import { NextRequest, NextResponse } from 'next/server';
import { geminiService } from '@/lib/gemini';
import { lineService } from '@/lib/line';
import path from 'path';
import fs from 'fs';
import { pipeline } from 'stream/promises';
import { r2Service } from '@/lib/r2';

// 1. Download file from R2 to tmp
// 2. Analyze with Gemini
// 3. Send result to LINE
// 4. Cleanup

export async function POST(req: NextRequest) {
    try {
        const { fileKey, userId } = await req.json();

        if (!fileKey || !userId) {
            return NextResponse.json({ error: 'Missing fileKey or userId' }, { status: 400 });
        }

        // Start async processing (Fire and Forget) to avoid timeout on Vercel (10s limit on Hobby)
        // However, Vercel Serverless Functions have limits. Long running tasks are risky.
        // For Vercel, it is better to await if < 10s. Gemini analysis is usually quick (< 10s).
        // Let's try awaiting it first. If it times out, we need a queue (which is overkill here).

        // Changing to async background processing is NOT supported well in Vercel Serverless (process might die).
        // But for a simple prototype, we can try to await.

        // NOTE: On Vercel, /tmp is writable.
        const tempFilePath = path.join('/tmp', path.basename(fileKey));

        console.log('Starting analysis for:', fileKey);

        // Download from R2
        const s3Stream = await r2Service.getFileStream(fileKey);
        // Convert WebStream/NodeStream to File
        // @ts-ignore
        await pipeline(s3Stream, fs.createWriteStream(tempFilePath));

        // Determine Mime
        const ext = path.extname(fileKey).toLowerCase();
        const mime = geminiService.getMimeType(fileKey);

        // Analyze
        const resultText = await geminiService.analyzeContent(tempFilePath, mime);

        // Send LINE
        await lineService.pushMessage(userId, "【食事解析完了】\n" + resultText);

        // Cleanup
        if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }

        return NextResponse.json({ success: true, message: 'Analysis completed' });

    } catch (error: any) {
        console.error('Analyze Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

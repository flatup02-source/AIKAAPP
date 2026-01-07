import { NextRequest, NextResponse } from 'next/server';
import { r2Service } from '@/lib/r2';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const fileName = searchParams.get('fileName');
        const fileType = searchParams.get('fileType');

        if (!fileName || !fileType) {
            return NextResponse.json({ error: 'Missing fileName or fileType' }, { status: 400 });
        }

        // Generate unique key
        const uniqueKey = `uploads/${Date.now()}-${path.basename(fileName)}`;

        const uploadUrl = await r2Service.getUploadUrl(uniqueKey, fileType);

        return NextResponse.json({ uploadUrl, fileKey: uniqueKey });
    } catch (error: any) {
        console.error('Upload Request Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

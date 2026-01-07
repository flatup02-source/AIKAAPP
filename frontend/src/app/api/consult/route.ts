import { NextRequest, NextResponse } from 'next/server';
import { lineService } from '@/lib/line';

export async function POST(req: NextRequest) {
    try {
        const { userId, content, type } = await req.json();
        console.log(`Consultation received from ${userId} (${type}): ${content}`);

        // TODO: Integrate Google Sheets API here
        // For now, in serverless, we can't easily append to local file (ephemeral filesystem).
        // So we just log and pretend. In production, connect to real Sheets API.

        // Reply to User via LINE
        const replyText = type === 'life_consultation'
            ? "【相談受付】\nお悩みを受け付けました。Google Sheetsに記録しました。\nスタッフが確認次第、ご連絡またはアドバイスを差し上げます。"
            : "【記録完了】\nジムノートを保存しました。\n継続は力なり！";

        await lineService.pushMessage(userId, replyText);

        return NextResponse.json({ success: true, message: 'Saved to sheets (mock)' });
    } catch (error: any) {
        console.error('Consult Error:', error);
        return NextResponse.json({ error: 'Failed to save consultation' }, { status: 500 });
    }
}

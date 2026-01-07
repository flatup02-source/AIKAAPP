import { NextRequest, NextResponse } from 'next/server';
import { lineService } from '@/lib/line';

export async function POST(req: NextRequest) {
    try {
        const { userId, content, type } = await req.json();
        console.log(`Consultation received from ${userId} (${type}): ${content}`);

        // Send to Make.com (Manus) if configured
        const makeWebhookUrl = process.env.MAKE_WEBHOOK_URL;
        if (makeWebhookUrl) {
            try {
                // Fire and forget (or await if critical)
                // Using await to ensure data is sent before replying
                await fetch(makeWebhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId,
                        content,
                        type,
                        timestamp: new Date().toISOString()
                    })
                });
                console.log('Sent to Make webhook');
            } catch (e) {
                console.error('Failed to send to Make:', e);
                // Don't fail the request to the user, just log
            }
        }

        // Reply to User via LINE
        const replyText = type === 'life_consultation'
            ? "【相談受付】\nお悩みを受け付けました。専属トレーナー（AIKA）が確認します！"
            : "【記録完了】\nジムノートを保存しました。\n継続は力なり！";

        await lineService.pushMessage(userId, replyText);

        return NextResponse.json({ success: true, message: 'Processed successfully' });
    } catch (error: any) {
        console.error('Consult Error:', error);
        return NextResponse.json({ error: 'Failed to save consultation' }, { status: 500 });
    }
}

export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

/**
 * LINE Webhookエンドポイント
 * n8n/Make.comから呼び出される、または直接LINEから呼び出される
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const events = body.events || [];
    
    const lineChannelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_SITE_URL;
    
    if (!lineChannelAccessToken) {
      console.error('LINE_CHANNEL_ACCESS_TOKEN is not set');
      return NextResponse.json({ error: 'LINE configuration missing' }, { status: 500 });
    }
    
    // 各イベントを処理
    for (const event of events) {
      if (event.type !== 'message') {
        continue;
      }
      
      const userId = event.source.userId;
      const messageType = event.message.type;
      
      if (messageType === 'text') {
        // テキストメッセージの場合
        const messageText = event.message.text;
        
        // バックエンドのAIKA18チャットAPIを呼び出し
        try {
          const chatResponse = await axios.post(`${backendUrl}/api/aika18/chat`, {
            message: messageText,
            userId: userId,
          }, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          const aika18Response = chatResponse.data.message;
          
          // LINEに返信
          await axios.post('https://api.line.me/v2/bot/message/reply', {
            replyToken: event.replyToken,
            messages: [
              {
                type: 'text',
                text: aika18Response,
              },
            ],
          }, {
            headers: {
              'Authorization': `Bearer ${lineChannelAccessToken}`,
              'Content-Type': 'application/json',
            },
          });
          
        } catch (error: any) {
          console.error('Error processing text message:', error);
          // エラー時はデフォルトメッセージを返信
          await axios.post('https://api.line.me/v2/bot/message/reply', {
            replyToken: event.replyToken,
            messages: [
              {
                type: 'text',
                text: 'すみません、ちょっと調子が悪いみたい。もう一度言ってくれる？',
              },
            ],
          }, {
            headers: {
              'Authorization': `Bearer ${lineChannelAccessToken}`,
              'Content-Type': 'application/json',
            },
          });
        }
        
      } else if (messageType === 'video') {
        // 動画メッセージの場合
        const messageId = event.message.id;
        
        // LINEから動画を取得
        const videoResponse = await axios.get(
          `https://api-data.line.me/v2/bot/message/${messageId}/content`,
          {
            headers: {
              'Authorization': `Bearer ${lineChannelAccessToken}`,
            },
            responseType: 'arraybuffer',
          }
        );
        
        // 動画をGoogle Cloud Storageにアップロード（既存のupload.tsを使用）
        // ここでは簡易的に、動画解析APIを直接呼び出す
        try {
          // 動画解析を実行（既存のanalyze-video APIを使用）
          const analysisResponse = await axios.post(`${backendUrl}/api/analyze-video`, {
            videoUrl: `line://message/${messageId}`, // 実際にはGCSのURLが必要
          });
          
          const analysisResult = analysisResponse.data;
          
          // AIKA18に動画解析結果を送信
          const aika18Response = await axios.post(`${backendUrl}/api/aika18/video-analysis`, {
            videoAnalysisResult: analysisResult,
            userId: userId,
            videoDurationMinutes: 1, // 実際の動画時間を計算して設定
          });
          
          // 使用量上限に達した場合のエラーハンドリング
          if (aika18Response.status === 503) {
            await axios.post('https://api.line.me/v2/bot/message/reply', {
              replyToken: event.replyToken,
              messages: [
                {
                  type: 'text',
                  text: aika18Response.data.message || '申し訳ございませんが、現在動画解析サービスが利用制限に達しています。来月までお待ちください。',
                },
              ],
            }, {
              headers: {
                'Authorization': `Bearer ${lineChannelAccessToken}`,
                'Content-Type': 'application/json',
              },
            });
            continue;
          }
          
          const aika18Message = aika18Response.data.message;
          
          // LINEに返信
          await axios.post('https://api.line.me/v2/bot/message/reply', {
            replyToken: event.replyToken,
            messages: [
              {
                type: 'text',
                text: aika18Message,
              },
            ],
          }, {
            headers: {
              'Authorization': `Bearer ${lineChannelAccessToken}`,
              'Content-Type': 'application/json',
            },
          });
          
        } catch (error: any) {
          console.error('Error processing video message:', error);
          await axios.post('https://api.line.me/v2/bot/message/reply', {
            replyToken: event.replyToken,
            messages: [
              {
                type: 'text',
                text: '動画の解析に失敗したわ。もう一度送ってくれる？',
              },
            ],
          }, {
            headers: {
              'Authorization': `Bearer ${lineChannelAccessToken}`,
              'Content-Type': 'application/json',
            },
          });
        }
      }
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    console.error('Error in LINE webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * LINE Webhookの検証用（GET）
 */
export async function GET(req: NextRequest) {
  return NextResponse.json({ 
    message: 'LINE Webhook endpoint is active',
    timestamp: new Date().toISOString(),
  });
}

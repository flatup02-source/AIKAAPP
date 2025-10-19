import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import axios from 'axios';

// Google Sheets APIの認証と設定
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const spreadsheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, userName, videoUrl, timestamp } = body;

    if (!userId || !videoUrl || !timestamp) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Googleスプレッドシートへの書き込み
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'シート1!A:D', // 書き込み先のシート名と範囲
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[timestamp, userId, userName || 'N/A', videoUrl]],
      },
    });

    // ここが問題の箇所でした。「http://」を「https://」に修正します。
    // さらに、将来的にも安定するよう、環境変数からベースURLを取得するように変更しました。
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://serene-zabaione-8c4e2a.netlify.app';
    const videoAnalysisUrl = `${baseUrl}/api/analyze-video`;

    // 動画解析APIを呼び出す（エラーが出てもスプレッドシート記録は成功させるため、ここでは待たない）
    axios.post(videoAnalysisUrl, { videoUrl }).catch(error => {
      console.error('Failed to trigger video analysis:', error.message);
    });

    return NextResponse.json({ message: 'Successfully recorded in Spreadsheet' }, { status: 200 });

  } catch (error: any) {
    console.error('Error in spreadsheet API:', error.message);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}

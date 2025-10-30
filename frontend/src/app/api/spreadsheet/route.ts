export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import axios from 'axios';

import { getGoogleAuthFromEnv } from '@/lib/gcloud';

export async function POST(req: NextRequest) {
  try {
    const auth = await getGoogleAuthFromEnv(['https://www.googleapis.com/auth/spreadsheets']);
    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID;
    const body = await req.json();
    const { userId, userName, videoUrl, timestamp } = body;

    if (!userId || !videoUrl || !timestamp) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Googleスプレッドシートへの書き込み
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'シート1!A:D',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[timestamp, userId, userName || 'N/A', videoUrl]],
      },
    });
    
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://serene-zabaione-8c4e2a.netlify.app';
    const videoAnalysisUrl = `${baseUrl}/api/analyze-video`;

    // 動画解析APIを非同期で呼び出す (記録の成否には影響させない)
    axios.post(videoAnalysisUrl, { videoUrl }).catch(error => {
      // ここでのエラーはログに出力するのみ
      console.error('Failed to trigger video analysis:', error.message);
    });

    return NextResponse.json({ message: 'Successfully recorded in Spreadsheet' }, { status: 200 });

  } catch (error) {
    // TypeScriptのルールに準拠した、より安全なエラーハンドリング
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error('Error in spreadsheet API:', errorMessage);
    return NextResponse.json({ message: 'Internal Server Error', error: errorMessage }, { status: 500 });
  }
}
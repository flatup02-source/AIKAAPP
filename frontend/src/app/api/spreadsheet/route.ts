export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import axios from 'axios';

import { getGoogleAuthFromEnv } from '@/lib/gcloud';

export async function POST(req: NextRequest) {
  try {
    // フォールバック: ランタイムに大きな環境変数 (GOOGLE_APPLICATION_CREDENTIALS_JSON) が無い場合は
    // スプレッドシート書き込みをスキップして受領のみ返す。
    const hasGoogleCreds = !!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    const auth = hasGoogleCreds
      ? await getGoogleAuthFromEnv(['https://www.googleapis.com/auth/spreadsheets'])
      : null;
    const sheets = auth ? google.sheets({ version: 'v4', auth }) : null;
    const spreadsheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID;
    const body = await req.json();
    const { userId, userName, videoUrl, timestamp } = body;

    if (!userId || !videoUrl || !timestamp) {
      return NextResponse.json({ 
        message: 'Missing required fields',
        received: { userId: !!userId, videoUrl: !!videoUrl, timestamp: !!timestamp }
      }, { status: 400 });
    }

    if (!spreadsheetId) {
      console.error('NEXT_PUBLIC_GOOGLE_SHEET_ID is not set');
      return NextResponse.json({ message: 'Spreadsheet ID is not configured' }, { status: 500 });
    }

    // Googleスプレッドシートへの書き込み (資格情報がある場合のみ)
    if (sheets) {
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'シート1!A:D',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[timestamp, userId, userName || 'N/A', videoUrl]],
        },
      });
    } else {
      console.warn('Skipping Sheets write: GOOGLE_APPLICATION_CREDENTIALS_JSON is not set. Returning 202 Accepted.');
      return NextResponse.json({ message: 'Accepted (skipped Sheets write at runtime)' }, { status: 202 });
    }
    
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
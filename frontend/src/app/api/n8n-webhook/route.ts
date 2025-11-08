// n8n連携用のWebhookエンドポイント
// n8nから呼び出して、Firebaseやスプレッドシートと連携する

export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { getGoogleAuthFromEnv } from '@/lib/gcloud';

/**
 * n8nからのWebhookを受け取り、会員情報を処理する
 * 用途: 新規会員登録時の自動処理、会費請求の自動化など
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, data } = body;

    // n8nからの認証（オプション）
    const webhookSecret = process.env.N8N_WEBHOOK_SECRET;
    const providedSecret = req.headers.get('x-n8n-secret');
    if (webhookSecret && providedSecret !== webhookSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    switch (action) {
      case 'new_member':
        return await handleNewMember(data);
      
      case 'payment_reminder':
        return await handlePaymentReminder(data);
      
      case 'lesson_reminder':
        return await handleLessonReminder(data);
      
      case 'update_spreadsheet':
        return await handleSpreadsheetUpdate(data);
      
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in n8n webhook:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

/**
 * 新規会員登録時の処理
 */
async function handleNewMember(data: {
  userId: string;
  userName: string;
  email?: string;
  lineId?: string;
  membershipType: string;
  joinDate: string;
}) {
  const hasGoogleCreds = !!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  const auth = hasGoogleCreds
    ? await getGoogleAuthFromEnv(['https://www.googleapis.com/auth/spreadsheets'])
    : null;
  const sheets = auth ? google.sheets({ version: 'v4', auth }) : null;
  const spreadsheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID;

  if (!spreadsheetId) {
    return NextResponse.json({ error: 'Spreadsheet ID not configured' }, { status: 500 });
  }

  if (sheets) {
    // 会員情報をスプレッドシートに追加
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: '会員管理!A:F',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          data.joinDate,
          data.userId,
          data.userName,
          data.email || '',
          data.lineId || '',
          data.membershipType
        ]],
      },
    });
  }

  return NextResponse.json({ 
    success: true, 
    message: 'Member registered successfully',
    memberId: data.userId 
  });
}

/**
 * 会費請求リマインダーの処理
 */
async function handlePaymentReminder(data: {
  userId: string;
  userName: string;
  email?: string;
  lineId?: string;
  amount: number;
  dueDate: string;
  paymentUrl?: string;
}) {
  // ここでLINE Messaging APIやメール送信の処理を実装
  // 現在はログに記録するのみ
  
  console.log('Payment reminder:', {
    userId: data.userId,
    userName: data.userName,
    amount: data.amount,
    dueDate: data.dueDate,
  });

  // TODO: LINE Messaging APIやメール送信の実装
  // - LINE Messaging APIを使用してリマインダーを送信
  // - またはメール送信サービスを使用

  return NextResponse.json({ 
    success: true, 
    message: 'Payment reminder sent',
    userId: data.userId 
  });
}

/**
 * レッスンリマインダーの処理
 */
async function handleLessonReminder(data: {
  userId: string;
  userName: string;
  email?: string;
  lineId?: string;
  lessonName: string;
  lessonDate: string;
  lessonTime: string;
}) {
  console.log('Lesson reminder:', {
    userId: data.userId,
    userName: data.userName,
    lessonName: data.lessonName,
    lessonDate: data.lessonDate,
    lessonTime: data.lessonTime,
  });

  // TODO: LINE Messaging APIやメール送信の実装

  return NextResponse.json({ 
    success: true, 
    message: 'Lesson reminder sent',
    userId: data.userId 
  });
}

/**
 * スプレッドシートの更新処理
 */
async function handleSpreadsheetUpdate(data: {
  sheetName: string;
  range: string;
  values: any[][];
}) {
  const hasGoogleCreds = !!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  const auth = hasGoogleCreds
    ? await getGoogleAuthFromEnv(['https://www.googleapis.com/auth/spreadsheets'])
    : null;
  const sheets = auth ? google.sheets({ version: 'v4', auth }) : null;
  const spreadsheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID;

  if (!spreadsheetId) {
    return NextResponse.json({ error: 'Spreadsheet ID not configured' }, { status: 500 });
  }

  if (!sheets) {
    return NextResponse.json({ error: 'Google Sheets not configured' }, { status: 500 });
  }

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${data.sheetName}!${data.range}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: data.values,
    },
  });

  return NextResponse.json({ 
    success: true, 
    message: 'Spreadsheet updated successfully' 
  });
}

/**
 * GET: Webhookのヘルスチェック
 */
export async function GET(req: NextRequest) {
  return NextResponse.json({ 
    status: 'ok', 
    service: 'n8n-webhook',
    timestamp: new Date().toISOString()
  });
}

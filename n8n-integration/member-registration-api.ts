import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * n8nワークフローから呼び出される会員登録API
 * POST /api/n8n/member-registration
 * 
 * リクエストボディ:
 * {
 *   userId: string,
 *   name: string,
 *   email: string,
 *   phone?: string,
 *   lineId?: string
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, name, email, phone, lineId } = body;

    // 必須項目の検証
    if (!userId || !name || !email) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          required: ['userId', 'name', 'email']
        },
        { status: 400 }
      );
    }

    // ここでFirebaseやデータベースに会員情報を保存
    // 例: Firebase Firestoreへの保存
    // const db = getFirestore();
    // await db.collection('members').doc(userId).set({
    //   name,
    //   email,
    //   phone: phone || null,
    //   lineId: lineId || null,
    //   status: 'active',
    //   registrationDate: new Date(),
    // });

    // Googleスプレッドシートへの記録（既存のAPIを利用）
    const spreadsheetResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/spreadsheet`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          userName: name,
          videoUrl: '', // 会員登録時は不要
          timestamp: new Date().toISOString(),
        }),
      }
    );

    if (!spreadsheetResponse.ok) {
      console.error('Failed to record in spreadsheet');
    }

    return NextResponse.json(
      {
        status: 'success',
        message: '会員登録が完了しました',
        data: {
          userId,
          name,
          email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in member registration API:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

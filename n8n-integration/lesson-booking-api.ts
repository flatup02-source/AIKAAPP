import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * n8nワークフローから呼び出されるレッスン予約API
 * POST /api/n8n/lesson-booking
 * 
 * リクエストボディ:
 * {
 *   userId: string,
 *   userName?: string,
 *   lessonDate: string (YYYY-MM-DD),
 *   lessonTime: string (HH:mm),
 *   lessonType?: string
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, userName, lessonDate, lessonTime, lessonType } = body;

    // 必須項目の検証
    if (!userId || !lessonDate || !lessonTime) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          required: ['userId', 'lessonDate', 'lessonTime'],
        },
        { status: 400 }
      );
    }

    // 日付形式の検証
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(lessonDate)) {
      return NextResponse.json(
        {
          error: 'Invalid date format',
          expected: 'YYYY-MM-DD',
          received: lessonDate,
        },
        { status: 400 }
      );
    }

    // 時間形式の検証
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!timeRegex.test(lessonTime)) {
      return NextResponse.json(
        {
          error: 'Invalid time format',
          expected: 'HH:mm',
          received: lessonTime,
        },
        { status: 400 }
      );
    }

    // 過去の日付でないかチェック
    const bookingDateTime = new Date(`${lessonDate}T${lessonTime}`);
    if (bookingDateTime < new Date()) {
      return NextResponse.json(
        {
          error: 'Cannot book past dates',
        },
        { status: 400 }
      );
    }

    // ここで予約データをデータベースに保存
    // 例: Firebase Firestoreへの保存
    // const db = getFirestore();
    // const bookingRef = await db.collection('bookings').add({
    //   userId,
    //   userName: userName || '会員',
    //   lessonDate,
    //   lessonTime,
    //   lessonType: lessonType || '通常レッスン',
    //   status: 'confirmed',
    //   createdAt: new Date(),
    // });

    // Googleカレンダーへの登録（Google Calendar APIを使用）
    // ここでは例として、カレンダーイベントIDを生成
    const calendarEventId = `booking-${userId}-${Date.now()}`;

    return NextResponse.json(
      {
        status: 'success',
        message: '予約が完了しました',
        data: {
          bookingId: calendarEventId,
          userId,
          userName: userName || '会員',
          lessonDate,
          lessonTime,
          lessonType: lessonType || '通常レッスン',
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in lesson booking API:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

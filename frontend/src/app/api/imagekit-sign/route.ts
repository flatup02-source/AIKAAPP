import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';

export async function POST(req: NextRequest) {
  try {
    const { fileName, contentType, action = 'write' } = await req.json();

    if (!fileName) {
      return NextResponse.json({ message: 'fileName is required.' }, { status: 400 });
    }

    if (action === 'write' && !contentType) {
        return NextResponse.json({ message: 'contentType is required for write action.' }, { status: 400 });
    }

    // 環境変数から認証情報を取得
    const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || '{}');
    const bucketName = process.env.GCS_BUCKET_NAME;

    if (!bucketName) {
      return NextResponse.json({ message: 'GCS_BUCKET_NAME is not set.' }, { status: 500 });
    }

    const storage = new Storage({
      projectId: credentials.project_id,
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key,
      },
    });

    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);

    const options: any = {
      version: 'v4',
      action: action,
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    };

    if (action === 'write') {
      options.contentType = contentType;
    }

    const [url] = await file.getSignedUrl(options);

    return NextResponse.json({ signedUrl: url });

  } catch (error) {
    console.error('Error generating signed URL:', error);
    let errorMessage = 'Internal Server Error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
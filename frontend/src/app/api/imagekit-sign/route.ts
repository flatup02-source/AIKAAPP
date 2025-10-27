import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';

export async function POST(req: NextRequest) {
  try {
    const { fileName, contentType } = await req.json();

    if (!fileName || !contentType) {
      return NextResponse.json({ message: 'fileName and contentType are required.' }, { status: 400 });
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

    const options = {
      version: 'v4' as 'v4', // GCS V4 Signed URL
      action: 'write' as 'write', // PUT method for upload
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType: contentType,
    };

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
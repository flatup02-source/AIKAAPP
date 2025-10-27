const { Storage } = require('@google-cloud/storage');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { filename, contentType } = JSON.parse(event.body);

    if (!filename || !contentType) {
      return { statusCode: 400, body: 'filename and contentType are required.' };
    }

    const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || '{}');
    const bucketName = process.env.GCS_BUCKET_NAME;

    if (!bucketName) {
      return { statusCode: 500, body: 'GCS_BUCKET_NAME is not set.' };
    }

    const storage = new Storage({
      projectId: credentials.project_id,
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key,
      },
    });

    const bucket = storage.bucket(bucketName);
    const file = bucket.file(filename);

    const options = {
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType: contentType,
    };

    const [url] = await file.getSignedUrl(options);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ signedUrl: url }),
    };

  } catch (error) {
    console.error('Error generating signed URL:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal Server Error' }),
    };
  }
};
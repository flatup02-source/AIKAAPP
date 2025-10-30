import { NextResponse } from 'next/server';
import { VideoIntelligenceServiceClient, protos } from '@google-cloud/video-intelligence';
import { GoogleAuth } from 'google-auth-library';
import { requireProjectId } from '@/lib/gcloud';

async function getVideoClient() {
  const projectId = requireProjectId();
  const raw = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  if (!raw) throw new Error('Missing environment variable GOOGLE_APPLICATION_CREDENTIALS_JSON');
  let json: Record<string, unknown>;
  try {
    json = JSON.parse(raw);
  } catch {
    throw new Error('GOOGLE_APPLICATION_CREDENTIALS_JSON is not valid JSON');
  }
  const auth = new GoogleAuth({ credentials: json as any, scopes: ['https://www.googleapis.com/auth/cloud-platform'] });
  return new VideoIntelligenceServiceClient({ projectId, auth });
}

export async function POST(req: Request) {
  try {
    const client = await getVideoClient();
    const { gcsUri } = await req.json();

    if (!gcsUri) {
      return NextResponse.json({ ok: false, error: 'gcsUri is required.' }, { status: 400 });
    }

    const operation = await client.annotateVideo({
      inputUri: gcsUri,
      features: [protos.google.cloud.videointelligence.v1.Feature.OBJECT_TRACKING],
    });
    
    // Don't wait for the operation to complete, just return that it was accepted.
    // The client can poll for the result separately.
    return NextResponse.json({ ok: true, operationName: operation[0].name });

  } catch (e: any) {
    console.error('Error in video analysis:', e);
    return NextResponse.json({ ok: false, error: String(e?.message ?? 'Unknown error') }, { status: 500 });
  }
}
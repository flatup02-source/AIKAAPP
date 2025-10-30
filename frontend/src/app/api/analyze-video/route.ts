import { NextResponse } from 'next/server';
import { VideoIntelligenceServiceClient } from '@google-cloud/video-intelligence';
import { GoogleAuth } from 'google-auth-library';
import { requireProjectId } from '@/lib/gcloud';

// This function is kept for potential future use, but is not currently called.
import { getAuthClientFromEnv } from '@/lib/gcloud';

async function getVideoClient() {
  const projectId = requireProjectId();
  const authClient = await getAuthClientFromEnv(['https://www.googleapis.com/auth/cloud-platform']);
  return new VideoIntelligenceServiceClient({ projectId, auth: authClient as any });
}

export async function POST(req: Request) {
  try {
    const { gcsUri } = await req.json();
    if (!gcsUri) {
      return NextResponse.json({ ok: false, error: 'gcsUri is required.' }, { status: 400 });
    }

    console.log(`Received request for GCS URI: ${gcsUri}, returning dummy data.`);

    // Note: This function currently returns dummy data.
    // To enable actual analysis, you would call getVideoClient() and use the client.
    const dummyResult = {
      power_level: 77,
      comment: "解析完了。\n\n1. 右ストレートの際に、少し顎が上がっている傾向が見られます。常に顎を引く意識を持つと、ディフェンスが安定します。\n\n2. フットワークは軽快ですが、パンチのインパクトの瞬間に足が止まると、よりパワーが拳に伝わります。\n\n3. コンビネーションの最後に左フックを返すと、相手の意識を散らすことができ、次の攻撃に繋げやすくなります。",
    };

    return NextResponse.json({ ok: true, ...dummyResult });

  } catch (e: any) {
    console.error('Error in dummy video analysis:', e);
    return NextResponse.json({ ok: false, error: String(e?.message ?? 'Unknown error') }, { status: 500 });
  }
}

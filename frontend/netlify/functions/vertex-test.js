// file: frontend/netlify/functions/vertex-test.js
// Vertex AI APIへの最小テスト呼び出し（Endpoints一覧）。成功すればMetricsに出ます。

import { GoogleAuth } from 'google-auth-library';

export default async (req, context) => {
  const rawJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  const projectId = process.env.GOOGLE_PROJECT_ID;
  const location = 'asia-northeast1'; // リージョン固定

  if (!rawJson) {
    return new Response(JSON.stringify({ ok: false, error: 'GOOGLE_APPLICATION_CREDENTIALS_JSON is missing' }), { status: 500 });
  }
  if (!projectId) {
    return new Response(JSON.stringify({ ok: false, error: 'GOOGLE_PROJECT_ID is missing' }), { status: 500 });
  }

  try {
    // サービスアカウント鍵JSONをパース
    const credentials = JSON.parse(rawJson);

    // GoogleAuthで認証クライアントを作成
    const auth = new GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });
    const client = await auth.getClient();

    // Vertex AI v1 Endpoints一覧を取得
    const url = `https://asia-northeast1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/endpoints`;
    const resp = await client.request({ url });

    const endpoints = Array.isArray(resp.data?.endpoints) ? resp.data.endpoints : [];
    const payload = {
      ok: true,
      httpStatus: resp.status,
      endpointsCount: endpoints.length,
      sampleEndpointName: endpoints[0]?.name ?? null,
      projectId,
      location,
    };

    return new Response(JSON.stringify(payload), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    const errorPayload = {
      ok: false,
      message: e?.message ?? String(e),
      code: e?.code ?? null,
      httpStatus: e?.response?.status ?? null,
      response: e?.response?.data ?? null,
      hints: [
        'Keys: private_key_id が Google Cloud Keys のものと一致すること',
        'Role: サービスアカウントに Vertex AI User が付与済みであること',
        'Region/Endpoint: asia-northeast1 / asia-northeast1-aiplatform.googleapis.com',
        'Netlify再デプロイが完了していること',
      ],
    };
    return new Response(JSON.stringify(errorPayload), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};

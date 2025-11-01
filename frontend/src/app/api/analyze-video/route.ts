export const runtime = 'nodejs';

import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';

type AnalyzeVideoPayload = {
  gcsUri?: string;
  videoUrl?: string;
  userId?: string;
  userName?: string;
  timestamp?: string;
  metadata?: Record<string, unknown>;
};

const makeEndpoint = process.env.MAKE_ANALYSIS_WEBHOOK_URL ?? process.env.MAKE_WEBHOOK_URL;
const makeSecretHeaderName = process.env.MAKE_WEBHOOK_SECRET_HEADER ?? 'X-Webhook-Secret';

function deriveGcsUriFromUrl(videoUrl: string | undefined): string | null {
  if (!videoUrl) return null;
  try {
    if (videoUrl.startsWith('gs://')) {
      return videoUrl;
    }

    const url = new URL(videoUrl);

    // https://storage.googleapis.com/<bucket>/<object>
    if (url.hostname === 'storage.googleapis.com') {
      const [bucket, ...rest] = url.pathname.replace(/^\//, '').split('/');
      if (bucket && rest.length) {
        return `gs://${bucket}/${rest.join('/')}`;
      }
    }

    // https://<bucket>.storage.googleapis.com/<object>
    if (url.hostname.endsWith('.storage.googleapis.com')) {
      const bucket = url.hostname.replace('.storage.googleapis.com', '');
      const objectPath = url.pathname.replace(/^\//, '');
      if (bucket && objectPath) {
        return `gs://${bucket}/${objectPath}`;
      }
    }

    // https://firebasestorage.googleapis.com/v0/b/<bucket>/o/<object>?...
    if (url.hostname === 'firebasestorage.googleapis.com') {
      const parts = url.pathname.split('/').filter(Boolean);
      const bucketIndex = parts.indexOf('b');
      const objectIndex = parts.indexOf('o');
      if (bucketIndex !== -1 && objectIndex !== -1 && bucketIndex + 1 < parts.length && objectIndex + 1 < parts.length) {
        const bucket = parts[bucketIndex + 1];
        const encodedObject = parts[objectIndex + 1];
        if (bucket && encodedObject) {
          const decodedObject = decodeURIComponent(encodedObject);
          return `gs://${bucket}/${decodedObject}`;
        }
      }
    }
  } catch (error) {
    console.warn('Failed to parse videoUrl as URL', error);
  }

  return null;
}

async function forwardToMake(payload: Record<string, unknown>, signal: AbortSignal) {
  if (!makeEndpoint) {
    return {
      forwarded: false,
      responseBody: null,
      status: 202,
      statusText: 'Make webhook is not configured',
    } as const;
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (process.env.MAKE_WEBHOOK_AUTHORIZATION) {
    headers['Authorization'] = process.env.MAKE_WEBHOOK_AUTHORIZATION;
  }

  if (process.env.MAKE_WEBHOOK_SECRET) {
    headers[makeSecretHeaderName] = process.env.MAKE_WEBHOOK_SECRET;
  }

  const response = await fetch(makeEndpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
    signal,
  });

  const contentType = response.headers.get('content-type') ?? '';
  const rawBody = await response.text();

  let parsedBody: unknown = rawBody;
  if (rawBody && contentType.includes('application/json')) {
    try {
      parsedBody = JSON.parse(rawBody);
    } catch (error) {
      console.warn('Failed to parse Make response as JSON. Returning raw text.', error);
      parsedBody = rawBody;
    }
  }

  return {
    forwarded: true,
    status: response.status,
    statusText: response.statusText,
    responseBody: parsedBody,
    ok: response.ok,
  } as const;
}

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as AnalyzeVideoPayload;
    const requestId = randomUUID();

    let gcsUri = payload.gcsUri?.trim();
    if (!gcsUri) {
      gcsUri = deriveGcsUriFromUrl(payload.videoUrl);
    }

    if (!gcsUri) {
      return NextResponse.json({
        ok: false,
        error: 'gcsUri または videoUrl を指定してください。',
        requestId,
      }, { status: 400 });
    }

    const nowIso = new Date().toISOString();
    const forwardedPayload = {
      requestId,
      gcsUri,
      videoUrl: payload.videoUrl ?? null,
      user: {
        id: payload.userId ?? null,
        name: payload.userName ?? null,
      },
      timestamp: payload.timestamp ?? nowIso,
      metadata: payload.metadata ?? {},
    };

    const controller = new AbortController();
    const timeoutMs = Number(process.env.MAKE_WEBHOOK_TIMEOUT_MS ?? 25000);
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    let forwardResult;
    try {
      forwardResult = await forwardToMake(forwardedPayload, controller.signal);
    } finally {
      clearTimeout(timeout);
    }

    if (!forwardResult.forwarded) {
      console.warn('MakeのWebhook URLが設定されていないため、ダミー応答を返します。');
      return NextResponse.json({
        ok: true,
        message: 'MakeのWebhookが未設定のため、分析リクエストはキューされませんでした。MAKE_ANALYSIS_WEBHOOK_URL を設定してください。',
        requestId,
        gcsUri,
        dummyResult: {
          powerLevel: 77,
          comment: 'MakeのWebhookが未設定のため、ダミー応答を返却しています。設定後に再実行してください。',
        },
      }, { status: forwardResult.status });
    }

    if (!forwardResult.ok) {
      console.error('Make webhook returned an error', {
        status: forwardResult.status,
        statusText: forwardResult.statusText,
        responseBody: forwardResult.responseBody,
        requestId,
      });

      return NextResponse.json({
        ok: false,
        error: 'Make webhook call failed',
        status: forwardResult.status,
        statusText: forwardResult.statusText,
        response: forwardResult.responseBody,
        requestId,
      }, { status: 502 });
    }

    return NextResponse.json({
      ok: true,
      requestId,
      gcsUri,
      makeResponse: forwardResult.responseBody,
    });

  } catch (error: unknown) {
    if ((error as Error)?.name === 'AbortError') {
      console.error('Make webhook request timed out');
      return NextResponse.json({
        ok: false,
        error: 'Make webhook request timed out',
      }, { status: 504 });
    }

    console.error('Error in analyze-video route:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

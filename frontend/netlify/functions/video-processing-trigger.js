// frontend/netlify/functions/video-processing-trigger.js

// Netlify Functions (AWS Lambda) で動く Webhook 受け口。
// 目的: 動画のアップロード完了通知（object name, contentType など）を受け取り、
// Firestore に処理ステータス（pending/processing）を記録する。
// 後続の解析ワーカーがこのドキュメントを参照して処理を進める設計。

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// 認証方式:
// 1) GOOGLE_APPLICATION_CREDENTIALS_JSON にサービスアカウントJSONを入れる（安全なSecret管理推奨）
// 2) なければ ADC（Application Default Credentials）で初期化を試みる
let appInitialized = false;
function initFirebase() {
  if (appInitialized) return;
  const credsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  if (credsJson) {
    // 環境変数に埋め込んだJSON文字列から認証
    const serviceAccount = JSON.parse(credsJson);
    initializeApp({ credential: cert(serviceAccount) });
  } else {
    // ランタイム環境にADCがある場合
    initializeApp({ credential: applicationDefault() });
  }
  appInitialized = true;
}

function badRequest(message) {
  return {
    statusCode: 400,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: false, error: message }),
  };
}

exports.handler = async (event) => {
  // Netlify Functions は event.body に文字列が入る
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Allow': 'POST', 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, error: 'Method Not Allowed' }),
    };
  }

  // JSONパース
  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (e) {
    return badRequest('Invalid JSON body');
  }

  // 必要パラメータの検証
  // Storage finalize 相当の情報を想定（例）:
  // {
  //   bucket: "aikaapp-584fa.firebasestorage.app",
  //   name: "users/{uid}/videos/xxx.mp4",
  //   contentType: "video/mp4",
  //   size: "1234567"
  // }
  const { bucket, name, contentType, size } = payload || {};
  if (!bucket || !name) {
    return badRequest('Missing required fields: bucket, name');
  }
  if (!contentType || !String(contentType).startsWith('video/')) {
    return badRequest('Not a video contentType');
  }
  if (!name.startsWith('users/')) {
    // クライアント領域以外は無視（必要に応じて許可範囲を拡張）
    return badRequest('Unsupported object path');
  }

  // uid をパスから抽出（users/{uid}/... の前提）
  const parts = name.split('/');
  const uid = parts.length >= 2 ? parts[1] : null;
  if (!uid) {
    return badRequest('Could not extract uid from object name');
  }

  try {
    initFirebase();
    const db = getFirestore();

    // ドキュメントIDを一意化。object name を安全にキー化
    const docId = Buffer.from(name).toString('base64url'); // URL-safe base64
    const now = new Date().toISOString();

    // 既存があれば更新、なければ作成
    await db.collection('videos').doc(docId).set({
      uid,
      bucket,
      inputPath: name,
      contentType,
      size: size ? Number(size) : null,
      status: 'processing', // finalize受領時にprocessingへ
      createdAt: now,
      updatedAt: now,
    }, { merge: true });

    // ここではあくまで「受理とステータス記録」。実際の解析は別ワーカーへ。
    // 次段の選択肢:
    // - Pub/Sub に enqueue して Cloud Run Worker が取り出して解析
    // - 直接 Cloud Run Worker のエンドポイントにジョブをPOST
    // - 将来的に Cloud Functions for Firebase の storage.onFinalize を利用

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true, message: 'Video processing queued', docId }),
    };
  } catch (error) {
    console.error('Failed to record processing status', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, error: String(error?.message || error) }),
    };
  }
};
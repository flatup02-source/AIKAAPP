// filename: usage-monitor.js
// 使用量監視と自動停止機能

import admin from 'firebase-admin';

// Firebase初期化（既存のコードから）
let appInitialized = false;
function initFirebase() {
  if (appInitialized || admin.apps.length > 0) return;
  
  const rawCreds = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  if (!rawCreds) {
    console.error('GOOGLE_APPLICATION_CREDENTIALS_JSON is not set');
    return;
  }

  try {
    let serviceAccount;
    try {
      const decoded = Buffer.from(rawCreds, 'base64').toString('utf-8');
      serviceAccount = JSON.parse(decoded);
    } catch (decodeError) {
      serviceAccount = JSON.parse(rawCreds);
    }
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    appInitialized = true;
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
  }
}

// 使用量の上限設定
const USAGE_LIMITS = {
  line_messages: {
    limit: 500,
    warning_threshold: 400, // 80%
    stop_threshold: 480,    // 96%
    unit: 'messages'
  },
  dify_api_calls: {
    limit: 200,
    warning_threshold: 160,
    stop_threshold: 190,
    unit: 'calls'
  },
  gcp_video_minutes: {
    limit: 1000,
    warning_threshold: 800,
    stop_threshold: 950,
    unit: 'minutes'
  },
  gcp_storage_gb: {
    limit: 5,
    warning_threshold: 4,
    stop_threshold: 4.8,
    unit: 'GB'
  },
  firebase_auth: {
    limit: 50000,
    warning_threshold: 40000,
    stop_threshold: 48000,
    unit: 'authentications'
  }
};

/**
 * 使用量を記録
 */
async function recordUsage(service, amount = 1) {
  try {
    initFirebase();
    if (!appInitialized) return { success: false, error: 'Firebase not initialized' };

    const db = admin.firestore();
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const docRef = db.collection('usage_stats').doc(`${service}_${monthKey}`);

    await docRef.set({
      service,
      month: monthKey,
      current_usage: admin.firestore.FieldValue.increment(amount),
      last_updated: admin.firestore.FieldValue.serverTimestamp(),
      status: 'active'
    }, { merge: true });

    // 使用量をチェック
    const doc = await docRef.get();
    const currentUsage = doc.data()?.current_usage || 0;
    const limit = USAGE_LIMITS[service];

    if (!limit) {
      return { success: true, currentUsage, limit: null };
    }

    // 警告・停止チェック
    const result = await checkUsageThreshold(service, currentUsage, limit);

    return {
      success: true,
      currentUsage,
      limit: limit.limit,
      ...result
    };
  } catch (error) {
    console.error(`Error recording usage for ${service}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * 使用量の閾値をチェック
 */
async function checkUsageThreshold(service, currentUsage, limit) {
  const db = admin.firestore();
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const docRef = db.collection('usage_stats').doc(`${service}_${monthKey}`);

  let status = 'ok';
  let shouldStop = false;
  let shouldWarn = false;

  // 停止閾値を超えた場合
  if (currentUsage >= limit.stop_threshold) {
    status = 'stopped';
    shouldStop = true;
    
    // Firestoreに停止状態を記録
    await docRef.update({
      status: 'stopped',
      stopped_at: admin.firestore.FieldValue.serverTimestamp()
    });

    // 管理者に通知
    await sendAlert(service, 'stopped', currentUsage, limit.limit);
  }
  // 警告閾値を超えた場合
  else if (currentUsage >= limit.warning_threshold) {
    status = 'warning';
    shouldWarn = true;

    // 既に警告済みかチェック（1日1回のみ）
    const doc = await docRef.get();
    const lastWarning = doc.data()?.last_warning_date;
    const today = now.toISOString().split('T')[0];

    if (lastWarning !== today) {
      await docRef.update({
        status: 'warning',
        last_warning_date: today
      });

      // 管理者に警告通知
      await sendAlert(service, 'warning', currentUsage, limit.limit);
    }
  }

  return {
    status,
    shouldStop,
    shouldWarn,
    percentage: (currentUsage / limit.limit * 100).toFixed(1)
  };
}

/**
 * アラートを送信
 */
async function sendAlert(service, type, currentUsage, limit) {
  const db = admin.firestore();
  const alertDoc = {
    service,
    type, // 'warning' or 'stopped'
    currentUsage,
    limit,
    percentage: (currentUsage / limit * 100).toFixed(1),
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    notified: false
  };

  // アラートを記録
  await db.collection('usage_alerts').add(alertDoc);

  // LINEまたはメールで通知（実装は後で）
  console.log(`[ALERT] ${service}: ${type} - ${currentUsage}/${limit} (${alertDoc.percentage}%)`);
  
  // n8n/Make.comのWebhookに送信（設定されている場合）
  const webhookUrl = process.env.USAGE_ALERT_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertDoc)
      });
    } catch (error) {
      console.error('Failed to send webhook alert:', error);
    }
  }
}

/**
 * 使用量を取得
 */
async function getUsage(service) {
  try {
    initFirebase();
    if (!appInitialized) return { success: false, error: 'Firebase not initialized' };

    const db = admin.firestore();
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const docRef = db.collection('usage_stats').doc(`${service}_${monthKey}`);
    const doc = await docRef.get();

    if (!doc.exists) {
      return {
        success: true,
        currentUsage: 0,
        limit: USAGE_LIMITS[service]?.limit || null,
        status: 'ok'
      };
    }

    const data = doc.data();
    const limit = USAGE_LIMITS[service];
    const currentUsage = data.current_usage || 0;

    return {
      success: true,
      currentUsage,
      limit: limit?.limit || null,
      status: data.status || 'ok',
      percentage: limit ? (currentUsage / limit.limit * 100).toFixed(1) : null
    };
  } catch (error) {
    console.error(`Error getting usage for ${service}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * すべてのサービスの使用量を取得
 */
export async function getAllUsage() {
  const services = Object.keys(USAGE_LIMITS);
  const results = {};

  for (const service of services) {
    results[service] = await getUsage(service);
  }

  return results;
}

/**
 * サービスが停止状態かチェック
 */
async function isServiceStopped(service) {
  const usage = await getUsage(service);
  return usage.status === 'stopped';
}

/**
 * 使用量をリセット（月初めに実行）
 */
async function resetMonthlyUsage() {
  try {
    initFirebase();
    if (!appInitialized) return { success: false, error: 'Firebase not initialized' };

    const db = admin.firestore();
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthKey = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;

    // 先月のデータをアーカイブ
    const services = Object.keys(USAGE_LIMITS);
    for (const service of services) {
      const docRef = db.collection('usage_stats').doc(`${service}_${lastMonthKey}`);
      const doc = await docRef.get();
      
      if (doc.exists) {
        await db.collection('usage_archive').doc(`${service}_${lastMonthKey}`).set(doc.data());
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error resetting monthly usage:', error);
    return { success: false, error: error.message };
  }
}

// Export functions
export { recordUsage, getUsage, getAllUsage, isServiceStopped, resetMonthlyUsage };

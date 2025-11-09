// filename: server.js

import express from 'express';
import { recordUsage, getUsage, getAllUsage, isServiceStopped } from './usage-monitor.js';

// セキュリティ: 許可するオリジンを限定
const allowedOrigins = [
  'https://serene-zabaione-8c4e2a.netlify.app',
];

// 可変なプレビューURLに対応したい場合のカスタム判定
function isAllowedOrigin(origin) {
  if (!origin) return false;
  if (allowedOrigins.includes(origin)) return true;
  // Netlifyプレビュー: https://deploy-preview-123--serene-zabaione-8c4e2a.netlify.app の形式
  const previewPattern = /^https:\/\/deploy-preview-\d+--serene-zabaione-8c4e2a\.netlify\.app$/;
  return previewPattern.test(origin);
}

const app = express();

// 認証付きリクエストも許可するため、credentials:true を使う場合は
// Access-Control-Allow-Origin にワイルドカード(*)は使えない。Originごとに返す必要がある
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (isAllowedOrigin(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Vary', 'Origin'); // CDN経由のキャッシュ汚染防止
    res.header('Access-Control-Allow-Credentials', 'true'); // Cookie/Authorizationヘッダ利用時
  }
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  next();
});

// Preflight (OPTIONS) 明示対応
app.options('*', (req, res) => {
  // 上でヘッダを付けているので、そのまま200で返す
  res.status(200).send('OK');
});

app.use(express.json());

// Root health check for Cloud Run
app.get('/', (req, res) => {
  res.status(200).send('OK');
});

// 例: API ルート
app.get('/health', (req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

app.post('/api/upload', (req, res) => {
  // 実際の処理をここで行う（例: GCS に書き込みなど）
  // 成功レスポンス
  res.json({ status: 'uploaded' });
});

// n8n Webhook エンドポイント
// n8nから呼び出される統合API
app.post('/api/n8n/webhook', async (req, res) => {
  try {
    const { event, data } = req.body;
    
    // 認証チェック（n8nからのリクエストを検証）
    const apiKey = req.headers['x-n8n-api-key'];
    const expectedApiKey = process.env.N8N_WEBHOOK_API_KEY;
    
    if (expectedApiKey && apiKey !== expectedApiKey) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    console.log(`n8n webhook received: ${event}`, data);
    
    switch(event) {
      case 'member_registered':
        // 会員登録処理
        // Firebaseに会員情報を保存
        // Googleスプレッドシートに記録
        // LINEでウェルカムメッセージ送信
        break;
        
      case 'lesson_booked':
        // レッスン予約処理
        // Googleカレンダーに予約を追加
        // 会員に確認メッセージ送信
        break;
        
      case 'payment_received':
        // 支払い受領処理
        // Googleスプレッドシートに記録
        // 領収書送信
        break;
        
      case 'video_uploaded':
        // 動画アップロード処理
        // 動画分析をトリガー
        // 会員に通知
        break;
        
      default:
        console.warn(`Unknown event type: ${event}`);
    }
    
    res.json({ 
      success: true, 
      event,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error processing n8n webhook:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// n8nから呼び出すためのデータ取得API
app.get('/api/n8n/data/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const apiKey = req.headers['x-n8n-api-key'];
    const expectedApiKey = process.env.N8N_WEBHOOK_API_KEY;
    
    if (expectedApiKey && apiKey !== expectedApiKey) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // データタイプに応じてデータを取得
    // 例: 会員リスト、レッスンスケジュールなど
    switch(type) {
      case 'members':
        // Firebaseから会員リストを取得
        res.json({ members: [] });
        break;
        
      case 'lessons':
        // Googleカレンダーからレッスンスケジュールを取得
        res.json({ lessons: [] });
        break;
        
      default:
        res.status(400).json({ error: 'Invalid data type' });
    }
    
  } catch (error) {
    console.error('Error fetching data for n8n:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// 使用量監視API
app.get('/api/usage/:service', async (req, res) => {
  try {
    const { service } = req.params;
    const usage = await getUsage(service);
    res.json(usage);
  } catch (error) {
    console.error('Error getting usage:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

app.get('/api/usage', async (req, res) => {
  try {
    const allUsage = await getAllUsage();
    res.json(allUsage);
  } catch (error) {
    console.error('Error getting all usage:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// AIKA18用のDify連携API
app.post('/api/aika18/chat', async (req, res) => {
  try {
    const { message, userId } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // 使用量チェック: Dify APIが停止していないか確認
    const difyStopped = await isServiceStopped('dify_api_calls');
    if (difyStopped) {
      return res.status(503).json({ 
        error: 'Service temporarily unavailable',
        message: 'Dify APIの使用量上限に達しました。来月までお待ちください。',
        service: 'dify_api_calls'
      });
    }
    
    const difyApiKey = process.env.DIFY_API_KEY;
    const difyApiUrl = process.env.DIFY_API_URL || 'https://api.dify.ai/v1';
    
    if (!difyApiKey) {
      return res.status(500).json({ error: 'Dify API key is not configured' });
    }
    
    // Dify APIにリクエストを送信
    const response = await fetch(`${difyApiUrl}/chat-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${difyApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {},
        query: message,
        response_mode: 'blocking',
        user: userId || 'anonymous',
        conversation_id: req.body.conversationId || undefined,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Dify API error:', errorText);
      return res.status(response.status).json({ 
        error: 'Dify API error',
        details: errorText 
      });
    }
    
    const data = await response.json();
    
    // 使用量を記録
    const usageResult = await recordUsage('dify_api_calls', 1);
    
    // 停止状態になった場合は警告を返す
    if (usageResult.shouldStop) {
      console.warn('Dify API usage limit reached. Service stopped.');
    }
    
    res.json({
      success: true,
      message: data.answer,
      conversationId: data.conversation_id,
      usage: {
        current: usageResult.currentUsage,
        limit: usageResult.limit,
        status: usageResult.status,
        percentage: usageResult.percentage
      }
    });
    
  } catch (error) {
    console.error('Error calling Dify API:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// AIKA18用の動画解析結果をDifyに送信
app.post('/api/aika18/video-analysis', async (req, res) => {
  try {
    const { videoAnalysisResult, userId, videoDurationMinutes } = req.body;
    
    if (!videoAnalysisResult) {
      return res.status(400).json({ error: 'Video analysis result is required' });
    }
    
    // 使用量チェック: GCP Video Intelligence APIが停止していないか確認
    const videoStopped = await isServiceStopped('gcp_video_minutes');
    if (videoStopped) {
      return res.status(503).json({ 
        error: 'Service temporarily unavailable',
        message: '動画解析サービスの使用量上限に達しました。来月までお待ちください。',
        service: 'gcp_video_minutes'
      });
    }
    
    // 使用量チェック: Dify APIが停止していないか確認
    const difyStopped = await isServiceStopped('dify_api_calls');
    if (difyStopped) {
      return res.status(503).json({ 
        error: 'Service temporarily unavailable',
        message: 'Dify APIの使用量上限に達しました。来月までお待ちください。',
        service: 'dify_api_calls'
      });
    }
    
    const difyApiKey = process.env.DIFY_API_KEY;
    const difyApiUrl = process.env.DIFY_API_URL || 'https://api.dify.ai/v1';
    
    if (!difyApiKey) {
      return res.status(500).json({ error: 'Dify API key is not configured' });
    }
    
    // 動画解析結果をAIKA18のプロンプトに合わせてフォーマット
    const analysisPrompt = `以下の動画解析結果を基に、AIKA18として戦闘力を数値化し、辛口で指導してください。

動画解析結果:
${JSON.stringify(videoAnalysisResult, null, 2)}

レジェンドファイター基準:
- 平均プロレベル: 100ポイント
- エリートレベル: 130ポイント
- チャンピオンレベル: 150ポイント

戦闘力を「XXポイント（レジェンドファイター平均のYY%）」の形式で表示し、具体的な改善点を指摘してください。`;
    
    // Dify APIにリクエストを送信
    const response = await fetch(`${difyApiUrl}/chat-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${difyApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {},
        query: analysisPrompt,
        response_mode: 'blocking',
        user: userId || 'anonymous',
        conversation_id: req.body.conversationId || undefined,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Dify API error:', errorText);
      return res.status(response.status).json({ 
        error: 'Dify API error',
        details: errorText 
      });
    }
    
    const data = await response.json();
    
    // 使用量を記録（動画解析時間とDify API呼び出し）
    const videoMinutes = videoDurationMinutes || 1; // デフォルト1分
    const videoUsage = await recordUsage('gcp_video_minutes', videoMinutes);
    const difyUsage = await recordUsage('dify_api_calls', 1);
    
    // 停止状態になった場合は警告を返す
    if (videoUsage.shouldStop || difyUsage.shouldStop) {
      console.warn('Usage limit reached. Service stopped.');
    }
    
    res.json({
      success: true,
      message: data.answer,
      conversationId: data.conversation_id,
      usage: {
        video: {
          current: videoUsage.currentUsage,
          limit: videoUsage.limit,
          status: videoUsage.status,
          percentage: videoUsage.percentage
        },
        dify: {
          current: difyUsage.currentUsage,
          limit: difyUsage.limit,
          status: difyUsage.status,
          percentage: difyUsage.percentage
        }
      }
    });
    
  } catch (error) {
    console.error('Error calling Dify API for video analysis:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// 使用量リセットAPI（月初めに実行）
app.post('/api/usage/reset', async (req, res) => {
  try {
    // 認証チェック（管理者のみ）
    const apiKey = req.headers['x-admin-api-key'];
    const expectedApiKey = process.env.ADMIN_API_KEY;
    
    if (expectedApiKey && apiKey !== expectedApiKey) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { resetMonthlyUsage } = await import('./usage-monitor.js');
    const result = await resetMonthlyUsage();
    
    res.json(result);
  } catch (error) {
    console.error('Error resetting usage:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// Cloud Run はポート環境変数に従う必要あり
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
});
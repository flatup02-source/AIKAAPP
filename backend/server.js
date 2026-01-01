// filename: server.js
import express from 'express';

// セキュリティ: 許可するオリジンを限定
const allowedOrigins = [
  'https://serene-zabaione-8c4e2a.netlify.app',
  'https://aika18.netlify.app',
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

// CORS設定
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (isAllowedOrigin(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Vary', 'Origin');
    res.header('Access-Control-Allow-Credentials', 'true');
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
  res.status(200).send('OK');
});

app.use(express.json());

// Root health check for Cloud Run
app.get('/', (req, res) => {
  res.status(200).send('OK');
});

// API ルート
app.get('/health', (req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

app.post('/api/upload', (req, res) => {
  // 実際の処理をここで行う（例: GCS に書き込みなど）
  res.json({ status: 'uploaded' });
});

// Cloud Run はポート環境変数に従う必要あり
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
});

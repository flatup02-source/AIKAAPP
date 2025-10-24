// filename: server.js

import express from 'express';
import cors from 'cors';

// セキュリティ: 許可するオリジンを限定
// Netlify の本番/プレビューのURLを必ず自分の環境に合わせて設定してください。
// 例）本番: https://your-site.netlify.app
//     プレビュー: https://deploy-preview-*/your-site--something.netlify.app のようにパターンがあるため、必要なら正規表現ベースのチェックを使います。
const allowedOrigins = [
  'https://your-site.netlify.app',
  'https://your-custom-domain.example.com',
];

// 可変なプレビューURLに対応したい場合のカスタム判定
function isAllowedOrigin(origin) {
  if (!origin) return false;
  if (allowedOrigins.includes(origin)) return true;
  // Netlifyプレビュー: https://deploy-preview-123--your-site.netlify.app の形式
  const previewPattern = /^https:\/\/deploy-preview-\d+--your-site\.netlify\.app$/;
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

// 例: API ルート
app.get('/health', (req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

app.post('/api/upload', (req, res) => {
  // 実際の処理をここで行う（例: GCS に書き込みなど）
  // 成功レスポンス
  res.json({ status: 'uploaded' });
});

// Cloud Run はポート環境変数に従う必要あり
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
});
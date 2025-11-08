# n8n設定ガイド

## セットアップ手順

### 1. 環境変数の設定

`.env`ファイルを作成して以下の環境変数を設定してください：

```bash
# n8n基本認証
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=your-secure-password

# n8n設定
N8N_HOST=your-domain.com
N8N_PROTOCOL=https
WEBHOOK_URL=https://your-domain.com

# PostgreSQL
POSTGRES_PASSWORD=your-secure-password

# 暗号化キー（必ず変更）
N8N_ENCRYPTION_KEY=your-random-encryption-key

# タイムゾーン
GENERIC_TIMEZONE=Asia/Tokyo
```

### 2. n8nの起動

```bash
docker-compose -f docker-compose.n8n.yml up -d
```

### 3. n8nへのアクセス

ブラウザで `http://localhost:5678` にアクセスし、設定した認証情報でログインします。

### 4. 必要な認証情報の設定

n8nのCredentialsセクションで以下を設定：

#### Firebase Admin SDK
- サービスアカウントキー（JSON）
- プロジェクトID

#### Google Cloud
- サービスアカウントキー（JSON）
- スコープ: `https://www.googleapis.com/auth/spreadsheets`, `https://www.googleapis.com/auth/calendar`

#### LINE Messaging API
- Channel Access Token
- Channel Secret

#### Stripe / PayPal
- API Key
- Secret Key

#### Gmail / SendGrid
- SMTP設定またはAPI Key

### 5. Webhook API Keyの設定

バックエンドサーバーの環境変数に設定：

```bash
N8N_WEBHOOK_API_KEY=your-secure-api-key
```

このAPI Keyをn8nのHTTP Requestノードのヘッダーに設定：
```
X-n8n-api-key: your-secure-api-key
```

## ワークフローのインポート

`n8n-workflows/`ディレクトリにワークフローのJSONファイルを配置すると、n8nからインポートできます。

## セキュリティのベストプラクティス

1. **強力なパスワード**: 基本認証のパスワードは必ず変更
2. **HTTPS**: 本番環境では必ずHTTPSを使用
3. **API Key**: Webhook API Keyは定期的にローテーション
4. **認証情報**: 認証情報はn8nのCredentials機能を使用（環境変数に直接書かない）
5. **ファイアウォール**: 必要に応じてIP制限を設定

## トラブルシューティング

### n8nが起動しない
```bash
docker-compose -f docker-compose.n8n.yml logs n8n
```

### データベース接続エラー
PostgreSQLのログを確認：
```bash
docker-compose -f docker-compose.n8n.yml logs postgres
```

### Webhookが動作しない
- Webhook URLが正しいか確認
- API Keyが正しく設定されているか確認
- バックエンドサーバーのログを確認

## バックアップ

n8nのデータをバックアップ：

```bash
# ボリュームのバックアップ
docker run --rm -v n8n_n8n_data:/data -v $(pwd):/backup alpine tar czf /backup/n8n-backup-$(date +%Y%m%d).tar.gz /data
```

## 更新

n8nを最新版に更新：

```bash
docker-compose -f docker-compose.n8n.yml pull
docker-compose -f docker-compose.n8n.yml up -d
```

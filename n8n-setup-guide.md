# n8nセットアップガイド

## 1. n8nのインストール

### オプションA: Dockerを使用（推奨）

```bash
# n8nをDockerで起動
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  -e N8N_BASIC_AUTH_ACTIVE=true \
  -e N8N_BASIC_AUTH_USER=admin \
  -e N8N_BASIC_AUTH_PASSWORD=your-secure-password \
  n8nio/n8n
```

### オプションB: npmを使用

```bash
npm install n8n -g
n8n start
```

### オプションC: npxを使用（一時的な実行）

```bash
npx n8n
```

## 2. 初回セットアップ

1. ブラウザで `http://localhost:5678` にアクセス
2. 初回アクセス時にユーザー名とパスワードを設定
3. ダッシュボードが表示されます

## 3. 必要な認証情報の設定

### Googleサービス（Google Sheets, Google Calendar）

1. [Google Cloud Console](https://console.cloud.google.com/)でプロジェクトを作成
2. APIを有効化:
   - Google Sheets API
   - Google Calendar API
3. OAuth2認証情報を作成
4. n8nの「Credentials」でGoogle OAuth2を設定

### LINE Messaging API

1. [LINE Developers Console](https://developers.line.biz/ja/)でプロバイダーを作成
2. Messaging APIチャネルを作成
3. Channel Access TokenとChannel Secretを取得
4. n8nの「Credentials」でLINEを設定

### Firebase

1. FirebaseプロジェクトでService Account JSONをダウンロード
2. n8nの「Credentials」でFirebase Admin SDKを設定

### Stripe（請求ワークフローの場合）

1. [Stripe Dashboard](https://dashboard.stripe.com/)でAPI Keyを取得
2. n8nの「Credentials」でStripeを設定

## 4. ワークフローのインポート

1. n8nのダッシュボードで「Workflows」を選択
2. 「Import from File」をクリック
3. `n8n-workflows/`ディレクトリ内のJSONファイルを選択
4. ワークフローがインポートされます

## 5. 環境変数の設定

n8nの環境変数として以下を設定:

```bash
# .envファイルまたは環境変数として設定
GOOGLE_SHEET_ID=your-google-sheet-id
GOOGLE_CALENDAR_ID=your-calendar-id
LINE_CHANNEL_ACCESS_TOKEN=your-line-token
LINE_CHANNEL_SECRET=your-line-secret
STRIPE_API_KEY=your-stripe-key
```

## 6. ワークフローのカスタマイズ

インポートしたワークフローは、あなたの環境に合わせてカスタマイズが必要です:

1. **Webhook URLの確認**: 各WebhookノードのURLを確認
2. **認証情報の設定**: 各ノードで正しい認証情報を選択
3. **データ構造の調整**: スプレッドシートの列名やデータ構造を確認
4. **エラーハンドリングの追加**: 必要に応じてエラー処理を追加

## 7. テスト実行

1. ワークフローを有効化する前に「Test workflow」でテスト
2. 各ノードの出力を確認
3. 問題がなければワークフローを有効化

## 8. 本番環境へのデプロイ

### Cloud Runへのデプロイ（GCP）

```bash
# Dockerfileを作成
cat > Dockerfile << EOF
FROM n8nio/n8n

# 環境変数を設定
ENV N8N_BASIC_AUTH_ACTIVE=true
ENV N8N_BASIC_AUTH_USER=admin
ENV N8N_BASIC_AUTH_PASSWORD=your-secure-password

# ポートを公開
EXPOSE 5678
EOF

# Cloud Buildでビルド・デプロイ
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/n8n
gcloud run deploy n8n \
  --image gcr.io/YOUR_PROJECT_ID/n8n \
  --platform managed \
  --region asia-northeast1 \
  --allow-unauthenticated
```

### その他のクラウドプラットフォーム

- **Heroku**: Herokuボタンを使用
- **Railway**: Railway CLIを使用
- **DigitalOcean**: App Platformを使用

## 9. セキュリティのベストプラクティス

1. **認証の有効化**: Basic認証またはOAuth認証を有効化
2. **HTTPSの使用**: 本番環境では必ずHTTPSを使用
3. **認証情報の保護**: 環境変数やシークレット管理サービスを使用
4. **Webhookのセキュリティ**: Webhookに認証を追加（推奨）
5. **定期的なバックアップ**: ワークフロー設定の定期的なバックアップ

## 10. トラブルシューティング

### よくある問題

1. **認証エラー**: 認証情報が正しく設定されているか確認
2. **API制限**: APIのレート制限に達していないか確認
3. **データ形式エラー**: データの形式が正しいか確認
4. **タイムアウト**: 長時間実行されるワークフローはタイムアウト設定を調整

### ログの確認

```bash
# Dockerの場合
docker logs n8n

# npmの場合
# コンソールに直接出力されます
```

## 11. 次のステップ

1. 基本的なワークフローから始める
2. 動作確認後、より複雑なワークフローに拡張
3. エラーハンドリングと通知を追加
4. パフォーマンスを最適化
5. 定期的にワークフローを見直し・改善

## 参考リンク

- [n8n公式ドキュメント](https://docs.n8n.io/)
- [n8nコミュニティフォーラム](https://community.n8n.io/)
- [n8nワークフロー例](https://n8n.io/workflows/)

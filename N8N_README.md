# n8nを使った格闘技GYM経営の自動化

個人事業主としての格闘技GYM経営を効率化するためのn8nワークフロー自動化システムです。

## 📋 目次

- [概要](#概要)
- [ファイル構成](#ファイル構成)
- [クイックスタート](#クイックスタート)
- [ワークフロー一覧](#ワークフロー一覧)
- [詳細ドキュメント](#詳細ドキュメント)

## 概要

このプロジェクトは、n8n（ワークフロー自動化ツール）を使用して、格闘技GYM経営の以下の業務を自動化します：

- ✅ 会員管理
- ✅ レッスン予約管理
- ✅ 請求・支払い管理
- ✅ マーケティング・集客
- ✅ コンテンツ管理
- ✅ コミュニケーション自動化
- ✅ レポート・分析

## ファイル構成

```
/workspace/
├── N8N_AUTOMATION_IDEAS.md          # 自動化アイデアの詳細ドキュメント
├── N8N_SETUP.md                     # n8nセットアップガイド
├── docker-compose.n8n.yml           # n8n用Docker Compose設定
├── n8n-workflows/                   # n8nワークフローのJSONファイル
│   ├── lesson-booking.json          # レッスン予約の自動化
│   ├── monthly-billing.json         # 月額会費の自動請求
│   └── line-bot.json                # LINE自動返信ボット
└── backend/
    └── server.js                    # n8n連携用Webhookエンドポイント
```

## クイックスタート

### 1. n8nのセットアップ

詳細は [N8N_SETUP.md](./N8N_SETUP.md) を参照してください。

```bash
# 環境変数を設定
cp .env.example .env
# .envファイルを編集して必要な認証情報を設定

# n8nを起動
docker-compose -f docker-compose.n8n.yml up -d

# n8nにアクセス
# http://localhost:5678
```

### 2. ワークフローのインポート

1. n8nのWeb UIにアクセス
2. 「Workflows」→「Import from File」
3. `n8n-workflows/`ディレクトリ内のJSONファイルを選択してインポート

### 3. 認証情報の設定

各ワークフローで使用する認証情報をn8nのCredentialsセクションで設定：

- Google Sheets OAuth2
- Google Calendar OAuth2
- LINE Messaging API
- Stripe API
- SMTP (Gmail/SendGrid)
- OpenAI API

### 4. 環境変数の設定

n8nの環境変数で以下を設定：

```bash
BACKEND_URL=https://your-backend-url.com
N8N_WEBHOOK_API_KEY=your-secure-api-key
GOOGLE_SHEET_ID=your-google-sheet-id
GOOGLE_CALENDAR_ID=your-calendar-id
FROM_EMAIL=your-email@example.com
ADMIN_EMAIL=admin@example.com
```

## ワークフロー一覧

### 1. レッスン予約の自動化 (`lesson-booking.json`)

**機能**:
- Webhook経由でレッスン予約を受信
- Googleスプレッドシートに記録
- Googleカレンダーに予約を追加
- LINEで確認メッセージ送信
- 前日に自動リマインダー送信

**トリガー**: Webhook (POST `/webhook/lesson-booking`)

**必要な認証**:
- Google Sheets OAuth2
- Google Calendar OAuth2
- LINE Messaging API

### 2. 月額会費の自動請求 (`monthly-billing.json`)

**機能**:
- 毎月1日に自動実行
- アクティブ会員リストを取得
- Stripeで請求書を作成
- 請求書をメール送信
- 未払い会員にリマインダー送信（毎月5日）

**トリガー**: スケジュール（毎月1日 00:00）

**必要な認証**:
- Stripe API
- SMTP
- Google Sheets OAuth2

### 3. LINE自動返信ボット (`line-bot.json`)

**機能**:
- LINEメッセージを受信
- OpenAI (GPT-4) で自動回答生成
- よくある質問に自動返信
- 複雑な質問は担当者に転送
- 問い合わせログを記録

**トリガー**: LINE Webhook

**必要な認証**:
- LINE Messaging API
- OpenAI API
- SMTP
- Google Sheets OAuth2

## 詳細ドキュメント

- **[N8N_AUTOMATION_IDEAS.md](./N8N_AUTOMATION_IDEAS.md)**: 10の自動化カテゴリと詳細な実装アイデア
- **[N8N_SETUP.md](./N8N_SETUP.md)**: n8nのセットアップ手順とトラブルシューティング

## 既存システムとの連携

### Webhookエンドポイント

バックエンドサーバーに以下のエンドポイントが追加されています：

#### POST `/api/n8n/webhook`
n8nから呼び出される統合API

**リクエスト例**:
```json
{
  "event": "lesson_booked",
  "data": {
    "memberId": "12345",
    "memberName": "山田太郎",
    "lessonDate": "2024-01-15",
    "lessonTime": "19:00"
  }
}
```

**認証**: `X-n8n-api-key` ヘッダーにAPI Keyを設定

#### GET `/api/n8n/data/:type`
n8nからデータを取得するためのAPI

**エンドポイント例**:
- `/api/n8n/data/members` - 会員リスト取得
- `/api/n8n/data/lessons` - レッスンスケジュール取得

## 実装の優先順位

### フェーズ1（即効性が高い）✅
1. レッスン予約の自動化
2. 月額会費の自動請求
3. LINE自動返信ボット

### フェーズ2（業務効率化）
4. 新規会員登録フロー
5. 動画アップロード・分析の自動化
6. 月次レポートの自動生成

### フェーズ3（高度な自動化）
7. SNS投稿の自動化
8. 会員分析レポート
9. 体験レッスンフォローアップ

## セキュリティ

- Webhook API Keyによる認証
- HTTPSの使用（本番環境）
- 認証情報の安全な管理（n8n Credentials）
- 個人情報保護法への準拠

## トラブルシューティング

### ワークフローが実行されない
1. n8nのログを確認: `docker-compose -f docker-compose.n8n.yml logs n8n`
2. 認証情報が正しく設定されているか確認
3. 環境変数が正しく設定されているか確認

### Webhookが動作しない
1. Webhook URLが正しいか確認
2. API Keyが正しく設定されているか確認
3. バックエンドサーバーのログを確認

### 認証エラー
1. 各サービスのAPI Key/Tokenが有効か確認
2. スコープが正しく設定されているか確認
3. 認証情報の有効期限を確認

## 参考リソース

- [n8n公式ドキュメント](https://docs.n8n.io/)
- [n8n GitHub](https://github.com/n8n-io/n8n)
- [n8nコミュニティワークフロー](https://n8n.io/workflows/)

## ライセンス

このプロジェクトは個人事業主の格闘技GYM経営のための自動化システムです。

## サポート

質問や問題がある場合は、n8nのコミュニティフォーラムまたはGitHubのIssuesを参照してください。

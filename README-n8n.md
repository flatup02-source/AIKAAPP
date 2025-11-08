# n8nを使った格闘技GYM経営の自動化

個人事業主の格闘技GYM経営者向けに、n8nを活用した業務自動化の実装ガイドとワークフロー集です。

## 📋 目次

1. [概要](#概要)
2. [ファイル構成](#ファイル構成)
3. [クイックスタート](#クイックスタート)
4. [主な機能](#主な機能)
5. [ワークフロー一覧](#ワークフロー一覧)
6. [既存システムとの連携](#既存システムとの連携)

## 概要

このプロジェクトは、n8n（ワークフロー自動化ツール）を使って、格闘技GYM経営の以下の業務を自動化するためのものです：

- ✅ **会員管理**: 新規登録、情報更新、通知の自動化
- ✅ **予約管理**: 予約、キャンセル、リマインダーの自動化
- ✅ **請求処理**: 月額会費の自動請求、督促の自動化
- ✅ **顧客対応**: LINE Botによる自動応答
- ✅ **データ分析**: レポートの自動生成
- ✅ **マーケティング**: SNS投稿、フォローアップの自動化

## ファイル構成

```
/workspace/
├── docker-compose.n8n.yml              # n8nのDocker Compose設定
├── .env.n8n.example                    # 環境変数のテンプレート
├── n8n-gym-automation.md              # 詳細な自動化アイデア集（12のワークフロー案）
├── n8n-implementation-guide.md        # 実装ガイド（具体的な設定方法）
└── n8n-workflows/                      # すぐに使えるワークフローJSON
    ├── README.md                       # ワークフロー詳細ガイド
    ├── 01-reservation-reminder.json   # 予約リマインダー
    ├── 02-new-member-registration.json # 新規会員登録
    └── 03-monthly-billing.json        # 月額会費自動請求
```

## クイックスタート

### 1. 環境変数の設定

```bash
# 環境変数ファイルを作成
cp .env.n8n.example .env.n8n

# .env.n8nを編集して必要な値を設定
nano .env.n8n
```

必要な環境変数：
- `LINE_CHANNEL_ACCESS_TOKEN`: LINE Messaging APIのトークン
- `GOOGLE_SHEET_ID`: GoogleスプレッドシートID
- `FIREBASE_PROJECT_ID`: FirebaseプロジェクトID
- `NEXT_PUBLIC_SITE_URL`: サイトのURL

### 2. n8nの起動

```bash
# Docker Composeで起動
docker-compose -f docker-compose.n8n.yml --env-file .env.n8n up -d

# ログを確認
docker-compose -f docker-compose.n8n.yml logs -f n8n
```

### 3. n8nにアクセス

ブラウザで `http://localhost:5678` にアクセス

デフォルトのログイン情報：
- ユーザー名: `admin` (`.env.n8n`で変更可能)
- パスワード: `changeme` (`.env.n8n`で変更可能)

### 4. ワークフローのインポート

1. n8nのUIで「ワークフロー」→「インポート」を選択
2. `n8n-workflows/` ディレクトリ内のJSONファイルを選択
3. 各ワークフローで必要な認証情報を設定：
   - Google Sheets OAuth2認証
   - LINE Messaging API認証

## 主な機能

### 1. 予約リマインダー自動送信

毎日9時に翌日の予約を確認し、予約者にLINEでリマインダーを送信します。

**効果**:
- キャンセル率の低下
- 会員の満足度向上
- 手動での確認作業の削減

### 2. 新規会員登録の自動処理

Webhookで新規会員情報を受信し、自動的に：
- スプレッドシートに記録
- LINEで歓迎メッセージを送信
- 初回レッスン予約の案内

**効果**:
- オンボーディングの効率化
- 会員の第一印象の向上
- 手作業の削減

### 3. 月額会費の自動請求

毎月1日9時にアクティブ会員の会費を計算し、請求通知をLINEで送信します。

**効果**:
- 請求漏れの防止
- 回収率の向上
- 請求作業の時間削減

## ワークフロー一覧

| ワークフロー | ファイル | 説明 | 優先度 |
|------------|---------|------|--------|
| 予約リマインダー | `01-reservation-reminder.json` | 毎日9時に翌日の予約を確認してLINE通知 | ⭐⭐⭐ |
| 新規会員登録 | `02-new-member-registration.json` | Webhookで新規会員を自動登録・通知 | ⭐⭐ |
| 月額会費自動請求 | `03-monthly-billing.json` | 毎月1日に会費を自動請求 | ⭐⭐⭐ |

### 追加で実装できるワークフロー

詳細は `n8n-gym-automation.md` を参照：

- キャンセル処理の自動化
- 未払い督促の自動化
- 動画分析結果の自動処理
- LINE Botによる問い合わせ自動応答
- 月次レポートの自動生成
- SNS投稿の自動化
- 体験レッスン後のフォローアップ

## 既存システムとの連携

このプロジェクトには既に以下の機能が実装されています：

- **LINE認証**: `/api/auth/line`
- **Googleスプレッドシート連携**: `/api/spreadsheet`
- **動画分析**: `/api/analyze-video`
- **Firebase認証・ストレージ**

n8nはこれらのAPIを呼び出すことで、既存システムと連携できます。

### 連携例

**スプレッドシートAPIの呼び出し**:
```javascript
// n8nのHTTP Requestノードで
Method: POST
URL: {{ $env.NEXT_PUBLIC_SITE_URL }}/api/spreadsheet
Body: {
  "userId": "{{ $json.userId }}",
  "userName": "{{ $json.userName }}",
  "videoUrl": "{{ $json.videoUrl }}",
  "timestamp": "{{ $now.toISOString() }}"
}
```

## 必要な準備

### 1. LINE Messaging APIの設定

1. [LINE Developers Console](https://developers.line.biz/ja/)でアカウント作成
2. Messaging APIチャネルを作成
3. Channel Access Tokenを取得
4. Webhook URLを設定（n8nのWebhook URL）

### 2. Google Sheets APIの設定

1. [Google Cloud Console](https://console.cloud.google.com/)でプロジェクト作成
2. Google Sheets APIを有効化
3. OAuth2認証情報を作成
4. スプレッドシートを作成し、必要なシートを準備

### 3. スプレッドシートの準備

以下のシートを作成してください：

**予約管理シート**:
- 列: 日付, LINE_USER_ID, 時間, クラス名, 備考

**会員管理シート**:
- 列: 登録日, ユーザーID, LINE_USER_ID, メールアドレス, 追加クラス数, ステータス

**請求管理シート**:
- 列: 請求日, ユーザーID, 基本料金, 追加クラス数, 追加料金, 合計金額, 請求月

## トラブルシューティング

### よくある問題

**Q: Google Sheetsへのアクセスが拒否される**
- A: サービスアカウントの認証情報を確認し、スプレッドシートを共有してください

**Q: LINE通知が送信されない**
- A: Channel Access TokenとユーザーIDが正しいか確認してください

**Q: Webhookが動作しない**
- A: n8nのURLが公開されているか確認してください（localhostは外部からアクセス不可）

詳細は `n8n-workflows/README.md` を参照してください。

## 参考資料

- [n8n公式ドキュメント](https://docs.n8n.io/)
- [LINE Messaging API](https://developers.line.biz/ja/docs/messaging-api/)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [詳細な自動化アイデア集](./n8n-gym-automation.md)
- [実装ガイド](./n8n-implementation-guide.md)

## ライセンス

このプロジェクトは個人事業主の格闘技GYM経営者向けに作成されています。

## サポート

問題が発生した場合：
1. `n8n-workflows/README.md` のトラブルシューティングを確認
2. n8nの実行ログを確認
3. 各ノードの出力データを確認

---

**次のステップ**: `n8n-implementation-guide.md` を読んで、具体的な実装方法を確認してください。

# n8nワークフロー実装例

このディレクトリには、格闘技GYM経営者向けのn8nワークフロー実装例を格納します。

## ワークフロー例

### 1. 新規会員登録時の自動処理
ファイル: `workflows/member-registration.json`

### 2. 月次会費の自動請求
ファイル: `workflows/monthly-billing.json`

### 3. レッスン予約の自動処理
ファイル: `workflows/lesson-booking.json`

## 使い方

1. n8nのWeb UIにアクセス
2. 「Import from File」を選択
3. 該当するJSONファイルをインポート
4. 認証情報を設定
5. ワークフローを有効化

## 認証設定が必要なサービス

- Google Sheets API
- LINE Messaging API
- Firebase Admin SDK
- Stripe API（請求ワークフローの場合）
- Gmail API（メール送信の場合）

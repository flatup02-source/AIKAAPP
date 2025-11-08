# n8nワークフロー実装ガイド - クイックリファレンス

## ファイル構成

```
/workspace/
├── docker-compose.n8n.yml          # n8nのDocker Compose設定
├── .env.n8n.example                # 環境変数のテンプレート
├── n8n-gym-automation.md          # 詳細な自動化アイデア集
├── n8n-implementation-guide.md    # 実装ガイド
└── n8n-workflows/                  # ワークフローJSONファイル
    ├── 01-reservation-reminder.json      # 予約リマインダー
    ├── 02-new-member-registration.json   # 新規会員登録
    └── 03-monthly-billing.json           # 月額会費自動請求
```

## クイックスタート

### 1. 環境設定

```bash
# 環境変数ファイルを作成
cp .env.n8n.example .env.n8n

# .env.n8nを編集して必要な値を設定
# - LINE_CHANNEL_ACCESS_TOKEN
# - GOOGLE_SHEET_ID
# - FIREBASE_PROJECT_ID
# など
```

### 2. n8nの起動

```bash
docker-compose -f docker-compose.n8n.yml --env-file .env.n8n up -d
```

### 3. n8nにアクセス

ブラウザで `http://localhost:5678` にアクセス

### 4. ワークフローのインポート

1. n8nのUIで「ワークフロー」→「インポート」を選択
2. `n8n-workflows/` ディレクトリ内のJSONファイルを選択
3. 各ワークフローで必要な認証情報を設定

## ワークフロー一覧

### 01. 予約リマインダー (`01-reservation-reminder.json`)

**機能**: 毎日9時に翌日の予約を確認し、予約者にLINEでリマインダーを送信

**必要な設定**:
- Google Sheets認証（OAuth2）
- LINE Messaging API認証（Channel Access Token）
- スプレッドシートに「予約管理」シートが必要
- 列構成: 日付, LINE_USER_ID, 時間, クラス名

**使用方法**:
1. ワークフローをインポート
2. Google SheetsとLINEの認証情報を設定
3. スプレッドシートIDを環境変数に設定
4. ワークフローを有効化

### 02. 新規会員登録 (`02-new-member-registration.json`)

**機能**: Webhookで新規会員情報を受信し、スプレッドシートに記録してLINEで歓迎メッセージを送信

**必要な設定**:
- Google Sheets認証
- LINE Messaging API認証
- Webhook URL: `http://your-n8n-instance.com/webhook/new-member`

**Webhookの呼び出し例**:
```bash
curl -X POST http://localhost:5678/webhook/new-member \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "userName": "山田太郎",
    "email": "yamada@example.com",
    "lineUserId": "U1234567890abcdef"
  }'
```

### 03. 月額会費自動請求 (`03-monthly-billing.json`)

**機能**: 毎月1日9時にアクティブ会員の会費を計算し、請求通知をLINEで送信

**必要な設定**:
- Google Sheets認証
- LINE Messaging API認証
- スプレッドシートに「会員管理」と「請求管理」シートが必要

**会員管理シートの列構成**:
- 登録日, ユーザーID, LINE_USER_ID, 追加クラス数, ステータス

**請求管理シートの列構成**:
- 請求日, ユーザーID, 基本料金, 追加クラス数, 追加料金, 合計金額, 請求月

## 既存システムとの連携

### Next.js APIエンドポイントとの連携

既存のAPIをn8nから呼び出す例：

```javascript
// HTTP Requestノードの設定
Method: POST
URL: {{ $env.NEXT_PUBLIC_SITE_URL }}/api/spreadsheet
Body (JSON):
{
  "userId": "{{ $json.userId }}",
  "userName": "{{ $json.userName }}",
  "videoUrl": "{{ $json.videoUrl }}",
  "timestamp": "{{ $now.toISOString() }}"
}
```

### 動画分析結果の処理

`/api/analyze-video` の結果をn8nで処理する例：

1. Webhookノードで動画分析完了を検知
2. 分析結果をスプレッドシートに記録
3. 会員にLINEで分析レポートを送信

## トラブルシューティング

### よくある問題

**1. Google Sheetsへのアクセスが拒否される**
- サービスアカウントの認証情報を確認
- スプレッドシートの共有設定を確認（サービスアカウントのメールアドレスを共有）

**2. LINE通知が送信されない**
- Channel Access Tokenが正しいか確認
- ユーザーIDが正しいか確認（LINEユーザーIDは通常 "U" で始まる）

**3. Webhookが動作しない**
- n8nのURLが正しく設定されているか確認
- ファイアウォールの設定を確認
- Webhook URLが公開されているか確認（localhostは外部からアクセス不可）

**4. スケジュールが実行されない**
- Cron式が正しいか確認
- タイムゾーンが正しく設定されているか確認（Asia/Tokyo）

## 次のステップ

1. **基本的なワークフローから始める**: 予約リマインダーから実装
2. **段階的に追加**: 動作確認しながら他のワークフローを追加
3. **カスタマイズ**: 自分のGYMの業務フローに合わせて調整
4. **監視と改善**: エラーログを確認して改善

## 参考資料

- [n8n公式ドキュメント](https://docs.n8n.io/)
- [LINE Messaging API](https://developers.line.biz/ja/docs/messaging-api/)
- [Google Sheets API](https://developers.google.com/sheets/api)

## サポート

問題が発生した場合：
1. n8nの実行ログを確認
2. 各ノードの出力データを確認
3. エラーメッセージを確認して対応

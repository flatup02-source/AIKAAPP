# n8nワークフロー実装ガイド

## クイックスタート

### 1. n8nの起動

```bash
# 環境変数ファイルを作成
cp .env.n8n.example .env.n8n
# .env.n8nを編集して必要な値を設定

# Docker Composeで起動
docker-compose -f docker-compose.n8n.yml --env-file .env.n8n up -d

# ブラウザでアクセス
# http://localhost:5678
```

### 2. 基本的なワークフローの作成

#### 例1: 予約リマインダー（毎日9時に実行）

1. n8nのUIで「新規ワークフロー」を作成
2. 以下のノードを追加：

**ノード1: Schedule Trigger**
- 設定: Cron式 `0 9 * * *` (毎日9時)
- タイムゾーン: Asia/Tokyo

**ノード2: Google Sheets (読み取り)**
- 操作: Read
- スプレッドシートID: `{{ $env.GOOGLE_SHEET_ID }}`
- シート名: 予約管理
- 範囲: A2:E100

**ノード3: Code (フィルタリング)**
```javascript
// 翌日の予約をフィルタ
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowStr = tomorrow.toISOString().split('T')[0];

return items.filter(item => {
  const reservationDate = item.json['日付'];
  return reservationDate === tomorrowStr;
});
```

**ノード4: HTTP Request (LINE通知)**
- Method: POST
- URL: `https://api.line.me/v2/bot/message/push`
- Authentication: Header Auth
  - Name: Authorization
  - Value: `Bearer {{ $env.LINE_CHANNEL_ACCESS_TOKEN }}`
- Body (JSON):
```json
{
  "to": "{{ $json.LINE_USER_ID }}",
  "messages": [
    {
      "type": "text",
      "text": "明日のレッスンのリマインダーです。\n時間: {{ $json.時間 }}\nクラス: {{ $json.クラス名 }}"
    }
  ]
}
```

#### 例2: 新規会員登録時の自動処理

**トリガー: Webhook**
- Path: `/webhook/new-member`
- Method: POST

**ノード1: Webhook**
- HTTP Method: POST
- Path: new-member

**ノード2: Google Sheets (書き込み)**
- 操作: Append
- スプレッドシートID: `{{ $env.GOOGLE_SHEET_ID }}`
- シート名: 会員管理
- 範囲: A:D
- Values:
```json
[
  [
    "{{ $now.toFormat('yyyy-MM-dd HH:mm:ss') }}",
    "{{ $json.userId }}",
    "{{ $json.userName }}",
    "{{ $json.email }}"
  ]
]
```

**ノード3: HTTP Request (LINE通知)**
- Method: POST
- URL: `https://api.line.me/v2/bot/message/push`
- Body:
```json
{
  "to": "{{ $json.lineUserId }}",
  "messages": [
    {
      "type": "text",
      "text": "{{ $json.userName }}さん、ご登録ありがとうございます！\n初回レッスンの予約をお待ちしています。"
    }
  ]
}
```

### 3. 既存APIとの連携

既存のNext.js APIエンドポイントをn8nから呼び出す例：

**HTTP Requestノードの設定:**
- Method: POST
- URL: `{{ $env.NEXT_PUBLIC_SITE_URL }}/api/spreadsheet`
- Body (JSON):
```json
{
  "userId": "{{ $json.userId }}",
  "userName": "{{ $json.userName }}",
  "videoUrl": "{{ $json.videoUrl }}",
  "timestamp": "{{ $now.toISOString() }}"
}
```

### 4. LINE Botの設定

1. LINE Developers ConsoleでMessaging APIチャネルを作成
2. Webhook URLを設定: `https://your-n8n-instance.com/webhook/line`
3. Channel Access Tokenを取得して環境変数に設定

**LINE Webhookノードの設定:**
- Path: line
- Method: POST

**メッセージ受信後の処理例:**
```javascript
// Codeノードでメッセージを処理
const message = $input.item.json.events[0].message.text;
const userId = $input.item.json.events[0].source.userId;

// よくある質問への自動応答
const responses = {
  '営業時間': '営業時間は平日18:00-22:00、土日10:00-20:00です。',
  '料金': '月額会費は10,000円です。体験レッスンは無料です。',
  '予約': '予約はLINEまたはWebサイトから可能です。'
};

let replyText = '申し訳ございませんが、その質問にはお答えできません。お問い合わせください。';

for (const [keyword, response] of Object.entries(responses)) {
  if (message.includes(keyword)) {
    replyText = response;
    break;
  }
}

return [{
  json: {
    userId: userId,
    replyText: replyText
  }
}];
```

### 5. 月額会費の自動請求

**Schedule Trigger:**
- Cron: `0 9 1 * *` (毎月1日9時)

**ワークフロー:**
1. Google Sheetsからアクティブ会員を取得
2. 各会員の請求金額を計算
3. 決済API（Stripe、LINE Payなど）で請求
4. 結果をスプレッドシートに記録
5. 請求完了通知をLINEで送信

**Codeノード（請求金額計算）:**
```javascript
const members = $input.all();

return members.map(member => {
  const baseFee = 10000; // 基本料金
  const extraClasses = member.json['追加クラス数'] || 0;
  const extraFee = extraClasses * 2000; // 追加クラス料金
  
  return {
    json: {
      ...member.json,
      totalAmount: baseFee + extraFee,
      baseFee: baseFee,
      extraFee: extraFee
    }
  };
});
```

### 6. エラーハンドリング

**エラー処理のベストプラクティス:**

1. **Error Triggerノードを使用**
   - ワークフローの最後に追加
   - エラー発生時に通知を送信

2. **Try-Catchパターン**
   - Codeノードでtry-catchを使用
   - エラーを適切に処理

3. **ログ記録**
   - 重要な処理はスプレッドシートにログを記録
   - エラー内容、タイムスタンプ、ユーザー情報を記録

### 7. テスト方法

1. **手動実行**
   - 各ノードを個別にテスト
   - データを確認

2. **Webhookのテスト**
   ```bash
   curl -X POST http://localhost:5678/webhook/test \
     -H "Content-Type: application/json" \
     -d '{"test": "data"}'
   ```

3. **スケジュールのテスト**
   - Cron式を短い間隔に設定してテスト
   - 例: `*/5 * * * *` (5分ごと)

### 8. 本番環境へのデプロイ

1. **n8nのクラウドホスティング**
   - n8n Cloudを使用（有料）
   - または自前のサーバーでDocker Composeを使用

2. **環境変数の設定**
   - 本番環境の環境変数を設定
   - シークレットは安全に管理

3. **バックアップ**
   - ワークフローのエクスポート
   - 定期的にバックアップを取得

4. **監視**
   - ワークフローの実行状況を監視
   - エラー通知を設定

### 9. よくある問題と解決方法

**問題1: Webhookが動作しない**
- 解決: n8nのURLが正しく設定されているか確認
- 解決: ファイアウォールの設定を確認

**問題2: Google Sheetsへのアクセスが拒否される**
- 解決: サービスアカウントの認証情報を確認
- 解決: スプレッドシートの共有設定を確認

**問題3: LINE通知が送信されない**
- 解決: Channel Access Tokenが正しいか確認
- 解決: ユーザーIDが正しいか確認

### 10. 次のステップ

1. 基本的なワークフローから始める
2. 徐々に複雑なワークフローを追加
3. 会員からのフィードバックを収集して改善
4. 定期的にワークフローを見直して最適化

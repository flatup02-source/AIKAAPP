# n8nを使った格闘技GYM経営の自動化ワークフロー

## 概要
個人事業主の格闘技GYM経営者向けに、n8nを活用した業務自動化のアイデアと実装案をまとめます。

## 既存システムとの連携
現在のプロジェクトには以下の機能が実装されています：
- LINE認証（`/api/auth/line`）
- Googleスプレッドシート連携（`/api/spreadsheet`）
- 動画分析機能（`/api/analyze-video`）
- Firebase認証・ストレージ

これらの機能をn8nと連携させることで、より強力な自動化が可能になります。

---

## 1. 会員管理の自動化

### 1.1 新規会員登録フロー
**トリガー**: Webhook（フォーム送信、LINE登録など）

**ワークフロー**:
```
Webhook受信
  ↓
会員情報をGoogleスプレッドシートに記録
  ↓
Firebaseに会員データを作成
  ↓
LINE通知を会員に送信（登録完了メッセージ）
  ↓
会員証PDFを自動生成・送信
  ↓
初回レッスン予約案内を送信
```

**n8nノード構成**:
- Webhook
- Google Sheets（書き込み）
- HTTP Request（Firebase API呼び出し）
- LINE Messaging API
- PDF生成（n8nのPDFノードまたは外部サービス）

### 1.2 会員情報更新の自動化
**トリガー**: スプレッドシートの変更、または定期実行

**ワークフロー**:
```
スプレッドシート変更検知 / Cron（毎日）
  ↓
会員情報を取得・検証
  ↓
契約期限切れチェック
  ↓
期限切れ会員に自動通知（LINE/メール）
  ↓
更新手続きの案内を送信
```

---

## 2. 予約システムの自動化

### 2.1 レッスン予約の自動処理
**トリガー**: Webhook（予約フォーム、LINE予約）

**ワークフロー**:
```
予約リクエスト受信
  ↓
空き状況をGoogleカレンダーで確認
  ↓
予約可能かチェック
  ↓
予約確定 → Googleカレンダーに追加
  ↓
予約者にLINE通知（予約確定）
  ↓
スプレッドシートに予約記録
  ↓
前日リマインダーをスケジュール登録
```

**n8nノード構成**:
- Webhook
- Google Calendar（読み取り・書き込み）
- IF（条件分岐）
- Google Sheets（書き込み）
- LINE Messaging API
- Schedule Trigger（リマインダー用）

### 2.2 キャンセル処理の自動化
**トリガー**: Webhook（キャンセルリクエスト）

**ワークフロー**:
```
キャンセルリクエスト受信
  ↓
Googleカレンダーから予約を削除
  ↓
キャンセル待ちリストを確認
  ↓
待ちリストの最初の人に自動通知
  ↓
スプレッドシートにキャンセル記録
```

### 2.3 リマインダー自動送信
**トリガー**: Schedule Trigger（毎日実行）

**ワークフロー**:
```
毎日朝9時に実行
  ↓
翌日の予約をスプレッドシートから取得
  ↓
各予約者にLINEでリマインダー送信
  ↓
「参加しますか？」ボタン付きメッセージ
  ↓
回答をWebhookで受信して処理
```

---

## 3. 請求・支払いの自動化

### 3.1 月額会費の自動請求
**トリガー**: Schedule Trigger（毎月1日）

**ワークフロー**:
```
毎月1日に実行
  ↓
アクティブ会員リストをスプレッドシートから取得
  ↓
各会員の請求金額を計算
  ↓
請求書PDFを自動生成
  ↓
LINE Pay / Stripeで自動請求
  ↓
請求結果をスプレッドシートに記録
  ↓
請求完了通知をLINEで送信
```

**n8nノード構成**:
- Schedule Trigger
- Google Sheets（読み取り）
- Code（請求金額計算）
- HTTP Request（決済API）
- PDF生成
- LINE Messaging API

### 3.2 未払い督促の自動化
**トリガー**: Schedule Trigger（毎週実行）

**ワークフロー**:
```
毎週月曜日に実行
  ↓
未払い会員をスプレッドシートから抽出
  ↓
未払い日数に応じてメッセージを変更
  - 1週間未満: 優しいリマインダー
  - 2週間: 警告メッセージ
  - 1ヶ月: 最終通知
  ↓
LINEで督促メッセージを送信
  ↓
督促記録をスプレッドシートに追加
```

---

## 4. 動画分析結果の自動処理

### 4.1 動画アップロード時の自動分析
**トリガー**: Webhook（既存の`/api/analyze-video`から）

**ワークフロー**:
```
動画アップロード検知
  ↓
Google Video Intelligence APIで分析
  ↓
分析結果（フォーム、テクニックなど）を抽出
  ↓
スプレッドシートに分析結果を記録
  ↓
会員に分析レポートをLINEで送信
  ↓
改善ポイントを自動生成して提案
```

**既存APIとの連携**:
- `/api/analyze-video`の結果をn8nのWebhookで受信
- n8nで追加の処理（レポート生成、通知など）を実行

### 4.2 動画分析レポートの自動生成
**トリガー**: 動画分析完了後

**ワークフロー**:
```
分析結果を受信
  ↓
テクニック評価をスコア化
  ↓
前回の分析結果と比較
  ↓
改善点・褒めるポイントを抽出
  ↓
レポートPDFを生成
  ↓
会員にLINEで送信
```

---

## 5. LINE連携の強化

### 5.1 LINE Botによる問い合わせ自動応答
**トリガー**: LINE Webhook

**ワークフロー**:
```
LINEメッセージ受信
  ↓
メッセージ内容を分析（自然言語処理）
  ↓
よくある質問パターンにマッチング
  - 営業時間
  - 料金
  - 体験レッスン
  - 予約状況
  ↓
適切な回答を自動返信
  ↓
回答できない場合は、スプレッドシートに記録して後で対応
```

**n8nノード構成**:
- LINE Webhook
- OpenAI / Google Gemini（自然言語処理）
- IF（条件分岐）
- LINE Reply API
- Google Sheets（未回答記録）

### 5.2 LINE通知の一斉送信
**トリガー**: Schedule Trigger / Webhook

**ワークフロー**:
```
イベント通知が必要な時
  ↓
対象会員リストをスプレッドシートから取得
  ↓
各会員にLINEで一斉送信
  - 新クラス開講のお知らせ
  - イベント案内
  - お知らせ
  ↓
送信結果を記録
```

---

## 6. データ分析・レポートの自動化

### 6.1 月次レポートの自動生成
**トリガー**: Schedule Trigger（毎月最終日）

**ワークフロー**:
```
毎月最終日に実行
  ↓
スプレッドシートからデータを集計
  - 新規会員数
  - 退会者数
  - 予約数
  - 売上
  - 人気クラス
  ↓
グラフを生成
  ↓
レポートPDFを作成
  ↓
経営者にLINE/メールで送信
```

### 6.2 会員満足度調査の自動実施
**トリガー**: Schedule Trigger（四半期ごと）

**ワークフロー**:
```
四半期ごとに実行
  ↓
アクティブ会員リストを取得
  ↓
各会員にLINEでアンケート送信
  ↓
回答をWebhookで受信
  ↓
スプレッドシートに集計
  ↓
結果を分析して改善提案を生成
```

---

## 7. マーケティング自動化

### 7.1 SNS投稿の自動化
**トリガー**: Schedule Trigger / Webhook

**ワークフロー**:
```
投稿スケジュールに従って実行
  ↓
スプレッドシートから投稿内容を取得
  ↓
画像を自動生成（Canva APIなど）
  ↓
Twitter / Instagramに自動投稿
  ↓
投稿結果を記録
```

### 7.2 体験レッスン後のフォローアップ
**トリガー**: Webhook（体験レッスン予約完了後）

**ワークフロー**:
```
体験レッスン予約完了
  ↓
当日のリマインダーをスケジュール
  ↓
体験レッスン後、3日後に自動フォロー
  ↓
LINEでアンケート送信
  ↓
入会を促すメッセージを送信
```

---

## 8. n8nの実装方法

### 8.1 n8nのセットアップ
```bash
# Docker Composeでn8nを起動
docker-compose up -d n8n
```

### 8.2 既存APIとの連携
既存のNext.js APIエンドポイントをn8nのHTTP Requestノードから呼び出します：

**例: スプレッドシート連携**
```json
{
  "method": "POST",
  "url": "https://your-site.netlify.app/api/spreadsheet",
  "body": {
    "userId": "{{ $json.userId }}",
    "userName": "{{ $json.userName }}",
    "videoUrl": "{{ $json.videoUrl }}",
    "timestamp": "{{ $now }}"
  }
}
```

### 8.3 環境変数の設定
n8nの環境変数に以下を設定：
- `LINE_CHANNEL_ACCESS_TOKEN`: LINE Messaging APIのトークン
- `GOOGLE_SHEET_ID`: GoogleスプレッドシートID
- `FIREBASE_PROJECT_ID`: FirebaseプロジェクトID
- `OPENAI_API_KEY`: OpenAI APIキー（自然言語処理用）

---

## 9. 優先順位の高いワークフロー

### 最優先（すぐに実装すべき）
1. **予約リマインダー自動送信** - キャンセル率を下げる
2. **月額会費の自動請求** - 収益の安定化
3. **LINE Botによる問い合わせ自動応答** - 業務時間外の対応

### 次優先（1-2ヶ月以内）
4. **新規会員登録フロー** - オンボーディングの効率化
5. **動画分析レポートの自動送信** - 付加価値の向上
6. **未払い督促の自動化** - 回収率の向上

### 中長期（3-6ヶ月以内）
7. **月次レポートの自動生成** - 経営判断の支援
8. **SNS投稿の自動化** - マーケティング効率化
9. **会員満足度調査** - サービス改善

---

## 10. 実装例：予約リマインダーのn8nワークフロー

### ワークフローJSON（n8nでインポート可能）
```json
{
  "name": "レッスン予約リマインダー",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "cronExpression",
              "expression": "0 9 * * *"
            }
          ]
        }
      },
      "name": "毎日9時に実行",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1.1
    },
    {
      "parameters": {
        "operation": "read",
        "documentId": "={{ $env.GOOGLE_SHEET_ID }}",
        "sheetName": "予約管理",
        "range": "A2:E100"
      },
      "name": "予約データ取得",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4
    },
    {
      "parameters": {
        "conditions": {
          "date": [
            {
              "value1": "={{ $json.日付 }}",
              "operation": "equals",
              "value2": "={{ $now.toFormat('yyyy-MM-dd') }}"
            }
          ]
        }
      },
      "name": "翌日の予約をフィルタ",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://api.line.me/v2/bot/message/push",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Content-Type",
              "value": "application/json"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": []
        },
        "specifyBody": "json",
        "jsonBody": "={\n  \"to\": \"{{ $json.LINE_USER_ID }}\",\n  \"messages\": [\n    {\n      \"type\": \"text\",\n      \"text\": \"明日のレッスンのリマインダーです。\\n時間: {{ $json.時間 }}\\nクラス: {{ $json.クラス名 }}\\n\\n参加されますか？\"\n    },\n    {\n      \"type\": \"template\",\n      \"altText\": \"予約確認\",\n      \"template\": {\n        \"type\": \"confirm\",\n        \"text\": \"参加しますか？\",\n        \"actions\": [\n          {\n            \"type\": \"message\",\n            \"label\": \"参加します\",\n            \"text\": \"参加します\"\n          },\n          {\n            \"type\": \"message\",\n            \"label\": \"キャンセル\",\n            \"text\": \"キャンセルします\"\n          }\n        ]\n      }\n    }\n  ]\n}",
        "options": {}
      },
      "name": "LINE通知送信",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1
    }
  ],
  "connections": {
    "毎日9時に実行": {
      "main": [[{"node": "予約データ取得", "type": "main", "index": 0}]]
    },
    "予約データ取得": {
      "main": [[{"node": "翌日の予約をフィルタ", "type": "main", "index": 0}]]
    },
    "翌日の予約をフィルタ": {
      "main": [[{"node": "LINE通知送信", "type": "main", "index": 0}]]
    }
  }
}
```

---

## 11. コスト削減のポイント

1. **無料プランの活用**: n8nのセルフホスティング版は無料
2. **Webhookの効率的な使用**: 不要なAPI呼び出しを減らす
3. **バッチ処理**: 個別処理ではなく、まとめて処理する
4. **キャッシュの活用**: 同じデータを何度も取得しない

---

## 12. セキュリティ考慮事項

1. **APIキーの管理**: n8nの環境変数で管理、Gitにコミットしない
2. **Webhookの認証**: シークレットトークンで検証
3. **個人情報の取り扱い**: 暗号化、アクセス制限
4. **ログの管理**: 機密情報をログに出力しない

---

## まとめ

n8nを活用することで、以下の業務を大幅に自動化できます：

✅ **会員管理**: 登録、更新、通知の自動化
✅ **予約管理**: 予約、キャンセル、リマインダーの自動化
✅ **請求処理**: 自動請求、督促の自動化
✅ **顧客対応**: LINE Botによる自動応答
✅ **データ分析**: レポートの自動生成
✅ **マーケティング**: SNS投稿、フォローアップの自動化

これにより、個人事業主として限られた時間をより効率的に使い、会員サービスの質を向上させながら、経営に集中できるようになります。

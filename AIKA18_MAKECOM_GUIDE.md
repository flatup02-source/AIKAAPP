# Make.com シナリオ設定ガイド - AIKA18 LINEボット

## 概要

Make.comを使用してAIKA18のLINEボットを構築する場合のシナリオ設定手順です。

## シナリオ1: テキストメッセージ処理

### モジュール構成

```
1. LINE Webhook (Trigger)
2. Router (メッセージタイプ判定)
3. HTTP Request (AIKA18 API呼び出し)
4. LINE Reply Message
```

### 詳細設定

#### モジュール1: LINE Webhook

1. 「LINE」→「Watch Events」を選択
2. 「Event Type」: `Message`
3. Webhook URLをコピーしてLINE Developersコンソールに設定

#### モジュール2: Router

1. 「Flow control」→「Router」を追加
2. ルート1: `{{1.message.type}}` equals `text`
3. ルート2: `{{1.message.type}}` equals `video`

#### モジュール3: HTTP Request (ルート1 - テキスト)

1. 「HTTP」→「Make a request」を選択
2. **URL**: `https://your-backend-url.com/api/aika18/chat`
3. **Method**: `POST`
4. **Body Type**: `Raw`
5. **Content Type**: `application/json`
6. **Request Content**:
```json
{
  "message": "{{1.message.text}}",
  "userId": "{{1.source.userId}}"
}
```

#### モジュール4: LINE Reply Message (ルート1)

1. 「LINE」→「Reply to Message」を選択
2. **Reply Token**: `{{1.replyToken}}`
3. **Message Type**: `Text`
4. **Message Text**: `{{3.message}}`

## シナリオ2: 動画メッセージ処理

### モジュール構成

```
1. LINE Webhook (Trigger)
2. Router (メッセージタイプ判定)
3. LINE Get Content (動画取得)
4. Google Cloud Storage Upload
5. HTTP Request (動画解析API)
6. HTTP Request (AIKA18動画解析API)
7. LINE Reply Message
```

### 詳細設定

#### モジュール3: LINE Get Content (ルート2 - 動画)

1. 「LINE」→「Get Content」を選択
2. **Message ID**: `{{1.message.id}}`
3. **Output**: `Binary`

#### モジュール4: Google Cloud Storage Upload

1. 「Google Cloud Storage」→「Upload a File」を選択
2. **Bucket Name**: あなたのGCSバケット名
3. **File Name**: `{{1.message.id}}.mp4`
4. **File Data**: `{{3.data}}`
5. **Make Public**: `No`

#### モジュール5: HTTP Request (動画解析API)

1. 「HTTP」→「Make a request」を選択
2. **URL**: `https://your-backend-url.com/api/analyze-video`
3. **Method**: `POST`
4. **Body Type**: `Raw`
5. **Content Type**: `application/json`
6. **Request Content**:
```json
{
  "gcsUri": "gs://your-bucket/{{4.name}}"
}
```

#### モジュール6: HTTP Request (AIKA18動画解析API)

1. 「HTTP」→「Make a request」を選択
2. **URL**: `https://your-backend-url.com/api/aika18/video-analysis`
3. **Method**: `POST`
4. **Body Type**: `Raw`
5. **Content Type**: `application/json`
6. **Request Content**:
```json
{
  "videoAnalysisResult": {{5}},
  "userId": "{{1.source.userId}}"
}
```

#### モジュール7: LINE Reply Message (ルート2)

1. 「LINE」→「Reply to Message」を選択
2. **Reply Token**: `{{1.replyToken}}`
3. **Message Type**: `Text`
4. **Message Text**: `{{6.message}}`

## 認証情報の設定

### LINE Messaging API

1. 「Connections」→「Add a new connection」
2. 「LINE」を選択
3. Channel Access Tokenを入力

### Google Cloud Storage

1. 「Connections」→「Add a new connection」
2. 「Google Cloud Storage」を選択
3. サービスアカウントキー（JSON）をアップロード

## エラーハンドリング

### エラーハンドラーの追加

各HTTP Requestモジュールの後に「Error handler」を追加：

1. 「Flow control」→「Error handler」を追加
2. 「LINE」→「Reply to Message」を追加
3. **Reply Token**: `{{1.replyToken}}`
4. **Message Text**: `すみません、ちょっと調子が悪いみたい。もう一度言ってくれる？`

## テスト手順

1. シナリオを有効化
2. LINEアプリでボットにテキストメッセージを送信
3. AIKA18からの返答を確認
4. LINEアプリでボットに動画を送信
5. 動画解析と戦闘力数値化の結果を確認

## 最適化のヒント

### パフォーマンス

- 動画処理は時間がかかるため、非同期処理を検討
- 動画アップロード中に「解析中です...」というメッセージを送信

### 会話履歴の管理

- Difyの`conversation_id`をFirebaseやデータベースに保存
- 次回のメッセージで`conversation_id`を送信して会話の継続性を保つ

### レート制限対策

- Make.comの実行回数制限に注意
- 必要に応じて有料プランへのアップグレードを検討

## トラブルシューティング

### Webhookが動作しない

1. LINE DevelopersコンソールでWebhook URLが正しく設定されているか確認
2. Make.comのシナリオが有効になっているか確認
3. Webhookの実行履歴を確認

### 動画解析が失敗する

1. Google Cloud Storageへのアップロードが成功しているか確認
2. 動画解析APIのエラーログを確認
3. GCSのバケット権限を確認

### Dify APIエラー

1. API Keyが正しく設定されているか確認
2. DifyのAPI使用制限に達していないか確認
3. API URLが正しいか確認

## 参考資料

- [Make.com公式ドキュメント](https://www.make.com/en/help)
- [LINE Messaging API公式ドキュメント](https://developers.line.biz/ja/docs/messaging-api/)
- [Dify API公式ドキュメント](https://docs.dify.ai/api-reference)

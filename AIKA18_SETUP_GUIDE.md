# AIKA18 LINEボット セットアップガイド

## 概要

このガイドでは、n8n/Make.comとDifyを連携してAIKA18のLINEボットを構築する手順を説明します。

## 前提条件

- LINE Developersアカウント
- Difyアカウント（無料プランでも可）
- n8nまたはMake.comアカウント
- Google Cloud Platformアカウント（動画解析用）

## ステップ1: Difyの設定

### 1.1 Difyアプリの作成

1. [Dify](https://dify.ai/)にログイン
2. 「アプリを作成」をクリック
3. 「チャットボット」または「エージェント」を選択
4. アプリ名を「AIKA18」と設定

### 1.2 プロンプト設定

`AIKA18_DIFY_PROMPT.md`の内容を参考に、DifyのSystem Promptを設定：

1. 「プロンプト」セクションを開く
2. System Promptに`AIKA18_DIFY_PROMPT.md`の内容を貼り付け
3. ジムのURLを実際のものに置き換え

### 1.3 モデル選択

- GPT-4 Turbo または GPT-4o を推奨
- 複雑な人格表現に適しているため

### 1.4 API Keyの取得

1. 「設定」→「API」を開く
2. API Keyをコピー（後で使用）
3. API URLを確認（例: `https://api.dify.ai/v1`）

## ステップ2: LINE Messaging APIの設定

### 2.1 LINE Developersでチャネル作成

1. [LINE Developers](https://developers.line.biz/)にログイン
2. 「新規プロバイダー作成」または既存プロバイダーを選択
3. 「Messaging API」チャネルを作成
4. チャネルアクセストークンとチャネルシークレットを取得

### 2.2 Webhook URLの設定

n8n/Make.comのWebhook URLをLINE Developersコンソールに設定：
- n8nの場合: `https://your-n8n-instance.com/webhook/aika18-line-webhook`
- Make.comの場合: `https://hook.integromat.com/your-scenario-id`

### 2.3 応答メッセージの設定

LINE Developersコンソールで：
1. 「応答メッセージ」をOFFにする（Webhookで処理するため）
2. 「Webhookの利用」をONにする

## ステップ3: バックエンドサーバーの設定

### 3.1 環境変数の設定

バックエンドサーバーに以下の環境変数を設定：

```bash
# Dify API
DIFY_API_KEY=your_dify_api_key
DIFY_API_URL=https://api.dify.ai/v1

# LINE Messaging API
LINE_CHANNEL_ACCESS_TOKEN=your_channel_access_token
LINE_CHANNEL_SECRET=your_channel_secret

# バックエンドURL
BACKEND_URL=https://your-backend-url.com
```

### 3.2 APIエンドポイントの確認

以下のエンドポイントが利用可能か確認：
- `POST /api/aika18/chat` - テキストメッセージ処理
- `POST /api/aika18/video-analysis` - 動画解析結果処理

## ステップ4: n8nワークフローの設定

### 4.1 ワークフローのインポート

1. n8nにログイン
2. 「Workflows」→「Import from File」
3. 以下のファイルをインポート：
   - `n8n-workflows/aika18-text-message.json`
   - `n8n-workflows/aika18-video-message.json`

### 4.2 認証情報の設定

各ワークフローで以下の認証情報を設定：

#### LINE Messaging API
1. 「Credentials」→「New Credential」
2. 「LINE」を選択
3. Channel Access Tokenを入力

#### Google Cloud Storage（動画処理用）
1. 「Credentials」→「New Credential」
2. 「Google Cloud Storage」を選択
3. サービスアカウントキーをアップロード

### 4.3 環境変数の設定

n8nの環境変数に以下を設定：

```bash
BACKEND_URL=https://your-backend-url.com
```

### 4.4 Webhook URLの取得

1. ワークフローを有効化
2. WebhookノードのURLをコピー
3. LINE DevelopersコンソールのWebhook URLに設定

## ステップ5: Make.comシナリオの設定（n8nの代わりに使用する場合）

### 5.1 シナリオの作成

1. Make.comにログイン
2. 「Create a new scenario」をクリック
3. 以下のモジュールを追加：

#### テキストメッセージ処理フロー
```
LINE Webhook
  ↓
Router (メッセージタイプ判定)
  ↓
[テキストの場合] → HTTP Request (AIKA18 API)
  ↓
LINE Reply Message
```

#### 動画メッセージ処理フロー
```
LINE Webhook
  ↓
Router (メッセージタイプ判定)
  ↓
[動画の場合] → LINE Get Content
  ↓
Google Cloud Storage Upload
  ↓
HTTP Request (動画解析API)
  ↓
HTTP Request (AIKA18動画解析API)
  ↓
LINE Reply Message
```

### 5.2 認証情報の設定

各モジュールで必要な認証情報を設定：
- LINE: Channel Access Token
- Google Cloud Storage: サービスアカウントキー
- HTTP Request: 認証不要（バックエンドで処理）

## ステップ6: テスト

### 6.1 テキストメッセージのテスト

1. LINEアプリでボットにメッセージを送信
2. AIKA18からの返答を確認
3. 口調や決め台詞が正しく表示されるか確認

### 6.2 動画メッセージのテスト

1. LINEアプリでボットに動画を送信
2. 動画解析が実行されるか確認
3. 戦闘力が数値化されて返信されるか確認

### 6.3 エラーハンドリングの確認

- 動画解析が失敗した場合のエラーメッセージ
- API呼び出しが失敗した場合のフォールバック

## ステップ7: リッチメニューの設定（オプション）

LINE Developersコンソールでリッチメニューを設定：

1. 「Messaging API」→「リッチメニュー」
2. 新しいリッチメニューを作成
3. 以下のボタンを追加：
   - 「体験レッスンを予約する」
   - 「ジムの場所を見る」
   - 「AIKAに質問する」

## トラブルシューティング

### Webhookが動作しない

1. LINE DevelopersコンソールでWebhook URLが正しく設定されているか確認
2. n8n/Make.comのWebhookが有効になっているか確認
3. バックエンドサーバーのログを確認

### Dify APIエラー

1. API Keyが正しく設定されているか確認
2. DifyのAPI使用制限に達していないか確認
3. API URLが正しいか確認

### 動画解析が失敗する

1. Google Cloud Storageへのアップロードが成功しているか確認
2. 動画解析APIのエラーログを確認
3. Google Cloud Video Intelligence APIが有効になっているか確認

## 次のステップ

1. AIKA18のプロンプトを調整して、より自然な会話に
2. 会話履歴の管理（Difyのconversation_idを使用）
3. リッチメニューの追加
4. エラーハンドリングの改善
5. パフォーマンスの最適化

## 参考資料

- [Dify公式ドキュメント](https://docs.dify.ai/)
- [LINE Messaging API公式ドキュメント](https://developers.line.biz/ja/docs/messaging-api/)
- [n8n公式ドキュメント](https://docs.n8n.io/)
- [Make.com公式ドキュメント](https://www.make.com/en/help)

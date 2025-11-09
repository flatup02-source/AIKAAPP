# AIKA18 LINEボット 実装完了ガイド

## 📋 実装内容

n8n/Make.comとDifyを連携して、「ツンデレ辛口AIKA18」のLINEボットを実装しました。

## 📁 ファイル構成

```
/workspace/
├── AIKA18_IMPLEMENTATION_PLAN.md    # 実装計画書
├── AIKA18_DIFY_PROMPT.md            # Difyプロンプト設定
├── AIKA18_SETUP_GUIDE.md            # セットアップガイド
├── AIKA18_MAKECOM_GUIDE.md          # Make.com設定ガイド
├── backend/
│   └── server.js                    # AIKA18用APIエンドポイント追加済み
├── frontend/
│   └── src/app/api/line/webhook/
│       └── route.ts                 # LINE Webhookエンドポイント
└── n8n-workflows/
    ├── aika18-text-message.json     # テキストメッセージ処理ワークフロー
    └── aika18-video-message.json    # 動画メッセージ処理ワークフロー
```

## 🚀 クイックスタート

### 1. Difyの設定

1. [Dify](https://dify.ai/)にログイン
2. 新しいアプリを作成（チャットボット）
3. `AIKA18_DIFY_PROMPT.md`の内容をSystem Promptに設定
4. API Keyを取得

### 2. LINE Messaging APIの設定

1. [LINE Developers](https://developers.line.biz/)でチャネル作成
2. Channel Access TokenとChannel Secretを取得
3. Webhook URLを設定（後でn8n/Make.comから取得）

### 3. バックエンドの環境変数設定

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

### 4. n8nワークフローの設定

1. `n8n-workflows/`内のJSONファイルをインポート
2. LINE認証情報を設定
3. Webhook URLをLINE Developersコンソールに設定

または

### 4. Make.comシナリオの設定

1. `AIKA18_MAKECOM_GUIDE.md`を参照
2. シナリオを構築
3. Webhook URLをLINE Developersコンソールに設定

## 🎯 機能

### ✅ 実装済み機能

1. **テキストメッセージ処理**
   - LINEからのテキストメッセージを受信
   - DifyでAIKA18の返答を生成
   - LINEに返信

2. **動画メッセージ処理**
   - LINEからの動画を受信
   - Google Cloud Storageにアップロード
   - 動画解析を実行
   - DifyでAIKA18の返答（戦闘力含む）を生成
   - LINEに返信

3. **AIKA18のキャラクター**
   - ツンデレで辛口な口調
   - 動画解析結果に基づく戦闘力数値化
   - レジェンドファイターとの比較
   - 決め台詞「喋り足りなかったら、ジムでいつでも待ってるわ。」

## 📚 ドキュメント

- **[AIKA18_IMPLEMENTATION_PLAN.md](./AIKA18_IMPLEMENTATION_PLAN.md)**: 実装計画の詳細
- **[AIKA18_DIFY_PROMPT.md](./AIKA18_DIFY_PROMPT.md)**: Difyプロンプト設定
- **[AIKA18_SETUP_GUIDE.md](./AIKA18_SETUP_GUIDE.md)**: セットアップ手順
- **[AIKA18_MAKECOM_GUIDE.md](./AIKA18_MAKECOM_GUIDE.md)**: Make.com設定ガイド

## 🔧 APIエンドポイント

### POST `/api/aika18/chat`

テキストメッセージをDifyに送信してAIKA18の返答を取得

**リクエスト**:
```json
{
  "message": "こんにちは",
  "userId": "user123",
  "conversationId": "conv456" // オプション
}
```

**レスポンス**:
```json
{
  "success": true,
  "message": "AIKA18の返答",
  "conversationId": "conv456"
}
```

### POST `/api/aika18/video-analysis`

動画解析結果をDifyに送信してAIKA18の返答を取得

**リクエスト**:
```json
{
  "videoAnalysisResult": {
    "power_level": 77,
    "comment": "解析結果..."
  },
  "userId": "user123",
  "conversationId": "conv456" // オプション
}
```

**レスポンス**:
```json
{
  "success": true,
  "message": "AIKA18の返答（戦闘力含む）",
  "conversationId": "conv456"
}
```

### POST `/api/line/webhook`

LINE Webhookエンドポイント（Next.js）

## 🎨 AIKA18のキャラクター設定

### 基本情報
- **名前**: AIKA（アイカ）
- **年齢**: 18歳
- **職業**: 格闘技インストラクター
- **性格**: ツンデレ、辛口、厳しいが愛情深い

### 口調の特徴
- 「〜わよ」「〜なさい」「〜じゃない」などの口調
- デレの例：「ふん、まあ悪くはないわね」
- 決め台詞：「喋り足りなかったら、ジムでいつでも待ってるわ。」

## 🔐 セキュリティ

- LINE Webhookの検証（必要に応じて実装）
- API Keyによる認証
- 環境変数による機密情報の管理

## 🐛 トラブルシューティング

### Webhookが動作しない
1. LINE DevelopersコンソールでWebhook URLを確認
2. n8n/Make.comのワークフローが有効か確認
3. バックエンドサーバーのログを確認

### Dify APIエラー
1. API Keyが正しく設定されているか確認
2. DifyのAPI使用制限を確認
3. API URLが正しいか確認

### 動画解析が失敗する
1. Google Cloud Storageへのアップロードを確認
2. 動画解析APIのエラーログを確認
3. GCSのバケット権限を確認

## 📈 次のステップ

1. **会話履歴の管理**
   - Firebaseにconversation_idを保存
   - 会話の継続性を保つ

2. **リッチメニューの追加**
   - LINE公式アカウントにリッチメニューを設定
   - 「体験レッスンを予約する」などのボタンを追加

3. **エラーハンドリングの改善**
   - より詳細なエラーメッセージ
   - リトライ機能の実装

4. **パフォーマンスの最適化**
   - 動画処理の非同期化
   - キャッシュの活用

5. **分析機能の追加**
   - 会話ログの記録
   - ユーザー行動の分析

## 📝 ライセンス

このプロジェクトは個人事業主の格闘技GYM経営のための自動化システムです。

## 🙏 参考資料

- [Dify公式ドキュメント](https://docs.dify.ai/)
- [LINE Messaging API公式ドキュメント](https://developers.line.biz/ja/docs/messaging-api/)
- [n8n公式ドキュメント](https://docs.n8n.io/)
- [Make.com公式ドキュメント](https://www.make.com/en/help)

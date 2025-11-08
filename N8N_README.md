# n8nを使った格闘技GYM経営の自動化 - クイックスタート

## 📋 概要

このプロジェクトは、個人事業主の格闘技GYM経営者がn8nを使って業務を自動化するためのアイデアと実装例をまとめたものです。

## 🚀 クイックスタート（5分で始める）

### ステップ1: n8nを起動

```bash
# Dockerを使用（推奨）
docker run -it --rm --name n8n -p 5678:5678 n8nio/n8n

# または npmを使用
npm install n8n -g
n8n start
```

### ステップ2: n8nにアクセス

ブラウザで `http://localhost:5678` を開く

### ステップ3: 最初のワークフローをインポート

1. n8nのダッシュボードで「Workflows」をクリック
2. 「Import from File」を選択
3. `n8n-workflows/member-registration.json` をインポート

### ステップ4: 認証情報を設定

ワークフロー内の各ノードで必要な認証情報を設定:
- Google Sheets（会員情報の記録）
- LINE Bot（通知送信）
- Firebase（データ保存）

### ステップ5: テスト実行

ワークフローを有効化して、Webhookをテスト

## 📁 ファイル構成

```
.
├── n8n-workflow-ideas.md          # 自動化アイデアの詳細ドキュメント
├── n8n-setup-guide.md             # セットアップガイド
├── n8n-workflows/                 # ワークフローJSONファイル
│   ├── member-registration.json   # 会員登録自動処理
│   ├── monthly-billing.json       # 月次会費自動請求
│   └── lesson-booking.json        # レッスン予約自動処理
└── n8n-integration/               # API統合例
    ├── member-registration-api.ts # 会員登録API
    └── lesson-booking-api.ts      # 予約API
```

## 🎯 推奨される実装順序

1. **会員登録の自動処理**（最も効果的）
   - 手作業を大幅に削減
   - 顧客満足度の向上

2. **レッスン予約の自動処理**
   - 予約管理の効率化
   - リマインド機能でキャンセル率削減

3. **月次会費の自動請求**
   - 収益に直結
   - 未納管理の自動化

4. **長期未来店者のリエンゲージメント**
   - 会員維持率の向上

## 💡 主な自動化アイデア

### 会員管理
- ✅ 新規会員登録時の自動処理
- ✅ 会員ステータス管理
- ✅ 退会処理の自動化

### 予約管理
- ✅ レッスン予約の自動処理
- ✅ 予約リマインド
- ✅ キャンセル処理

### 請求管理
- ✅ 月次会費の自動請求
- ✅ 未納管理の自動化

### 顧客フォローアップ
- ✅ レッスン後の自動フォロー
- ✅ 長期未来店者のリエンゲージメント

### SNS運用
- ✅ レッスン写真の自動投稿
- ✅ 定期的なコンテンツ投稿

詳細は `n8n-workflow-ideas.md` を参照してください。

## 🔧 必要な準備

### 1. サービスアカウントの準備
- Google Workspace（Google Sheets, Calendar）
- LINE Messaging API
- Firebase（オプション）
- Stripe（請求機能を使用する場合）

### 2. 環境変数の設定
```bash
GOOGLE_SHEET_ID=your-sheet-id
GOOGLE_CALENDAR_ID=your-calendar-id
LINE_CHANNEL_ACCESS_TOKEN=your-token
LINE_CHANNEL_SECRET=your-secret
```

## 📚 ドキュメント

- **詳細なアイデア**: `n8n-workflow-ideas.md`
- **セットアップガイド**: `n8n-setup-guide.md`
- **ワークフロー例**: `n8n-workflows/` ディレクトリ
- **API統合例**: `n8n-integration/` ディレクトリ

## 🆘 トラブルシューティング

### 認証エラーが発生する
→ 各サービスの認証情報が正しく設定されているか確認

### Webhookが動作しない
→ Webhook URLが正しいか、ネットワーク設定を確認

### ワークフローが実行されない
→ ワークフローが有効化されているか確認

詳細なトラブルシューティングは `n8n-setup-guide.md` を参照してください。

## 🎓 学習リソース

- [n8n公式ドキュメント](https://docs.n8n.io/)
- [n8nコミュニティワークフロー](https://n8n.io/workflows/)
- [LINE Messaging API](https://developers.line.biz/ja/docs/messaging-api/)

## 📝 ライセンス

このプロジェクトは個人事業主の格闘技GYM経営者向けの参考資料です。
自由にカスタマイズしてご利用ください。

## 🤝 貢献

改善提案や追加のワークフローアイデアは大歓迎です！

---

**次のステップ**: `n8n-setup-guide.md` を読んで、詳細なセットアップ手順を確認してください。

# 使用量監視と自動停止機能 - 実装完了

## ✅ 実装内容

上限に近づいたら自動的にストップする機能を実装しました。

## 📁 作成したファイル

1. **`backend/usage-monitor.js`** - 使用量監視のコア機能
   - 使用量の記録
   - 警告・停止の判定
   - Firestoreへの保存

2. **`backend/server.js`** - APIエンドポイント追加
   - `/api/usage` - 使用量取得API
   - `/api/usage/:service` - 特定サービスの使用量取得
   - `/api/usage/reset` - 月初めのリセットAPI
   - AIKA18 APIに使用量チェックを統合

3. **`n8n-workflows/usage-monitoring.json`** - 使用量監視ワークフロー
   - 1時間ごとに使用量をチェック
   - 警告・停止状態をLINEで通知

4. **`USAGE_MONITORING_SETUP.md`** - セットアップガイド

## 🎯 機能

### 1. 自動使用量記録
- API呼び出し時に自動的に使用量を記録
- Firestoreに月次で保存

### 2. 警告機能（80%到達時）
- 使用量が80%に達したら警告通知
- LINEで管理者に通知（1日1回）

### 3. 自動停止機能（96%到達時）
- 使用量が96%に達したら自動停止
- 該当サービスへのリクエストを拒否（503エラー）
- LINEで管理者に通知

### 4. 使用量確認API
- リアルタイムで使用量を確認可能
- すべてのサービスの使用量を一括取得

## 📊 監視対象サービス

| サービス | 上限 | 警告閾値 | 停止閾値 |
|---------|------|---------|---------|
| LINE Messaging API | 500通/月 | 400通 (80%) | 480通 (96%) |
| Dify API | 200回/月 | 160回 (80%) | 190回 (95%) |
| GCP Video Intelligence | 1,000分/月 | 800分 (80%) | 950分 (95%) |
| GCP Storage | 5GB | 4GB (80%) | 4.8GB (96%) |
| Firebase Auth | 50,000認証/月 | 40,000認証 (80%) | 48,000認証 (96%) |

## 🚀 使い方

### 1. Firestoreの設定

Firestoreに以下のコレクションを作成：
- `usage_stats` - 使用量統計
- `usage_alerts` - アラート履歴

### 2. 環境変数の設定

```bash
# 使用量アラート用Webhook（オプション）
USAGE_ALERT_WEBHOOK_URL=https://your-n8n-instance.com/webhook/usage-alert

# 管理者API Key（使用量リセット用）
ADMIN_API_KEY=your-secure-api-key

# 管理者LINEユーザーID（n8nワークフロー用）
ADMIN_LINE_USER_ID=your_line_user_id
```

### 3. n8nワークフローの設定

1. `n8n-workflows/usage-monitoring.json`をインポート
2. 環境変数を設定
3. LINE認証情報を設定
4. ワークフローを有効化

### 4. 使用量の確認

```bash
# すべてのサービスの使用量を確認
curl https://your-backend-url.com/api/usage

# 特定のサービスの使用量を確認
curl https://your-backend-url.com/api/usage/dify_api_calls
```

## 🔄 動作フロー

### 通常のAPI呼び出し時

```
1. API呼び出し
   ↓
2. 使用量チェック（停止状態か確認）
   ↓
3. 停止状態なら503エラーを返す
   ↓
4. 通常処理を実行
   ↓
5. 使用量を記録
   ↓
6. 警告・停止状態をチェック
   ↓
7. 必要に応じて通知を送信
```

### 使用量監視ワークフロー

```
1. 1時間ごとにトリガー
   ↓
2. すべてのサービスの使用量を取得
   ↓
3. 警告・停止状態のサービスをフィルタ
   ↓
4. LINEで管理者に通知
```

## 📝 APIレスポンス例

### 使用量取得API

```json
{
  "success": true,
  "currentUsage": 180,
  "limit": 200,
  "status": "warning",
  "percentage": "90.0"
}
```

### API呼び出し時のレスポンス（使用量情報付き）

```json
{
  "success": true,
  "message": "AIKA18の返答",
  "conversationId": "conv123",
  "usage": {
    "current": 181,
    "limit": 200,
    "status": "warning",
    "percentage": "90.5"
  }
}
```

### 停止状態時のエラー

```json
{
  "error": "Service temporarily unavailable",
  "message": "Dify APIの使用量上限に達しました。来月までお待ちください。",
  "service": "dify_api_calls"
}
```

## ⚠️ 注意事項

1. **月初めのリセット**: 手動でリセットするか、n8nワークフローで自動化
2. **停止状態の解除**: Firestoreで`status`を`ok`に手動変更
3. **使用量の正確性**: 動画の長さを正確に記録する必要がある

## 🔧 カスタマイズ

### 閾値の変更

`backend/usage-monitor.js`の`USAGE_LIMITS`を編集：

```javascript
const USAGE_LIMITS = {
  dify_api_calls: {
    limit: 200,
    warning_threshold: 160, // 変更可能
    stop_threshold: 190,    // 変更可能
    unit: 'calls'
  },
  // ...
};
```

## 📚 参考資料

- [USAGE_MONITORING_SETUP.md](./USAGE_MONITORING_SETUP.md) - 詳細なセットアップ手順
- [USAGE_MONITORING_PLAN.md](./USAGE_MONITORING_PLAN.md) - 実装計画

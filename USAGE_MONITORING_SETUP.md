# 使用量監視と自動停止機能 セットアップガイド

## 概要

各サービスの無料プランの上限に近づいたら自動的にストップする機能のセットアップ手順です。

## 機能

### 1. 自動使用量記録
- API呼び出し時に自動的に使用量を記録
- Firestoreに月次で保存

### 2. 警告機能
- 使用量が80%に達したら警告通知
- LINEまたはメールで管理者に通知

### 3. 自動停止機能
- 使用量が96%に達したら自動停止
- 該当サービスへのリクエストを拒否

### 4. 使用量確認API
- リアルタイムで使用量を確認可能
- すべてのサービスの使用量を一括取得

## セットアップ手順

### 1. Firebase Firestoreの設定

Firestoreに以下のコレクションを作成：

#### `usage_stats` コレクション
- ドキュメントID: `{service}_{YYYY-MM}`
- フィールド:
  - `service`: string (サービス名)
  - `month`: string (YYYY-MM形式)
  - `current_usage`: number (現在の使用量)
  - `status`: string ('ok', 'warning', 'stopped')
  - `last_updated`: timestamp
  - `last_warning_date`: string (YYYY-MM-DD形式、警告送信日)
  - `stopped_at`: timestamp (停止時刻)

#### `usage_alerts` コレクション
- フィールド:
  - `service`: string
  - `type`: string ('warning' or 'stopped')
  - `currentUsage`: number
  - `limit`: number
  - `percentage`: string
  - `timestamp`: timestamp
  - `notified`: boolean

### 2. 環境変数の設定

バックエンドサーバーに以下の環境変数を追加：

```bash
# 使用量アラート用Webhook（オプション）
USAGE_ALERT_WEBHOOK_URL=https://your-n8n-instance.com/webhook/usage-alert

# 管理者LINEユーザーID（n8nワークフロー用）
ADMIN_LINE_USER_ID=your_line_user_id
```

### 3. Firestoreのセキュリティルール

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // usage_stats: 読み取りのみ許可（サーバー側で書き込み）
    match /usage_stats/{document=**} {
      allow read: if true;
      allow write: if false; // サーバー側からのみ書き込み
    }
    
    // usage_alerts: 読み取りのみ許可
    match /usage_alerts/{document=**} {
      allow read: if true;
      allow write: if false; // サーバー側からのみ書き込み
    }
  }
}
```

### 4. n8nワークフローの設定

`n8n-workflows/usage-monitoring.json`をインポート：

1. n8nにログイン
2. 「Workflows」→「Import from File」
3. `usage-monitoring.json`を選択
4. 環境変数を設定：
   - `BACKEND_URL`: バックエンドサーバーのURL
   - `ADMIN_LINE_USER_ID`: 管理者のLINEユーザーID
5. LINE認証情報を設定
6. ワークフローを有効化

### 5. 月初めのリセット処理（オプション）

月初めに使用量をリセットするワークフローを作成：

```json
{
  "name": "月初め使用量リセット",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "cronExpression",
              "expression": "0 0 1 * *"
            }
          ]
        }
      },
      "name": "毎月1日トリガー",
      "type": "n8n-nodes-base.scheduleTrigger"
    },
    {
      "parameters": {
        "url": "={{ $env.BACKEND_URL }}/api/usage/reset",
        "method": "POST"
      },
      "name": "使用量リセットAPI呼び出し",
      "type": "n8n-nodes-base.httpRequest"
    }
  ]
}
```

## APIエンドポイント

### GET `/api/usage`
すべてのサービスの使用量を取得

**レスポンス例**:
```json
{
  "line_messages": {
    "success": true,
    "currentUsage": 450,
    "limit": 500,
    "status": "warning",
    "percentage": "90.0"
  },
  "dify_api_calls": {
    "success": true,
    "currentUsage": 180,
    "limit": 200,
    "status": "warning",
    "percentage": "90.0"
  }
}
```

### GET `/api/usage/:service`
特定のサービスの使用量を取得

**例**: `GET /api/usage/dify_api_calls`

**レスポンス例**:
```json
{
  "success": true,
  "currentUsage": 180,
  "limit": 200,
  "status": "warning",
  "percentage": "90.0"
}
```

### POST `/api/usage/reset`
月初めに使用量をリセット（管理者用）

## 使用量の監視方法

### 1. API経由で確認

```bash
# すべてのサービスの使用量を確認
curl https://your-backend-url.com/api/usage

# 特定のサービスの使用量を確認
curl https://your-backend-url.com/api/usage/dify_api_calls
```

### 2. Firestoreで直接確認

Firebase Consoleで`usage_stats`コレクションを確認

### 3. n8nワークフローで自動監視

`usage-monitoring.json`ワークフローが1時間ごとにチェックし、警告・停止状態をLINEで通知

## 動作確認

### 1. 使用量記録のテスト

```bash
# Dify API呼び出しをシミュレート
curl -X POST https://your-backend-url.com/api/aika18/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "テスト", "userId": "test123"}'
```

### 2. 使用量確認のテスト

```bash
curl https://your-backend-url.com/api/usage/dify_api_calls
```

### 3. 停止状態のテスト

手動でFirestoreの`current_usage`を上限値に設定し、API呼び出しが拒否されることを確認

## トラブルシューティング

### 使用量が記録されない

1. Firebase Admin SDKが正しく初期化されているか確認
2. Firestoreのセキュリティルールを確認
3. バックエンドサーバーのログを確認

### 警告・停止通知が来ない

1. n8nワークフローが有効になっているか確認
2. `ADMIN_LINE_USER_ID`が正しく設定されているか確認
3. LINE認証情報が正しく設定されているか確認

### 自動停止が動作しない

1. Firestoreの`status`フィールドが`stopped`になっているか確認
2. `isServiceStopped`関数が正しく動作しているか確認
3. APIエンドポイントで使用量チェックが実行されているか確認

## カスタマイズ

### 閾値の変更

`backend/usage-monitor.js`の`USAGE_LIMITS`を編集：

```javascript
const USAGE_LIMITS = {
  dify_api_calls: {
    limit: 200,
    warning_threshold: 160, // 80% → 変更可能
    stop_threshold: 190,    // 95% → 変更可能
    unit: 'calls'
  },
  // ...
};
```

### 通知方法の追加

`sendAlert`関数を編集して、メール通知などを追加可能

## 注意事項

- 使用量は月次でリセットされます
- 停止状態は手動でリセットする必要があります（Firestoreで`status`を`ok`に変更）
- 月初めの自動リセット処理を設定することを推奨します

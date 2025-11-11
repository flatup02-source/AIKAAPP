# Netlify環境変数セットアップガイド

## ❗ 重要：Netlifyダッシュボードで以下の設定が必要です

現在、Netlifyの環境変数は **`VITE_`** プレフィックスになっていますが、Next.jsでは **`NEXT_PUBLIC_`** プレフィックスを使用します。

## 必要な環境変数一覧

### 1. Firebase設定（ブラウザ公開OK）
Netlifyダッシュボード → Site settings → Environment variables → **Add a variable**

以下の変数を追加/変更：

| 現在の変数名 | 変更後の変数名 | 値の例 |
|------------|--------------|--------|
| `VITE_FIREBASE_API_KEY` | `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyBx4KankOaRUO_GA9WOZwJP0AWthBIrY74` |
| `VITE_FIREBASE_APP_ID` | `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:639286700347:web:2216c51a5ebb126b516f1e` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `aikaapp-584fa.firebaseapp.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `639286700347` |
| `VITE_FIREBASE_PROJECT_ID` | `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `aikaapp-584fa` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `aikaapp-584fa.firebasestorage.app` |

### 2. LINE設定
| 変数名 | 値の例 | 説明 |
|-------|-------|-----|
| `NEXT_PUBLIC_LIFF_ID` | `2008276179-XxwM2QQD` | LINE LIFFアプリID |
| `LINE_CHANNEL_ID` | `2008276179` | LINEチャネルID **（新規追加）** |

### 3. Google設定
| 変数名 | 値の例 | 説明 |
|-------|-------|-----|
| `NEXT_PUBLIC_GOOGLE_SHEET_ID` | `1UOw5RYqZAR1_Cu5kqIm6Kg3vArwfBKFEs68pnO9nWS8` | スプレッドシートID |
| `GOOGLE_PROJECT_ID` | `aikaapp-584fa` | Google Cloud プロジェクトID **（新規追加）** |
| `GOOGLE_APPLICATION_CREDENTIALS_JSON` | （下記参照） | サービスアカウントキーJSON **（新規追加）** |

### 4. GOOGLE_APPLICATION_CREDENTIALS_JSONの設定方法

この変数には、Google CloudのサービスアカウントキーのJSONを設定します。

**方法1：プレーンJSON**
```json
{
  "type": "service_account",
  "project_id": "aikaapp-584fa",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "...@aikaapp-584fa.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  ...
}
```

**方法2：Base64エンコード**
JSONをBase64エンコードした文字列を設定できます。

## 手順

1. Netlifyダッシュボード → **Site settings** → **Environment variables** を開く
2. 既存の `VITE_` プレフィックスの変数を **編集** して `NEXT_PUBLIC_` に変更
3. 不足している変数を **追加**：
   - `LINE_CHANNEL_ID`
   - `GOOGLE_PROJECT_ID`
   - `GOOGLE_APPLICATION_CREDENTIALS_JSON`
4. **Save changes** をクリック
5. 新しいデプロイをトリガー（または既存のデプロイを再デプロイ）

## デプロイ後の確認

デプロイが完了したら、ブラウザのコンソールを開いて：
1. エラーメッセージがないか確認
2. Firebase初期化が成功しているか確認
3. ページが正常に表示されるか確認


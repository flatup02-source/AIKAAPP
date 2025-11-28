# AIKAAPP プロジェクト現状報告書・要件指示書

**作成日**: 2025年11月1日  
**プロジェクト名**: AIKA18号 バトルスカウター / FLATUPGYM ウェブサイト  
**バージョン**: 1.0.0

---

## 📊 プロジェクト完成度評価

### LIFFアプリ完成度: **6.5点 / 10点**

#### 評価項目別スコア

| 項目 | スコア | 詳細 |
|------|--------|------|
| **フロントエンドUI** | 7/10 | 基本的なページレイアウトは完成。ただし、現在テストページが表示されている |
| **バックエンドAPI** | 6/10 | APIエンドポイントは実装済み。認証エラーハンドリングが不十分 |
| **認証・セキュリティ** | 7/10 | LINE LIFF認証実装済み。Firebase認証も実装済み。環境変数設定が未完了 |
| **データベース連携** | 5/10 | Google Spreadsheet連携実装済み。Firebase連携実装済み。環境変数設定が必要 |
| **ビルド・デプロイ** | 8/10 | Netlify設定完了。ビルドは成功。環境変数のみ設定待ち |
| **エラーハンドリング** | 6/10 | エラーバウンダリー実装済み。詳細なエラーログ追加済み |
| **テスト・品質保証** | 4/10 | 型チェックは通過。ユニットテスト・E2Eテストは未実装 |
| **ドキュメント** | 8/10 | 環境変数設定ガイド作成済み。コードコメントは充実 |

#### 総合評価: **6.5点 / 10点**

**達成状況**:
- ✅ 基本的な機能実装は完了
- ✅ ビルド・デプロイ設定は完了
- ⚠️ 環境変数の設定が未完了（Netlifyで設定が必要）
- ⚠️ 一部のページがテストページのまま（デバッグ中）
- ⚠️ 動画解析機能はダミーデータを返す実装（本番用実装はコメントアウト済み）

---

## 📁 プロジェクト構造

```
AIKAAPP/
├── frontend/                    # Next.jsフロントエンドアプリケーション
│   ├── src/
│   │   ├── app/                # Next.js App Router
│   │   │   ├── page.tsx        # トップページ（テストページ表示中）
│   │   │   ├── layout.tsx      # ルートレイアウト
│   │   │   ├── aika19/         # AIKA19ページ（適性診断）
│   │   │   └── api/            # API Routes
│   │   │       ├── analyze/           # 動画解析API（未使用）
│   │   │       ├── analyze-video/     # 動画解析API（ダミーデータ返却）
│   │   │       ├── auth/line/         # LINE認証API
│   │   │       ├── imagekit-sign/     # ImageKit署名URL生成
│   │   │       ├── spreadsheet/       # Google Spreadsheet書き込み
│   │   │       └── upload/            # ファイルアップロード
│   │   ├── components/         # Reactコンポーネント
│   │   ├── lib/                # ユーティリティライブラリ
│   │   │   ├── firebase.ts     # Firebase初期化
│   │   │   ├── gcloud.ts       # Google Cloud認証
│   │   │   └── auth/line.ts    # LINE認証ヘルパー
│   │   └── env.mjs             # 環境変数バリデーション
│   └── netlify/functions/      # Netlify Functions
├── backend/                     # バックエンドサーバー（Node.js）
├── backend-worker/              # バックエンドワーカー
├── netlify.toml                 # Netlify設定ファイル
└── NETLIFY_ENV_VARS_SETUP.md   # 環境変数セットアップガイド
```

---

## 🔧 技術スタック

### フロントエンド
- **フレームワーク**: Next.js 14.2.4 (App Router)
- **言語**: TypeScript 5
- **スタイリング**: Tailwind CSS 3.4.18
- **UI**: React 18

### バックエンド
- **ランタイム**: Node.js 20
- **プラットフォーム**: Netlify Functions / Cloud Run
- **認証**: Firebase Admin SDK, LINE LIFF

### クラウドサービス
- **ホスティング**: Netlify
- **データベース**: Google Spreadsheet, Firebase (Firestore)
- **ストレージ**: Firebase Storage, Google Cloud Storage
- **認証**: Firebase Authentication, LINE OAuth
- **AI/ML**: Google Cloud Video Intelligence API (実装済み、未有効化)

---

## ✅ 実装済み機能

### 1. ウェブサイト（フロントエンド）

#### ✅ 完了している機能
- [x] トップページ（ランディングページ）
  - ヒーローセクション
  - お悩みセクション
  - 選ばれる理由セクション
  - クラス選択セクション
  - 料金プランセクション
  - お客様の声セクション
  - 無料体験セクション
  - アクセスセクション
  - フッター

- [x] AIKA19ページ（`/aika19`）
  - 格闘技適性診断（簡易版）
  - 動画解析機能の説明

- [x] 静的ページ
  - プライバシーポリシー（`/privacy`）
  - 利用規約（`/terms`）
  - 特定商取引法（`/law`）
  - 成功ページ（`/success`）

#### ⚠️ 注意事項
- 現在、トップページ（`/`）がテストページを表示している状態
- 原因: 白画面問題のデバッグ中に最小限のテストページに置き換えられた

### 2. APIエンドポイント

#### ✅ 実装済み

| エンドポイント | メソッド | 機能 | 状態 |
|--------------|---------|------|------|
| `/api/auth/line` | POST | LINE IDトークンからFirebase Custom Token生成 | ✅ 実装済み |
| `/api/analyze-video` | POST | 動画解析（現在はダミーデータを返却） | ⚠️ ダミー実装 |
| `/api/spreadsheet` | POST | Google Spreadsheetへのデータ書き込み | ✅ 実装済み |
| `/api/imagekit-sign` | POST | ImageKit署名URL生成 | ✅ 実装済み |
| `/api/analyze` | POST | 動画解析（未使用） | ⚠️ 未使用 |

#### ⚠️ 実装状況の詳細

**`/api/analyze-video`**:
- 現在はダミーデータを返却する実装
- 実際のGoogle Cloud Video Intelligence APIの呼び出しコードはコメントアウト済み
- 本番用の実装に切り替えるには、コードのコメントアウトを解除する必要あり

### 3. 認証システム

#### ✅ LINE認証
- LINE LIFF統合実装済み
- LINE IDトークンからFirebase Custom Tokenへの変換実装済み
- 動的インポートでエラーハンドリング強化

#### ✅ Firebase認証
- Firebase Admin SDK初期化実装済み
- サービスアカウントキーによる認証対応
- Base64エンコード/プレーンJSON両対応

### 4. データストレージ

#### ✅ Google Spreadsheet
- ユーザー情報と動画URLの記録機能実装済み
- 環境変数設定により動作可能

#### ✅ Firebase Storage
- 動画ファイルのアップロード機能実装済み
- クライアントサイドから直接アップロード可能

---

## ❌ 未実装・未完成の機能

### 1. 環境変数の設定（重要度: 🔴 最高）

**現状**: Netlifyダッシュボードで環境変数が未設定または誤設定

**必要な対応**:
- `VITE_`プレフィックス → `NEXT_PUBLIC_`プレフィックスへの変更
- 以下の環境変数の追加/設定:
  - `LINE_CHANNEL_ID`
  - `GOOGLE_PROJECT_ID`
  - `GOOGLE_APPLICATION_CREDENTIALS_JSON`

**詳細**: `NETLIFY_ENV_VARS_SETUP.md`を参照

### 2. 動画解析機能の本番実装（重要度: 🟡 中）

**現状**: ダミーデータを返却する実装

**必要な対応**:
- `frontend/src/app/api/analyze-video/route.ts`の実装を本番用に切り替え
- Google Cloud Video Intelligence APIの実際の呼び出しを有効化

### 3. テストページの削除（重要度: 🟡 中）

**現状**: トップページがテストページを表示

**必要な対応**:
- `frontend/src/app/page.tsx`を本来のランディングページに戻す
- または、テストページを削除して本番ページを復元

### 4. DeFi統合（重要度: 🔴 最高 - 今後実装予定）

**現状**: 未実装

**必要な対応**:
- Web3ウォレット連携の実装
- スマートコントラクトとの連携
- DeFiプロトコルとの統合

---

## 🚀 デプロイ状況

### ホスティング
- **プラットフォーム**: Netlify
- **サイトURL**: `aika18.netlify.app` (または `serene-zabaione-8c4e2a.netlify.app`)
- **ビルド**: 成功
- **デプロイ**: 自動デプロイ設定済み（GitHub連携）

### ビルド設定
- **ビルドコマンド**: `npm --prefix frontend install && npm --prefix frontend run build`
- **公開ディレクトリ**: `frontend/.next`
- **プラグイン**: `@netlify/plugin-nextjs`

---

## 📋 次の管理者への要件指示書

### 🎯 優先度1: 緊急対応（必須）

#### 1.1 環境変数の設定

**期限**: 即座に実施  
**責任者**: Netlify管理者

**手順**:
1. Netlifyダッシュボードにログイン
2. サイト設定 → Environment variables を開く
3. 以下の変更を実施:
   - `VITE_*` を `NEXT_PUBLIC_*` に変更
   - 不足している環境変数を追加
4. 新しいデプロイをトリガー

**詳細な手順**: `NETLIFY_ENV_VARS_SETUP.md`を参照してください。

**必要な環境変数一覧**:

**ブラウザ公開変数** (`NEXT_PUBLIC_`プレフィックス):
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_GOOGLE_SHEET_ID`
- `NEXT_PUBLIC_LIFF_ID`

**サーバー専用変数** (プレフィックスなし):
- `LINE_CHANNEL_ID`
- `GOOGLE_PROJECT_ID`
- `GOOGLE_APPLICATION_CREDENTIALS_JSON` (サービスアカウントキーのJSON)

#### 1.2 テストページの削除・本番ページへの切り替え

**期限**: 環境変数設定後  
**責任者**: フロントエンド開発者

**手順**:
1. `frontend/src/app/page.tsx`を確認
2. テストページのコードを削除
3. 本来のランディングページのコードを復元
4. ビルドテストを実行: `cd frontend && npm run build`
5. コミット・プッシュしてデプロイ

**注意**: 現在のテストページは白画面問題のデバッグのために作成されたものです。

### 🎯 優先度2: 重要機能の有効化

#### 2.1 動画解析機能の本番実装

**期限**: 1週間以内  
**責任者**: バックエンド開発者

**手順**:
1. `frontend/src/app/api/analyze-video/route.ts`を開く
2. ダミーデータを返却する部分を削除
3. Google Cloud Video Intelligence APIの実際の呼び出しコードを有効化
4. テスト実行と動作確認

**参考コード**: ファイル内にコメントアウトされた実装コードが存在します。

#### 2.2 エラーハンドリングの強化

**期限**: 2週間以内  
**責任者**: フロントエンド開発者

**対応内容**:
- API呼び出しのエラーハンドリングを強化
- ユーザーフレンドリーなエラーメッセージの表示
- エラーログの収集と分析

### 🎯 優先度3: 新機能の実装

#### 3.1 DeFi統合

**期限**: 要相談  
**責任者**: フルスタック開発者 + ブロックチェーン開発者

**必要な実装**:
- Web3ウォレット連携（MetaMask、WalletConnect等）
- スマートコントラクトとの連携
- DeFiプロトコルとの統合（Uniswap、Compound等）

**技術要件**:
- ブロックチェーン: Ethereum / Polygon / BSC
- ライブラリ: ethers.js または web3.js
- RPCプロバイダー: Infura / Alchemy

**詳細な要件定義が必要です。要件が明確になり次第、実装計画を立ててください。**

---

## 🔍 トラブルシューティング

### 問題1: 白画面が表示される

**原因**: 
- 環境変数が未設定または誤設定
- JavaScriptエラーによるレンダリング停止
- Service Workerのキャッシュ

**解決方法**:
1. ブラウザの開発者ツール（F12）でエラーを確認
2. 環境変数の設定を確認
3. Service Workerをクリア: Applicationタブ → Service Workers → Unregister
4. 強制リロード: Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows)

### 問題2: 認証が失敗する

**原因**:
- `GOOGLE_APPLICATION_CREDENTIALS_JSON`が未設定
- サービスアカウントキーの形式が不正
- Firebase Admin SDKの初期化エラー

**解決方法**:
1. Netlifyの環境変数で`GOOGLE_APPLICATION_CREDENTIALS_JSON`を確認
2. JSON形式が正しいか確認（Base64エンコードまたはプレーンJSON）
3. サーバーログを確認（Netlify Functionsのログ）

### 問題3: ビルドエラー

**原因**:
- 型エラー
- 依存関係の不足
- 環境変数の未設定（ビルド時）

**解決方法**:
1. ローカルでビルドテスト: `cd frontend && npm run build`
2. 型チェック: `cd frontend && npm run type-check`
3. エラーメッセージを確認して修正

---

## 📝 開発環境セットアップ

### 必要な環境
- Node.js 20以上
- npm または yarn
- Git

### ローカル開発の手順

```bash
# リポジトリのクローン
git clone <repository-url>
cd AIKAAPP

# 依存関係のインストール
cd frontend
npm install

# 環境変数の設定
# .env.localファイルを作成し、必要な環境変数を設定

# 開発サーバーの起動
npm run dev

# ブラウザで http://localhost:3000 を開く
```

### 環境変数ファイル（`.env.local`）

```env
# Firebase設定
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# LINE設定
NEXT_PUBLIC_LIFF_ID=your_liff_id
LINE_CHANNEL_ID=your_channel_id

# Google設定
NEXT_PUBLIC_GOOGLE_SHEET_ID=your_sheet_id
GOOGLE_PROJECT_ID=your_project_id
GOOGLE_APPLICATION_CREDENTIALS_JSON=your_service_account_json
```

---

## 📚 重要なファイルとその役割

### 設定ファイル

| ファイル | 役割 |
|---------|------|
| `netlify.toml` | Netlifyデプロイ設定、ビルドコマンド、プラグイン設定 |
| `frontend/next.config.mjs` | Next.js設定、Webpack最適化、画像最適化 |
| `frontend/src/env.mjs` | 環境変数のバリデーション定義 |
| `frontend/tailwind.config.ts` | Tailwind CSS設定 |

### 主要なコンポーネント

| ファイル | 役割 |
|---------|------|
| `frontend/src/app/layout.tsx` | ルートレイアウト、エラーバウンダリー |
| `frontend/src/app/page.tsx` | トップページ（現在テストページ表示中） |
| `frontend/src/app/aika19/page.tsx` | AIKA19ページ（適性診断） |
| `frontend/src/components/ErrorBoundary.tsx` | エラーバウンダリーコンポーネント |

### 主要なAPI

| ファイル | 役割 |
|---------|------|
| `frontend/src/app/api/auth/line/route.ts` | LINE認証、Firebase Custom Token生成 |
| `frontend/src/app/api/analyze-video/route.ts` | 動画解析（現在ダミーデータ） |
| `frontend/src/app/api/spreadsheet/route.ts` | Google Spreadsheet書き込み |

---

## 🎓 技術的詳細

### 認証フロー

1. **ユーザーがLINEアプリ内でページにアクセス**
2. **LIFF初期化** → LINE IDトークン取得
3. **`/api/auth/line`にIDトークンを送信**
4. **サーバー側でFirebase Custom Tokenを生成**
5. **クライアント側でFirebase認証を完了**
6. **認証状態を保持**

### データフロー

1. **ユーザーが動画をアップロード**
2. **Firebase Storageに保存**
3. **`/api/spreadsheet`でSpreadsheetに記録**
4. **`/api/analyze-video`で動画解析（現在はダミーデータ）**
5. **結果をユーザーに返却**

---

## 🐛 既知の問題

### 1. 白画面問題
- **状態**: デバッグ中
- **影響**: ユーザーがページを開いても白い画面が表示される
- **対処**: テストページが表示される状態。環境変数設定後に本番ページに切り替え

### 2. 動画解析機能がダミーデータを返却
- **状態**: 実装済みだが未有効化
- **影響**: 実際のAI解析が動作しない
- **対処**: 本番用の実装コードを有効化

### 3. 環境変数の不整合
- **状態**: Netlifyで`VITE_`プレフィックスが使用されている
- **影響**: Next.jsが環境変数を読み込めない
- **対処**: `NEXT_PUBLIC_`プレフィックスに変更が必要

---

## 📞 サポート・連絡先

### ドキュメント
- 環境変数設定: `NETLIFY_ENV_VARS_SETUP.md`
- このドキュメント: `PROJECT_STATUS_AND_REQUIREMENTS.md`

### Gitリポジトリ
- 最新のコミットを確認: `git log --oneline -10`
- ブランチ: `main`

---

## 🎯 次のステップ（推奨順序）

1. **環境変数の設定**（最優先）
   - Netlifyダッシュボードで環境変数を正しく設定
   - デプロイを確認

2. **テストページの削除**
   - 本番ページに切り替え
   - 動作確認

3. **動画解析機能の有効化**
   - ダミーデータから本番実装へ切り替え
   - テスト実行

4. **DeFi統合の要件定義**
   - 必要な機能の明確化
   - 技術スタックの選定
   - 実装計画の策定

5. **テストの追加**
   - ユニットテスト
   - 統合テスト
   - E2Eテスト

---

## ✅ チェックリスト（次の管理者用）

### 初回セットアップ
- [ ] 環境変数の設定（Netlifyダッシュボード）
- [ ] ローカル開発環境のセットアップ
- [ ] `.env.local`ファイルの作成
- [ ] 依存関係のインストール確認
- [ ] ビルドテストの実行

### デプロイ確認
- [ ] Netlifyでのビルド成功を確認
- [ ] デプロイ後のサイト表示確認
- [ ] 環境変数の読み込み確認
- [ ] APIエンドポイントの動作確認

### 機能確認
- [ ] トップページの表示確認
- [ ] AIKA19ページの表示確認
- [ ] LINE認証の動作確認
- [ ] 動画アップロード機能の確認
- [ ] Spreadsheet書き込みの確認

### 改善項目
- [ ] テストページの削除
- [ ] 動画解析機能の本番実装
- [ ] エラーハンドリングの強化
- [ ] パフォーマンス最適化

---

**最終更新**: 2025年11月1日  
**ドキュメントバージョン**: 1.0.0


# Sora 2 ウォーターマーク削除アプリ

Sora 2で生成された動画からウォーターマークを削除するアプリケーションです。

## 機能

- **動画アップロード**: Sora 2で生成された動画ファイルをアップロード
- **自動ウォーターマーク検出**: 動画の右下領域を自動的に検出して処理
- **手動領域指定**: ウォーターマークの位置を手動で指定可能
- **リアルタイムプレビュー**: 処理前後の動画をプレビュー可能
- **ダウンロード**: 処理済み動画をダウンロード

## 技術スタック

- **フロントエンド**: Next.js 14, React, TypeScript, Tailwind CSS
- **バックエンド**: Next.js API Routes
- **動画処理**: FFmpeg (delogoフィルター)

## セットアップ

### 前提条件

- Node.js 18以上
- FFmpeg（動画処理に必要）

### FFmpegのインストール

#### macOS
```bash
brew install ffmpeg
```

#### Ubuntu/Debian
```bash
sudo apt-get update
sudo apt-get install ffmpeg
```

#### Windows
1. [FFmpeg公式サイト](https://ffmpeg.org/download.html)からダウンロード
2. 環境変数PATHに追加

### インストール

```bash
cd frontend
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

アプリケーションは `http://localhost:3000` で起動します。

## 使用方法

1. **動画ファイルを選択**: 「動画ファイルを選択」ボタンをクリックして、Sora 2で生成された動画を選択します。

2. **ウォーターマーク領域の設定（オプション）**:
   - 自動検出を使用する場合は、そのまま処理を実行します
   - 手動で領域を指定する場合は、X座標、Y座標、幅、高さを入力します

3. **処理を実行**: 「ウォーターマークを削除」ボタンをクリックして処理を開始します。

4. **結果を確認**: 処理が完了すると、処理済み動画が表示されます。プレビューで確認してからダウンロードできます。

## APIエンドポイント

### POST /api/remove-watermark

動画からウォーターマークを削除します。

**リクエスト:**
- `Content-Type: multipart/form-data`
- `video`: 動画ファイル（最大500MB）
- `watermarkRegion`: JSON形式のウォーターマーク領域 `{x, y, width, height}` (オプション)

**レスポンス:**
- 処理済み動画ファイル（MP4形式）

### GET /api/remove-watermark

APIの状態を確認します。

**レスポンス:**
```json
{
  "success": true,
  "message": "ウォーターマーク削除APIは利用可能です",
  "supportedFormats": ["mp4", "mov", "avi"],
  "maxFileSize": "500MB",
  "ffmpegAvailable": true
}
```

## 注意事項

- **ファイルサイズ制限**: 最大500MBまで対応
- **対応形式**: MP4, MOV, AVI
- **処理時間**: 動画の長さとサイズによって異なります（通常数秒から数分）
- **ウォーターマーク位置**: デフォルトでは動画の右下10%の領域を処理します

## トラブルシューティング

### FFmpegが見つからないエラー

FFmpegがインストールされていない場合、処理は実行されず元の動画がそのまま返されます。FFmpegをインストールしてから再度お試しください。

### 処理がタイムアウトする

大きな動画ファイルを処理する場合、タイムアウトが発生する可能性があります。その場合は、動画を短くするか、より小さなファイルサイズに圧縮してください。

## 開発

### プロジェクト構造

```
frontend/
├── src/
│   ├── app/
│   │   └── api/
│   │       └── remove-watermark/
│   │           └── route.ts          # APIエンドポイント
│   ├── components/
│   │   └── WatermarkRemoval.tsx     # UIコンポーネント
│   └── lib/
│       └── searchPrompts.ts         # 検索プロンプト定義
```

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。

# filename: Dockerfile
# Next.js を Cloud Run にデプロイするためのコンテナ。Node 18 を使用。
# マルチステージでビルドと実行環境を分離して軽量にする。

# 1) ビルドステージ
FROM node:18-alpine AS builder

# 本番向け最適化
ENV NODE_ENV=production

# 作業ディレクトリ
WORKDIR /app

# 依存関係だけ先にインストール（キャッシュを効かせる）
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* .npmrc* ./
# あなたのプロジェクトが npm を使っている前提。もし yarn/pnpm なら後で書き換えます。
RUN npm ci --legacy-peer-deps

# 残りのソースをコピー
COPY . .

# Next.js をビルド
RUN npm run build

# 2) 実行（ランタイム）ステージ
FROM node:18-alpine AS runner

ENV NODE_ENV=production
WORKDIR /app

# ビルド成果物と必要ファイルのみコピー
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# 本番依存だけインストール（dev依存は除外）
RUN npm ci --omit=dev --legacy-peer-deps

# Cloud Run は $PORT を渡す。Next.js をそのポートで起動する。
ENV PORT=8080
EXPOSE 8080

# 起動コマンド（package.json に "start": "next start" がある前提）
CMD ["npm", "run", "start", "--", "-p", "8080"]


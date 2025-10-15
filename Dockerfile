# Dockerfile
# ベースイメージ：Node 20 の軽量版
FROM node:20-alpine AS base

# 作業ディレクトリ
WORKDIR /app

# 依存関係だけ先にコピーしてキャッシュを最大化
COPY package.json package-lock.json ./
RUN npm ci --only=production && npm cache clean --force

# アプリのソースをコピー（.dockerignore で秘密や不要物は除外しておく）
COPY . .

# Next.js を本番ビルド
ENV NODE_ENV=production
RUN npm run build

# 非rootユーザーで実行（最低限の権限に）
RUN addgroup -g 1001 nodegrp && adduser -u 1001 -G nodegrp -D nodeusr
USER nodeusr

# Cloud Run 互換のポート設定（必要に応じて変更）
ENV PORT=8080
EXPOSE 8080

# 健康チェック（任意：/ で200が返るなら）
# HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
#   CMD wget -qO- http://localhost:${PORT}/ || exit 1

# 起動コマンド
CMD ["npm", "run", "start"]

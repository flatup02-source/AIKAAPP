# 1. ビルド環境のベースイメージを指定
FROM node:20-slim AS base

# 2. ビルドに必要なツールをインストールし、キャッシュをクリーン
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# 3. 依存関係を効率的にインストール
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# 4. ソースコードをコピーしてビルド
COPY . .
RUN npm run build

# 5. 本番環境のベースイメージを指定
FROM node:20-slim AS release

# 6. 実行ユーザーを作成（セキュリティ向上）
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 7. 実行に必要なファイルのみをコピー
WORKDIR /app
COPY --from=base /app/public ./public
COPY --from=base /app/.next ./.next
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json


# 8. ユーザーを切り替え
USER nextjs

# 9. Cloud Run 用にポートを 8080 に設定
ENV PORT 8080
EXPOSE 8080

# 10. 起動コマンド
CMD ["npm", "start"]
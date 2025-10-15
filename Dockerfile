# 1. ビルド環境のベースイメージを指定
FROM node:20-slim AS base

# 2. ビルドに必要なツールをインストール
RUN apt-get update && apt-get install -y openssl

# 3. アプリケーションのソースコードをコピー
WORKDIR /app
COPY . .

# 4. 依存関係をインストール
# --omit=dev は本番で不要なパッケージを除外
RUN npm ci --omit=dev

# 5. Next.js アプリケーションをビルド
RUN npm run build

# 6. 本番環境のベースイメージを指定
FROM node:20-slim AS release

# 7. 実行ユーザーを作成（セキュリティ向上）
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 8. ビルド成果物をコピー
WORKDIR /app
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/package.json ./package.json

# 9. ユーザーを切り替え
USER nextjs

# 10. ポートを開放
EXPOSE 3000

# 11. 起動コマンド
CMD ["npm", "start"]

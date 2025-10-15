// Dockerfile
FROM node:20-alpine

# 作業フォルダ
WORKDIR /app

# まず依存関係を入れる（キャッシュを効かせるため先にpackage*.jsonだけ）
COPY package*.json ./
RUN npm ci && npm cache clean --force

# アプリ本体をコピー
COPY . .

# 本番用にビルド
RUN npm run build

# Cloud Run はポート8080を使う
ENV PORT=8080
EXPOSE 8080

# 起動コマンド（Next.jsを8080で起動）
CMD ["npm", "run", "start"]

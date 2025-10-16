FROM node:20-alpine

# 作業フォルダ
WORKDIR /app

# 依存関係のみ先にコピーしてインストール（ビルドキャッシュ活用）
COPY package*.json ./
RUN npm ci && npm cache clean --force

# アプリ本体をコピー
COPY . .

# 本番ビルド
RUN npm run build

# Cloud Run は 8080 を使う
ENV PORT=8080
EXPOSE 8080

# Next.js を 8080 で起動
CMD ["npm", "run", "start"]

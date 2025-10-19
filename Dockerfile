# ステージ1: ビルダー
FROM node:20-alpine AS builder

WORKDIR /app

# キャッシュを改善するために、package.json をコピーして最初に依存関係をインストールします
COPY package*.json ./
RUN npm install

# すべての環境変数に対してビルド引数を宣言します
# これらは cloudbuild.yaml の --build-arg で使用されている名前と一致している必要があります
ARG LINE_CHANNEL_ID
ARG IMAGEKIT_PRIVATE_KEY
ARG GOOGLE_CREDENTIALS_JSON
ARG NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY
ARG NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
ARG NEXT_PUBLIC_GOOGLE_SHEET_ID
ARG LINE_CHANNEL_SECRET
ARG VertexAIAPI

# それらをDockerイメージのコンテキスト内で環境変数として設定します。
# Next.jsビルド (および実行中のアプリ) は、これらをENV変数として探します。
ENV LINE_CHANNEL_ID=$LINE_CHANNEL_ID \
    IMAGEKIT_PRIVATE_KEY=$IMAGEKIT_PRIVATE_KEY \
    GOOGLE_CREDENTIALS_JSON=$GOOGLE_CREDENTIALS_JSON \
    NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=$NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY \
    NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=$NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT \
    NEXT_PUBLIC_GOOGLE_SHEET_ID=$NEXT_PUBLIC_GOOGLE_SHEET_ID \
    LINE_CHANNEL_SECRET=$LINE_CHANNEL_SECRET \
    VertexAIAPI=$VertexAIAPI

# アプリケーションの残りのコードをコピーします
COPY . .

# Next.jsのビルドコマンドを実行します
RUN npm run build

# ステージ2: 本番
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

# ビルド成果物と実行に必要なファイルをコピー
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts

# Cloud Runが提供するPORT環境変数でリッスンすることを示す
EXPOSE 8080

# アプリケーションを起動
CMD ["npm", "start"]

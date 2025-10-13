import { createEnv } from " @t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  // サーバー側でのみ使用する変数
  server: {
    LINE_CHANNEL_ID: z.string().min(1),
    IMAGEKIT_PRIVATE_KEY: z.string().min(1),
    GOOGLE_CREDENTIALS_JSON: z.string().min(1),
  },
  
  // ブラウザ側でも使用する変数
  client: {
    NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY: z.string().min(1),
    NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: z.string().min(1),
    NEXT_PUBLIC_GOOGLE_SHEET_ID: z.string().min(1),
  },

  // Next.jsが環境変数を読み込むための設定
  runtimeEnv: {
    LINE_CHANNEL_ID: process.env.LINE_CHANNEL_ID,
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
    GOOGLE_CREDENTIALS_JSON: process.env.GOOGLE_CREDENTIALS_JSON,
    NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
    NEXT_PUBLIC_GOOGLE_SHEET_ID: process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID,
  },
});
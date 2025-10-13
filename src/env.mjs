import { z } from "zod";

const server = z.object({
  LINE_CHANNEL_ID: z.string().min(1),
  IMAGEKIT_PRIVATE_KEY: z.string().min(1),
  GOOGLE_CREDENTIALS_JSON: z.string().min(1),
});

const client = z.object({
  NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY: z.string().min(1),
  NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: z.string().min(1),
  NEXT_PUBLIC_GOOGLE_SHEET_ID: z.string().min(1),
});

const processEnv = {
    LINE_CHANNEL_ID: process.env.LINE_CHANNEL_ID,
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
    GOOGLE_CREDENTIALS_JSON: process.env.GOOGLE_CREDENTIALS_JSON,
    NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
    NEXT_PUBLIC_GOOGLE_SHEET_ID: process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID,
};

const merged = server.merge(client);
const parsed = merged.safeParse(processEnv);

if (parsed.success === false) {
  console.error(
    "❌ Invalid environment variables:",
    parsed.error.flatten().fieldErrors,
  );
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;
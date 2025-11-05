/**
 * Google Cloud認証ユーティリティ
 * すべてのGoogle Cloud APIクライアントで使用する共通認証関数
 */

import { GoogleAuth, type AuthClient } from "google-auth-library";
import { env } from "@/env.mjs";

/**
 * 認証情報を検証し、パース済みのcredentialsオブジェクトを返す
 * @returns パース済みの認証情報オブジェクト
 * @throws 環境変数が設定されていない場合、または認証情報のパースに失敗した場合
 */
function parseCredentials(): Record<string, unknown> {
  const credentialsJsonString = env.GOOGLE_CREDENTIALS_JSON;

  if (!credentialsJsonString) {
    throw new Error(
      "GOOGLE_CREDENTIALS_JSON 環境変数が設定されていません。"
    );
  }

  // Base64デコード（Base64の場合）または直接パース
  let credentials: Record<string, unknown>;
  try {
    // Base64エンコードされている場合を想定
    try {
      const decoded = Buffer.from(credentialsJsonString, "base64").toString(
        "utf8"
      );
      credentials = JSON.parse(decoded);
    } catch {
      // Base64でない場合、直接JSONとしてパース
      credentials = JSON.parse(credentialsJsonString);
    }
  } catch (error) {
    throw new Error(
      `GOOGLE_CREDENTIALS_JSON のパースに失敗しました: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }

  // 必須フィールドの検証
  if (
    !credentials.client_email ||
    !credentials.project_id ||
    !credentials.private_key_id
  ) {
    throw new Error(
      "GOOGLE_CREDENTIALS_JSON に必要なフィールド（client_email, project_id, private_key_id）が含まれていません。"
    );
  }

  return credentials;
}

/**
 * 環境変数からGoogle Cloud認証クライアントを取得
 * @param scopes 必要なスコープの配列
 * @returns AuthClientインスタンス
 * @throws 環境変数が設定されていない場合、または認証情報のパースに失敗した場合
 */
export async function getAuthClientFromEnv(
  scopes: string[]
): Promise<AuthClient> {
  const credentials = parseCredentials();
  const projectId = env.GOOGLE_PROJECT_ID;

  if (!projectId) {
    throw new Error("GOOGLE_PROJECT_ID 環境変数が設定されていません。");
  }

  // GoogleAuthで認証クライアントを作成
  const auth = new GoogleAuth({
    credentials,
    scopes,
    projectId,
  });

  // getClient()の戻り（AuthClient）を返す（非推奨のcredentials直接指定を避ける）
  const client = await auth.getClient();

  if (!client) {
    throw new Error("認証クライアントの取得に失敗しました。");
  }

  return client;
}

/**
 * VertexAIなどの環境変数から認証情報を自動読み取りするクライアント用に
 * GOOGLE_APPLICATION_CREDENTIALS環境変数を設定する
 * 注意: この関数は環境変数を変更するため、プロセス全体に影響を与えます
 */
export function setupGoogleApplicationCredentials(): void {
  const credentials = parseCredentials();
  
  // 一時ファイルではなく、環境変数として直接設定
  // VertexAIは環境変数から認証情報を読み取るため
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    // JSON文字列として環境変数に設定
    process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON = JSON.stringify(credentials);
  }
}


import { GoogleAuth, AuthClient } from 'google-auth-library';

export async function getGoogleAuthFromEnv(scopes: string[] = ['https://www.googleapis.com/auth/cloud-platform']): Promise<GoogleAuth> {
  const raw = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  if (!raw) throw new Error('Missing environment variable GOOGLE_APPLICATION_CREDENTIALS_JSON');

  let json: Record<string, unknown>;
  try {
    // Try to decode as Base64 first
    const decoded = Buffer.from(raw, 'base64').toString('utf-8');
    json = JSON.parse(decoded);
  } catch (decodeError) {
    // If Base64 decode fails, try parsing as plain JSON
    try {
      json = JSON.parse(raw);
    } catch (parseError) {
      throw new Error('GOOGLE_APPLICATION_CREDENTIALS_JSON could not be parsed as Base64 or plain JSON.');
    }
  }
  return new GoogleAuth({ credentials: json as any, scopes });
}

export async function getAuthClientFromEnv(scopes: string[] = ['https://www.googleapis.com/auth/cloud-platform']): Promise<AuthClient> {
  const auth = await getGoogleAuthFromEnv(scopes);
  return auth.getClient();
}

export function requireProjectId(): string {
  const pid = process.env.GOOGLE_PROJECT_ID;
  if (!pid) throw new Error('Missing environment variable GOOGLE_PROJECT_ID');
  return pid;
}

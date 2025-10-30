import { GoogleAuth, AuthClient } from 'google-auth-library';

export async function getAuthClientFromEnv(scopes: string[] = ['https://www.googleapis.com/auth/cloud-platform']): Promise<AuthClient> {
  const raw = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  if (!raw) throw new Error('Missing environment variable GOOGLE_APPLICATION_CREDENTIALS_JSON');
  let json: Record<string, unknown>;
  try {
    json = JSON.parse(raw);
  } catch {
    throw new Error('GOOGLE_APPLICATION_CREDENTIALS_JSON is not valid JSON');
  }
  const auth = new GoogleAuth({ credentials: json as any, scopes });
  return auth.getClient();
}

export function requireProjectId(): string {
  const pid = process.env.GOOGLE_PROJECT_ID;
  if (!pid) throw new Error('Missing environment variable GOOGLE_PROJECT_ID');
  return pid;
}

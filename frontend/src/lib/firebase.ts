import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

/**
 * Initialize Firebase App once and reuse it.
 * Uses explicit typing to avoid "implicitly has type 'any'".
 * Throws informative errors if required env vars are missing.
 */

function assertEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. ` +
        `Set it in Netlify (Site settings → Build & deploy → Environment) and your local .env file.`
    );
  }
  return value;
}

const firebaseConfig = {
  apiKey: assertEnv("NEXT_PUBLIC_FIREBASE_API_KEY", process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
  authDomain: assertEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
  projectId: assertEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
  storageBucket: assertEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET", process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: assertEnv(
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  ),
  appId: assertEnv("NEXT_PUBLIC_FIREBASE_APP_ID", process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
};

let appInstance: FirebaseApp;
if (getApps().length === 0) {
  appInstance = initializeApp(firebaseConfig);
} else {
  appInstance = getApps()[0]!;
}

const authInstance: Auth = getAuth(appInstance);

export const app: FirebaseApp = appInstance;
export const auth: Auth = authInstance;

// frontend/src/lib/auth/line.ts
import { getAuth, signInWithCredential, OAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";

// Firebase設定は環境変数から読み込む
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Firebaseアプリの初期化
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const signInWithLine = async (idToken: string) => {
  try {
    // LINEのidTokenを使ってFirebaseのOAuthCredentialを作成
    // 'oidc.line' はFirebaseコンソールで設定したOIDCプロバイダのIDに合わせる必要があります
    const provider = new OAuthProvider('oidc.line');
    const credential = provider.credential({ idToken });

    // Firebaseにサインイン
    const result = await signInWithCredential(auth, credential);
    const user = result.user;

    console.log("Firebase Sign-in successful with LINE:", user);
    return user;
  } catch (error) {
    console.error("Error signing in with LINE to Firebase:", error);
    throw error;
  }
};
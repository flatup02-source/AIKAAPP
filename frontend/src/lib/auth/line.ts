// frontend/src/lib/auth/line.ts
import { getAuth, signInWithCredential, OAuthProvider } from "firebase/auth";
import { auth } from "../firebase";

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
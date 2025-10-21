import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDDy5_-jv0BQCCFIHyPgXvH7sBjE83mnp4",
  authDomain: "aikaapp-584fa.firebaseapp.com",
  projectId: "aikaapp-584fa",
  storageBucket: "aikaapp-584fa.appspot.com",
  messagingSenderId: "639286700347",
  appId: "1:639286700347:web:2216c51a5ebb126b516f1e",
  measurementId: "G-T9QETENBLZ"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
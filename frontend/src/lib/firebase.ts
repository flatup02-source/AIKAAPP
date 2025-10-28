import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDDy5_-jv0BQCCFIHyPgXvH7sBjE83mnp4",
  authDomain: "aikaapp-584fa.firebaseapp.com",
  projectId: "aikaapp-584fa",
  storageBucket: "aikaapp-584fa.firebasestorage.app",
  messagingSenderId: "639286700347",
  appId: "1:639286700347:web:2216c51a5ebb126b516f1e",
  measurementId: "G-T9QETENBLZ"
};

// Initialize Firebase
let app;
let db;
let auth;
let storage;

function initializeFirebaseClient() {
  if (typeof window !== 'undefined' && !getApps().length) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
  }
}

export { app, db, auth, storage, initializeFirebaseClient };
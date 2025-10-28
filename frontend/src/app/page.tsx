'use client';

import React, { useState, useEffect } from 'react';
import liff from "@line/liff";
import axios from "axios";
import { signInWithLine } from "@/lib/auth/line";
import { initializeFirebaseClient } from "@/lib/firebase";
// signInWithLine と uploadUserVideo は、あなたのプロジェクトの lib フォルダ内の実際のファイルパスに合わせて修正してください
// import { signInWithLine } from "../lib/auth"; 
// import { uploadUserVideo } from "../lib/upload";
// FileUploader コンポーネントが components フォルダにあると仮定します
import FileUploader from "../components/FileUploader"; 

// ダミー関数 (あなたの実際の関数に置き換えてください)
const uploadUserVideo = async (userId: string, file: File, onProgress: (p: number) => void): Promise<string> => {
  console.log("Uploading file for", userId);
  // ダミーのアップロード処理
  for (let i = 0; i <= 100; i++) {
    await new Promise(res => setTimeout(res, 20));
    onProgress(i);
  }
  return `https://storage.googleapis.com/your-bucket/uploads/${file.name}`;
};


type ViewState = "form" | "analyzing" | "result";
type AIPersonality = "default" | "fun" | "pro";

export default function AikaFormPage() {
  // --- State Variables ---
  const [viewState, setViewState] = useState<ViewState>("form");
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [theme, setTheme] = useState("");
  const [requests, setRequests] = useState("");
  const [aiComment, setAiComment] = useState("AIからのコメントがここに表示されます。");
  const [aiPersonality, setAiPersonality] = useState<AIPersonality>("default");
  
  // --- useEffect for LIFF Initialization ---
  useEffect(() => {
    initializeFirebaseClient();
    const initializeLiff = async () => {
      try {
        // NEXT_PUBLIC_LIFF_ID はあなたの .env.local ファイルで定義してください
        const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
        if (!liffId) {
          console.error("LIFF ID is not defined.");
          alert("LIFF IDが設定されていません。");
          return;
        }
        await liff.init({ liffId });
        if (!liff.isLoggedIn()) {
          liff.login();
        } else {
          const profile = await liff.getProfile();
          setUserId(profile.userId);
          setUserName(profile.displayName);

          // LINE IDトークンを取得し、Firebaseでサインイン
          const idToken = liff.getIDToken();
          if (idToken) {
            await signInWithLine(idToken);
          }
        }
      } catch (error) {
        console.error("LIFF Initialization failed", error);
        alert("LIFFの初期化に失敗しました。LINEアプリで開き直してください。");
      }
    };
    initializeLiff();
  }, []);

  // --- Handlers and Functions ---
  const handleUpload = async () => {
    if (!file || !userId) {
      alert("ファイルを選択し、LINEユーザー情報が読み込まれていることを確認してください。");
      return;
    };

    setViewState("analyzing");
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const videoUrl = await uploadUserVideo(userId, file, setUploadProgress);
      
      const payload = {
        userId,
        userName,
        videoUrl,
        theme,
        requests,
        timestamp: new Date().toISOString(),
      };

      // バックエンドAPIへの送信 (Next.jsのAPIルート)
      const response = await axios.post('/api/spreadsheet', payload);
      
      setAiComment(response.data.aiComment || "分析が完了しましたが、AIからのコメントはありませんでした。");
      
      setViewState("result");

    } catch (error) {
      console.error("Upload or API call failed", error);
      alert("アップロードまたはAPI呼び出し中にエラーが発生しました。");
      setViewState("form"); // エラー時はフォームに戻る
    } finally {
      setIsUploading(false);
    }
  };

  const renderResultContent = () => {
    // 将来的にAIの性格によって内容を変更できます
    return { title: "あなたの称号", commentIntro: "分析結果：" };
  };

  // --- Conditional Rendering ---
  if (viewState === "analyzing") {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-4">
        <h1 className="text-3xl font-bold mb-4">
          集中…今、君の未来を計算している…
        </h1>
        <p className="text-xl">{uploadProgress}%</p>
        {/* ここにプログレスバーなどを追加すると、よりリッチなUIになります */}
      </div>
    );
  }

  if (viewState === "result") {
    const { title, commentIntro } = renderResultContent();
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-lg w-full text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{commentIntro}</h1>
          <p className="text-5xl font-bold my-4 text-blue-600">{title}</p>
          <p className="text-left text-gray-600 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">{aiComment}</p>
          <button
            onClick={() => setViewState("form")}
            className="mt-8 w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 rounded-xl shadow-lg"
          >
            もう一度挑戦する
          </button>
        </div>
      </div>
    );
  }

  // --- Default View: Form ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex flex-col items-center justify-center p-4">
      <main className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">AIKAフォーム</h1>
        
        {/* FileUploader コンポーネントを使用 */}
        {/* FileUploaderは onFileSelect という props を持つと仮定 */}
        <FileUploader onFileSelect={setFile} onUploadAttempt={handleUpload} isUploading={isUploading} />

        <div className="mt-4">
          <label htmlFor="theme" className="block text-sm font-medium text-gray-700">テーマ</label>
          <input id="theme" value={theme} onChange={(e) => setTheme(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
        </div>

        <div className="mt-4">
          <label htmlFor="requests" className="block text-sm font-medium text-gray-700">特記事項</label>
          <textarea id="requests" value={requests} onChange={(e) => setRequests(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
        </div>
        
        <button
          onClick={handleUpload}
          disabled={isUploading || !file}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50"
        >
          {isUploading ? 'アップロード中...' : 'アップロードして分析'}
        </button>
      </main>
    </div>
  );
}

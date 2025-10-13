"use client";

import { useState, ChangeEvent, useEffect } from "react";
import axios from 'axios';
import liff from "@line/liff";
import Image from 'next/image';

import { env } from "@/env.mjs";

// ☆☆☆ 30-40代女性向けにUI/UXの文言を全面リファクタリング ☆☆☆

export default function AikaFormPage() {
  // --- State Management ---
  const [currentStep, setCurrentStep] = useState(1);
  const [userName, setUserName] = useState("");
  const [genre, setGenre] = useState("");
  const [theme, setTheme] = useState("");
  const [requests, setRequests] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  // --- Effects ---
  useEffect(() => {
    const initializeLiff = async () => {
      try {
        await liff.init({ liffId: "2008276179-41Dz3bbj" });
        if (!liff.isLoggedIn()) {
          liff.login();
        } else {
          const profile = await liff.getProfile();
          setUserName(profile.displayName);
        }
      } catch (e: unknown) {
        console.error("LIFF Init Error:", e);
        setUserName("ゲスト");
      }
    };
    initializeLiff();
  }, []);

  // --- Handlers ---
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 10 * 1024 * 1024) { // 10MB
        setErrorMessage("ファイルサイズが10MBを超えています。10MB以下のファイルを選択してください。");
        setFile(null);
      } else {
        setFile(selectedFile);
        setErrorMessage("");
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploadStatus("uploading");
    setUploadProgress(0);
    setErrorMessage("");

    try {
      // 1. ログイン状態の確認
      if (!liff.isLoggedIn()) {
        alert("LINEにログインしていません。ページを再読み込みしてログインしてください。");
        setUploadStatus("idle");
        return;
      }

      // 2. IDトークンの取得を試みる
      const idToken = await liff.getIDToken();
      if (!idToken) {
        alert("認証情報の取得に失敗しました。ページの再読み込みや再ログインをお試しください。");
        setUploadStatus("idle");
        return;
      }

      const config = { headers: { Authorization: `Bearer ${idToken}` } };

      // 署名取得
      console.log("Fetching ImageKit signature...");
      const signatureResponse = await axios.get('/api/imagekit-sign', config);
      const { signature, expire, token } = signatureResponse.data;
      console.log("ImageKit signature fetched successfully.");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("publicKey", env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY);
      formData.append("signature", signature);
      formData.append("expire", expire);
      formData.append("token", token);
      formData.append("fileName", file.name);

      // ImageKitへのアップロード
      console.log("Uploading to ImageKit...");
      const imagekitResponse = await axios.post('https://upload.imagekit.io/api/v1/files/upload', formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        },
      });
      const videoUrl = imagekitResponse.data.url;
      console.log("Upload to ImageKit successful:", videoUrl);

      // スプレッドシートへの書き込み
      console.log("Writing to spreadsheet...");
      await axios.post('/api/spreadsheet', {
        userName, genre, theme, requests, videoUrl,
        fileName: file.name, fileType: file.type, fileSize: file.size,
      }, config);
      console.log("Spreadsheet write successful.");
      
      setUploadStatus("success");
      setCurrentStep(5); // Go to final step

    } catch (err: unknown) {
      console.error("An error occurred during the upload process:", err);

      let msg = "アップロードに失敗しました。";
      if (axios.isAxiosError(err)) {
        console.error("Axios error details:", err.response?.data);
        if (err.response?.status === 401) {
            msg = "認証エラーが発生しました。再度ログインしてからお試しください。";
        } else {
            const errorDetail = err.response?.data?.message || "サーバーでエラーが発生しました。";
            msg = `アップロードに失敗しました: ${errorDetail}`;
        }
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setErrorMessage(msg);
      setUploadStatus("error");
      setCurrentStep(5); // Go to final step
    }
  };

  const restart = () => {
    setGenre("");
    setTheme("");
    setRequests("");
    setFile(null);
    setUploadStatus("idle");
    setUploadProgress(0);
    setErrorMessage("");
    setCurrentStep(1);
  };

  // --- Render Functions for Steps ---

  const renderStep1 = () => (
    <div className="text-center">
        <Image src="https://ik.imagekit.io/FLATUPGYM/Generated%20Image%20October%2013,%202025%20-%201_22PM%20(2).png?updatedAt=1760329626628" alt="AI training app" width={120} height={120} className="mx-auto mb-6"/>
        <h1 className="text-2xl font-bold text-gray-800 leading-tight mb-2">
            あなたの動きを、もっと美しく。
        </h1>
        <p className="text-gray-600 mb-8">AIがひろえる、新しいトレーニング習慣</p>
        <button onClick={() => setCurrentStep(2)} className="btn-primary">
            トレーニングを始める
        </button>
    </div>
  );

  const genres = [
    { title: "ボクシング", icon: "🥊" },
    { title: "キックボクシング", icon: "💥" },
    { title: "総合格闘技", icon: "🤼" },
  ];

  const renderStep2 = () => (
    <div className="text-center">
      <h2 className="text-xl font-bold mb-6">どのトレーニングに挑戦しますか？</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {genres.map((item) => (
          <div
            key={item.title}
            onClick={() => { setGenre(item.title); setCurrentStep(3); }}
            className={`card ${genre === item.title ? "selected" : ""}`}
          >
            <span className="text-3xl">{item.icon}</span>
            <span className="font-semibold mt-2">{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const themes = [
    { title: "美しいフォームを身につけたい", icon: "✨" },
    { title: "パンチのスピードを上げたい", icon: "✨" },
    { title: "かっこいい連続技を覚えたい", icon: "✨" },
    { title: "まずは楽しみながらやってみたい", icon: "✨" },
  ];

  const renderStep3 = () => (
    <div className="text-center">
      <h2 className="text-xl font-bold mb-6">あなたの目標を教えてください</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {themes.map((item) => (
          <div
            key={item.title}
            onClick={() => { setTheme(item.title); }}
            className={`card-sm ${theme === item.title ? "selected" : ""}`}
          >
            <span className="text-2xl mr-3">{item.icon}</span>
            <span>{item.title}</span>
          </div>
        ))}
      </div>
       <textarea
          id="requests"
          rows={3}
          value={requests}
          onChange={(e) => setRequests(e.target.value)}
          placeholder="その他、気になるポイントがあればご記入ください"
          className="w-full bg-gray-100 border-gray-300 rounded-lg shadow-sm px-4 py-3 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200 mt-6"
        />
        <button onClick={() => setCurrentStep(4)} className="btn-primary mt-6">
            次へ進む
        </button>
    </div>
  );

  const renderStep4 = () => (
    <div className="text-center">
      <h2 className="text-xl font-bold mb-4">動画を準備してくださいね</h2>
      
      <div className="bg-gray-50 border border-gray-200 text-gray-700 rounded-lg p-4 text-sm mb-6">
        <h3 className="font-bold mb-2 text-left">動画のポイント</h3>
        <ul className="list-disc list-inside text-left space-y-1">
          <li>10秒以内の動画でお願いします</li>
          <li>正面か横から全身が映るように</li>
          <li>背景はシンプルがベストです</li>
        </ul>
      </div>

      {uploadStatus === "uploading" ? (
        <div>
          <p className="mb-4 font-semibold">AIが解析中です...</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
          </div>
          <p className="mt-2 text-lg font-bold">{uploadProgress}%</p>
        </div>
      ) : (
        <>
          <label htmlFor="videoFile" className="file-label">
            {file ? `選択中: ${file.name}` : "ここをタップして動画を選ぶ"}
          </label>
          <input type="file" id="videoFile" accept="video/*" onChange={handleFileChange} className="hidden" />
          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
          <button onClick={handleUpload} className="btn-primary mt-4" disabled={!file}>
            送信する
          </button>
        </>
      )}
    </div>
  );

  const renderStep5 = () => (
    <div className="text-center">
      {uploadStatus === "success" ? (
        <>
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-4">ありがとうございます！</h2>
          <div className="bg-gray-100 p-4 rounded-lg text-left mb-8">
              <h3 className="font-bold text-center mb-2">解析時間のご案内</h3>
              <p className="text-sm text-gray-700">動画の解析には、<span className="font-bold">半日から1日ほど</span>お時間をいただく場合がございます。解析が完了しましたら、LINEのメッセージでお知らせしますので、しばらくお待ちくださいませ。</p>
          </div>
          <button onClick={restart} className="btn-secondary">
            別のトレーニングを試す
          </button>
        </>
      ) : (
        <>
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-4">エラーが発生しました</h2>
          <p className="text-red-600 bg-red-100 p-3 rounded-lg mb-8">{errorMessage}</p>
          <button onClick={() => setCurrentStep(4)} className="btn-primary">
            もう一度試す
          </button>
        </>
      )}
    </div>
  );

  // --- Main Render ---
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="container">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        {currentStep === 5 && renderStep5()}
      </div>

      <style jsx global>{`
        .container {
          width: 90%;
          max-width: 420px; /* Slightly wider for better text flow */
          background: var(--white);
          border-radius: 16px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease-in-out;
        }
        .btn-primary, .btn-secondary {
          width: 100%;
          padding: 15px;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-primary {
          background-color: var(--primary-color);
          color: var(--white);
        }
        .btn-primary:disabled {
          background-color: #BDBDBD;
          cursor: not-allowed;
        }
        .btn-primary:not(:disabled):hover {
          background-color: #00897B;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 191, 165, 0.3);
        }
        .btn-secondary {
          background-color: #E0E0E0;
          color: var(--text-color);
        }
        .btn-secondary:hover {
          background-color: #BDBDBD;
        }
        .card {
          padding: 20px;
          border: 2px solid #E0E0E0;
          border-radius: 12px;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .card:hover {
          border-color: var(--primary-color);
          background-color: #E0F2F1;
        }
        .card.selected {
          border-color: var(--primary-color);
          background-color: var(--primary-color);
          color: var(--white);
          transform: scale(1.05);
          box-shadow: 0 5px 20px rgba(0, 191, 165, 0.3);
        }
        .card-sm {
          padding: 15px;
          border: 2px solid #E0E0E0;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .card-sm:hover {
          border-color: var(--primary-color);
          background-color: #E0F2F1;
        }
        .card-sm.selected {
          border-color: var(--primary-color);
          background-color: var(--primary-color);
          color: var(--white);
        }
        .file-label {
          display: block;
          padding: 2rem;
          border: 2px dashed #E0E0E0;
          border-radius: 12px;
          cursor: pointer;
          margin-bottom: 1rem;
          transition: all 0.2s;
          font-weight: 500;
          color: #757575;
        }
        .file-label:hover {
          border-color: var(--primary-color);
          background-color: #E0F2F1;
        }
      `}</style>
    </div>
  );
}

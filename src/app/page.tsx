"use client";

import { useState, ChangeEvent, useEffect } from "react";
import axios from 'axios';
import liff from "@line/liff";
import Image from 'next/image';

// ☆☆☆ 感情戦略設計書に基づき、UI/UXを全面的にリファクタリング ☆☆☆

export default function AikaFormPage() {
  // --- State Management ---
  const [currentStep, setCurrentStep] = useState(1);
  const [userName, setUserName] = useState("");
  const [genre, setGenre] = useState(""); // New: 武道ジャンル
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
        await liff.init({ liffId: "2008276179-41Dz3bbJ" });
        if (liff.isLoggedIn()) {
          const profile = await liff.getProfile();
          setUserName(profile.displayName);
        }
      } catch (e: unknown) {
        console.error("LIFF Init Error:", e);
        setUserName("挑戦者");
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
      const idToken = liff.isLoggedIn() ? await liff.getIDToken() : null;
      const config = idToken ? { headers: { Authorization: `Bearer ${idToken}` } } : {};

      const signatureResponse = await axios.get('/api/imagekit-sign', config);
      const { signature, expire, token } = signatureResponse.data;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("publicKey", process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!);
      formData.append("signature", signature);
      formData.append("expire", expire);
      formData.append("token", token);
      formData.append("fileName", file.name);

      const imagekitResponse = await axios.post('https://upload.imagekit.io/api/v1/files/upload', formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        },
      });
      const videoUrl = imagekitResponse.data.url;

      await axios.post('/api/spreadsheet', {
        userName, genre, theme, requests, videoUrl,
        fileName: file.name, fileType: file.type, fileSize: file.size,
      }, config);
      
      setUploadStatus("success");
      setCurrentStep(5); // Go to final step

    } catch (err: unknown) {
      console.error(err);
      let msg = "アップロードに失敗しました。";
      if (axios.isAxiosError(err)) {
        msg = err.response?.data?.message || err.response?.data?.error || "サーバーでエラーが発生しました。";
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
        <Image src="/logo-aisoryu.png" alt="AI素流 ロゴ" width={150} height={150} className="mx-auto mb-4"/>
        <h1 className="text-2xl font-bold text-gray-800 leading-tight mb-2">
            魂のフォームを刻み込め。
        </h1>
        <p className="text-gray-600 mb-8">AIが導く、現代武道家のための次世代修行道。</p>
        <button onClick={() => setCurrentStep(2)} className="btn-primary">
            覚醒への一歩を踏み出す
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
      <h2 className="text-xl font-bold mb-6">師範が問う。汝、どの道を極めるか？</h2>
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
    { title: "キレイなフォームになりたい！", icon: "✨" },
    { title: "パンチのスピードを上げたい！", icon: "💨" },
    { title: "カッコいいコンビネーションを覚えたい！", icon: "🥊" },
    { title: "とにかく楽しみたい！", icon: "😄" },
  ];

  const renderStep3 = () => (
    <div className="text-center">
      <h2 className="text-xl font-bold mb-6">良かろう。では、何を目指す？</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {themes.map((item) => (
          <div
            key={item.title}
            onClick={() => { setTheme(item.title); setCurrentStep(4); }}
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
          placeholder="その他、特に見てほしいポイントなど (任意)"
          className="w-full bg-gray-100 border-gray-300 rounded-lg shadow-sm px-4 py-3 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200 mt-6"
        />
        <button onClick={() => setCurrentStep(4)} className="btn-secondary mt-4">次へ</button>
    </div>
  );

  const renderStep4 = () => (
    <div className="text-center">
      <h2 className="text-xl font-bold mb-4">その覚悟、しかと見届けよう。</h2>
      <p className="text-gray-600 mb-6">お前の魂を、この一撃に込めよ。</p>
      
      <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4 text-sm mb-6">
        <h3 className="font-bold mb-2">【重要】動画の掟</h3>
        <ul className="list-disc list-inside text-left">
          <li>動画は<span className="font-bold">10秒以内、10MB以下</span>とせよ。</li>
          <li><span className="font-bold">正面または側面</span>から全身を写すこと。</li>
          <li>背景はゴチャゴチャさせぬこと。</li>
        </ul>
      </div>

      {uploadStatus === "uploading" ? (
        <div>
          <p className="mb-4 font-semibold">師範が貴方の動画を鋭意解析中…</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
          </div>
          <p className="mt-2 text-lg font-bold">{uploadProgress}%</p>
        </div>
      ) : (
        <>
          <label htmlFor="videoFile" className="file-label">
            {file ? `選択中: ${file.name}` : "ここをタップして動画を選択"}
          </label>
          <input type="file" id="videoFile" accept="video/*" onChange={handleFileChange} className="hidden" />
          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
          <button onClick={handleUpload} className="btn-primary mt-4" disabled={!file}>
            師範に動画を送る
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
          <h2 className="text-2xl font-bold mb-4">見事だ！動画は確かに受け取った。</h2>
          <div className="bg-gray-100 p-4 rounded-lg text-left mb-8">
              <h3 className="font-bold text-center mb-2">【解析時間に関するご案内】</h3>
              <p className="text-sm text-gray-700">送信された動画の解析には、<span className="font-bold">半日から1日ほど</span>お時間を頂戴いたします。解析が完了次第、LINEのメッセージにて内容を丁寧にお知らせいたしますので、今しばらくお待ちください。</p>
          </div>
          <button onClick={restart} className="btn-secondary">
            別の動画で修行を続ける
          </button>
        </>
      ) : (
        <>
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-4">エラーが発生した。</h2>
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
    <div className="min-h-screen flex items-center justify-center p-4">
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
          max-width: 500px;
          background: var(--white);
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
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
          box-shadow: 0 4px 15px rgba(0, 191, 165, 0.4);
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
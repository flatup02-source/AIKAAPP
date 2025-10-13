"use client";

import { useState, ChangeEvent, useEffect } from "react";
import axios from 'axios';
import liff from "@line/liff";

// ☆☆☆ UI/UX最適化指示書に基づき、全面的にリファクタリング ☆☆☆

export default function AikaFormPage() {
  // --- State Management ---
  const [currentStep, setCurrentStep] = useState(1);
  const [userName, setUserName] = useState("");
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
        await liff.init({ liffId: "2008276179-41Dz3bbJ" }); // あなたのLIFF ID

        if (!liff.isLoggedIn()) {
          // ログインを促す処理をここに実装可能
          return;
        }

        const profile = await liff.getProfile();
        setUserName(profile.displayName);
      } catch (e: unknown) {
        console.error("LIFF Init Error:", e);
        setUserName("ゲスト"); // LIFF外でも利用できるようゲスト名を設定
      }
    };
    initializeLiff();
  }, []);

  // --- Handlers ---
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
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
        userName, theme, requests, videoUrl,
        fileName: file.name, fileType: file.type, fileSize: file.size,
      }, config);
      
      setUploadStatus("success");
      setCurrentStep(4);

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
      setCurrentStep(4);
    }
  };

  const restart = () => {
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
      <h2 className="text-2xl font-bold mb-2" id="welcomeMessage">
        {userName ? `${userName}さん、ようこそ！` : "ようこそ！"}
      </h2>
      <p className="text-gray-600 mb-8">あなたのフォームをAIが分析します。</p>
      <button onClick={() => setCurrentStep(2)} className="btn-primary">
        はじめる
      </button>
    </div>
  );

  const themes = [
    { title: "キレイなフォームになりたい！", icon: "✨" },
    { title: "パンチのスピードを上げたい！", icon: "💨" },
    { title: "カッコいいコンビネーションを覚えたい！", icon: "🥊" },
    { title: "とにかく楽しみたい！", icon: "😄" },
  ];

  const renderStep2 = () => (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-6">どうなりたいですか？</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {themes.map((item) => (
          <div
            key={item.title}
            onClick={() => {
              setTheme(item.title);
              setCurrentStep(3);
            }}
            className={`card ${theme === item.title ? "selected" : ""}`}
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
    </div>
  );

  const renderStep3 = () => (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-6">動画をアップロード</h2>
      {uploadStatus === "uploading" ? (
        <div>
          <p className="mb-4">送信中...</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
          </div>
          <p className="mt-2 text-lg font-bold">{uploadProgress}%</p>
        </div>
      ) : (
        <>
          <label htmlFor="videoFile" className="file-label">
            {file ? `選択中: ${file.name}` : "ファイルを選択"}
          </label>
          <input type="file" id="videoFile" accept="video/*" onChange={handleFileChange} className="hidden" />
          <button onClick={handleUpload} className="btn-primary mt-4" disabled={!file}>
            送信する
          </button>
        </>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="text-center">
      {uploadStatus === "success" ? (
        <>
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-4">アップロードが完了しました！</h2>
          <p className="text-gray-600 mb-8">AIからのフィードバックをお待ちください。</p>
          <button onClick={restart} className="btn-secondary">
            別の動画をアップロードする
          </button>
        </>
      ) : (
        <>
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-4">エラーが発生しました</h2>
          <p className="text-red-600 bg-red-100 p-3 rounded-lg mb-8">{errorMessage}</p>
          <button onClick={() => setCurrentStep(3)} className="btn-primary">
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
      </div>

      {/* CSSをJSX内で定義 */}
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
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
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

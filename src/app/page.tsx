"use client";

import { useState, ChangeEvent, useEffect } from "react";
import Image from "next/image";
import axios from 'axios';
import { useRouter } from "next/navigation";
import liff from "@line/liff";

export default function AikaFormPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [userName, setUserName] = useState("");
  const [theme, setTheme] = useState("");
  const [requests, setRequests] = useState("");
  const [liffMessage, setLiffMessage] = useState("LIFFを初期化中...");

  useEffect(() => {
    const initializeLiff = async () => {
      try {
        await liff.init({ liffId: "2008276179-41Dz3bbJ" }); // あなたのLIFF ID
        setLiffMessage("LIFFの初期化に成功！");

        if (!liff.isLoggedIn()) {
          setLiffMessage("LINEにログインしていません。");
          return;
        }

        const profile = await liff.getProfile();
        setUserName(profile.displayName);
        setLiffMessage(`ようこそ、${profile.displayName}さん！`);

      } catch (e) {
        console.error("LIFF Init Error:", e);
        setLiffMessage("LIFFの初期化に失敗。通常のブラウザで開いていますか？");
      }
    };
    initializeLiff();
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("まず動画ファイルを選択してください。");
      return;
    }
    setUploading(true);
    setUploadProgress(0);

    try {
      const signatureResponse = await axios.get('/api/imagekit-sign');
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
        userName,
        theme,
        requests,
        videoUrl,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      });
      
      router.push('/success');

    } catch (err) {
      console.error(err);
      let errorMessage = "アップロードに失敗しました。";
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err.response?.data?.error || "サーバーでエラーが発生しました。";
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      alert(`エラーが発生しました: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  const themes = [
    "キレイなフォームになりたい！",
    "パンチのスピードを上げたい！",
    "カッコいいコンビネーションを覚えたい！",
    "とにかく楽しみたい！",
  ];

  return (
    <div 
      className="min-h-screen text-gray-800 flex justify-center py-12 px-4"
      style={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}
    >
      <div className="w-full max-w-2xl space-y-12">
        <header className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 drop-shadow-sm leading-tight">
            たった10秒…お前の「戦闘力」、見せてみろ！
          </h1>
          <p className="text-xl md:text-2xl font-semibold text-gray-600 mt-4">
            AIスカウターが導く！<br />破壊神AIKA 18号のフォーム解析！
          </p>
        </header>

        <div className="flex justify-center">
          <div 
            className="relative p-1 rounded-2xl" 
            style={{boxShadow: '0 0 40px rgba(76, 201, 240, 0.4)'}}
          >
            <Image
              src="/aika-character.jpg"
              alt="AIコーチ AIKA 18号"
              width={500}
              height={500}
              className="rounded-xl shadow-2xl object-cover"
              priority
            />
          </div>
        </div>
        
        <main className="bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow-lg space-y-8 border border-white/50">
           <p className="text-center text-sm text-gray-500">{liffMessage}</p>
          <div className="space-y-6">
            <div>
              <label htmlFor="userName" className="block text-sm font-bold text-gray-700 mb-2">
                お名前 (LINEでの表示名)
              </label>
              <input
                type="text"
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="LIFFから自動取得中..."
                className="w-full bg-white/50 border-gray-300 rounded-lg shadow-sm px-4 py-3 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                今日のテーマ (1つだけ選んでみてね)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {themes.map((item) => (
                  <button
                    key={item}
                    onClick={() => setTheme(item)}
                    className={`w-full text-center px-5 py-4 rounded-xl transition-all duration-200 font-semibold text-sm ${
                      theme === item
                        ? "bg-blue-500 text-white shadow-lg scale-105 transform"
                        : "bg-white/50 text-gray-700 hover:bg-white"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="requests" className="block text-sm font-bold text-gray-700 mb-2">
                その他の要望・気になることなど
              </label>
              <textarea
                id="requests"
                rows={4}
                value={requests}
                onChange={(e) => setRequests(e.target.value)}
                placeholder="例：かめはめ波を打つ時の腰のフォームが気になる..."
                className="w-full bg-white/50 border-gray-300 rounded-lg shadow-sm px-4 py-3 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                ここから動画をアップロード (10秒以内)
              </label>
              <label 
                htmlFor="file-upload" 
                className={`mt-2 flex justify-center items-center w-full px-6 py-10 border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-300
                  ${file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-400'}`}
              >
                <div className="text-center">
                  {file ? (
                    <div>
                      <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="mt-2 font-semibold text-green-600">{file.name}</p>
                      <p className="text-xs text-gray-500 mt-1">ファイル選択済み！</p>
                    </div>
                  ) : (
                    <div>
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 4v.01M28 8l4-4h20v12l-4 4m-32 4l8-8 12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-600">ここをタップして動画を選択</p>
                      <p className="text-xs text-gray-500 mt-1">動画を送ってアドバイスをもらおう！</p>
                    </div>
                  )}
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="video/*"/>
                </div>
              </label>
            </div>

            <div className="pt-6">
              <button
                onClick={handleUpload}
                disabled={uploading || !file}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 disabled:bg-gray-400 disabled:from-gray-400 disabled:cursor-not-allowed transform hover:scale-105 transition-transform duration-200"
              >
                {uploading ? `解析中... ${uploadProgress}%` : "AIKA 18号に動画を送る"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
"use client";

import liff from "@line/liff";
import { useEffect, useState } from "react";

export default function SuccessPage() {
  const [liffError, setLiffError] = useState("");

  useEffect(() => {
    // LIFFの初期化はメインページで行われていると仮定
    if (liff.id && !liff.isInClient()) {
      console.log("This is not in the LINE client.");
    }
  }, []);

  const handleClose = () => {
    if (liff.isInClient()) {
      liff.closeWindow();
    } else {
      // LIFF環境外の場合のフォールバック（例：トップページに戻る）
      window.location.href = '/';
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center text-center px-4"
      style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}
    >
      <div className="bg-white/70 backdrop-blur-xl p-8 md:p-12 rounded-2xl shadow-lg max-w-lg w-full">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
          👍 送信完了しました！
        </h1>
        <p className="mt-6 text-gray-600">
          動画の送信ありがとうございます！<br />
          ただいまAIKA 18号が、あなたのフォームを丁寧にチェックしています。診断結果は、半日〜1日程度でお送りしますので、楽しみに待っていてくださいね！
        </p>
        <div className="mt-8">
          <button
            onClick={handleClose}
            className="w-full max-w-xs mx-auto flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 transform hover:scale-105 transition-transform duration-200"
          >
            LINEに戻る
          </button>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import liff from "@line/liff";
import FileUploader from "../components/FileUploader";

type ViewState = "form" | "analyzing" | "result";
type AIPersonality = "default" | "fun" | "pro";

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [userName, setUserName] = useState("");
  const [theme, setTheme] = useState("");
  const [requests, setRequests] = useState("");
  const [liffMessage, setLiffMessage] = useState(
    "あなたの最強のパートナー、AI18号を起動しています…"
  );
  const [lineId, setLineId] = useState<string | null>(null); // LIFFユーザーIDを保存するstate

  // ★★★ 新しい状態を追加 ★★★
  const [viewState, setViewState] = useState<ViewState>("form");
  const [powerLevel, setPowerLevel] = useState<number | null>(null);
  const [aiComment, setAiComment] = useState("");
  const [idolFighterName] = useState("那須川天心"); // デフォルトの憧れのファイター
  const [aiPersonality, setAiPersonality] =
    useState<AIPersonality>("default");
  const [aiIntroduction, setAiIntroduction] = useState("");

    // ... (rest of the state declarations)

  

    useEffect(() => {

      const initializeLiff = async () => {

        try {

          console.log("LIFF初期化開始:", process.env.NEXT_PUBLIC_LIFF_ID);

          await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! });

  

          if (!liff.isLoggedIn()) {

            liff.login({ redirectUri: window.location.href });

            return;

          }

  

          const profile = await liff.getProfile();

          console.log("ログイン成功:", profile.displayName);

          setUserName(profile.displayName);

          setLineId(profile.userId);

  

          const idToken = liff.getIDToken();

          if (idToken) {

            const user = await signInWithLine(idToken);

            console.log("Firebase Auth successful:", user);

          }

  

        } catch (err) {

          console.error("LIFF初期化エラー:", err);

          alert("LIFF初期化に失敗しました。LINEアプリ内で開いてください。");

        }

      };

      initializeLiff();

    }, []);

  

    // ... (handleThemeSelect function)

  

    const handleUpload = async (selectedFile: File) => {

      console.log("handleUpload function executed.");

      if (!selectedFile) {

        alert("まず動画ファイルを選択してください。");

        return;

      }

  

      setUploading(true);

      setUploadProgress(0);

      setViewState("analyzing");

  

      try {

        const uploadPath = await uploadUserVideo(selectedFile);

        console.log("Upload successful, path:", uploadPath);

  

        // ... (rest of the post-upload logic)

  

      } catch (error) {

        console.error("Upload failed:", error);

        alert("アップロードに失敗しました。");

        setViewState("form");

        setUploading(false);

      }

    };

  

    // ... (rest of the component)

  

  const themes = [
    "より美しいフォームを手に入れたい",
    "パンチのスピードを向上させたい",
    "洗練されたコンビネーションを習得したい",
    "まずは楽しむことを重視したい",
    "プロになりたい",
    "試合に出てみたい",
  ];

  // ★★★ ここから、画面表示の切り替え処理を追加 ★★★

  if (viewState === "analyzing") {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">
            集中…今、君の未来を計算している…
          </h1>
          <div className="relative w-64 h-64">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                className="text-gray-700"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
                r="45"
                cx="50"
                cy="50"
              />
              <circle
                className="text-blue-500"
                strokeWidth="10"
                strokeDasharray={2 * Math.PI * 45}
                strokeDashoffset={(2 * Math.PI * 45) * (1 - uploadProgress / 100)}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="45"
                cx="50"
                cy="50"
                style={{
                  transform: "rotate(-90deg)",
                  transformOrigin: "50% 50%",
                }}
              />
            </svg>
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold">
              {uploadProgress}%
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (viewState === "result") {
    const renderResultContent = () => {
      switch (aiPersonality) {
        case "fun":
          return {
            title: `今日のスタイルポイントは【${powerLevel}点】！次は100点目指そう！`,
            commentIntro:
              "見つけたよ！君の動きがもっと最高になる、とっておきのヒントを３つ！",
          };
        case "pro":
          return {
            title: `現在のフォーム効率は【${powerLevel}%】。次の解析までに75%を超えることが当面の目標だ。`,
            commentIntro:
              "解析完了。現状の課題と、改善のための具体的処方を3点提示する。",
          };
        default:
          return {
            title: `戦闘力【${powerLevel?.toLocaleString()}】`,
            commentIntro: "神託の啓示",
          };
      }
    };

    const { title, commentIntro } = renderResultContent();

    return (
      <div
        className="min-h-screen flex items-center justify-center text-center p-4"
        style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}
      >
        <div className="bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-2xl shadow-lg max-w-lg w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {commentIntro}
          </h1>
          <p className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400 my-4">
            {title}
          </p>
          <p className="text-left text-gray-600 whitespace-pre-wrap">
            {aiComment}
          </p>
          <button
            onClick={() => setViewState("form")}
            className="mt-8 w-full max-w-xs mx-auto flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-lg font-semibold text-white bg-gray-700 hover:bg-gray-800 transform hover:scale-105 transition-transform duration-200"
          >
            もう一度挑戦する
          </button>
        </div>
      </div>
    );
  }

  return (
    // viewStateが'form'の場合の元のフォーム
    <div
      className="min-h-screen text-gray-800 flex justify-center py-12 px-4"
      style={{
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      <div className="w-full max-w-2xl space-y-12">
        <header className="text-center">
          <Image
            src={`https://ik.imagekit.io/FLATUPGYM/b9d4a676-0903-444c-91d2-50222dc3294f.png?updatedAt=1760340781490&v=${new Date().getTime()}`}
            alt="AIKA 18"
            width={400}
            height={400}
            className="w-full h-auto max-w-xs mx-auto mb-4 rounded-lg md:w-48 md:h-48 md:rounded-full"
          />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 drop-shadow-sm leading-tight">
            この10秒で、あなたのフォームはもっと輝く。
          </h1>
          <p className="text-xl md:text-2xl font-semibold text-gray-600 mt-4">
            はじめまして！私があなたの専属AIトレーナー「AIKA」よ。あなたの動きを分析して、もっと上手になるためのアドバイスを送るわね。
          </p>
        </header>

        {/* Temporary UI for debugging LIFF state */}
        {/* Removed for production */}

        {/* ... 以降のフォーム部分は変更なし ... */}
        <main className="bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow-lg space-y-8 border border-white/50">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="userName"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                お名前（LINEでの表示名）
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
              <div className="text-center mb-4">
                <p className="font-bold text-gray-800">
                  {userName}さん、こんにちは！一緒に頑張りましょう！
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  まずは、今日のテーマを一つ選んでくれるかな？あなたの目標に合わせて、私もアドバイスの内容を変えていくわ。
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {themes.map((item) => (
                  <button
                    key={item}
                    onClick={() => handleThemeSelect(item)}
                    className={`w-full text-center px-5 py-4 rounded-xl transition-all duration-200 font-semibold text-sm ${
                      theme === item
                        ? "bg-blue-500 text-white shadow-lg scale-105 transform"
                        : "bg-white text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              {aiIntroduction && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg text-center">
                  <p className="text-sm text-blue-800 font-semibold">
                    {aiIntroduction}
                  </p>
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="requests"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                もし「特にここを見てほしい！」というポイントがあったら、気軽に教えてね！
              </label>
              <textarea
                id="requests"
                rows={4}
                value={requests}
                onChange={(e) => setRequests(e.target.value)}
                placeholder="（例：右ストレートがブレちゃう、ステップインのタイミングがわからない…など）"
                className="w-full bg-white/50 border-gray-300 rounded-lg shadow-sm px-4 py-3 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
              />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">
                準備ができたら、あなたの「今」の動きを見せて。完璧じゃなくて大丈夫。あなたの動きの中に眠る「未来の強さ」の原石を、私が見つけ出すから。さあ、撮影ボタンを押して！
              </p>
              <FileUploader
                onUploadAttempt={handleUpload}
                isUploading={uploading}
              />
            </div>
          </div>
        </main>
        <footer className="text-left text-sm bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow-lg border border-white/50">
          <h3 className="font-bold text-base text-gray-800 mb-3">
            直接の指導をご希望の方へ
          </h3>
          <p className="mb-4 text-gray-800 leading-relaxed">
            もし操作にご不明な点があったり、AIの解析だけでは物足りないと感じたりした際は、どうぞお気軽にジムへお越しください。
          </p>

          <div className="mb-4">
            <h4 className="font-semibold text-gray-700">【初めての方へ】</h4>
            <p className="text-gray-800 leading-relaxed">
              インストラクターがマンツーマンで指導する無料体験レッスンもご用意しております。あなたの理想のフォームへ、最短距離で近づきましょう。
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700">【会員の皆様へ】</h4>
            <p className="text-gray-800 leading-relaxed">
              ジムにてインストラクターへ直接お声がけくだされば、よりパーソナルなアドバイスも可能です。いつでもお待ちしております。
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
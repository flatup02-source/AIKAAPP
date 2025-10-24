"use client";

import { useState, ChangeEvent, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firebase";

import liff from "@line/liff";

const getMimeType = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  if (!extension) return 'application/octet-stream';
  const mimeTypes: { [key: string]: string } = {
    'mp4': 'video/mp4',
    'mov': 'video/quicktime',
    'avi': 'video/x-msvideo',
    'mkv': 'video/x-matroska',
    'wmv': 'video/x-ms-wmv',
    'webm': 'video/webm',
  };
  return mimeTypes[extension] || 'application/octet-stream';
};

const validateUploadPath = (lineId: string, fileName: string): string | null => {
  if (!lineId.startsWith("U")) {
    return "Invalid LINE User ID. It must start with 'U'.";
  }
  if (!fileName.match(/\.(mp4|mov|avi|mkv|wmv|webm)$/i)) {
    return "Invalid file type. Only video files are allowed.";
  }
  return null;
};

const getUploadMetadata = (lineId: string, file: File) => {
  const bucketName = "aika-storage-bucket2";
  const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'tmp';
  const uniqueFileName = `${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;
  const storagePath = `users/${lineId}/videos/${uniqueFileName}`;

  let contentType = file.type || getMimeType(file.name);
  if (contentType === 'application/octet-stream') {
    if (fileExtension === 'mp4') {
      contentType = 'video/mp4';
    } else if (fileExtension === 'mov') {
      contentType = 'video/quicktime';
    }
  }
  return { storagePath, contentType, uniqueFileName, bucketName };
};

type ViewState = "form" | "analyzing" | "result";
type AIPersonality = "default" | "fun" | "pro";

export default function AikaFormPage() {

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [userName, setUserName] = useState("");
  const [theme, setTheme] = useState("");
  const [requests, setRequests] = useState("");
  const [liffMessage, setLiffMessage] = useState("あなたの最強のパートナー、AI18号を起動しています…");
  const [lineId, setLineId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInClient, setIsInClient] = useState(false);
  
  const [viewState, setViewState] = useState<ViewState>("form");
  const [powerLevel, setPowerLevel] = useState<number | null>(null);
  const [aiComment, setAiComment] = useState("");
  const [idolFighterName] = useState("那須川天心");
  const [aiPersonality, setAiPersonality] = useState<AIPersonality>("default");
  const [aiIntroduction, setAiIntroduction] = useState("");

  useEffect(() => {
    const initializeLiff = async () => {
      try {
        console.log("LIFF初期化開始:", process.env.NEXT_PUBLIC_LIFF_ID);
        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! });

        setIsInClient(liff.isInClient());
        setIsLoggedIn(liff.isLoggedIn());

        if (!liff.isLoggedIn()) {
          liff.login({ redirectUri: window.location.href });
          return;
        }

        const profile = await liff.getProfile();
        console.log("ログイン成功:", profile.displayName);
        setUserName(profile.displayName);
        setLineId(profile.userId);

      } catch (err: unknown) {
        console.error("LIFF初期化エラー:", err);
        if (err instanceof Error) {
          alert(`LIFF初期化に失敗しました: ${err.message}。LINEアプリ内で開いてください。`);
        } else {
          alert("LIFF初期化に失敗しました。LINEアプリ内で開いてください。");
        }
      }
    };
    initializeLiff();
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleThemeSelect = (selectedTheme: string) => {
    setTheme(selectedTheme);
    if (selectedTheme === "まずは楽しむことを重視したい") {
      setAiPersonality("fun");
      setAiIntroduction("了解！楽しむのが一番だよね！理屈は抜きにして、とにかくカッコよく動けるように、私が最高の相棒になるよ！よろしく！");
    } else if (selectedTheme === "プロになりたい") {
      setAiPersonality("pro");
      setAiIntroduction("覚悟はいいか。プロの世界は甘くない。私からの要求は厳しくなるが、ついてくるなら世界レベルの視点を授けよう。始めようか。");
    } else {
      setAiPersonality("default");
      setAiIntroduction("");
    }
  };

  const handleUpload = async () => {
    if (!file || !lineId) {
      alert("File or LINE ID missing.");
      return;
    }

    const validationError = validateUploadPath(lineId, file.name);
    if (validationError) {
      alert(`[Validation Error] ${validationError}`);
      return;
    }

    setUploading(true);
    setViewState("analyzing");

    const { storagePath, contentType, uniqueFileName, bucketName } = getUploadMetadata(lineId, file);
    console.log("シンプルな uploadBytes でアップロードを開始します...", { storagePath, contentType, size: file.size });

    try {
      const storageRef = ref(storage, storagePath);
      const metadata = { contentType };
      const blob = new Blob([file], { type: file.type });

      await uploadBytes(storageRef, blob, metadata);
      
      console.log('アップロードが完了しました！');
      await handleAnalysis(storagePath, uniqueFileName, bucketName, file.type, file.size);

    } catch (error: any) {
      console.error("アップロードに失敗しました", error);
      alert(`アップロードに失敗しました: ${error.message}`);
      setViewState("form");
    } finally {
      setUploading(false);
    }
  };

  async function handleAnalysis(storagePath: string, uniqueFileName: string, bucketName: string, fileType: string, fileSize: number) {
    try {
      console.log("Step 4: Upload to GCS complete. Calling analysis API...");
      const gcsUri = `gs://${bucketName}/videos/${uniqueFileName}`;

      const analysisResponse = await axios.post("/api/analyze-video", {
        gcsUri: gcsUri,
        idolFighterName,
        liffUserId: lineId,
        theme: theme,
      });
      console.log("Step 5: Analysis API call successful. Saving to spreadsheet...");

      const { power_level, comment } = analysisResponse.data;

      await axios.post("/api/spreadsheet", {
        userName,
        theme,
        requests,
        videoUrl: gcsUri,
        fileName: uniqueFileName,
        fileType: fileType,
        fileSize: fileSize,
        powerLevel: power_level,
        aiComment: comment,
      });
      console.log("Step 6: Spreadsheet save successful. Displaying results.");

      setPowerLevel(power_level);
      setAiComment(comment);
      setViewState("result");

    } catch (err: unknown) {
      console.error("Error during post-upload API calls:", err);
      let errorMessage = "An unknown error occurred";
      if (axios.isAxiosError(err)) {
        errorMessage = JSON.stringify(err.response?.data || err.message, null, 2);
      } else if (err instanceof Error) {
        errorMessage = err.message;
      } else {
        try {
          errorMessage = JSON.stringify(err);
        } catch {
          errorMessage = String(err);
        }
      }
      alert(`アップロード後にエラーが発生しました:\n\n${errorMessage}`);
      setViewState("form");
    }
  }

  const themes = [
    "より美しいフォームを手に入れたい",
    "パンチのスピードを向上させたい",
    "洗練されたコンビネーションを習得したい",
    "まずは楽しむことを重視したい",
    "プロになりたい",
    "試合に出てみたい",
  ];

  if (viewState === "analyzing") {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">集中…今、君の未来を計算している…</h1>
            <div className="relative w-64 h-64 flex items-center justify-center">
                <svg className="animate-spin h-24 w-24 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        </div>
      </div>
    );
  }

  if (viewState === "result") {
    const renderResultContent = () => {
      switch (aiPersonality) {
        case 'fun':
          return {
            title: `今日のスタイルポイントは【${powerLevel}点】！次は100点目指そう！`,
            commentIntro: "見つけたよ！君の動きがもっと最高になる、とっておきのヒントを３つ！",
          };
        case 'pro':
          return {
            title: `現在のフォーム効率は【${powerLevel}%】。次の解析までに75%を超えることが当面の目標だ。`,
            commentIntro: "解析完了。現状の課題と、改善のための具体的処方を3点提示する。",
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
        <div className="min-h-screen flex items-center justify-center text-center p-4" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
            <div className="bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-2xl shadow-lg max-w-lg w-full">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">{commentIntro}</h1>
                <p className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400 my-4">
                    {title}
                </p>
                <p className="text-left text-gray-600 whitespace-pre-wrap">{aiComment}</p>
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
    <div 
      className="min-h-screen text-gray-800 flex justify-center py-12 px-4"
      style={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
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

        <div className="bg-yellow-100 p-4 rounded-lg text-sm text-gray-800 my-4 shadow-inner">
          <h3 className="font-bold text-base mb-2">【デバッグ情報】</h3>
          <p><span className="font-semibold">LINEアプリ内で実行中 (isInClient):</span> {isInClient.toString()}</p>
          <p><span className="font-semibold">ログイン状態 (isLoggedIn):</span> {isLoggedIn.toString()}</p>
          <p><span className="font-semibold">LINE User ID:</span> {lineId || "未取得"}</p>
        </div>

        <main className="bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow-lg space-y-8 border border-white/50">
          <div className="space-y-6">
            <div>
              <label htmlFor="userName" className="block text-sm font-bold text-gray-700 mb-2">お名前（LINEでの表示名）</label>
              <input type="text" id="userName" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="LIFFから自動取得中..." className="w-full bg-white/50 border-gray-300 rounded-lg shadow-sm px-4 py-3 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200" readOnly />
            </div>
            <div>
              <div className="text-center mb-4">
                <p className="font-bold text-gray-800">{userName}さん、こんにちは！一緒に頑張りましょう！</p>
                <p className="text-sm text-gray-600 mt-2">まずは、今日のテーマを一つ選んでくれるかな？あなたの目標に合わせて、私もアドバイスの内容を変えていくわ。</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {themes.map((item) => (
                  <button key={item} onClick={() => handleThemeSelect(item)} className={`w-full text-center px-5 py-4 rounded-xl transition-all duration-200 font-semibold text-sm ${ theme === item ? "bg-blue-500 text-white shadow-lg scale-105 transform" : "bg-white text-gray-800 hover:bg-gray-100" }`}>{item}</button>
                ))}
              </div>
              {aiIntroduction && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg text-center">
                  <p className="text-sm text-blue-800 font-semibold">{aiIntroduction}</p>
                </div>
              )}
            </div>
            <div>
              <label htmlFor="requests" className="block text-sm font-bold text-gray-700 mb-2">もし「特にここを見てほしい！」というポイントがあったら、気軽に教えてね！</label>
              <textarea id="requests" rows={4} value={requests} onChange={(e) => setRequests(e.target.value)} placeholder="（例：右ストレートがブレちゃう、ステップインのタイミングがわからない…など）" className="w-full bg-white/50 border-gray-300 rounded-lg shadow-sm px-4 py-3 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200" />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">準備ができたら、あなたの「今」の動きを見せて。完璧じゃなくて大丈夫。あなたの動きの中に眠る「未来の強さ」の原石を、私が見つけ出すから。さあ、撮影ボタンを押して！</p>
<div className="w-full max-w-md mx-auto p-4 bg-slate-100 rounded-2xl shadow-inner space-y-4">

  {file && (
    <div className="p-3 bg-white rounded-lg text-center">
      <p className="text-gray-800 font-medium truncate">{file.name}</p>
    </div>
  )}

  <button
    onClick={handleUpload}
    disabled={!file || uploading}
    className="w-full bg-black text-white font-bold py-4 px-6 rounded-xl text-lg transition-all
               hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
  >
    18号、頼んだ！
  </button>

  <label className="block w-full text-center text-sm text-gray-600 bg-white
                   py-2 px-4 rounded-xl cursor-pointer hover:bg-gray-200 transition-colors">
    {file ? '動画を変更する' : '動画を選択する'}
    <input
      type="file"
      accept="video/*"
      className="hidden"
      onChange={handleFileChange}
    />
  </label>
</div>
            </div>
          </div>
        </main>
        <footer className="text-left text-sm bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow-lg border border-white/50">
          <h3 className="font-bold text-base text-gray-800 mb-3">直接の指導をご希望の方へ</h3>
          <p className="mb-4 text-gray-800 leading-relaxed">もし操作にご不明な点があったり、AIの解析だけでは物足りないと感じたりした際は、どうぞお気軽にジムへお越しください。</p>
          
          <div className="mb-4">
              <h4 className="font-semibold text-gray-700">【初めての方へ】</h4>
              <p className="text-gray-800 leading-relaxed">インストラクターがマンツーマンで指導する無料体験レッスンもご用意しております。あなたの理想のフォームへ、最短距離で近づきましょう。</p>
          </div>

          <div>
              <h4 className="font-semibold text-gray-700">【会員の皆様へ】</h4>
              <p className="text-gray-800 leading-relaxed">ジムにてインストラクターへ直接お声がけくだされば、よりパーソナルなアドバイスも可能です。いつでもお待ちしております。</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
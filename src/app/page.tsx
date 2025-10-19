"use client";

import { useState, ChangeEvent, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { getStorage, ref, uploadBytes } from "firebase/storage";

import liff from "@line/liff";

type ViewState = "form" | "analyzing" | "result";
type AIPersonality = "default" | "fun" | "pro";

export default function AikaFormPage() {

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [userName, setUserName] = useState("");
  const [theme, setTheme] = useState("");
  const [requests, setRequests] = useState("");
  const [liffMessage, setLiffMessage] = useState("あなたの最強のパートナー、AI18号を起動しています…");
  
  // ★★★ 新しい状態を追加 ★★★
  const [viewState, setViewState] = useState<ViewState>("form");
  const [powerLevel, setPowerLevel] = useState<number | null>(null);
  const [aiComment, setAiComment] = useState("");
  const [idolFighterName] = useState("那須川天心"); // デフォルトの憧れのファイター
  const [aiPersonality, setAiPersonality] = useState<AIPersonality>("default");
  const [aiIntroduction, setAiIntroduction] = useState("");

  useEffect(() => {
    const initializeLiff = async () => {
      try {
        await liff.init({ liffId: "2008276179-41Dz3bbJ" });
        if (liff.isLoggedIn()) {
          const profile = await liff.getProfile();
          setUserName(profile.displayName);
          setLiffMessage("LIFFを初期化中..."); // 初期化メッセージを更新
        } else {
          setLiffMessage("LIFFにログインしてください。");
        }
      } catch (e) {
        console.error("LIFF Init Error:", e);
        setLiffMessage("LIFFの初期化に失敗。");
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
      setAiIntroduction(""); // 他のテーマでは特別な紹介文はなし
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("まず動画ファイルを選択してください。");
      return;
    }
    setUploading(true);
    setUploadProgress(0);
    setViewState("analyzing"); // 解析中の画面に切り替え

    try {
      const liffUserId = liff.getIDToken();
      if (!liffUserId) {
        alert("LINEの認証情報を取得できませんでした。再度お試しください。");
        setViewState("form");
        return;
      }

      // GCSへの直接アップロード処理
      const storage = getStorage();
      const bucketName = "aika-storage-bucket2";
      const fileName = `${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `videos/${fileName}`);

      // 1. GCSにファイルを直接アップロード
      await uploadBytes(storageRef, file);
      console.log("GCSへのアップロードが完了しました。");
      setUploadProgress(100); // GCS upload doesn't have progress, so set to 100 after completion

      // 2. 正しいgcsUriを組み立てる
      const gcsUri = `gs://${bucketName}/videos/${fileName}`;

      // 3. 正しいgcsUriを使って、APIを呼び出す
      const analysisResponse = await axios.post("/api/analyze-video", {
        gcsUri: gcsUri,
        idolFighterName,
        liffUserId: liffUserId,
        theme: theme,
      });

      const { power_level, comment } = analysisResponse.data;

      // 4. 全てのデータをスプレッドシートに記録
      await axios.post("/api/spreadsheet", {
        userName,
        theme,
        requests,
        videoUrl: gcsUri, // Using gcsUri as videoUrl
        fileName: fileName,
        fileType: file.type,
        fileSize: file.size,
        powerLevel: power_level,
        aiComment: comment,
      });
      
      // 5. 結果を画面に表示する
      setPowerLevel(power_level);
      setAiComment(comment);
      setViewState("result"); // 結果表示画面に切り替え

    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      console.error(err);
      const errorMessage = JSON.stringify(
        err.response?.data || err.message || err,
        null,
        2
      );
      alert(`エラー詳細:\n\n${errorMessage}`);
      setViewState("form"); // エラー時はフォームに戻す
    } finally {
      setUploading(false);
    }
  };

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
            <h1 className="text-3xl font-bold mb-4">集中…今、君の未来を計算している…</h1>
            <div className="relative w-64 h-64">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle className="text-gray-700" strokeWidth="10" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                    <circle 
                        className="text-blue-500"
                        strokeWidth="10"
                        strokeDasharray={2 * Math.PI * 45}
                        strokeDashoffset={(2 * Math.PI * 45) * (1 - uploadProgress / 100)}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="45" cx="50" cy="50"
                        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                    />
                </svg>
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold">{uploadProgress}%</span>
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

  return ( // viewStateが'form'の場合の元のフォーム
    <div 
      className="min-h-screen text-gray-800 flex justify-center py-12 px-4"
      style={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}
    >
      <div className="w-full max-w-2xl space-y-12">
        <header className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 drop-shadow-sm leading-tight">
            その10秒が、あなたのフォームを次のレベルへ導く。
          </h1>
          <p className="text-xl md:text-2xl font-semibold text-gray-600 mt-4">
            専属AIトレーナー「AIKA 18号」が、あなたの動きを精密に解析し、パーソナルフィードバックをお届けします。
          </p>
        </header>

        {/* ... 以降のフォーム部分は変更なし ... */}
        <div className="flex justify-center">
          <div className="relative p-1 rounded-2xl" style={{boxShadow: '0 0 40px rgba(76, 201, 240, 0.4)'}}>
            <Image src="https://ik.imagekit.io/FLATUPGYM/b9d4a676-0903-444c-91d2-50222dc3294f.png?updatedAt=1760340781490" alt="AIコーチ AIKA 18号" width={500} height={500} className="rounded-xl shadow-2xl object-cover" priority />
          </div>
        </div>
        <main className="bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow-lg space-y-8 border border-white/50">
          <div className="space-y-6">
            <div>
              <label htmlFor="userName" className="block text-sm font-bold text-gray-700 mb-2">お名前（LINEでの表示名）</label>
              <input type="text" id="userName" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="LIFFから自動取得中..." className="w-full bg-white/50 border-gray-300 rounded-lg shadow-sm px-4 py-3 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200" readOnly />
            </div>
            <div>
              <div className="text-center mb-4">
                <p className="font-bold text-gray-800">{userName}さん、こんにちは。</p>
                <p className="font-bold text-gray-800">AI18号だ。君が求める未来へ、私が導く。</p>
                <p className="text-sm text-gray-600 mt-2">今回のテーマを1つ選んでくれ。それによって、私からの言葉も変わってくる。</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {themes.map((item) => (
                  <button key={item} onClick={() => handleThemeSelect(item)} className={`w-full text-center px-5 py-4 rounded-xl transition-all duration-200 font-semibold text-sm ${ theme === item ? "bg-blue-500 text-white shadow-lg scale-105 transform" : "bg-white/50 text-gray-700 hover:bg-white" }`}>{item}</button>
                ))}
              </div>
              {aiIntroduction && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg text-center">
                  <p className="text-sm text-blue-800 font-semibold">{aiIntroduction}</p>
                </div>
              )}
            </div>
            <div>
              <label htmlFor="requests" className="block text-sm font-bold text-gray-700 mb-2">ご要望や特に見てほしい点など</label>
              <textarea id="requests" rows={4} value={requests} onChange={(e) => setRequests(e.target.value)} placeholder="（例：右ストレートの軌道、ステップインのタイミングなど）" className="w-full bg-white/50 border-gray-300 rounded-lg shadow-sm px-4 py-3 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">私に、君の「のびしろ」を見せてくれ。</label>
              <p className="text-sm text-gray-600 mb-2">完成されたフォームには興味ない。今の君の動きに眠る、未来の強さの原石を私が見つけ出す。安心して、今の全てをぶつけてみてくれ。（10秒以内の動画をどうぞ）</p>
              <label htmlFor="file-upload" className={`mt-2 flex justify-center items-center w-full px-6 py-10 border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-300 ${file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-400'}`}>
                <div className="text-center">
                  {file ? (
                    <div>
                      <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <p className="mt-2 font-semibold text-green-600">{file.name}</p>
                      <p className="text-xs text-gray-500 mt-1">ファイル選択済み！</p>
                    </div>
                  ) : (
                    <div>
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 4v.01M28 8l4-4h20v12l-4 4m-32 4l8-8 12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      <p className="mt-2 text-sm text-gray-600">動画を選択</p>
                    </div>
                  )}
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="video/*"/>
                </div>
              </label>
            </div>
            <div className="pt-6">
              <button onClick={handleUpload} disabled={uploading || !file} className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 disabled:bg-gray-400 disabled:from-gray-400 disabled:cursor-not-allowed transform hover:scale-105 transition-transform duration-200">
                {uploading ? `解析中... ${uploadProgress}%` : "18号、頼んだ！"}
              </button>
            </div>
          </div>
        </main>
        <footer className="text-left text-sm text-gray-600 bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow-lg border border-white/50">
          <h3 className="font-bold text-base text-gray-800 mb-3">直接の指導をご希望の方へ</h3>
          <p className="mb-4">もし操作にご不明な点があったり、AIの解析だけでは物足りないと感じたりした際は、どうぞお気軽にジムへお越しください。</p>
          
          <div className="mb-4">
              <h4 className="font-semibold text-gray-700">【初めての方へ】</h4>
              <p>インストラクターがマンツーマンで指導する無料体験レッスンもご用意しております。あなたの理想のフォームへ、最短距離で近づきましょう。</p>
          </div>

          <div>
              <h4 className="font-semibold text-gray-700">【会員の皆様へ】</h4>
              <p>ジムにてインストラクターへ直接お声がけくだされば、よりパーソナルなアドバイスも可能です。いつでもお待ちしております。</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

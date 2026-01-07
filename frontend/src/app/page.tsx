'use client';

import { useEffect, useState, useRef } from 'react';
import liff from '@line/liff';

// Configuration
// In production, this should be an environment variable
// Use relative path to leverage Next.js rewrites (keeps traffic on same origin)
const API_BASE_URL = '';

export default function AIKA19Page() {
    const [status, setStatus] = useState<'initializing' | 'ready' | 'uploading' | 'processing' | 'complete' | 'error'>('initializing');
    const [profile, setProfile] = useState<any>(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const initLiff = async () => {
            try {
                // Hardcoded LIFF ID to bypass environment variable issues
                const liffId = '2008276179-XxwM2QQD';

                await liff.init({ liffId });

                if (liff.isLoggedIn()) {
                    const p = await liff.getProfile();
                    setProfile(p);
                    setStatus('ready');
                } else {
                    // Forcing login for LIFF app usage
                    if (process.env.NODE_ENV === 'development') {
                        console.warn('Dev Mode: Skipping LINE Login');
                        setProfile({ userId: 'DEV_USER_ID', displayName: 'Dev User' });
                        setStatus('ready');
                    } else {
                        liff.login();
                    }
                }
            } catch (e: any) {
                console.error('LIFF Init Error', e);
                // Fallback for local testing if not in LIFF browser
                if (process.env.NODE_ENV === 'development') {
                    setProfile({ userId: 'dev_user', displayName: 'Developer' });
                    setStatus('ready');
                } else {
                    setStatus('error');
                    setErrorMsg('LIFF初期化に失敗しました: ' + e.message);
                }
            }
        };
        initLiff();
    }, []);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        console.log('Selected file:', file.name, file.type, file.size);
        console.log('API Base URL:', API_BASE_URL);

        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            alert('画像サイズが大きすぎます（10MB以下にしてください）');
            return;
        }

        setStatus('uploading');
        setProgress(10);
        setErrorMsg('');

        try {
            // 1. Get Presigned URL
            console.log('Requesting upload URL...');
            const reqRes = await fetch(`${API_BASE_URL}/api/upload-request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileName: file.name, contentType: file.type })
            });

            console.log('Upload Request Status:', reqRes.status);

            if (!reqRes.ok) {
                const errText = await reqRes.text();
                let errMsg = `サーバー通信エラー: ${reqRes.status}`;
                try {
                    const errJson = JSON.parse(errText);
                    if (errJson.error) errMsg += ` (${errJson.error})`;
                } catch (e) {
                    errMsg += ` ${reqRes.statusText}`;
                }

                console.error('Upload Request Error Body:', errText);
                if (reqRes.status === 429) throw new Error('本日の利用枠が上限に達しました。');
                throw new Error(errMsg);
            }

            const { uploadUrl, fileKey } = await reqRes.json();
            console.log('Got upload URL for key:', fileKey);
            setProgress(30);

            // 2. Upload to R2
            console.log('Uploading to R2...');
            const uploadRes = await fetch(uploadUrl, {
                method: 'PUT',
                body: file,
                headers: { 'Content-Type': file.type }
            });

            console.log('R2 Upload Status:', uploadRes.status);

            if (!uploadRes.ok) {
                const errText = await uploadRes.text().catch(() => 'No body');
                console.error('R2 Error Body:', errText);
                throw new Error(`動画アップロードに失敗しました (R2 Status: ${uploadRes.status})`);
            }
            setProgress(70);

            setStatus('processing');

            // 3. Trigger Analysis
            console.log('Triggering analysis...');
            const analyzeRes = await fetch(`${API_BASE_URL}/api/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fileKey,
                    userId: profile?.userId || 'GUEST_USER' // Fallback for debugging
                })
            });

            console.log('Analyze Request Status:', analyzeRes.status);

            if (!analyzeRes.ok) {
                const errText = await analyzeRes.text();
                console.error('Analyze Error Body:', errText);
                if (analyzeRes.status === 429) throw new Error('本日の利用枠が上限に達しました。');
                throw new Error(`解析開始エラー: ${analyzeRes.status}`);
            }

            setProgress(100);
            setStatus('complete');

        } catch (err: any) {
            console.error('Full Error Object:', err);
            setStatus('error');
            setErrorMsg(err.message || '予期せぬエラーが発生しました');
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    // Add to state
    const [mode, setMode] = useState<'diet' | 'note' | 'consult'>('diet');
    const [noteContent, setNoteContent] = useState('');
    const [consultContent, setConsultContent] = useState('');

    // Handlers
    const handleNoteSubmit = async () => {
        if (!noteContent) return;
        setStatus('uploading');
        // Simulate API call
        setTimeout(() => {
            setStatus('complete');
            setNoteContent('');
        }, 1500);
    };

    const handleConsultSubmit = async () => {
        if (!consultContent) return;
        setStatus('uploading');
        try {
            // Need a real endpoint for this
            const res = await fetch(`${API_BASE_URL}/api/consult`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: profile?.userId || 'GUEST',
                    content: consultContent,
                    type: 'life_consultation'
                })
            });
            if (!res.ok) throw new Error('送信に失敗しました');
            setStatus('complete');
            setConsultContent('');
        } catch (e: any) {
            setStatus('error');
            setErrorMsg('送信エラー');
        }
    };

    // ... logic ...

    return (
        <div className="min-h-screen relative overflow-hidden bg-background text-text-main font-sans selection:bg-secondary selection:text-white">
            {/* Dynamic Background - Cuter Blobs */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-primary blur-[150px] opacity-10 animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full bg-secondary blur-[150px] opacity-10 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
            </div>

            <main className="relative z-10 flex flex-col items-center min-h-[100dvh] p-4 md:p-8">

                {/* Header - Cuter Typography */}
                <div className="text-center mb-8 space-y-2 animate-fade-in w-full max-w-2xl">
                    <p className="text-secondary text-xs font-bold tracking-[0.2em] uppercase opacity-90 drop-shadow-md">
                        ♥ FLAT UP GYM APP ♥
                    </p>
                    <h1 className="text-4xl md:text-6xl font-black font-heading tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-pink-100 to-gray-400 drop-shadow-2xl animate-text-glow leading-tight">
                        トータルサポート
                    </h1>
                </div>

                {/* Mode Switcher - Rounded & Bouncy */}
                <div className="grid grid-cols-3 gap-3 md:gap-6 w-full max-w-lg mb-8">
                    <button
                        onClick={() => { setMode('diet'); setStatus('ready'); }}
                        className={`p-4 rounded-3xl border backdrop-blur-md transition-all duration-300 flex flex-col items-center gap-2 hover:scale-105 active:scale-95 ${mode === 'diet' ? 'bg-primary/20 border-primary shadow-[0_0_20px_rgba(255,215,0,0.4)] ring-2 ring-primary/50' : 'bg-white/5 border-white/20 hover:bg-white/10'}`}
                    >
                        <div className="text-3xl filter drop-shadow-lg transform transition-transform group-hover:rotate-12">🥗</div>
                        <span className="text-[10px] md:text-xs font-bold tracking-wider text-white">食事管理</span>
                    </button>
                    <button
                        onClick={() => { setMode('note'); setStatus('ready'); }}
                        className={`p-4 rounded-3xl border backdrop-blur-md transition-all duration-300 flex flex-col items-center gap-2 hover:scale-105 active:scale-95 ${mode === 'note' ? 'bg-sporty-green/20 border-sporty-green shadow-[0_0_20px_rgba(0,255,157,0.4)] ring-2 ring-sporty-green/50' : 'bg-white/5 border-white/20 hover:bg-white/10'}`}
                    >
                        <div className="text-3xl filter drop-shadow-lg transform transition-transform group-hover:rotate-12">📝</div>
                        <span className="text-[10px] md:text-xs font-bold tracking-wider text-white">練習ノート</span>
                    </button>
                    <button
                        onClick={() => { setMode('consult'); setStatus('ready'); }}
                        className={`p-4 rounded-3xl border backdrop-blur-md transition-all duration-300 flex flex-col items-center gap-2 hover:scale-105 active:scale-95 ${mode === 'consult' ? 'bg-secondary/20 border-secondary shadow-[0_0_20px_rgba(255,85,221,0.4)] ring-2 ring-secondary/50' : 'bg-white/5 border-white/20 hover:bg-white/10'}`}
                    >
                        <div className="text-3xl filter drop-shadow-lg transform transition-transform group-hover:rotate-12">💌</div>
                        <span className="text-[10px] md:text-xs font-bold tracking-wider text-white">お悩み相談</span>
                    </button>
                </div>

                {/* Dynamic Main Card - Super Rounded */}
                <div className="w-full max-w-lg glass-card rounded-[2.5rem] p-1.5 bg-gradient-to-br from-white/20 via-white/5 to-transparent animate-slide-up flex-grow h-full max-h-[65vh] flex flex-col shadow-2xl">
                    <div className="bg-black/40 backdrop-blur-xl rounded-[2.2rem] p-6 md:p-8 flex flex-col items-center text-center border border-white/10 relative overflow-hidden flex-grow h-full w-full">

                        <div className="absolute inset-0 pointer-events-none opacity-20 scanline"></div>

                        {/* ERROR / LOADING COMMON UI */}
                        {status === 'initializing' && (
                            <div className="flex flex-col items-center gap-4 py-8 m-auto">
                                <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-xs font-mono text-secondary animate-pulse">準備中...</span>
                            </div>
                        )}

                        {/* ---------------- DIET MODE ---------------- */}
                        {mode === 'diet' && status === 'ready' && (
                            <div className="flex flex-col items-center justify-center flex-grow w-full space-y-6 animate-fade-in">
                                <div className="space-y-3">
                                    <div className="inline-block px-4 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold tracking-widest mb-2">
                                        AI ANALYSIS
                                    </div>
                                    <h2 className="text-3xl font-black text-white font-heading tracking-tight drop-shadow-lg">
                                        食事サポート
                                    </h2>
                                    <p className="text-sm text-gray-300 font-medium">
                                        もっと可愛く、もっと健康に。<br />写真一枚でAIがサポートします。
                                    </p>
                                </div>
                                <div className="relative group cursor-pointer w-full max-w-xs" onClick={triggerFileInput}>
                                    <div className="absolute -inset-1 bg-gradient-to-r from-primary via-white to-secondary rounded-[2rem] blur opacity-40 group-hover:opacity-80 transition duration-500 animate-pulse-slow"></div>
                                    <button className="relative w-full py-8 px-6 bg-black/80 hover:bg-black/90 border border-white/20 rounded-[2rem] flex flex-col items-center justify-center gap-4 transition-all duration-300 group-hover:border-white/50 group-hover:scale-[1.02]">
                                        <div className="w-16 h-16 bg-gradient-to-br from-white/10 to-transparent rounded-full flex items-center justify-center border border-white/20 group-hover:bg-primary/20 group-hover:text-primary transition-colors shadow-inner">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path></svg>
                                        </div>
                                        <span className="text-sm font-bold tracking-widest text-white group-hover:text-primary transition-colors">写真を選択</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ---------------- NOTE MODE ---------------- */}
                        {mode === 'note' && status === 'ready' && (
                            <div className="flex flex-col items-center justify-center flex-grow w-full space-y-4 animate-fade-in">
                                <div className="space-y-2">
                                    <div className="inline-block px-4 py-1 rounded-full bg-sporty-green/20 border border-sporty-green/30 text-sporty-green text-xs font-bold tracking-widest mb-2">
                                        RECORD
                                    </div>
                                    <h2 className="text-3xl font-black text-white font-heading tracking-tight">練習ノート</h2>
                                    <p className="text-sm text-gray-300">今日の頑張りを記録しよう！</p>
                                </div>
                                <textarea
                                    className="w-full flex-grow bg-white/5 border border-white/20 rounded-3xl p-5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-sporty-green focus:bg-white/10 transition-all resize-none mb-2"
                                    placeholder="例：今日はキックの練習をした！右ストレートが上手く打てた気がする。"
                                    value={noteContent}
                                    onChange={(e) => setNoteContent(e.target.value)}
                                ></textarea>
                                <button
                                    onClick={handleNoteSubmit}
                                    disabled={!noteContent}
                                    className="w-full py-4 bg-gradient-to-r from-sporty-green to-emerald-500 rounded-full font-bold text-black text-sm tracking-widest shadow-lg shadow-sporty-green/20 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95 transition-all"
                                >
                                    記録を保存
                                </button>
                            </div>
                        )}

                        {/* ---------------- CONSULT MODE ---------------- */}
                        {mode === 'consult' && status === 'ready' && (
                            <div className="flex flex-col items-center justify-center flex-grow w-full space-y-4 animate-fade-in">
                                <div className="space-y-2">
                                    <div className="inline-block px-4 py-1 rounded-full bg-secondary/20 border border-secondary/30 text-secondary text-xs font-bold tracking-widest mb-2">
                                        SECRET TALK
                                    </div>
                                    <h2 className="text-3xl font-black text-white font-heading tracking-tight">人生・お悩み相談</h2>
                                    <p className="text-sm text-gray-300">どんなお悩みも、こっそり聞きます。</p>
                                </div>
                                <textarea
                                    className="w-full flex-grow bg-white/5 border border-white/20 rounded-3xl p-5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-secondary focus:bg-white/10 transition-all resize-none mb-2"
                                    placeholder="恋愛、仕事、人生... 言いにくいこともここなら安心。"
                                    value={consultContent}
                                    onChange={(e) => setConsultContent(e.target.value)}
                                ></textarea>
                                <button
                                    onClick={handleConsultSubmit}
                                    disabled={!consultContent}
                                    className="w-full py-4 bg-gradient-to-r from-secondary to-purple-600 rounded-full font-bold text-white text-sm tracking-widest shadow-lg shadow-secondary/20 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95 transition-all"
                                >
                                    相談を送る
                                </button>
                            </div>
                        )}


                        {/* ---------------- COMMON: UPLOADING / PROCESSING UI ---------------- */}
                        {(status === 'uploading' || status === 'processing') && (
                            <div className="flex flex-col items-center justify-center flex-grow w-full space-y-8 animate-fade-in">
                                <div className="relative w-24 h-24">
                                    <div className={`absolute inset-0 border-[6px] rounded-full animate-spin border-t-transparent ${mode === 'diet' ? 'border-primary' : mode === 'note' ? 'border-sporty-green' : 'border-secondary'}`}></div>
                                    <div className={`absolute inset-4 rounded-full animate-bounce ${mode === 'diet' ? 'bg-primary' : mode === 'note' ? 'bg-sporty-green' : 'bg-secondary'}`}></div>
                                </div>
                                <h3 className="text-2xl font-black font-heading tracking-widest animate-pulse">
                                    {mode === 'diet' ? '考え中...' : '保存中...'}
                                </h3>
                            </div>
                        )}

                        {/* ---------------- COMMON: COMPLETE UI ---------------- */}
                        {status === 'complete' && (
                            <div className="flex flex-col items-center justify-center flex-grow w-full space-y-6 animate-fade-in">
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 shadow-[0_0_30px_rgba(0,0,0,0.3)] animate-float ${mode === 'diet' ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-blue-500/20 border-blue-500 text-blue-400'}`}>
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                                <div className="text-center space-y-3">
                                    <h3 className="text-3xl font-black font-heading text-white">送信完了！</h3>
                                    <p className="text-sm text-gray-300">
                                        {mode === 'diet' ? 'LINEに結果を送ったよ！' : 'ばっちり記録しました！'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => { setStatus('ready'); }}
                                    className="mt-8 px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold tracking-widest text-white transition-all transform hover:scale-105"
                                >
                                    OK
                                </button>
                            </div>
                        )}

                        {/* Error UI */}
                        {status === 'error' && (
                            <div className="flex flex-col items-center justify-center flex-grow w-full space-y-4 animate-shake">
                                <div className="text-red-400 font-bold text-2xl font-heading">エラー発生...</div>
                                <p className="text-xs text-red-200 bg-red-500/20 px-4 py-2 rounded-lg">{errorMsg}</p>
                                <button onClick={() => setStatus('ready')} className="px-6 py-2 bg-red-500 hover:bg-red-400 rounded-full text-white text-xs font-bold shadow-lg">もう一度</button>
                            </div>
                        )}

                        <input
                            type="file"
                            accept="image/jpeg, image/png, image/heic, image/webp"
                            capture="environment"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                        />
                    </div>
                </div>

                {/* Footer info */}
                <div className="mt-8 text-[10px] text-gray-500 font-mono tracking-widest uppercase flex items-center space-x-3 opacity-90 transition-opacity">
                    <span>Powered by Gemini</span>
                    <span className="text-secondary">♥</span>
                    <span>FLAT UP GYM AI</span>
                </div>

            </main>
        </div>
    );
}

'use client';

import { useEffect, useState, useRef, FormEvent } from 'react';
import liff from '@line/liff';

// Configuration
const API_BASE_URL = '';

type Message = {
    id: string;
    role: 'user' | 'assistant';
    type: 'text' | 'image';
    content: string; // Text content or Image URL (blob/base64)
    timestamp: number;
    status?: 'sending' | 'sent' | 'error';
};

export default function AIKA19Page() {
    const [status, setStatus] = useState<'initializing' | 'ready' | 'uploading' | 'processing' | 'error'>('initializing');
    const [profile, setProfile] = useState<any>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial Greeting
    useEffect(() => {
        setMessages([
            {
                id: 'welcome',
                role: 'assistant',
                type: 'text',
                content: 'こんにちは！AIKAです。\n食事の写真や、お悩みを送ってくださいね。',
                timestamp: Date.now()
            }
        ]);
    }, []);

    // LIFF Init
    useEffect(() => {
        const initLiff = async () => {
            try {
                const liffId = '2008276179-XxwM2QQD';
                await liff.init({ liffId });
                if (liff.isLoggedIn()) {
                    setProfile(await liff.getProfile());
                    setStatus('ready');
                } else {
                    if (process.env.NODE_ENV === 'development') {
                        setProfile({ userId: 'DEV_USER', displayName: 'Dev User' });
                        setStatus('ready');
                    } else {
                        liff.login();
                    }
                }
            } catch (e) {
                if (process.env.NODE_ENV === 'development') {
                    setProfile({ userId: 'dev_user', displayName: 'Developer' });
                    setStatus('ready');
                } else {
                    setStatus('error');
                }
            }
        };
        initLiff();
    }, []);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Handle Text Send
    const handleSendMessage = async (e?: FormEvent) => {
        e?.preventDefault();
        if (!inputText.trim() || status === 'uploading') return;

        const text = inputText;
        setInputText('');

        // Add User Message
        const userMsgId = Date.now().toString();
        setMessages(prev => [...prev, {
            id: userMsgId,
            role: 'user',
            type: 'text',
            content: text,
            timestamp: Date.now(),
            status: 'sending'
        }]);

        try {
            // Call Consult API
            const res = await fetch(`${API_BASE_URL}/api/consult`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: profile?.userId || 'GUEST',
                    content: text,
                    type: 'chat_message'
                })
            });

            if (!res.ok) throw new Error('Failed to send');

            // Update status
            setMessages(prev => prev.map(m => m.id === userMsgId ? { ...m, status: 'sent' } : m));

            // Simulate Reply (or use real response if API returns one)
            // Ideally API returns the AI response. For now, let's mock or use what API returns if any.
            // The current Consult API triggers LINE push. 
            // We should ideally show a "Sent to Note" confirmation if it's a note, or an AI reply.
            // For this UI, let's show a generic "Received" or wait for real implementation.

            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    role: 'assistant',
                    type: 'text',
                    content: 'メッセージを受け取りました！',
                    timestamp: Date.now()
                }]);
            }, 1000);

        } catch (error) {
            setMessages(prev => prev.map(m => m.id === userMsgId ? { ...m, status: 'error' } : m));
        }
    };

    // Handle Image Select
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview Image
        const previewUrl = URL.createObjectURL(file);
        const msgId = Date.now().toString();

        setMessages(prev => [...prev, {
            id: msgId,
            role: 'user',
            type: 'image',
            content: previewUrl,
            timestamp: Date.now(),
            status: 'sending'
        }]);

        setStatus('uploading');

        try {
            // 1. Get Presigned URL
            const reqRes = await fetch(`${API_BASE_URL}/api/upload-request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileName: file.name, contentType: file.type })
            });
            if (!reqRes.ok) throw new Error('Upload init failed');
            const { uploadUrl, fileKey } = await reqRes.json();

            // 2. Upload
            await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });

            // 3. Analyze
            setStatus('processing');
            // Add temporary AI "thinking" message
            const thinkingId = 'thinking_' + Date.now();
            setMessages(prev => [...prev, {
                id: thinkingId,
                role: 'assistant',
                type: 'text',
                content: '解析中... 🥗',
                timestamp: Date.now()
            }]);

            const analyzeRes = await fetch(`${API_BASE_URL}/api/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileKey, userId: profile?.userId || 'GUEST' })
            });

            if (!analyzeRes.ok) throw new Error('Analysis failed');

            // Ideally API returns JSON with text. 
            // Current `api/analyze` returns {success:true} and sends LINE.
            // We should update `api/analyze` to return text OR just show "Sent to LINE" here.
            // For now, let's look at `api/analyze`... it calls `lineService.pushMessage`.
            // We can change the UI to say "Sent to LINE".

            setMessages(prev => prev.filter(m => m.id !== thinkingId)); // Remove thinking
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'assistant',
                type: 'text',
                content: '解析完了！LINEに詳しい結果を送りました。確認してみてね！',
                timestamp: Date.now()
            }]);

            setStatus('ready');

        } catch (error) {
            console.error(error);
            setStatus('error');
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'assistant',
                type: 'text',
                content: 'ごめんなさい、エラーが発生しました。',
                timestamp: Date.now()
            }]);
        }
    };

    return (
        <div className="flex flex-col h-[100dvh] bg-black text-white font-sans overflow-hidden relative">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500 blur-[120px] opacity-20 animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pink-500 blur-[120px] opacity-20 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
            </div>

            {/* Header */}
            <header className="z-10 p-4 border-b border-white/10 backdrop-blur-md bg-black/50 flex items-center justify-between sticky top-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 p-[2px]">
                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                            <span className="text-xl">🤖</span>
                        </div>
                    </div>
                    <div>
                        <h1 className="font-bold text-sm tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-pink-200">
                            AIKA 19
                        </h1>
                        <p className="text-[10px] text-gray-400 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Online
                        </p>
                    </div>
                </div>
            </header>

            {/* Chat Area */}
            <main className="flex-1 overflow-y-auto p-4 space-y-4 z-10 scroll-smooth">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                    >
                        <div className={`max-w-[80%] rounded-2xl p-4 shadow-lg backdrop-blur-sm ${msg.role === 'user'
                                ? 'bg-gradient-to-br from-blue-600/80 to-purple-600/80 text-white rounded-tr-sm'
                                : 'bg-white/10 border border-white/10 text-gray-100 rounded-tl-sm'
                            }`}>
                            {msg.type === 'image' ? (
                                <img src={msg.content} alt="Upload" className="rounded-lg max-h-48 object-cover border border-white/20" />
                            ) : (
                                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                            )}
                            <div className={`text-[10px] mt-1 opacity-50 flex items-center gap-1 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                {msg.status === 'sending' && <span>• 送信中</span>}
                                {msg.status === 'error' && <span className="text-red-300">• エラー</span>}
                            </div>
                        </div>
                    </div>
                ))}

                {status === 'processing' && (
                    <div className="flex justify-start animate-fade-in">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 rounded-tl-sm flex gap-2 items-center">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </main>

            {/* Input Area */}
            <footer className="z-10 p-4 pb-8 bg-black/80 backdrop-blur-xl border-t border-white/10">
                <form onSubmit={handleSendMessage} className="flex gap-3 items-end max-w-2xl mx-auto">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-blue-300 transition-colors"
                        disabled={status !== 'ready' && status !== 'error'}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </button>

                    <div className="flex-1 bg-white/5 rounded-2xl border border-white/10 focus-within:border-blue-500/50 transition-colors relative">
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="メッセージを入力..."
                            className="w-full bg-transparent border-none p-3 max-h-32 min-h-[48px] resize-none focus:ring-0 text-white placeholder-gray-500 text-sm"
                            rows={1}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!inputText.trim() || status !== 'ready' && status !== 'error'}
                        className="p-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 transition-all"
                    >
                        <svg className="w-5 h-5 translate-x-[1px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                    </button>
                </form>

                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                />
            </footer>
        </div>
    );
}

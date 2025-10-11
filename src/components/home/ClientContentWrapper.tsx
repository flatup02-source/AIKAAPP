// components/home/ClientContentWrapper.tsx
"use client"; // ★重要: この行を追加して、このコンポーネントがClient Componentであることを宣言します

import dynamic from 'next/dynamic';
import React from 'react';

// ClientContentを動的にインポートし、サーバーサイドレンダリングを無効にする
// '@/components/home/ClientContent' は、ClientContentコンポーネントが実際に存在するパスに合わせてください。
const ClientContent = dynamic(() => import('./ClientContent'), { ssr: false });

export default function ClientContentWrapper() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      {/* ClientContent は、ここ（Client Component内）で動的にインポートされます */}
      <ClientContent />
    </React.Suspense>
  );
}
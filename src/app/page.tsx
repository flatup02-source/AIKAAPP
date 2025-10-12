// app/page.tsx
// (このファイルには "use client"; は不要です。Server Componentのままにします)

import ClientContentWrapper from '@/components/home/ClientContentWrapper';
// import dynamic from 'next/dynamic'; // これはもう不要なので削除します

export default function HomePage() {
  return (
    <main>
      {/* Server Component の中に Client Component ラッパーを配置 */}
      <ClientContentWrapper />
    </main>
  );
}
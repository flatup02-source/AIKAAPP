"use client";

import { useEffect } from "react";

// 最小限のテストページ - 段階的に問題を特定
export default function TestPage() {
  useEffect(() => {
    console.log("✅ TestPage: コンポーネントがマウントされました");
    console.log("✅ TestPage: React レンダリング成功");
    console.log("✅ TestPage: ブラウザ環境:", typeof window !== 'undefined' ? 'はい' : 'いいえ');
    console.log("✅ TestPage: 現在のURL:", typeof window !== 'undefined' ? window.location.href : 'N/A');
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '20px',
      backgroundColor: '#f0f0f0',
      color: '#000'
    }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        テストページ - 基本レンダリング確認
      </h1>
      <p style={{ fontSize: '16px', marginBottom: '10px' }}>
        このページが表示されれば、基本的なレンダリングは動作しています。
      </p>
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#fff', 
        border: '2px solid #000',
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>現在の状態:</h2>
        <ul style={{ listStyle: 'disc', paddingLeft: '20px' }}>
          <li>JavaScript: 実行中</li>
          <li>React: レンダリング成功</li>
          <li>スタイル: インライン適用</li>
        </ul>
      </div>
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
        <p style={{ fontSize: '14px', color: '#1976d2' }}>
          <strong>次のステップ:</strong> このページが表示されたら、段階的に機能を追加していきます。
        </p>
      </div>
    </div>
  );
}

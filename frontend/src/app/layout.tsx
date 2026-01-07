import type { Metadata } from "next";
import { Orbitron, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FLAT UP GYM DIET AI | 世界一優しいAI食事管理",
  description: "写真を撮るだけでAIがカロリー計算と栄養アドバイス。運動経験ゼロでも安心のパーソナルジムが提供する、最先端の食事サポート。",
};

export const viewport = "width=device-width, initial-scale=1.0, maximum-scale=1.0";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${orbitron.variable} ${notoSansJP.variable}`}>
      <body className="antialiased selection:bg-primary selection:text-black">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
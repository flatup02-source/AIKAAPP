import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AIKA 18号 バトルスカウター",
  description: "あなたのフォームの戦闘力を測定します",
  viewport: "width=device-width, initial-scale=1.0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      {/* ↓↓ ここに className="bg-gray-900" を追加したぞ！ ↓↓ */}
      <body className={`${inter.className} bg-gray-900`}>
        {children}
      </body>
    </html>
  );
}
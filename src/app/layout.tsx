import type { Metadata } from "next";
import { Orbitron, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-orbitron",
});

const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
  title: "AIKA BATTLE SCOUTER",
  description: "お前の力、AIKAに見せる覚悟はあるか？",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${orbitron.variable} ${notoSansJp.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

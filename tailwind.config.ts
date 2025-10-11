import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#0057FF', // メインのブランドカラー
        'accent-orange': '#FF7A00', // アクセントカラー（ボタンなど）
        'sporty-green': '#00C48C', // ポジティブな要素を強調
        'light-gray': '#F3F4F6',   // 背景色
        'dark-text': '#1F2937',    // 基本のテキストカラー
      },
      fontFamily: {
        sans: ['"Helvetica Neue"', 'Arial', '"Hiragino Kaku Gothic ProN"', '"Hiragino Sans"', 'Meiryo', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config

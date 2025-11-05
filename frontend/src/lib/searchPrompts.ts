/**
 * Sora2ウォーターマーク問題に関する検索プロンプト
 */
export const SORA2_WATERMARK_SEARCH_PROMPT = `私はsora2で動画を作ってるクリエイターです、sora2で動画を生成するとウォーターマークが入ります、私以外にも同じような問題を遭遇したクリエイターがいると思うのでその人たちがどのように問題を解決したかインターネットで調べてください`;

/**
 * 検索クエリを生成する関数
 */
export function generateSearchQuery(additionalContext?: string): string {
  const basePrompt = SORA2_WATERMARK_SEARCH_PROMPT;
  
  if (additionalContext) {
    return `${basePrompt}\n\n追加情報: ${additionalContext}`;
  }
  
  return basePrompt;
}

/**
 * より具体的な検索クエリを生成する関数
 */
export function generateDetailedSearchQuery(): string {
  return `Sora2で生成された動画のウォーターマークを削除する方法、または回避する方法について、他のクリエイターがどのように解決したかを調べてください。解決策には以下のようなものが含まれる可能性があります：
- 動画編集ソフトを使用したウォーターマークの除去
- Sora2のAPI設定やオプションによるウォーターマークの無効化
- 代替の動画生成ツールの使用
- ウォーターマークを隠すためのクリエイティブな方法
- コミュニティやフォーラムでの議論や解決策`;
}

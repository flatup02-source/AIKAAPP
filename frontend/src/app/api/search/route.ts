import { NextRequest, NextResponse } from 'next/server';
import { generateSearchQuery } from '../../../lib/searchPrompts';

/**
 * 検索APIエンドポイント
 * インターネット検索を実行して、Sora2のウォーターマーク問題の解決策を探します
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, additionalContext } = body;

    // 検索プロンプトを生成
    const searchPrompt = additionalContext 
      ? generateSearchQuery(additionalContext)
      : query || generateSearchQuery();

    // ここで実際の検索APIを呼び出す
    // 例: Google Custom Search API, Perplexity API, Tavily APIなど
    // 現在はモックレスポンスを返します
    
    // TODO: 実際の検索APIを統合する
    // const searchResults = await performWebSearch(searchPrompt);
    
    // モックレスポンス
    const mockResults = {
      query: searchPrompt,
      results: [
        {
          title: "Sora2ウォーターマーク問題の解決策 - クリエイターコミュニティ",
          url: "https://example.com/sora2-watermark-solution",
          snippet: "多くのクリエイターがSora2のウォーターマーク問題に直面しています。動画編集ソフトを使用してウォーターマークを除去する方法が一般的です。",
        },
        {
          title: "Sora2 API設定でウォーターマークを無効化する方法",
          url: "https://example.com/sora2-api-settings",
          snippet: "Sora2のAPI設定を変更することで、ウォーターマークを無効化できる可能性があります。",
        },
        {
          title: "動画編集でウォーターマークを削除するチュートリアル",
          url: "https://example.com/video-editing-tutorial",
          snippet: "After EffectsやPremiere Proを使用してウォーターマークを除去する方法を解説しています。",
        },
      ],
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: mockResults,
    });
  } catch (error: any) {
    console.error('検索エラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || '検索中にエラーが発生しました',
      },
      { status: 500 }
    );
  }
}

/**
 * GETリクエストでの検索プロンプト取得
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    prompt: generateSearchQuery(),
  });
}

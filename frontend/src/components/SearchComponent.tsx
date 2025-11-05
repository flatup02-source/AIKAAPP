import React, { useState } from 'react';
import { LogLevel } from '../types';

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

interface SearchComponentProps {
  onSearchComplete?: (results: SearchResult[]) => void;
  addLog?: (level: LogLevel, message: string) => void;
}

const SearchComponent: React.FC<SearchComponentProps> = ({ onSearchComplete, addLog }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [additionalContext, setAdditionalContext] = useState('');

  const handleSearch = async () => {
    setIsSearching(true);
    setResults([]);
    
    if (addLog) {
      addLog(LogLevel.INFO, 'Sora2ウォーターマーク問題の解決策を検索中...');
    }

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          additionalContext: additionalContext || undefined,
        }),
      });

      const data = await response.json();

      if (data.success && data.data.results) {
        setResults(data.data.results);
        
        if (addLog) {
          addLog(
            LogLevel.SUCCESS,
            `${data.data.results.length}件の検索結果が見つかりました`
          );
        }
        
        if (onSearchComplete) {
          onSearchComplete(data.data.results);
        }
      } else {
        throw new Error(data.error || '検索に失敗しました');
      }
    } catch (error: any) {
      const errorMessage = error.message || '検索中にエラーが発生しました';
      
      if (addLog) {
        addLog(LogLevel.ERROR, `検索エラー: ${errorMessage}`);
      }
      
      console.error('検索エラー:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 w-full space-y-4">
      <h2 className="text-xl font-semibold text-gray-100 mb-4">
        Sora2ウォーターマーク問題の解決策を検索
      </h2>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            検索プロンプト（自動生成）
          </label>
          <div className="bg-gray-900 p-3 rounded-md text-sm text-gray-400 border border-gray-700">
            私はsora2で動画を作ってるクリエイターです、sora2で動画を生成するとウォーターマークが入ります、私以外にも同じような問題を遭遇したクリエイターがいると思うのでその人たちがどのように問題を解決したかインターネットで調べてください
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            追加情報（オプション）
          </label>
          <textarea
            value={additionalContext}
            onChange={(e) => setAdditionalContext(e.target.value)}
            placeholder="追加の情報や具体的な質問があれば入力してください..."
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            disabled={isSearching}
          />
        </div>

        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="w-full px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-md hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSearching ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              検索中...
            </div>
          ) : (
            '解決策を検索'
          )}
        </button>
      </div>

      {results.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-100">
            検索結果 ({results.length}件)
          </h3>
          <div className="space-y-3">
            {results.map((result, index) => (
              <div
                key={index}
                className="bg-gray-900 border border-gray-700 rounded-md p-4 hover:border-blue-500 transition-colors"
              >
                <h4 className="text-base font-semibold text-blue-400 mb-2">
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {result.title}
                  </a>
                </h4>
                <p className="text-sm text-gray-400 line-clamp-3">
                  {result.snippet}
                </p>
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 hover:text-blue-400 mt-2 inline-block"
                >
                  続きを読む →
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;

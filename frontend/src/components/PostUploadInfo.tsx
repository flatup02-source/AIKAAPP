import React from 'react';

interface PostUploadInfoProps {
  status: 'idle' | 'loading' | 'success' | 'error';
  payload: object;
  errorDetails?: string;
}

const PostUploadInfo: React.FC<PostUploadInfoProps> = ({ status, payload, errorDetails }) => {
  if (status === 'idle') {
    return null;
  }

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="flex items-center justify-center text-blue-400">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>処理中...</span>
          </div>
        );
      case 'success':
        return (
          <div className="text-green-400">
            <p className="font-semibold">API呼び出し成功！</p>
            <pre className="bg-gray-700 p-2 rounded text-sm mt-2 overflow-x-auto">
              {JSON.stringify(payload, null, 2)}
            </pre>
          </div>
        );
      case 'error':
        return (
          <div className="text-red-400">
            <p className="font-semibold">エラーが発生しました。</p>
            {errorDetails && (
              <pre className="bg-gray-700 p-2 rounded text-sm mt-2 overflow-x-auto">
                {errorDetails}
              </pre>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl bg-gray-800 border border-gray-700 rounded-lg p-4 mt-4 shadow-lg animate-fade-in">
      <h2 className="text-xl font-semibold mb-4 text-gray-100">アップロード後情報</h2>
      {renderContent()}
    </div>
  );
};

export default PostUploadInfo;
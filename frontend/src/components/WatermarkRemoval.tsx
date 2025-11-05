import React, { useState, useRef } from 'react';
import { LogLevel } from '../types';

interface WatermarkRemovalProps {
  onProcessComplete?: (processedVideoUrl: string) => void;
  addLog?: (level: LogLevel, message: string) => void;
}

const WatermarkRemoval: React.FC<WatermarkRemovalProps> = ({ onProcessComplete, addLog }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string | null>(null);
  const [watermarkRegion, setWatermarkRegion] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setProcessedVideoUrl(null);
      
      // プレビューURLを作成
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      if (addLog) {
        addLog(LogLevel.INFO, `動画ファイル「${file.name}」を選択しました`);
      }
    }
  };

  const handleRemoveWatermark = async () => {
    if (!selectedFile) {
      if (addLog) {
        addLog(LogLevel.WARN, '動画ファイルを選択してください');
      }
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setProcessedVideoUrl(null);

    if (addLog) {
      addLog(LogLevel.INFO, 'ウォーターマーク削除処理を開始します...');
    }

    try {
      const formData = new FormData();
      formData.append('video', selectedFile);
      formData.append('watermarkRegion', JSON.stringify(watermarkRegion));

      // 進捗をシミュレート（実際の実装では、サーバーサイドから進捗を取得）
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 500);

      const response = await fetch('/api/remove-watermark', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'ウォーターマーク削除に失敗しました');
      }

      // 処理された動画をBlobとして取得
      const blob = await response.blob();
      const processedUrl = URL.createObjectURL(blob);
      setProcessedVideoUrl(processedUrl);

      if (addLog) {
        addLog(LogLevel.SUCCESS, 'ウォーターマーク削除が完了しました！');
      }

      if (onProcessComplete) {
        onProcessComplete(processedUrl);
      }
    } catch (error: any) {
      const errorMessage = error.message || 'ウォーターマーク削除中にエラーが発生しました';
      
      if (addLog) {
        addLog(LogLevel.ERROR, `エラー: ${errorMessage}`);
      }
      
      console.error('ウォーターマーク削除エラー:', error);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleDownload = () => {
    if (!processedVideoUrl || !selectedFile) return;
    
    const a = document.createElement('a');
    a.href = processedVideoUrl;
    a.download = `watermark-removed-${selectedFile.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 w-full space-y-4">
      <h2 className="text-xl font-semibold text-gray-100 mb-4">
        Sora 2 ウォーターマーク削除
      </h2>

      <div className="space-y-4">
        {/* ファイル選択 */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            動画ファイルを選択
          </label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="video/*"
            className="hidden"
            disabled={isProcessing}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {selectedFile ? selectedFile.name : '動画ファイルを選択'}
          </button>
        </div>

        {/* プレビュー */}
        {previewUrl && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              元の動画プレビュー
            </label>
            <video
              ref={videoRef}
              src={previewUrl}
              controls
              className="w-full max-h-64 rounded-md bg-black"
            />
          </div>
        )}

        {/* ウォーターマーク領域の設定（オプション） */}
        <div className="bg-gray-900 p-4 rounded-md border border-gray-700">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            ウォーターマーク領域の設定（オプション）
          </label>
          <p className="text-xs text-gray-400 mb-3">
            自動検出を使用する場合は、そのまま処理を実行してください。
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <label className="text-gray-400">X座標</label>
              <input
                type="number"
                value={watermarkRegion.x}
                onChange={(e) =>
                  setWatermarkRegion({ ...watermarkRegion, x: parseInt(e.target.value) || 0 })
                }
                className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded text-gray-200"
                disabled={isProcessing}
              />
            </div>
            <div>
              <label className="text-gray-400">Y座標</label>
              <input
                type="number"
                value={watermarkRegion.y}
                onChange={(e) =>
                  setWatermarkRegion({ ...watermarkRegion, y: parseInt(e.target.value) || 0 })
                }
                className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded text-gray-200"
                disabled={isProcessing}
              />
            </div>
            <div>
              <label className="text-gray-400">幅</label>
              <input
                type="number"
                value={watermarkRegion.width}
                onChange={(e) =>
                  setWatermarkRegion({ ...watermarkRegion, width: parseInt(e.target.value) || 0 })
                }
                className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded text-gray-200"
                disabled={isProcessing}
              />
            </div>
            <div>
              <label className="text-gray-400">高さ</label>
              <input
                type="number"
                value={watermarkRegion.height}
                onChange={(e) =>
                  setWatermarkRegion({ ...watermarkRegion, height: parseInt(e.target.value) || 0 })
                }
                className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded text-gray-200"
                disabled={isProcessing}
              />
            </div>
          </div>
        </div>

        {/* 処理ボタン */}
        <button
          onClick={handleRemoveWatermark}
          disabled={!selectedFile || isProcessing}
          className="w-full px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-md hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              処理中... ({progress}%)
            </div>
          ) : (
            'ウォーターマークを削除'
          )}
        </button>

        {/* 進捗バー */}
        {isProcessing && (
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* 処理済み動画 */}
        {processedVideoUrl && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              処理済み動画
            </label>
            <video
              src={processedVideoUrl}
              controls
              className="w-full max-h-64 rounded-md bg-black"
            />
            <button
              onClick={handleDownload}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              動画をダウンロード
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatermarkRemoval;

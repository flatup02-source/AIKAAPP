// 対象のAPIファイル (例: src/app/api/analyze/route.ts)

import { PredictionServiceClient } from '@google-cloud/aiplatform';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function POST(req: Request) {
  try {
    // --- ▼▼▼【最終版】認証コード ▼▼▼ ---

    // 1. ビルド時に作成された認証情報ファイル（中身はBase64）を読み込む
    let credentials;
    try {
      const credentialsPath = join(process.cwd(), 'google-credentials.json');
      const credentialsBase64 = readFileSync(credentialsPath, 'utf8');
      
      // 2. Base64文字列を、元のJSON文字列にデコード（復元）する
      const credentialsJsonString = Buffer.from(credentialsBase64.trim(), 'base64').toString('utf8');
      
      // 3. デコードしたJSON文字列を、JavaScriptオブジェクトに変換（パース）する
      credentials = JSON.parse(credentialsJsonString);
    } catch (fileError) {
      console.error('致命的エラー: 認証情報ファイル `google-credentials.json` が見つからないか、読み込みに失敗しました。', fileError);
      return new Response(JSON.stringify({
        error: "サーバー設定エラー: 認証情報が正しく設定されていません。"
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 4. Vertex AIクライアントを初期化する
    const clientOptions = {
      apiEndpoint: 'asia-northeast1-aiplatform.googleapis.com',
      credentials,
    };
    const predictionServiceClient = new PredictionServiceClient(clientOptions);
    
    // --- ▲▲▲ 認証コードここまで ▲▲▲ ---


    // --- これ以降に、あなたのAI分析処理を記述します ---
    // 例: const body = await req.json();
    // 例: const [response] = await predictionServiceClient.predict(...);
    

    // 処理が成功した場合、クライアントに結果を返す
    return new Response(JSON.stringify({
      message: "分析に成功しました。",
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    // 予期せぬエラーを処理する
    console.error('予期せぬエラーが発生しました:', error);
    return new Response(JSON.stringify({
      error: "サーバー内部で予期せぬエラーが発生しました。",
      details: error instanceof Error ? error.message : "不明なエラー",
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
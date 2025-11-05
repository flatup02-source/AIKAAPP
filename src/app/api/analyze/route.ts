import { NextRequest, NextResponse } from "next/server";
import { PredictionServiceClient } from "@google-cloud/aiplatform";
import { getAuthClientFromEnv } from "@/lib/gcloud";

export async function POST(req: NextRequest) {
  try {
    // 認証クライアントを取得（非推奨のcredentials直接指定を避ける）
    const authClient = await getAuthClientFromEnv([
      "https://www.googleapis.com/auth/cloud-platform",
    ]);

    // Vertex AIクライアントを初期化
    const predictionServiceClient = new PredictionServiceClient({
      apiEndpoint: "asia-northeast1-aiplatform.googleapis.com",
      auth: authClient,
    });

    // リクエストボディを取得
    const body = await req.json();

    // ここにAI分析処理を記述
    // 例: const [response] = await predictionServiceClient.predict(...);

    // 処理が成功した場合、クライアントに結果を返す
    return NextResponse.json(
      {
        message: "分析に成功しました。",
      },
      { status: 200 }
    );
  } catch (error) {
    // 予期せぬエラーを処理する
    console.error("予期せぬエラーが発生しました:", error);
    return NextResponse.json(
      {
        error: "サーバー内部で予期せぬエラーが発生しました。",
        details: error instanceof Error ? error.message : "不明なエラー",
      },
      { status: 500 }
    );
  }
}

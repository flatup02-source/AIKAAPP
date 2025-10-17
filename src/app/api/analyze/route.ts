import {
  VideoIntelligenceServiceClient,
  protos,
} from "@google-cloud/video-intelligence";
import { NextResponse } from "next/server";

// 環境変数からプロジェクトIDを取得するか、直接ここにハードコードする（非推奨）
// 本番環境では環境変数を使用するのがベストプラクティスです。
// プロジェクトID: "innate-algebra-474710-f0" を設定しました。
const projectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT || "innate-algebra-474710-f0";

const videoClient = new VideoIntelligenceServiceClient({
  projectId: projectId, // ここでプロジェクトIDを渡す
});

export async function POST(req: Request) {
  try {
    console.log("Video analysis request received.");

    // フロントエンドから送られてきた情報（JSON）を読み取る
    const { gcsUri } = await req.json();

    // gcsUriが送られてこなかった場合のエラー処理
    if (!gcsUri) {
      return NextResponse.json(
        { message: "gcsUri is required." },
        { status: 400 }
      );
    }

    const request = {
      inputUri: gcsUri,
      features: [protos.google.cloud.videointelligence.v1.Feature.OBJECT_TRACKING],
    };

    console.log("Sending request to Video Intelligence API...");
    const [operation] = await videoClient.annotateVideo(request);
    console.log("Waiting for operation to complete...");
    await operation.promise(); // ここで完了を待つ

    console.log("Video analysis successful.");
    return NextResponse.json({
      message: "動画解析が正常に開始されました。",
    });

  } catch (error) {
    console.error("ERROR IN VIDEO ANALYSIS:", error);
    return NextResponse.json(
      { message: "動画解析中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}

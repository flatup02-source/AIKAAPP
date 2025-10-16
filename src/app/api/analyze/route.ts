import { VideoIntelligenceServiceClient } from "@google-cloud/video-intelligence";
import { NextResponse } from "next/server";

// Video Intelligence APIのクライアントを初期化します
const videoClient = new VideoIntelligenceServiceClient();

export async function POST(req: Request) {
  try {
    // ここは一旦、動画解析が動くかどうかのテスト用です
    console.log("Video analysis request received.");

    // 今はダミーの処理をしています
    // 将来的には、ここでリクエストから動画ファイルの情報を受け取ります
    const gcsUri = "gs://YOUR_BUCKET_NAME/YOUR_VIDEO_FILE.mp4";

    const request = {
      inputUri: gcsUri,
      features: ["OBJECT_TRACKING"], // 例としてオブジェクト追跡機能を指定
    };

    console.log("Sending request to Video Intelligence API...");
    const [operation] = await videoClient.annotateVideo(request);
    console.log("Waiting for operation to complete...");

    await operation.promise();

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

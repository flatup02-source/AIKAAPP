import {
  VideoIntelligenceServiceClient,
  protos,
} from "@google-cloud/video-intelligence";
import { NextResponse } from "next/server";

const videoClient = new VideoIntelligenceServiceClient();

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
    const result = await videoClient.annotateVideo(request);
    const operation = result[0];
    console.log("Waiting for operation to complete...");

    // ここでは処理の完了を待たずに、リクエストを受け付けたことをすぐに返す
    // 実際の分析結果は別の方法で取得します（今後のステップ）
    console.log("Video analysis operation started.");
    return NextResponse.json({
      message: "動画解析のリクエストを受け付けました。",
    });

  } catch (error) {
    console.error("ERROR IN VIDEO ANALYSIS:", error);
    return NextResponse.json(
      { message: "動画解析中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}

import {
  VideoIntelligenceServiceClient,
  protos,
} from "@google-cloud/video-intelligence";
import { NextResponse } from "next/server";

const videoClient = new VideoIntelligenceServiceClient();

export async function POST(req: Request) {
  try {
    console.log("Video analysis request received.");

    const gcsUri = "gs://YOUR_BUCKET_NAME/YOUR_VIDEO_FILE.mp4";

    const request = {
      inputUri: gcsUri,
      // ↓↓↓ この行を正式な命令書の形式に修正しました ↓↓↓
      features: [protos.google.cloud.videointelligence.v1.Feature.OBJECT_TRACKING],
    };

    console.log("Sending request to Video Intelligence API...");
    const result = await videoClient.annotateVideo(request);
    const operation = result[0];
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

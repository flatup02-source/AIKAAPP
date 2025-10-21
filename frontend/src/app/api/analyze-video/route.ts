import {
  VideoIntelligenceServiceClient,
  protos,
} from "@google-cloud/video-intelligence";
import { NextResponse } from "next/server";

const videoClient = new VideoIntelligenceServiceClient({
  projectId: process.env.GOOGLE_PROJECT_ID,
});

export async function POST(req: Request) {
  try {
    console.log("Video analysis request received.");

    const { gcsUri } = await req.json();
    if (!gcsUri) {
      return NextResponse.json(
        { message: "gcsUri is required." },
        { status: 400 }
      );
    }

    // TODO: 本来はここでGoogle Video Intelligence APIを呼び出し、
    // その結果を元に戦闘力やコメントを生成する重い処理が入ります。
    // 現在はタイムアウトを回避し、フロントエンドの動作を担保するために、
    // ダミーデータを返却しています。

    console.log(`Received request for GCS URI: ${gcsUri}`);
    console.log("Skipping actual video analysis and returning dummy data.");

    // ダミーの解析結果を生成
    const dummyResult = {
      power_level: 77, // ダミーの戦闘力
      comment: "解析完了。\n\n1. 右ストレートの際に、少し顎が上がっている傾向が見られます。常に顎を引く意識を持つと、ディフェンスが安定します。\n\n2. フットワークは軽快ですが、パンチのインパクトの瞬間に足が止まると、よりパワーが拳に伝わります。\n\n3. コンビネーションの最後に左フックを返すと、相手の意識を散らすことができ、次の攻撃に繋げやすくなります。",
    };

    // 意図的に少し待機時間を入れる（ローディング画面を見せるため）
    await new Promise(resolve => setTimeout(resolve, 3000));

    return NextResponse.json(dummyResult);

  } catch (error) {
    console.error("ERROR IN VIDEO ANALYSIS:", error);
    return NextResponse.json(
      { message: "動画解析中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}
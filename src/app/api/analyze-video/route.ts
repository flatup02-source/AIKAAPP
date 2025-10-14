import { NextRequest, NextResponse } from "next/server";
import { VertexAI } from "@google-cloud/vertexai";
import axios from "axios";

// Gemini Visionの初期化
const vertex_ai = new VertexAI({
  project: process.env.GOOGLE_PROJECT_ID!,
  location: "asia-northeast1", // 東京リージョン
});
const model = "gemini-1.0-pro-vision-001";

const generativeModel = vertex_ai.getGenerativeModel({
  model: model,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { videoUrl, idolFighterName, liffUserId } = body;

    if (!videoUrl) {
      return NextResponse.json({ error: "動画URLが必要です" }, { status: 400 });
    }

    // ★ STEP 1: Gemini Visionが動画を「観て」テキスト化する ★
    const request = {
      contents: [
        {
          role: "user",
          parts: [
            {
              fileData: {
                mimeType: "video/mp4", // もし他の形式も許可するなら要調整
                fileUri: videoUrl,
              },
            },
            {
              text: "この格闘技のフォーム動画を詳細に分析し、動きの良い点と改善点を箇条書きで客観的に説明してください。",
            },
          ],
        },
      ],
    };

    const response = await generativeModel.generateContent(request);
    const videoAnalysisText =
      response.response.candidates?.[0]?.content?.parts[0]?.text ||
      "動画の分析に失敗しました。";

    // ★ STEP 2: Dify (AIKA 18号) がテキストを「思考」し、最終的な神託を生成する ★
    const difyResponse = await axios.post(
      process.env.DIFY_API_URL!, // DifyのAPI URL
      {
        inputs: {
          video_analysis_text: videoAnalysisText,
          idol_fighter_name: idolFighterName || "指定なし",
        },
        response_mode: "blocking", // 回答が完了するまで待つ
        user: liffUserId || "anonymous-user",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DIFY_API_KEY!}`, // DifyのAPIキー
          "Content-Type": "application/json",
        },
      }
    );

    // Difyからの回答は通常、JSON形式の"文字列"で返ってくる
    const aikasOracle = JSON.parse(difyResponse.data.answer);

    // ★ STEP 3: 最終結果をフロントエンドに返す ★
    return NextResponse.json(aikasOracle);

  } catch (error) {
    console.error("分析APIエラー:", error);
    // エラーの詳細をフロントに返す
    let errorMessage = "不明なエラー";
    if (axios.isAxiosError(error)) {
      errorMessage = JSON.stringify(error.response?.data) || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: "分析中にエラーが発生しました", details: errorMessage },
      { status: 500 }
    );
  }
}
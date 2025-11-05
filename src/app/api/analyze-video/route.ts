import { NextRequest, NextResponse } from "next/server";
import { VertexAI } from "@google-cloud/vertexai";
import axios from "axios";
import { env } from "@/env.mjs";
import { getAuthClientFromEnv } from "@/lib/gcloud";

// Gemini Visionの初期化（環境変数から認証情報を自動読み込み）
let vertex_ai: VertexAI | null = null;
let generativeModel: ReturnType<VertexAI["getGenerativeModel"]> | null = null;

async function initializeVertexAI() {
  if (vertex_ai && generativeModel) {
    return { vertex_ai, generativeModel };
  }

  // 認証情報を検証（エラーを早期に検出）
  await getAuthClientFromEnv([
    "https://www.googleapis.com/auth/cloud-platform",
  ]);

  // VertexAIは内部的にGoogleAuthを使用し、環境変数から認証情報を自動的に読み取る
  // GOOGLE_APPLICATION_CREDENTIALS_JSON が設定されていれば自動的に使用される
  vertex_ai = new VertexAI({
    project: env.GOOGLE_PROJECT_ID,
    location: "asia-northeast1",
  });

  const model = "gemini-1.0-pro-vision-001";
  generativeModel = vertex_ai.getGenerativeModel({
    model: model,
  });

  return { vertex_ai, generativeModel };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { videoUrl, idolFighterName, liffUserId } = body;

    if (!videoUrl) {
      return NextResponse.json({ error: "動画URLが必要です" }, { status: 400 });
    }

    // VertexAIを初期化
    const { generativeModel } = await initializeVertexAI();
    if (!generativeModel) {
      throw new Error("VertexAIの初期化に失敗しました");
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
    const difyApiUrl = env.DIFY_API_URL;
    const difyApiKey = env.DIFY_API_KEY;

    if (!difyApiUrl || !difyApiKey) {
      // Difyが設定されていない場合、Geminiの分析結果をそのまま返す
      return NextResponse.json({
        analysis: videoAnalysisText,
        note: "Dify APIが設定されていないため、Geminiの分析結果のみを返します。",
      });
    }

    const difyResponse = await axios.post(
      difyApiUrl,
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
          Authorization: `Bearer ${difyApiKey}`,
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
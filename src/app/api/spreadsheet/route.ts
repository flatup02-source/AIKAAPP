import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import path from "path";

export async function POST(req: NextRequest) {
  // このデバッグコードはもう不要なので消してもOKだ
  console.log("!!! SERVER PROCESS NODE VERSION:", process.version);

  try {
    const body = await req.json();
    const {
      userName,
      theme,
      requests,
      videoUrl,
      fileName,
      fileType,
      fileSize,
    } = body;

    if (!videoUrl || !fileName) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // 環境変数から認証情報を取得するか、ファイルから読み込む
    const credentials = process.env.GOOGLE_CREDENTIALS
      ? JSON.parse(process.env.GOOGLE_CREDENTIALS)
      : require("path").join(process.cwd(), "google-credentials.json");

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const now = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
    
    const values = [[
        now, 
        userName || "",
        theme || "",
        requests || "",
        videoUrl, 
        fileName, 
        fileType, 
        fileSize
    ]];

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID,
      // ★★★ ここが最後の修正ポイントだ！ ★★★
      range: "Form Responses 1", // シート名を正しく修正！!A1も不要！
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: values,
      },
    });

    return NextResponse.json({ success: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error updating sheet:", error);
    return NextResponse.json(
      { error: `シートへの書き込みに失敗しました: ${error.message}` },
      { status: 500 }
    );
  }
}
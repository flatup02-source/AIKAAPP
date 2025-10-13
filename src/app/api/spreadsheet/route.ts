import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import path from "path";

export async function POST(req: NextRequest) {
  console.log("Received request to update spreadsheet.");
  try {
    const body = await req.json();
    console.log("Request body:", body);

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
      console.error("Missing required parameters: videoUrl or fileName");
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const credentialsEnv = process.env.GOOGLE_CREDENTIALS;
    console.log("Using GOOGLE_CREDENTIALS from env:", !!credentialsEnv);

    const credentials = credentialsEnv
      ? JSON.parse(credentialsEnv)
      : path.join(process.cwd(), "google-credentials.json");

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

    console.log("Appending values to spreadsheet:", values);

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID,
      range: "Form Responses 1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: values,
      },
    });

    console.log("Successfully appended values to spreadsheet.");
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error updating sheet:", error);
    return NextResponse.json(
      { error: `シートへの書き込みに失敗しました: ${error.message}` },
      { status: 500 }
    );
  }
}
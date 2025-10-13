import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import path from "path";
import { env } from "@/env.mjs";

export async function POST(req: NextRequest) {
  console.log("Received request to update spreadsheet.");

  // --- LINE ID Token Authentication ---
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const channelId = env.LINE_CHANNEL_ID;
  if (!channelId) {
    console.error("LINE_CHANNEL_ID is not set in environment variables.");
    return NextResponse.json({ error: "Configuration error" }, { status: 500 });
  }

  try {
    const params = new URLSearchParams();
    params.append("id_token", token);
    params.append("client_id", channelId);

    const response = await fetch("https://api.line.me/oauth2/v2.1/verify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("LINE token verification failed:", errorData);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    console.log("LINE token verified successfully.");
    // --- End of Authentication ---

    const body = await req.json();
    console.log("Request body:", body);

    const {
      userName,
      genre, // Extract genre
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

    let credentials;
    try {
      credentials = JSON.parse(env.GOOGLE_CREDENTIALS_JSON);
    } catch (error) {
      console.error("Failed to parse GOOGLE_CREDENTIALS_JSON:", error);
      return NextResponse.json(
        { error: "Google credentials configuration error." },
        { status: 500 }
      );
    }

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const now = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
    
    const values = [[
        now, 
        userName || "",
        genre || "", // Add genre to values
        theme || "",
        requests || "",
        videoUrl, 
        fileName, 
        fileType, 
        fileSize
    ]];

    console.log("Appending values to spreadsheet:", values);

    await sheets.spreadsheets.values.append({
      spreadsheetId: env.NEXT_PUBLIC_GOOGLE_SHEET_ID,
      range: "Form Responses 1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: values,
      },
    });

    console.log("Successfully appended values to spreadsheet.");
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error updating sheet:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `シートへの書き込みに失敗しました: ${message}` },
      { status: 500 }
    );
  }
}
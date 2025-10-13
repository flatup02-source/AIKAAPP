import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";
import { env } from "@/env.mjs";

// ImageKitのインスタンスを作成
const imagekit = new ImageKit({
  publicKey: env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  privateKey: env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
});

export async function GET(req: NextRequest) {
  console.log("Attempting to get ImageKit authentication parameters...");

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

    const authenticationParameters = imagekit.getAuthenticationParameters();
    console.log("Successfully got ImageKit authentication parameters:", {
      token: authenticationParameters.token,
      expire: authenticationParameters.expire,
      signature: "..." // Signature is too long to log
    });
    return NextResponse.json(authenticationParameters);

  } catch (error) {
    console.error("ImageKit Auth Error:", error);
    return NextResponse.json(
      { error: "ImageKit authentication failed." },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import ImageKit from "imagekit";

// ImageKitのインスタンスを作成
const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

export async function GET() {
  console.log("Attempting to get ImageKit authentication parameters...");
  try {
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
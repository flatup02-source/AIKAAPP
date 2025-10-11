import { NextResponse } from "next/server";
import ImageKit from "imagekit";

// ImageKitのインスタンスを作成
const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

export async function GET(request: Request) {
  try {
    // ★★★ここが修正ポイント★★★
    // 現在時刻から60秒後を有効期限として設定します
    const expire = Math.floor(Date.now() / 1000) + 60;

    const authenticationParameters = imagekit.getAuthenticationParameters(
      undefined, // tokenは不要なのでundefined
      expire     // 正しく計算した有効期限を設定
    );

    return NextResponse.json(authenticationParameters);

  } catch (error) {
    console.error("ImageKit Auth Error:", error);
    return NextResponse.json(
      { error: "ImageKit authentication failed." },
      { status: 500 }
    );
  }
}
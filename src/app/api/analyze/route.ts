import {NextResponse} from 'next/server';
import ImageKit from 'imagekit';

const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export function GET() {
    const result = imagekit.getAuthenticationParameters();
    return NextResponse.json(result);
}

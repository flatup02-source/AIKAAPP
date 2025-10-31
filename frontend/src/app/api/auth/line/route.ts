export const runtime = 'nodejs';

import admin from 'firebase-admin';
import axios from 'axios';
import { NextResponse } from 'next/server'; // Import NextResponse for API responses

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(), // Use applicationDefault for server-side
  });
}

// Helper function (not exported as a route handler)
async function createCustomToken(lineIdToken: string) {
  const res = await axios.get('https://api.line.me/oauth2/v2.1/verify', {
    params: { id_token: lineIdToken, client_id: process.env.LINE_CHANNEL_ID },
  });
  const { sub: lineUserId } = res.data;
  const uid = `line_${lineUserId}`;

  try {
    await admin.auth().getUser(uid);
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      await admin.auth().createUser({ uid });
    } else {
      throw error; // Re-throw other errors
    }
  }

  return admin.auth().createCustomToken(uid);
}

// POST handler for the API route
export async function POST(request: Request) {
  try {
    const { lineIdToken } = await request.json(); // Assuming lineIdToken is in the request body

    if (!lineIdToken) {
      return NextResponse.json({ error: 'LINE ID token is required' }, { status: 400 });
    }

    const firebaseCustomToken = await createCustomToken(lineIdToken);
    return NextResponse.json({ firebaseCustomToken });
  } catch (error: any) {
    console.error('Error in LINE auth API route:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
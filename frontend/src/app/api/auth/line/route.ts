import admin from 'firebase-admin';
import axios from 'axios';

admin.initializeApp({
  credential: admin.applicationDefault()
});

export async function createCustomToken(lineIdToken) {
  const res = await axios.get('https://api.line.me/oauth2/v2.1/verify', {
    params: { id_token: lineIdToken, client_id: process.env.LINE_CHANNEL_ID }
  });
  const { sub: lineUserId } = res.data;
  const uid = `line_${lineUserId}`;

  try {
    await admin.auth().getUser(uid);
  } catch {
    await admin.auth().createUser({ uid });
  }

  return admin.auth().createCustomToken(uid);
}

import * as admin from 'firebase-admin';

// Get the Firebase credentials from environment variables
const serviceAccount = JSON.parse(process.env.FIREBASE_PRIVATE_KEY as string);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
export { db };

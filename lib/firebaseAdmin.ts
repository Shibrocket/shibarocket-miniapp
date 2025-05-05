// lib/firebaseAdmin.ts
import * as admin from 'firebase-admin';
import serviceAccount from './serviceaccount.json';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

const db = admin.firestore();
const auth = admin.auth();

export { db, auth };

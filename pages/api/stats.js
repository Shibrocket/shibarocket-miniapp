// api/stats.js
import admin from 'firebase-admin';

// Initialize Firebase Admin SDK (only once)
let firebaseApp;

function initializeFirebaseAdmin() {
  if (!firebaseApp) {
    try {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY ? process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
        }),
        // databaseURL: process.env.FIREBASE_DATABASE_URL, // Optional: if you use Realtime Database
      });
    } catch (error) {
      console.error('Firebase Admin SDK initialization error:', error);
      throw error; // Propagate the error
    }
  }
  return firebaseApp;
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Initialize Firebase Admin
      const app = initializeFirebaseAdmin();
      const db = admin.firestore(app);

      // --- 1. Fetch User Count ---
      const usersSnapshot = await db.collection('users').get();
      const userCount = usersSnapshot.size;

      // --- 2. Fetch total shrockEarned from all users ---
      let totalShrockEarned = 0;
      usersSnapshot.forEach((doc) => {
        const data = doc.data();
        totalShrockEarned += data.shrockEarned || 0;
      });

      // --- 3. Fetch the latest daily pool data ---
      const today = new Date().toISOString().slice(0, 10);
      const poolsDoc = db.collection('pools').doc(today);
      const poolsSnap = await poolsDoc.get();
      const poolsData = poolsSnap.data() || {};

      // --- 4. Construct the response ---
      const stats = {
        userCount,
        totalShrockEarned,
        ...poolsData,
        // Add more stats as needed
      };

      res.status(200).json(stats);

    } catch (error) {
      console.error('Error fetching stats:', error);
      console.error('Error details:', error.message, error.code, error.stack);
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

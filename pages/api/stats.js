import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';

// Firebase configuration (Replace with your actual config - but these should come from env vars)

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase (only once)
function initializeFirebaseApp() {
  try {
    return getApp();
  } catch {
    return initializeApp(firebaseConfig);
  }
}

const app = initializeFirebaseApp();
const db = getFirestore(app);

export default async function handler(req, res) {
  console.log("NEXT_PUBLIC_FIREBASE_API_KEY:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
  console.log("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:", process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
  console.log("NEXT_PUBLIC_FIREBASE_PROJECT_ID:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
  console.log("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:", process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
  console.log("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:", process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID);
  console.log("NEXT_PUBLIC_FIREBASE_APP_ID:", process.env.NEXT_PUBLIC_FIREBASE_APP_ID);
  console.log("NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID:", process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID);

  console.log("FIREBASE_ADMIN_TYPE:", process.env.FIREBASE_ADMIN_TYPE);
  console.log("FIREBASE_ADMIN_PROJECT_ID:", process.env.FIREBASE_ADMIN_PROJECT_ID);
  console.log("FIREBASE_ADMIN_PRIVATE_KEY_ID:", process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID);
  console.log("FIREBASE_ADMIN_PRIVATE_KEY:", process.env.FIREBASE_ADMIN_PRIVATE_KEY ? process.env.FIREBASE_ADMIN_PRIVATE_KEY.substring(0, 20) + '...' : undefined);  // Log only the beginning for security
  console.log("FIREBASE_ADMIN_CLIENT_EMAIL:", process.env.FIREBASE_ADMIN_CLIENT_EMAIL);
  console.log("FIREBASE_ADMIN_CLIENT_ID:", process.env.FIREBASE_ADMIN_CLIENT_ID);
  console.log("FIREBASE_ADMIN_AUTH_URI:", process.env.FIREBASE_ADMIN_AUTH_URI);
  console.log("FIREBASE_ADMIN_TOKEN_URI:", process.env.FIREBASE_ADMIN_TOKEN_URI);
  console.log("FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL:", process.env.FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL);
  console.log("FIREBASE_ADMIN_CLIENT_X509_CERT_URL:", process.env.FIREBASE_ADMIN_CLIENT_X509_CERT_URL);
  console.log("FIREBASE_ADMIN_UNIVERSE_DOMAIN:", process.env.FIREBASE_ADMIN_UNIVERSE_DOMAIN);

  if (req.method === 'GET') {
    try {
      // 1. Fetch User Count
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const userCount = usersSnapshot.size;

      // 2. Example: Fetch total shrockEarned from all users
      let totalShrockEarned = 0;
      usersSnapshot.forEach((doc) => {
        const data = doc.data();
        totalShrockEarned += data.shrockEarned || 0; // Use || 0 to handle potential missing fields
      });

      // 3. Example:  Fetch the latest daily pool data
      const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format
      const poolsDoc = doc(db, 'pools', today);  // Use doc() to get a single document
      const poolsSnap = await getDoc(poolsDoc);

      const poolsData = poolsSnap.data() || {}; // Use || {} in case the document doesn't exist

      // Construct the response
      const stats = {
        userCount,
        totalShrockEarned,
        ...poolsData, // Include today's pool data
        // Add more stats as needed (e.g., from the 'settings' collection)
      };

      res.status(200).json(stats); // Send a successful response with the stats
    } catch (error) {
      console.error('Error fetching stats:', error);
      console.error('Error details:', error.message, error.code, error.stack);
      res.status(500).json({ error: 'Failed to fetch stats' }); // Send an error response
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' }); // Handle other HTTP methods
  }
}

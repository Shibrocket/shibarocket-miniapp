import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Firebase configuration (Replace with your actual config)
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
  if (req.method === 'GET') {
    try {
      // 1. Fetch User Count
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const userCount = usersSnapshot.size;

      // 2. Fetch Total Rewards Claimed (Example)
      let totalRewards = 0;
      const rewardsSnapshot = await getDocs(collection(db, 'rewards')); // Assuming you have a 'rewards' collection
      rewardsSnapshot.forEach((doc) => {
        const data = doc.data();
        totalRewards += data.amount; // Assuming each reward has an 'amount' field
      });

      // 3. Fetch Energy Usage (Example)
      let totalEnergyUsed = 0;
      const energySnapshot = await getDocs(collection(db, 'energyLogs')); // Assuming you have 'energyLogs'
      energySnapshot.forEach((doc) => {
        const data = doc.data();
        totalEnergyUsed += data.energyConsumed; // Assuming each log has 'energyConsumed'
      });

      // Construct the response
      const stats = {
        userCount,
        totalRewards,
        totalEnergyUsed,
        // Add more stats as needed
      };

      res.status(200).json(stats); // Send a successful response with the stats
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ error: 'Failed to fetch stats' }); // Send an error response
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' }); // Handle other HTTP methods
  }
}

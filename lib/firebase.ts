// lib/firebase.ts

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCgPHF_po0Xuq0E1hqJHK8GLnuxnDgTDbE",
  authDomain: "shibarocket-tapapp-7538a-e890c.firebaseapp.com",
  projectId: "shibarocket-tapapp-7538a-e890c",
  storageBucket: "shibarocket-tapapp-7538a-e890c.firebasestorage.app",
  messagingSenderId: "598699447123",
  appId: "1:598699447123:web:a9dc39806df1d457ce07a6",
  measurementId: "G-WCJ6BDXNSP"
};

// Initialize Firebase app (only once)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Export Firestore DB instance
export const db = getFirestore(app);

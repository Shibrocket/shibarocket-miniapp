import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCgPHF_po0Xuq0E1hqJHK8GLnuxnDgTDbE",
  authDomain: "shibarocket-tapapp-7538a-e890c.firebaseapp.com",
  projectId: "shibarocket-tapapp-7538a-e890c",
  storageBucket: "shibarocket-tapapp-7538a-e890c.appspot.com",
  messagingSenderId: "598699447123",
  appId: "1:598699447123:web:a9dc39806df1d457ce07a6",
  measurementId: "G-WCJ6BDXNSP"
};

const app = initializeApp(firebaseConfig);

// Add these two lines:
export const db = getFirestore(app);
export const auth = getAuth(app);

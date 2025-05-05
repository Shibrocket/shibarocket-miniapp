import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

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
const db = getFirestore(app);

export { app, db };

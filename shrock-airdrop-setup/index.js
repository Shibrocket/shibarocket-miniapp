// index.js

const admin = require("firebase-admin");
const fs = require("fs");

// Load your Firebase Admin SDK key
const serviceAccount = require("./serviceAccountKey.json");

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// DAILY POOL CONFIGURATION
const dailyTotal = 100_000_000_000 / 30; // 100B ÷ 30 days
const pools = {
  tappingPool: dailyTotal * 0.30,         // 30%
  socialTaskPool: dailyTotal * 0.20,      // 20%
  referralPool: dailyTotal * 0.20,        // 20%
  loginPool: dailyTotal * 0.20,           // 20%
  presalePool: dailyTotal * 0.10          // 10%
};

// Upload today's pool to Firestore
async function setDailyPools() {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const docRef = db.collection("dailyPools").doc(today);

  await docRef.set({
    date: today,
    ...pools,
    totalDaily: dailyTotal,
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  });

  console.log("✅ Daily airdrop pools set for:", today);
}

setDailyPools().catch(console.error);

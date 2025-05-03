// pages/api/adminStats.ts

import { NextApiRequest, NextApiResponse } from "next";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Only initialize if not already
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Count total users
    const usersSnap = await db.collection("users").get();
    const totalUsers = usersSnap.size;

    // Count total taps
    const tapsSnap = await db.collection("taps").get();
    const totalTaps = tapsSnap.size;

    // Sum SHROCK distributed (from user balances)
    let totalShrock = 0;
    let totalLoginRewards = 0;
    let totalReferrals = 0;

    usersSnap.forEach((doc) => {
      const data = doc.data();
      totalShrock += data.balance || 0;
      totalLoginRewards += data.loginReward || 0;
      totalReferrals += data.referrals || 0;
    });

    // Pools
    const poolsDoc = await db.collection("admin").doc("pools").get();
    const pools = poolsDoc.exists ? poolsDoc.data() : {};

    res.status(200).json({
      success: true,
      totalUsers,
      totalTaps,
      totalShrock,
      totalReferrals,
      totalLoginRewards,
      pools: {
        dailyPool: pools?.dailyPool || 0,
        loginPool: pools?.loginPool || 0,
        referralPool: pools?.referralPool || 0,
        socialPool: pools?.socialPool || 0,
        presalePool: pools?.presalePool || 0,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({ success: false, error: "Failed to load stats" });
  }
}

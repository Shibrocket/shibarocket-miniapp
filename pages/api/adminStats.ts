// pages/api/adminStats.ts

import { NextApiRequest, NextApiResponse } from "next";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, applicationDefault, cert, getApps } from "firebase-admin/app";

// Initialize Firebase Admin
if (!getApps().length) {
  initializeApp({
    credential: applicationDefault(),
  });
}

const db = getFirestore();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const dailyPoolDoc = await db.collection('dailyPool').doc('dailyPool').get();
    
    if (!dailyPoolDoc.exists) {
      return res.status(404).json({ error: "Daily pool not found" });
    }

    const dailyPoolData = dailyPoolDoc.data();

    return res.status(200).json({
      success: true,
      data: dailyPoolData,
    });

  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}

// pages/api/adminStats.ts

import { NextApiRequest, NextApiResponse } from "next";
import { getFirestore } from "firebase-admin/firestore";
import { adminApp } from "../../utils/firebaseAdmin"; // This imports your firebaseAdmin config

const db = getFirestore(adminApp);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const dailyPoolRef = db.collection("dailyPool").doc("dailyPool");
    const dailyPoolSnap = await dailyPoolRef.get();

    if (!dailyPoolSnap.exists) {
      return res.status(404).json({ error: "dailyPool document not found." });
    }

    const poolData = dailyPoolSnap.data();

    return res.status(200).json({
      success: true,
      data: poolData,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}

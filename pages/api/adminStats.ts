// pages/api/adminStats.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../utils/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const usersSnap = await db.collection("users").get();

    let totalTaps = 0;
    let totalTokens = 0;

    usersSnap.forEach(doc => {
      const data = doc.data();
      totalTaps += data.totalTaps || 0;
      totalTokens += data.shrock || 0;
    });

    res.status(200).json({
      totalUsers: usersSnap.size,
      totalTaps,
      totalTokens,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({ error: "Failed to fetch admin stats" });
  }
}

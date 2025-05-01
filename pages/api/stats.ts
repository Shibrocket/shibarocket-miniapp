// pages/api/stats.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../utils/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const usersSnapshot = await db.collection("users").get();
    const totalUsers = usersSnapshot.size;

    let totalEarned = 0;

    usersSnapshot.forEach(doc => {
      const data = doc.data();
      totalEarned += data.shrockEarned || 0;
    });

    const stats = {
      totalUsers,
      totalEarned,
      lastUpdated: new Date().toISOString(),
    };

    return res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

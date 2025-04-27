// pages/api/adminStats.ts

import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../utils/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const dailyPoolDoc = await db.collection("dailyPool").doc("dailyPool").get();

    if (!dailyPoolDoc.exists) {
      return res.status(404).json({ success: false, message: "Daily pool not found" });
    }

    const dailyPoolData = dailyPoolDoc.data();

    res.status(200).json({ success: true, data: dailyPoolData });
  } catch (error) {
    console.error("Admin stats API error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

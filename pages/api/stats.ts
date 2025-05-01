import { db } from "../../utils/firebaseAdmin";
import type { NextApiRequest, NextApiResponse } from "next";

type StatsResponse = {
  success: boolean;
  totalUsers: number;
  totalShrockEarned: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StatsResponse | { message: string }>
) {
  try {
    const snapshot = await db.collection("users").get();

    let totalUsers = 0;
    let totalShrockEarned = 0;

    snapshot.forEach(doc => {
      totalUsers += 1;
      const data = doc.data();
      totalShrockEarned += data.shrockEarned || 0;
    });

    return res.status(200).json({
      success: true,
      totalUsers,
      totalShrockEarned,
    });
  } catch (error) {
    console.error("Stats API Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

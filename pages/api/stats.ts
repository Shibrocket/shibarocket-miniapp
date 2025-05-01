import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../utils/firebaseAdmin";

type StatsResponse = {
  success: boolean;
  message: string;
  stats?: {
    totalUsers: number;
    totalTaps: number;
    totalShrockEarned: number;
    totalReferrals: number;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StatsResponse>
) {
  try {
    // Count users
    const usersCountSnap = await db.collection("users").count().get();
    const totalUsers = usersCountSnap.data().count || 0;

    // Sum all shrockEarned and referrals fields using batched fetch
    const usersSnap = await db.collection("users").select("shrockEarned", "referrals").get();

    let totalShrockEarned = 0;
    let totalReferrals = 0;
    let totalTaps = 0;

    usersSnap.forEach((doc) => {
      const data = doc.data();
      totalShrockEarned += data.shrockEarned || 0;
      totalReferrals += data.referrals || 0;
      totalTaps += Math.floor((data.shrockEarned || 0) / 5); // 5 $SHROCK per tap
    });

    return res.status(200).json({
      success: true,
      message: "Stats loaded",
      stats: {
        totalUsers,
        totalTaps,
        totalShrockEarned,
        totalReferrals,
      },
    });
  } catch (error) {
    console.error("Stats API error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load stats",
    });
  }
}

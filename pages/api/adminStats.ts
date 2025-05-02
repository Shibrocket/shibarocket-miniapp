import { db } from "../../utils/firebaseAdmin";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const usersSnap = await db.collection("users").get();
    const users = usersSnap.docs.map(doc => doc.data());

    const totalUsers = users.length;
    const totalShrock = users.reduce((sum, user) => sum + (user.shrock || 0), 0);
    const totalTaps = users.reduce((sum, user) => sum + (user.totalTaps || 0), 0);
    const totalReferrals = users.reduce((sum, user) => sum + ((user.referredUsers?.length || 0)), 0);
    const totalLoginRewards = users.reduce((sum, user) => sum + (user.loginStreak || 0), 0);

    // SHROCK values
    const tapReward = 5;
    const referralReferrer = 70000;
    const referralReferee = 30000;
    const loginDay1 = 500;
    const presaleReward = 100000;
    const socialRewardPerTask = 20000;

    const dailyPool = totalTaps * tapReward;
    const loginPool = totalLoginRewards * loginDay1;
    const referralPool = totalReferrals * (referralReferrer + referralReferee);
    const socialPool = users.reduce(
      (sum, u) => sum + ((u.socialTasksCompleted?.length || 0) * socialRewardPerTask),
      0
    );
    const presalePool = users.reduce((sum, u) => sum + (u.hasClaimedPresale ? presaleReward : 0), 0);

    return res.status(200).json({
      success: true,
      totalUsers,
      totalShrock,
      totalTaps,
      totalReferrals,
      totalLoginRewards,
      pools: {
        dailyPool,
        loginPool,
        referralPool,
        socialPool,
        presalePool,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

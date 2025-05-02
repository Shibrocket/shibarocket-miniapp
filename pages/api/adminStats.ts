import { db } from "@/utils/firebaseAdmin";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const usersSnap = await db.collection("users").get();

    let totalShrock = 0;
    let totalTaps = 0;
    let totalReferrals = 0;
    let totalLoginRewards = 0;
    let dailyPool = 0;
    let loginPool = 0;
    let referralPool = 0;
    let socialPool = 0;
    let presalePool = 0;

    usersSnap.forEach(doc => {
      const user = doc.data();
      totalShrock += user.shrock || 0;
      totalTaps += user.totalTaps || 0;
      totalReferrals += user.referrals || 0;
      totalLoginRewards += user.loginStreak || 0;

      dailyPool += (user.totalTaps || 0) * 5;
      loginPool += (user.loginStreak || 0) * 500;
      referralPool += ((user.referrals || 0) * 30000);
      if (user.referrer) referralPool += 70000;

      const taskCount = Array.isArray(user.socialTasksCompleted)
        ? user.socialTasksCompleted.length
        : 0;
      socialPool += taskCount * 20000;

      if (user.hasClaimedPresale) presalePool += 100000;
    });

    res.status(200).json({
      success: true,
      totalUsers: usersSnap.size,
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
      }
    });
  } catch (error) {
    console.error("adminStats error:", error);
    res.status(500).json({ success: false, error: "Failed to load stats" });
  }
}

// pages/api/adminStats.ts
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const totalUsers = await prisma.user.count();
    const totalTaps = await prisma.tap.count();
    const totalReferrals = await prisma.user.count({
      where: { referredBy: { not: null } },
    });

    const totalLoginRewards = await prisma.reward.aggregate({
      _sum: { amount: true },
      where: { type: "LOGIN" },
    });

    const totalShrock = await prisma.reward.aggregate({
      _sum: { amount: true },
    });

    // Get latest pool entry by date
    const latestPool = await prisma.pool.findFirst({
      orderBy: { date: "desc" },
    });

    res.status(200).json({
      success: true,
      totalUsers,
      totalTaps,
      totalReferrals,
      totalLoginRewards: totalLoginRewards._sum.amount || 0,
      totalShrock: totalShrock._sum.amount || 0,
      pools: {
        dailyPool: latestPool?.adsEnergyPool || 0,
        loginPool: latestPool?.loginPool || 0,
        referralPool: latestPool?.referralPool || 0,
        socialPool: latestPool?.socialPool || 0,
        presalePool: latestPool?.presalePool || 0,
      },
    });
  } catch (error) {
    console.error("Error in /api/adminStats:", error);
    res.status(500).json({ success: false });
  }
}

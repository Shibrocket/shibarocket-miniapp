// pages/api/stats.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../utils/firebaseAdmin';

type StatsResponse = {
  totalUsers: number;
  totalShrockEarned: number;
  remainingDailyPool: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StatsResponse | { error: string }>
) {
  try {
    // Get all users
    const usersSnapshot = await db.collection('users').get();
    const totalUsers = usersSnapshot.size;

    // Sum all shrockEarned
    let totalShrockEarned = 0;
    usersSnapshot.forEach((doc) => {
      const data = doc.data();
      totalShrockEarned += data.shrockEarned || 0;
    });

    // Get remainingDailyPool from pools/main
    const poolsSnapshot = await db.collection('pools').doc('main').get();
    const poolsData = poolsSnapshot.data();
    const remainingDailyPool = poolsData?.remainingDailyPool || 0;

    return res.status(200).json({
      totalUsers,
      totalShrockEarned,
      remainingDailyPool,
    });
  } catch (error) {
    console.error('Stats API error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

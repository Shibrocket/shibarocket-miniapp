import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../utils/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Fetch total users
    const usersSnapshot = await db.collection('users').get();
    const totalUsers = usersSnapshot.size;

    // Fetch total taps
    let totalTaps = 0;
    usersSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.totalTaps) {
        totalTaps += data.totalTaps;
      }
    });

    // Fetch pools (assuming pools are stored in a "pools" collection)
    const poolsDoc = await db.collection('pools').doc('mainPool').get();
    const poolsData = poolsDoc.exists ? poolsDoc.data() : {};

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalTaps,
        dailyPool: poolsData?.dailyPool || 0,
        loginPool: poolsData?.loginPool || 0,
        referralPool: poolsData?.referralPool || 0,
        socialTaskPool: poolsData?.socialTaskPool || 0,
        presaleTaskPool: poolsData?.presaleTaskPool || 0,
      },
    });
  } catch (error) {
    console.error('Admin Stats Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

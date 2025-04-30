import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../utils/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Fetch total users
    const usersSnapshot = await db.collection('users').get();
    const totalUsers = usersSnapshot.size;

    // Calculate total taps
    let totalTaps = 0;
    usersSnapshot.forEach(doc => {
      const data = doc.data();
      totalTaps += data.totalTaps || 0;
    });

    // Fetch pools
    const poolsSnapshot = await db.collection('pools').doc('daily').get();
    const loginSnapshot = await db.collection('pools').doc('login').get();
    const referralSnapshot = await db.collection('pools').doc('referral').get();
    const socialSnapshot = await db.collection('pools').doc('social').get();
    const presaleSnapshot = await db.collection('pools').doc('presale').get();

    const stats = {
      totalUsers,
      totalTaps,
      dailyPool: poolsSnapshot.data()?.amount || 0,
      loginPool: loginSnapshot.data()?.amount || 0,
      referralPool: referralSnapshot.data()?.amount || 0,
      socialPool: socialSnapshot.data()?.amount || 0,
      presalePool: presaleSnapshot.data()?.amount || 0
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

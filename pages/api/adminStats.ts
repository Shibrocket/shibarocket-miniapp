import type { NextApiRequest, NextApiResponse } from 'next';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get all users
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const totalUsers = usersSnapshot.size;

    let totalTaps = 0;
    usersSnapshot.forEach((doc) => {
      const data = doc.data();
      totalTaps += data.taps || 0;
    });

    // Pools
    const poolDocRef = doc(db, 'pools', 'dailyPools');
    const poolSnapshot = await getDoc(poolDocRef);
    const poolData = poolSnapshot.exists() ? poolSnapshot.data() : {};

    const today = new Date();
    const todayString = today.toISOString().split('T')[0];

    let updatedPools = {
      tappingPool: Number(poolData?.tappingPool) || 1_000_000_000,
      socialTaskPool: Number(poolData?.socialTaskPool) || 666_000_000,
      referralPool: Number(poolData?.referralPool) || 666_000_000,
      loginPool: Number(poolData?.loginPool) || 666_000_000,
      presalePool: Number(poolData?.presalePool) || 333_000_000,
      totalDaily: Number(poolData?.totalDaily) || 3_330_000_000,
      lastPoolUpdateDate: poolData?.lastPoolUpdateDate || todayString,
    };

    // Update if it's a new day or missing
    if (!poolData || poolData.lastPoolUpdateDate !== todayString) {
      updatedPools.lastPoolUpdateDate = todayString;
      await setDoc(poolDocRef, updatedPools);
    }

    // Get global settings
    const settingsDocRef = doc(db, 'settings', 'config');
    const settingsSnapshot = await getDoc(settingsDocRef);
    const settings = settingsSnapshot.exists() ? settingsSnapshot.data() : {};

    // Respond with admin stats
    res.status(200).json({
      totalUsers,
      totalTaps,
      pools: updatedPools,
      settings,
    });

  } catch (error) {
    console.error('Error in adminStats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

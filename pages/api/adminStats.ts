import type { NextApiRequest, NextApiResponse } from 'next';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const totalUsers = usersSnapshot.size;

    let totalTaps = 0;
    usersSnapshot.forEach((doc) => {
      const data = doc.data();
      totalTaps += data.taps || 0;
    });

    const poolDocRef = doc(db, 'pools', 'dailyPools');
    const poolSnapshot = await getDoc(poolDocRef);
    const poolData = poolSnapshot.data();

    const today = new Date();
    const todayString = today.toISOString().split('T')[0];

    let updatedPools = poolData || {};

    if (!poolData || poolData.lastPoolUpdateDate !== todayString) {
      updatedPools = {
        tappingPool: 1_000_000_000,
        socialTaskPool: 666_000_000,
        referralPool: 666_000_000,
        loginPool: 666_000_000,
        presalePool: 333_000_000,
        totalDaily: 3_330_000_000,
        lastPoolUpdateDate: todayString,
      };
      await setDoc(poolDocRef, updatedPools);
    }

    const settingsDocRef = doc(db, 'settings', 'config');
    const settingsSnapshot = await getDoc(settingsDocRef);
    const settings = settingsSnapshot.exists() ? settingsSnapshot.data() : {};

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

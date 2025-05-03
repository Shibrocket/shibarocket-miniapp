import { NextApiRequest, NextApiResponse } from 'next';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const poolDocRef = doc(db, 'pools', 'dailyPools');
  const poolSnapshot = await getDoc(poolDocRef);
  const poolData = poolSnapshot.data();

  const today = new Date();
  const todayString = today.toISOString().split('T')[0];

  if (!poolData || poolData.lastPoolUpdateDate !== todayString) {
    const updatedData = {
      tappingPool: 1_000_000_000,
      socialTaskPool: 666_000_000,
      referralPool: 666_000_000,
      loginPool: 666_000_000,
      presalePool: 333_000_000,
      totalDaily: 3_330_000_000,
      lastPoolUpdateDate: todayString,
    };

    await setDoc(poolDocRef, updatedData);
    return res.status(200).json({ message: 'Daily pools reset successfully', updatedData });
  } else {
    return res.status(200).json({ message: 'Pools already updated for today' });
  }
}

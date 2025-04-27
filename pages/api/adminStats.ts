// pages/api/adminStats.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../utils/firebaseAdmin'; // path correct

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const usersSnapshot = await db.collection('users').get();
    const usersCount = usersSnapshot.size;

    res.status(200).json({ success: true, data: { usersCount } });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

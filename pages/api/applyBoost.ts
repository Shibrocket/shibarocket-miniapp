import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../utils/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const userId = req.headers['x-user-id'] as string || req.query.userId as string;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'Missing user ID' });
    }

    const userRef = db.collection('users').doc(userId);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const configSnap = await db.collection('settings').doc('config').get();
    const config = configSnap.data();
    const boostAmount = config?.adsEnergyReward ?? 100;

    await userRef.update({
      boostedEnergy: boostAmount,
    });

    return res.status(200).json({
      success: true,
      message: `Boost applied: +${boostAmount} energy`,
      boostedEnergy: boostAmount,
    });
  } catch (error: any) {
    console.error('Boost error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}

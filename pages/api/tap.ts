import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../utils/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' });
  }

  try {
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const settingsSnap = await db.collection('settings').doc('config').get();
    const settings = settingsSnap.data();
    if (!settings) {
      return res.status(500).json({ error: 'Settings not found' });
    }

    const userData = userDoc.data() || {};
    const currentEnergy = userData.energy ?? 0;
    const maxEnergy = settings.maxEnergyWithBoost ?? 500;

    if (currentEnergy <= 0) {
      return res.status(400).json({ message: 'No energy left. Please wait or boost.' });
    }

    const earned = settings.tapReward ?? 5;
    const newEnergy = currentEnergy - 1;
    const newTotal = (userData.shrockEarned ?? 0) + earned;

    await userRef.update({
      energy: newEnergy,
      shrockEarned: newTotal,
    });

    return res.status(200).json({
      message: 'Tap successful',
      earned,
      newEnergy,
      totalEarned: newTotal,
    });

  } catch (error: any) {
    console.error('Tap API error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}

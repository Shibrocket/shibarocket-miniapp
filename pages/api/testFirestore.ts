import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../utils/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const testRef = db.collection('test').doc('connection-check');

    await testRef.set({
      message: 'Firestore connection successful!',
      timestamp: new Date().toISOString(),
    });

    const doc = await testRef.get();

    res.status(200).json({
      success: true,
      data: doc.data(),
    });
  } catch (error: any) {
    console.error('Firestore test error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Unknown error',
    });
  }
}

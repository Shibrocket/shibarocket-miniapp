import { initFirebaseAdmin, db } from '../../utils/firebaseAdmin';

const boostMap = {
  referral: 50,
  social: 100,
  streak: 50,
  ad: 100 
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { telegramId, type } = req.body;
  if (!telegramId || !type || !boostMap[type]) {
    return res.status(400).json({ error: "Invalid boost request" });
  }

  await initFirebaseAdmin();
  const userRef = db.collection("users").doc(telegramId);
  const userSnap = await userRef.get();

  if (!userSnap.exists) return res.status(404).json({ error: "User not found" });

  const currentBoost = userSnap.data().boostEnergy || 0;
  const boost = boostMap[type];

  const newBoost = Math.min(currentBoost + boost, 100);

  await userRef.update({ boostEnergy: newBoost });

  return res.status(200).json({ newBoost });
}

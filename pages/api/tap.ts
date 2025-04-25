import { initFirebaseAdmin, db } from '../../utils/firebaseAdmin';

const SHROCK_PER_TAP = 5;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { telegramId } = req.body;
  if (!telegramId) return res.status(400).json({ error: "Missing Telegram ID" });

  await initFirebaseAdmin();
  const userRef = db.collection("users").doc(telegramId);
  const userSnap = await userRef.get();

  const now = new Date().toISOString();

  if (!userSnap.exists) {
    await userRef.set({
      energy: 400,
      boostEnergy: 0,
      tapsToday: 0,
      totalShrockEarned: 0,
      lastEnergyReset: now,
    });
  }

  const user = (await userRef.get()).data();
  const maxEnergy = Math.min(400 + (user.boostEnergy || 0), 500);

  if (user.tapsToday >= maxEnergy) {
    return res.status(400).json({ error: "You’ve used all your energy for today!" });
  }

  const newTaps = user.tapsToday + 1;
  const newTotal = user.totalShrockEarned + SHROCK_PER_TAP;

  await userRef.update({
    tapsToday: newTaps,
    totalShrockEarned: newTotal
  });

  return res.status(200).json({
    shrockEarned: SHROCK_PER_TAP,
    total: newTotal,
    remainingEnergy: maxEnergy - newTaps
  });
}


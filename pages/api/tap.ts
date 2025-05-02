import { db } from "../../utils/firebaseAdmin";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ message: "Missing userId" });
  }

  const userRef = db.collection("users").doc(userId);
  const userSnap = await userRef.get();

  if (!userSnap.exists) {
    await userRef.set({
      energy: 399,
      shrock: 5,
      totalEarned: 5,
      totalTaps: 1,
      lastTap: Date.now(),
    });

    return res.status(200).json({
      message: "Tap successful",
      earned: 5,
      newEnergy: 399,
      totalEarned: 5,
    });
  }

  const current = userSnap.data() || {};
  const energy = current.energy || 0;
  const tapReward = 5;

  if (energy <= 0) {
    return res.status(400).json({ message: "Out of energy" });
  }

  const newEnergy = energy - 1;
  const newShrock = (current.shrock || 0) + tapReward;
  const newTotal = (current.totalEarned || 0) + tapReward;
  const newTotalTaps = (current.totalTaps || 0) + 1;

  await userRef.update({
    energy: newEnergy,
    shrock: newShrock,
    totalEarned: newTotal,
    totalTaps: newTotalTaps,
    lastTap: Date.now(),
  });

  return res.status(200).json({
    message: "Tap successful",
    earned: tapReward,
    newEnergy,
    totalEarned: newTotal,
    totalTaps: newTotalTaps,
  });
}

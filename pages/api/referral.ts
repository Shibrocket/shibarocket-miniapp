import { db } from "../../utils/firebaseAdmin";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { referrerId, refereeId } = req.body;

  if (!referrerId || !refereeId || referrerId === refereeId) {
    return res.status(400).json({ success: false, message: "Invalid user or referer ID" });
  }

  const referrerRef = db.collection("users").doc(referrerId);
  const refereeRef = db.collection("users").doc(refereeId);

  const referrerSnap = await referrerRef.get();
  if (!referrerSnap.exists) {
    await referrerRef.set({ referredUsers: [refereeId], shrock: 70000 });
  } else {
    await referrerRef.update({
      referredUsers: [...(referrerSnap.data()?.referredUsers || []), refereeId],
      shrock: (referrerSnap.data()?.shrock || 0) + 70000,
    });
  }

  const refereeSnap = await refereeRef.get();
  if (!refereeSnap.exists) {
    await refereeRef.set({ referrer: referrerId, shrock: 30000 });
  } else {
    await refereeRef.update({
      referrer: referrerId,
      shrock: (refereeSnap.data()?.shrock || 0) + 30000,
    });
  }

  res.status(200).json({
    success: true,
    referrerReward: 70000,
    refereeReward: 30000,
  });
}

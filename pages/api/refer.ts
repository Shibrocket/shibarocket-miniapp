// pages/api/refer.ts

import { db } from "../../utils/firebaseAdmin";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { userId, refererId } = req.body;

    if (!userId || !refererId || userId === refererId) {
      return res.status(400).json({ success: false, message: "Invalid user or referer ID" });
    }

    const userRef = db.collection("users").doc(userId);
    const refererRef = db.collection("users").doc(refererId);

    const [userSnap, refererSnap, configSnap] = await Promise.all([
      userRef.get(),
      refererRef.get(),
      db.collection("settings").doc("config").get(),
    ]);

    if (!userSnap.exists || !refererSnap.exists) {
      return res.status(404).json({ success: false, message: "User or referer not found" });
    }

    const userData = userSnap.data();
    const refererData = refererSnap.data();
    const config = configSnap.exists ? configSnap.data() : {};

    if (!userData) {
      return res.status(500).json({ success: false, message: "Failed to read user data" });
    }

    if (userData.refererId) {
      return res.status(400).json({ success: false, message: "Referral already claimed" });
    }

    const referrerReward = config?.referralRewardReferrer || 70000;
    const refereeReward = config?.referralRewardReferee || 30000;

    await Promise.all([
      userRef.update({
        refererId,
        shrockEarned: (userData.shrockEarned || 0) + refereeReward,
      }),
      refererRef.update({
        referrals: (refererData?.referrals || 0) + 1,
        shrockEarned: (refererData?.shrockEarned || 0) + referrerReward,
      }),
    ]);

    return res.status(200).json({
      success: true,
      message: `Referral complete! Referrer +${referrerReward}, You +${refereeReward}`,
    });
  } catch (error) {
    console.error("Referral error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

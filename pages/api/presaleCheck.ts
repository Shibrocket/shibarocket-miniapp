import { db } from "../../utils/firebaseAdmin";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ success: false, message: "Missing userId" });
  }

  const userRef = db.collection("users").doc(userId);
  const userSnap = await userRef.get();

  if (!userSnap.exists || userSnap.data()?.hasClaimedPresale) {
    return res.status(200).json({
      success: false,
      eligible: false,
      message: "User not found or not eligible",
    });
  }

  const rewardAmount = 100000;

  return res.status(200).json({
    success: true,
    eligible: true,
    amount: rewardAmount,
  });
}

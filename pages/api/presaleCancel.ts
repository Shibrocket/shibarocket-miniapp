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

  if (!userSnap.exists) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  await userRef.update({
    hasClaimedPresale: false,
    shrock: Math.max((userSnap.data()?.shrock || 0) - 100000, 0),
  });

  return res.status(200).json({
    success: true,
    message: "Presale claim reset",
  });
}

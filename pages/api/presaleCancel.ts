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

  try {
    const userRef = db.collection("users").doc(userId);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const userData = userSnap.data();
    if (!userData) {
      return res.status(500).json({ success: false, message: "User data is missing" });
    }

    const currentShrock = userData.shrock || 0;
    const updatedShrock = Math.max(currentShrock - 100000, 0);

    await userRef.update({
      hasClaimedPresale: false,
      shrock: updatedShrock,
    });

    return res.status(200).json({
      success: true,
      message: "Presale claim reset",
    });
  } catch (error) {
    console.error("Presale cancel error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

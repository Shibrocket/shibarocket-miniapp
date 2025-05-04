import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../utils/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { userId, action } = req.body;

  if (!userId || !action) {
    return res.status(400).json({ success: false, message: "Missing userId or action" });
  }

  try {
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const configSnap = await db.collection("settings").doc("config").get();
    const config = configSnap.data();
    if (!config) {
      return res.status(500).json({ success: false, message: "Settings not found" });
    }

    const userData = userDoc.data();
    if (!userData) {
      return res.status(500).json({ success: false, message: "User data missing" });
    }

    let updateData = {};
    let reward = 0;

    if (action === "reminder" && !userData.presaleReminderSet) {
      reward = config.presaleReminderReward ?? 50000;
      updateData = {
        presaleReminderSet: true,
        shrockEarned: (userData.shrockEarned || 0) + reward,
      };
    } else if (action === "quiz" && !userData.quizCompleted) {
      reward = config.quizReward ?? 100000;
      updateData = {
        quizCompleted: true,
        shrockEarned: (userData.shrockEarned || 0) + reward,
      };
    } else {
      return res.status(400).json({ success: false, message: "Already completed or invalid action" });
    }

    await userRef.update(updateData);

    return res.status(200).json({
      success: true,
      message: `You earned ${reward} $SHROCK for ${action}`,
    });
  } catch (error: any) {
    console.error("Presale task error:", error);
    return res.status(500).json({ success: false, message: error.message || "Server error" });
  }
}

import { db } from "../../utils/firebaseAdmin";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { userId, action } = req.body;

  if (!userId || !action) {
    return res.status(400).json({ success: false, message: "Missing userId or action" });
  }

  const userRef = db.collection("users").doc(userId);
  const configSnap = await db.collection("settings").doc("config").get();

  try {
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const userData = userDoc.data();
    if (!userData) {
      return res.status(500).json({ success: false, message: "User data is missing" });
    }

    let updateData: any = {};
    let reward = 0;

    if (action === "reminder" && !userData.presaleReminderSet) {
      reward = configSnap.data()?.presaleReminderReward || 50000;
      updateData = {
        presaleReminderSet: true,
        shrockEarned: (userData.shrockEarned || 0) + reward,
      };
    } else if (action === "quiz" && !userData.quizCompleted) {
      reward = configSnap.data()?.quizReward || 100000;
      updateData = {
        quizCompleted: true,
        shrockEarned: (userData.shrockEarned || 0) + reward,
      };
    } else {
      return res.status(400).json({ success: false, message: "Action already completed or invalid" });
    }

    await userRef.update(updateData);

    return res.status(200).json({
      success: true,
      message: `You earned ${reward} $SHROCK for ${action}`,
    });
  } catch (error) {
    console.error("Presale error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

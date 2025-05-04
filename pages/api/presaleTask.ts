// pages/api/presaleTask.ts

import { db } from "../../utils/firebaseAdmin";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { userId, type } = req.body;

    if (!userId || !type) {
      return res.status(400).json({ success: false, message: "Missing userId or type" });
    }

    const userRef = db.collection("users").doc(userId);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const userData = userSnap.data();
    if (!userData) {
      return res.status(500).json({ success: false, message: "Failed to read user data" });
    }

    if (type === "reminder" && userData.presaleReminderCompleted) {
      return res.status(400).json({ success: false, message: "Reminder already completed" });
    }

    if (type === "quiz" && userData.presaleQuizCompleted) {
      return res.status(400).json({ success: false, message: "Quiz already completed" });
    }

    const configSnap = await db.collection("settings").doc("config").get();
    const config = configSnap.exists ? configSnap.data() : {};

    const reward =
      type === "reminder"
        ? config?.presaleReminderReward || 50000
        : config?.quizReward || 100000;

    await userRef.update({
      shrockEarned: (userData.shrockEarned || 0) + reward,
      ...(type === "reminder" ? { presaleReminderCompleted: true } : {}),
      ...(type === "quiz" ? { presaleQuizCompleted: true } : {}),
    });

    return res.status(200).json({
      success: true,
      message: `${type === "reminder" ? "Reminder" : "Quiz"} completed! You earned ${reward} $SHROCK.`,
    });
  } catch (error) {
    console.error("Presale task error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

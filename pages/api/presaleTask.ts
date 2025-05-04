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
    const configSnap = await db.collection("settings").doc("config").get();
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const userData = userSnap.data();
    if (!userData) {
      return res.status(500).json({ success: false, message: "Invalid user data" });
    }

    const alreadyDoneField = type === "reminder" ? "presaleReminderSet" : "quizCompleted";
    if (userData[alreadyDoneField]) {
      return res.status(400).json({ success: false, message: `You already completed ${type}` });
    }

    const reward =
      type === "reminder"
        ? configSnap.data().presaleReminderReward || 50000
        : configSnap.data().quizReward || 100000;

    await userRef.update({
      [alreadyDoneField]: true,
      shrockEarned: (userData.shrockEarned || 0) + reward,
    });

    return res.status(200).json({
      success: true,
      message: `${type === "reminder" ? "Reminder set" : "Quiz completed"}! You earned ${reward} $SHROCK.`,
    });

  } catch (error) {
    console.error("Presale task error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

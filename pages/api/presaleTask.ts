import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../utils/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ success: false, message: "Method not allowed" });

  const { userId, type } = req.body;

  if (!userId || !type || !["reminder", "quiz"].includes(type)) {
    return res.status(400).json({ success: false, message: "Missing or invalid parameters" });
  }

  try {
    const userRef = db.collection("users").doc(userId);
    const [userSnap, configSnap] = await Promise.all([
      userRef.get(),
      db.collection("settings").doc("config").get()
    ]);

    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const userData = userSnap.data();
    const config = configSnap.data();

    let reward = 0;
    const updateData: Record<string, any> = {};
    const alreadyDoneField = type === "reminder" ? "presaleReminderSet" : "quizCompleted";

    if (userData[alreadyDoneField]) {
      return res.status(400).json({ success: false, message: `You already completed ${type}` });
    }

    reward = type === "reminder"
      ? config.presaleReminderReward || 50000
      : config.quizReward || 100000;

    updateData[alreadyDoneField] = true;
    updateData.shrockEarned = (userData.shrockEarned || 0) + reward;

    await userRef.update(updateData);

    return res.status(200).json({
      success: true,
      message: `You earned ${reward} $SHROCK for completing ${type}`
    });

  } catch (error) {
    console.error("Presale task error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

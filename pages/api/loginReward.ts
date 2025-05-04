import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../utils/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ success: false, message: "Method not allowed" });

  try {
    const userId = req.headers["x-user-id"] || req.query.userId;
    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

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

    const today = new Date().toISOString().slice(0, 10);
    const userData = userDoc.data();
    const lastLogin = userData?.lastLoginDate || "";
    let streak = userData?.loginStreak || 0;

    if (lastLogin === today) {
      return res.status(200).json({ success: false, message: "Already logged in today" });
    }

    // Check if the last login was yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);
    streak = lastLogin === yesterdayStr ? streak + 1 : 1;

    const rewardDay = Math.min(streak, config.rewardResetDay || 7);
    const rewardKey = `loginRewardDay${rewardDay}`;
    const rewardAmount = config[rewardKey] ?? config.loginRewardDay1 ?? 1000000;

    await userRef.update({
      lastLoginDate: today,
      loginStreak: streak,
      shrockEarned: (userData?.shrockEarned || 0) + rewardAmount,
    });

    return res.status(200).json({
      success: true,
      message: `Login reward of ${rewardAmount} $SHROCK applied for Day ${rewardDay}`,
    });
  } catch (error: any) {
    console.error("Login reward error:", error);
    return res.status(500).json({ success: false, message: error.message || "Server error" });
  }
}

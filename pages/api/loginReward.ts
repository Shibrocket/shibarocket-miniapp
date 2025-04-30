import { db } from "../../utils/firebaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const userId = req.headers["x-user-id"] || req.query.userId;
    if (!userId) return res.status(400).json({ success: false, message: "User ID is required" });

    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) return res.status(404).json({ success: false, message: "User not found" });

    const configSnap = await db.collection("settings").doc("config").get();
    const config = configSnap.data();

    const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
    const userData = userDoc.data();
    const lastLogin = userData.lastLoginDate;
    let streak = userData.loginStreak || 0;

    if (lastLogin === today) {
      return res.status(200).json({ success: false, message: "Already logged in today" });
    }

    // Reset streak if login was more than 1 day ago
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = lastLogin === yesterday.toISOString().slice(0, 10);
    streak = isYesterday ? streak + 1 : 1;

    // Cap streak to rewardResetDay
    const rewardDay = Math.min(streak, config.rewardResetDay || 7);
    const rewardKey = `loginRewardDay${rewardDay}`;
    const rewardAmount = config[rewardKey] || config.loginRewardDay1;

    await userRef.update({
      lastLoginDate: today,
      loginStreak: streak,
      shrockEarned: (userData.shrockEarned || 0) + rewardAmount,
    });

    return res.status(200).json({
      success: true,
      message: `Login reward of ${rewardAmount} $SHROCK applied for Day ${rewardDay}`,
    });
  } catch (error) {
    console.error("Login reward error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

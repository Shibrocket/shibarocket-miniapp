import { db } from "../../utils/firebaseAdmin";

export default async function handler(req, res) {
  try {
    // Get config settings
    const configSnap = await db.collection("settings").doc("config").get();
    const config = configSnap.data();

    // Check if config exists
    if (!config) {
      return res.status(500).json({ success: false, message: "Missing config document in settings collection" });
    }

    // Fetch user and pool stats
    const usersSnap = await db.collection("users").get();
    const poolSnap = await db.collection("pools").doc("current").get();

    const users = usersSnap.docs.map(doc => doc.data());
    const pool = poolSnap.exists ? poolSnap.data() : {};

    // Calculate totals
    const totalUsers = users.length;
    const totalTaps = users.reduce((sum, u) => sum + (u.shrockEarned || 0), 0);
    const totalSocialTasks = users.reduce((sum, u) => sum + ((u.socialTasksCompleted?.length || 0)), 0);
    const totalReferrals = users.reduce((sum, u) => sum + (u.referrals || 0), 0);
    const totalPresale = users.reduce((sum, u) =>
      sum + (u.presaleReminderSet ? 1 : 0) + (u.quizCompleted ? 1 : 0), 0
    );

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalTaps,
        totalSocialTasks,
        totalReferrals,
        totalPresale,
        tappingPoolRemaining: pool.tappingRemaining || 0,
        socialPoolRemaining: pool.socialRemaining || 0,
        referralPoolRemaining: pool.referralRemaining || 0,
        loginPoolRemaining: pool.loginRemaining || 0,
        presalePoolRemaining: pool.presaleRemaining || 0,
      }
    });
  } catch (error) {
    console.error("Stats API error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

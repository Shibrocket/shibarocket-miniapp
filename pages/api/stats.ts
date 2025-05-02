import { db } from "../../utils/firebaseAdmin";

export default async function handler(req, res) {
  try {
    const configSnap = await db.collection("settings").doc("config").get();

    if (!configSnap.exists) {
      console.error("Missing settings/config in Firestore");
      return res.status(500).json({ error: "Config not found" });
    }

    const config = configSnap.data();

    const stats = {
      tapReward: config.tapReward ?? 5,
      maxEnergy: config.maxEnergyPerDay ?? 400,
      maxEnergyWithBoost: config.maxEnergyWithBoost ?? 500,
      rewardResetDay: config.rewardResetDay ?? 7,
      loginRewards: [
        config.loginRewardDay1 ?? 500,
        config.loginRewardDay2 ?? 550,
        config.loginRewardDay3 ?? 600,
        config.loginRewardDay4 ?? 650,
        config.loginRewardDay5 ?? 700,
        config.loginRewardDay6 ?? 750,
      ],
      referralRewardReferrer: config.referralRewardReferrer ?? 70000,
      referralRewardReferee: config.referralRewardReferee ?? 30000,
      socialTaskReward: config.socialTaskReward ?? 20000,
      presaleReminderReward: config.presaleReminderReward ?? 50000,
      quizReward: config.quizReward ?? 100000,
      adsEnergyReward: config.adsEnergyReward ?? 100,
      adsShrockReward: config.adsShrockReward ?? 500,
      dailyResetTimeUTC: config.dailyResetTimeUTC ?? "00:00",
    };

    return res.status(200).json(stats);
  } catch (error) {
    console.error("Failed to load stats:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

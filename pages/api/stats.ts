import { db } from "../../utils/firebaseAdmin";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const configSnap = await db.collection("settings").doc("config").get();

    if (!configSnap.exists) {
      return res.status(500).json({ error: "Settings/config document not found in Firestore." });
    }

    const config = configSnap.data() || {};

    res.status(200).json({
      tapReward: config.tapReward ?? 5,
      maxEnergyPerDay: config.maxEnergyPerDay ?? 400,
      maxEnergyWithBoost: config.maxEnergyWithBoost ?? 500,
      rewardResetDay: config.rewardResetDay ?? 7,
      dailyResetTimeUTC: config.dailyResetTimeUTC ?? "00:00",

      loginRewardDay1: config.loginRewardDay1 ?? 500,
      loginRewardDay2: config.loginRewardDay2 ?? 550,
      loginRewardDay3: config.loginRewardDay3 ?? 600,
      loginRewardDay4: config.loginRewardDay4 ?? 650,
      loginRewardDay5: config.loginRewardDay5 ?? 700,
      loginRewardDay6: config.loginRewardDay6 ?? 750,

      referralRewardReferrer: config.referralRewardReferrer ?? 70000,
      referralRewardReferee: config.referralRewardReferee ?? 30000,

      socialTaskReward: config.socialTaskReward ?? 20000,
      presaleReminderReward: config.presaleReminderReward ?? 50000,
      quizReward: config.quizReward ?? 100000,

      adsEnergyReward: config.adsEnergyReward ?? 100,
      adsShrockReward: config.adsShrockReward ?? 500,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

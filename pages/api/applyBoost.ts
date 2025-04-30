import { db } from "../../utils/firebaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { userId, boostType } = req.body;
  if (!userId || !boostType) {
    return res.status(400).json({ message: "Missing userId or boostType" });
  }

  try {
    const userRef = db.collection("users").doc(userId);
    const userSnap = await userRef.get();
    if (!userSnap.exists) return res.status(404).json({ message: "User not found" });

    const userData = userSnap.data();

    const configSnap = await db.collection("settings").doc("config").get();
    const config = configSnap.data();

    const currentEnergy = userData.energy || 0;
    const currentBoosted = userData.boostedEnergy || 0;
    const maxEnergyWithBoost = config.maxEnergyWithBoost || 500;
    const adBoost = config.adsEnergyReward || 100;

    if (currentEnergy + currentBoosted >= maxEnergyWithBoost) {
      return res.status(200).json({ success: false, message: "Energy boost limit reached" });
    }

    const boostAmount = boostType === "ad" ? adBoost : 0;

    await userRef.update({
      boostedEnergy: currentBoosted + boostAmount,
    });

    return res.status(200).json({
      success: true,
      message: `Boosted ${boostAmount} energy. Total now: ${currentEnergy + currentBoosted + boostAmount}`,
    });
  } catch (error) {
    console.error("Apply boost error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

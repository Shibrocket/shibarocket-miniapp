import { db } from "../../utils/firebaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: "Missing userId" });

  try {
    const userRef = db.collection("users").doc(userId);
    const userSnap = await userRef.get();
    if (!userSnap.exists) return res.status(404).json({ message: "User not found" });

    const userData = userSnap.data();
    const configSnap = await db.collection("settings").doc("config").get();
    const config = configSnap.data();

    const maxEnergy = config.maxEnergyPerDay || 400;
    const shrockPerTap = config.tapReward || 5;

    const energy = userData.energy || 0;
    const boosted = userData.boostedEnergy || 0;
    const totalEnergy = energy + boosted;

    if (totalEnergy <= 0) {
      return res.status(200).json({ success: false, message: "No energy left for today." });
    }

    const newEnergy = energy > 0 ? energy - 1 : 0;
    const newBoosted = energy > 0 ? boosted : boosted - 1;
    const newEarned = (userData.shrockEarned || 0) + shrockPerTap;

    await userRef.update({
      energy: newEnergy,
      boostedEnergy: newBoosted,
      shrockEarned: newEarned,
    });

    return res.status(200).json({
      success: true,
      message: `+${shrockPerTap} $SHROCK earned!`,
      newEnergy,
      newBoosted,
      totalEarned: newEarned,
    });
  } catch (error) {
    console.error("Tap error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

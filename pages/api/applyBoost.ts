import { db } from "../../utils/firebaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const userId = req.headers["x-user-id"] || req.query.userId;
    if (!userId) return res.status(400).json({ success: false, message: "User ID is required" });

    const userRef = db.collection("users").doc(userId);
    const userSnap = await userRef.get();
    if (!userSnap.exists) return res.status(404).json({ success: false, message: "User not found" });

    // Fetch the config document
    const configSnap = await db.collection("settings").doc("config").get();
    const config = configSnap.data();
    const boostAmount = config?.adsEnergyReward ?? 100;

    await userRef.update({
      boostedEnergy: boostAmount,
    });

    return res.status(200).json({
      success: true,
      message: `Boost applied: +${boostAmount} energy`,
    });
  } catch (error) {
    console.error("Boost error:", error);
    return res.status(500).json({ success: false, message: "Server error during boost" });
  }
}

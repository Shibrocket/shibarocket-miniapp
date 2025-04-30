import { db } from "../../utils/firebaseAdmin";
import { getDoc, doc, Timestamp } from "firebase-admin/firestore";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: "Missing userId" });

  try {
    // Get user doc
    const userRef = db.collection("users").doc(userId);
    const userSnap = await userRef.get();

    if (!userSnap.exists) return res.status(404).json({ message: "User not found" });
    const userData = userSnap.data();

    // Get config
    const settingsSnap = await db.collection("settings").doc("config").get();
    const config = settingsSnap.data();

    const tapReward = config.tapReward || 5;
    const maxEnergy = config.maxEnergyPerDay || 400;

    // Check if user has energy
    if (userData.energy <= 0) {
      return res.status(400).json({ message: "No energy left" });
    }

    // Update user energy and SHROCK earned
    await userRef.update({
      energy: userData.energy - 1,
      shrockEarned: (userData.shrockEarned || 0) + tapReward,
    });

    return res.status(200).json({ success: true, reward: tapReward });
  } catch (error) {
    console.error("Tap error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

import { db } from "../../utils/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: "Missing userId" });

  try {
    const userRef = db.collection("users").doc(userId);
    const userSnap = await userRef.get();
    if (!userSnap.exists) return res.status(404).json({ message: "User not found" });

    const userData = userSnap.data();

    // Get config
    const configSnap = await db.collection("settings").doc("config").get();
    const config = configSnap.data();
    const maxEnergy = config.maxEnergyPerDay || 400;

    // Reset user energy
    await userRef.update({
      energy: maxEnergy,
      boostedEnergy: 0,
      lastLoginDate: Timestamp.now().toDate().toISOString().split("T")[0], // update login date
    });

    return res.status(200).json({ success: true, message: `Energy reset to ${maxEnergy}` });
  } catch (error) {
    console.error("Reset error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

import { db } from "../../utils/firebaseAdmin";

const SHROCK_PER_TAP = 5;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { telegramId } = req.body;

  if (!telegramId) {
    return res.status(400).json({ message: "Missing telegramId" });
  }

  try {
    const userRef = db.collection("users").doc(telegramId);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = userSnap.data();

    if (userData.energy <= 0) {
      return res.status(400).json({ message: "No energy left, come back later!" });
    }

    // Deduct 1 energy and add SHROCK_PER_TAP reward
    await userRef.update({
      energy: userData.energy - 1,
      shrockBalance: (userData.shrockBalance || 0) + SHROCK_PER_TAP,
      totalTapped: (userData.totalTapped || 0) + 1,
    });

    return res.status(200).json({ message: "Tap successful!" });

  } catch (error) {
    console.error("Error tapping:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

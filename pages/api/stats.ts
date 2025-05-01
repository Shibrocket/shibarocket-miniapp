import { db } from "../../utils/firebaseAdmin";

export default async function handler(req, res) {
  try {
    const usersSnap = await db.collection("users").get();
    const userCount = usersSnap.size;

    let totalShrockEarned = 0;
    usersSnap.forEach((doc) => {
      const data = doc.data();
      totalShrockEarned += typeof data.shrockEarned === 'number' ? data.shrockEarned : 0;
    });

    res.status(200).json({
      success: true,
      totalUsers: userCount,
      totalShrockEarned,
    });
  } catch (error) {
    console.error("Stats API error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
}

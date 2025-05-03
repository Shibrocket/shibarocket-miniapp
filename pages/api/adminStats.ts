// pages/api/adminStats.ts
import { adminDb } from "@/lib/firebaseAdmin";

export default async function handler(req, res) {
  try {
    const usersSnapshot = await adminDb.collection("users").get();
    const totalUsers = usersSnapshot.size;

    const tapsSnapshot = await adminDb.collection("taps").get();
    const totalTaps = tapsSnapshot.size;

    // Fetch from pools/dailyPools document (correct path now)
    const poolDoc = await adminDb.collection("pools").doc("dailyPools").get();

    const pools = poolDoc.exists ? poolDoc.data() : {};

    res.status(200).json({
      totalUsers,
      totalTaps,
      pools,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

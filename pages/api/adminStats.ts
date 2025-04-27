// pages/api/adminStats.ts

import { getFirestore } from "firebase-admin/firestore";
import { initAdminApp } from "../../utils/firebaseAdmin";

export default async function handler(req, res) {
  try {
    await initAdminApp();
    const db = getFirestore();
    const dailyPoolDoc = await db.collection("dailyPool").doc("dailyPool").get();
    const dailyPoolData = dailyPoolDoc.data();

    res.status(200).json({ success: true, data: dailyPoolData });
  } catch (error) {
    console.error("Failed to fetch admin stats:", error);
    res.status(500).json({ success: false, message: "Failed to load stats" });
  }
}

import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../utils/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
    const todayPoolSnap = await db.collection("dailyPools").doc(today).get();

    if (!todayPoolSnap.exists) {
      return res.status(404).json({ message: "Today's pool not found" });
    }

    // SAFE destructuring
    const todayData = todayPoolSnap.data();
    const { total = 0, claimed = 0 } = todayData || {};
    const untapped = total - claimed;

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 1);
    const nextDay = nextDate.toISOString().slice(0, 10);

    const newTotal = 1_000_000_000 + untapped;

    await db.collection("dailyPools").doc(nextDay).set({
      total: newTotal,
      claimed: 0,
    });

    res.status(200).json({
      message: "Rollover successful",
      newDailyPool: { date: nextDay, total: newTotal, claimed: 0 },
    });
  } catch (error) {
    console.error("Rollover error:", error);
    res.status(500).json({ message: "Rollover failed" });
  }
}

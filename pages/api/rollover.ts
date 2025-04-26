import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const poolRef = doc(db, "config", "pool");
    const poolSnap = await getDoc(poolRef);

    if (!poolSnap.exists()) {
      return res.status(404).json({ message: "Daily Pool not found" });
    }

    const { dailyPool, lastUpdate } = poolSnap.data();
    const untapped = dailyPool ?? 0;

    // Reset for new day
    const newDailyPool = 1000000000 + untapped; // 1 Billion + leftover

    await setDoc(poolRef, {
      dailyPool: newDailyPool,
      lastUpdate: new Date(),
    });

    res.status(200).json({ message: "Rollover successful", newDailyPool });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Rollover failed" });
  }
}

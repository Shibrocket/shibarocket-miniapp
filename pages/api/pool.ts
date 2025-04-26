import { db } from "../../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const poolDocRef = doc(db, "settings", "dailyPool");
    const poolDocSnap = await getDoc(poolDocRef);

    if (!poolDocSnap.exists()) {
      return res.status(404).json({ error: "Pool document not found" });
    }

    const data = poolDocSnap.data();
    const today = new Date().toISOString().split('T')[0];

    let pool = data.pool;
    let totalTappedToday = data.totalTappedToday;
    let lastPoolUpdateDate = data.lastPoolUpdateDate;

    if (lastPoolUpdateDate !== today) {
      // Rollover logic
      const remainingTokens = pool - totalTappedToday;
      const newPool = 1000000000 + (remainingTokens > 0 ? remainingTokens : 0);

      await updateDoc(poolDocRef, {
        pool: newPool,
        totalTappedToday: 0,
        lastPoolUpdateDate: today,
      });

      return res.status(200).json({ message: "Pool rolled over successfully", pool: newPool });
    }

    return res.status(200).json({ message: "No rollover needed", pool });
  } catch (error) {
    console.error("Error updating pool:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

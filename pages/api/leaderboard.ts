import { db } from "../../utils/firebaseAdmin";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const snapshot = await db
      .collection("users")
      .orderBy("shrock", "desc")
      .limit(10)
      .get();

    const leaderboard = snapshot.docs.map((doc, index) => ({
      rank: index + 1,
      userId: doc.id,
      shrock: doc.data().shrock || 0,
    }));

    return res.status(200).json({ success: true, leaderboard });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

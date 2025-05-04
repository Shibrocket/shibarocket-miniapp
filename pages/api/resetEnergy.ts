import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../utils/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    const configSnap = await db.collection("settings").doc("config").get();
    const config = configSnap.data();

    const maxEnergy = config?.maxEnergyPerDay ?? 400;
    const rewardResetDay = config?.rewardResetDay ?? 7;

    const usersRef = db.collection("users");
    const snapshot = await usersRef.get();

    const today = new Date().toISOString().split("T")[0];

    const batch = db.batch();

    snapshot.forEach((doc) => {
      const user = doc.data();
      const lastLogin: string = user.lastLoginDate;
      const streak: number = user.loginStreak || 1;

      const resetFields: Record<string, any> = {
        energy: maxEnergy,
        boostedEnergy: 0,
        lastLoginDate: today,
      };

      if (lastLogin !== today) {
        resetFields.loginStreak = streak >= rewardResetDay ? 1 : streak + 1;
      }

      batch.update(doc.ref, resetFields);
    });

    await batch.commit();

    return res.status(200).json({ success: true, message: "All users' energy reset" });
  } catch (error) {
    console.error("Reset error:", error);
    return res.status(500).json({ message: "Server error during energy reset" });
  }
}


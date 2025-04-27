import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../utils/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const poolDoc = db.collection("pools").doc("main");
    const poolSnap = await poolDoc.get();

    if (!poolSnap.exists) {
      return res.status(404).json({ error: "Pool document not found" });
    }

    const poolData = poolSnap.data();
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];

    if (poolData.lastPoolUpdateDate !== todayString) {
      const updatedData = {
        ...poolData,
        lastPoolUpdateDate: todayString,
        tappingPool: poolData.tappingPool + poolData.rolloverTapping + 1000000000,
        socialTaskPool: poolData.socialTaskPool + poolData.rolloverSocialTask + 666000000,
        referralPool: poolData.referralPool + poolData.rolloverRefferal + 666000000,
        loginPool: poolData.loginPool + poolData.rolloverLogin + 666000000,
        presaleTaskPool: poolData.presaleTaskPool + poolData.rolloverPresaleTask + 333000000,
        rolloverTapping: 0,
        rolloverSocialTask: 0,
        rolloverRefferal: 0,
        rolloverLogin: 0,
        rolloverPresaleTask: 0,
        totalTappedToday: 0,
      };

      await poolDoc.set(updatedData);
      return res.status(200).json({ message: "Pool successfully reset and rolled over!" });
    } else {
      return res.status(200).json({ message: "Pool already updated today" });
    }
  } catch (error) {
    console.error("Error resetting pool:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

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
    if (!poolData) {
      return res.status(500).json({ error: "Pool data is undefined" });
    }

    const today = new Date();
    const todayString = today.toISOString().split("T")[0];

    if (poolData.lastPoolUpdateDate !== todayString) {
      const updatedData = {
        ...poolData,
        lastPoolUpdateDate: todayString,
        tappingPool: (poolData.tappingPool || 0) + (poolData.rolloverTapping || 0) + 1000000000,
        socialTaskPool: (poolData.socialTaskPool || 0) + (poolData.rolloverSocialTask || 0) + 666000000,
        referralPool: (poolData.referralPool || 0) + (poolData.rolloverRefferal || 0) + 666000000,
        loginPool: (poolData.loginPool || 0) + (poolData.rolloverLogin || 0) + 666000000,
        presaleTaskPool: (poolData.presaleTaskPool || 0) + (poolData.rolloverPresaleTask || 0) + 333000000,
        rolloverTapping: 0,
        rolloverSocialTask: 0,
        rolloverRefferal: 0,
        rolloverLogin: 0,
        rolloverPresaleTask: 0,
        totalTappedToday: 0,
      };

      await poolDoc.set(updatedData, { merge: true });

      return res.status(200).json({
        success: true,
        message: "Pool successfully reset and rolled over!",
        data: updatedData,
      });
    } else {
      return res.status(200).json({ success: true, message: "Pool already updated today" });
    }
  } catch (error) {
    console.error("Error resetting pool:", error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}

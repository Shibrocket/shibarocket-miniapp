import { db } from "../../utils/firebaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { userId, refererId } = req.body;

    if (!userId || !refererId) {
      return res.status(400).json({ success: false, message: "Missing userId or refererId" });
    }

    const userRef = db.collection("users").doc(userId);
    const refererRef = db.collection("users").doc(refererId);
    const configSnap = await db.collection("settings").doc("config").get();

    const [userSnap, refererSnap] = await Promise.all([
      userRef.get(),
      refererRef.get()
    ]);

    if (!userSnap.exists || !refererSnap.exists) {
      return res.status(404).json({ success: false, message: "User or referrer not found" });
    }

    if (!configSnap.exists) {
      return res.status(500).json({ success: false, message: "Config not found" });
    }

    const userData = userSnap.data();
    const refererData = refererSnap.data();
    const config = configSnap.data();

    if (!userData || !refererData || !config) {
      return res.status(500).json({ success: false, message: "Invalid data retrieved" });
    }

    if (userData.refererId) {
      return res.status(400).json({ success: false, message: "Referral already applied" });
    }

    const referrerReward = config.referralRewardReferrer || 70000;
    const refereeReward = config.referralRewardReferee || 30000;

    await Promise.all([
      userRef.update({
        refererId,
        shrockEarned: (userData.shrockEarned || 0) + refereeReward
      }),
      refererRef.update({
        referrals: (refererData.referrals || 0) + 1,
        shrockEarned: (refererData.shrockEarned || 0) + referrerReward
      })
    ]);

    return res.status(200).json({
      success: true,
      message: `Referral successful! Referrer earned ${referrerReward}, you earned ${refereeReward}`
    });

  } catch (error) {
    console.error("Referral error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

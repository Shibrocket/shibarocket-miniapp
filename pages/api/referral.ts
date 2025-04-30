import { db } from "../../utils/firebaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { userId, refererId } = req.body;

    if (!userId || !refererId || userId === refererId) {
      return res.status(400).json({ success: false, message: "Invalid user or referer ID" });
    }

    const userRef = db.collection("users").doc(userId);
    const refererRef = db.collection("users").doc(refererId);

    const [userSnap, refererSnap, configSnap] = await Promise.all([
      userRef.get(),
      refererRef.get(),
      db.collection("settings").doc("config").get()
    ]);

    if (!userSnap.exists || !refererSnap.exists) {
      return res.status(404).json({ success: false, message: "User or referer not found" });
    }

    const userData = userSnap.data();
    if (userData.refererId) {
      return res.status(400).json({ success: false, message: "Referral already claimed" });
    }

    const config = configSnap.data();
    const referrerReward = config.referralRewardReferrer || 70000;
    const refereeReward = config.referralRewardReferee || 30000;

    // Apply rewards
    await Promise.all([
      userRef.update({
        refererId,
        shrockEarned: (userData.shrockEarned || 0) + refereeReward
      }),
      refererRef.update({
        referrals: (refererSnap.data().referrals || 0) + 1,
        shrockEarned: (refererSnap.data().shrockEarned || 0) + referrerReward
      })
    ]);

    return res.status(200).json({
      success: true,
      message: `Referral complete! Referrer +${referrerReward}, You +${refereeReward} $SHROCK`
    });
  } catch (error) {
    console.error("Referral error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

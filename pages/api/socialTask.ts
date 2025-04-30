import { db } from "../../utils/firebaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { userId, taskId } = req.body;

    if (!userId || !taskId) {
      return res.status(400).json({ success: false, message: "Missing userId or taskId" });
    }

    const userRef = db.collection("users").doc(userId);
    const configSnap = await db.collection("settings").doc("config").get();

    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const userData = userDoc.data();
    const completed = userData.socialTasksCompleted || [];

    if (completed.includes(taskId)) {
      return res.status(400).json({ success: false, message: "Task already completed" });
    }

    const reward = configSnap.data().socialTaskReward || 20000;

    await userRef.update({
      socialTasksCompleted: [...completed, taskId],
      shrockEarned: (userData.shrockEarned || 0) + reward,
    });

    return res.status(200).json({
      success: true,
      message: `Task completed. You earned ${reward} $SHROCK.`,
    });

  } catch (error) {
    console.error("Social task error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

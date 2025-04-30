import { db } from "../../utils/firebaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { userId, taskId } = req.body;

    if (!userId || !taskId) {
      return res.status(400).json({ success: false, message: "Missing userId or taskId" });
    }

    const userRef = db.collection("users").doc(userId);
    const [userSnap, configSnap] = await Promise.all([
      userRef.get(),
      db.collection("settings").doc("config").get()
    ]);

    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const userData = userSnap.data();
    const completedTasks = userData.socialTasksCompleted || [];

    if (completedTasks.includes(taskId)) {
      return res.status(400).json({ success: false, message: "Task already completed" });
    }

    const reward = configSnap.data().socialTaskReward || 20000;
    completedTasks.push(taskId);

    await userRef.update({
      socialTasksCompleted: completedTasks,
      shrockEarned: (userData.shrockEarned || 0) + reward
    });

    return res.status(200).json({
      success: true,
      message: `Social task rewarded with ${reward} $SHROCK!`
    });
  } catch (error) {
    console.error("Social task error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

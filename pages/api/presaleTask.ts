import { db } from "../../utils/firebaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { userId, type } = req.body;

    if (!userId || !type || !["reminder", "quiz"].includes(type)) {
      return res.status(400).json({ success: false, message: "Missing or invalid parameters" });
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
    const config = configSnap.data();

    let update: any = {};
    let reward = 0;
    let alreadyDone = false;

    if (type === "reminder") {
      if (userData.presaleReminderSet) alreadyDone = true;
      reward = config.presaleReminderReward || 50000;
      update.presaleReminderSet = true;
    } else if (type === "quiz") {
      if (userData.quizCompleted) alreadyDone = true;
      reward = config.quizReward || 100000;
      update.quizCompleted = true;
    }

    if (alreadyDone) {
      return res.status(400).json({ success: false, message: `You already completed ${type}` });
    }

    update.shrockEarned = (userData.shrockEarned || 0) + reward;

    await userRef.update(update);

    return res.status(200).json({
      success: true,
      message: `You earned ${reward} $SHROCK for completing ${type}`
    });

  } catch (error) {
    console.error("Presale task error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

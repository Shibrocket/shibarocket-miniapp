import { db } from "../../utils/firebaseAdmin";
import type { NextApiRequest, NextApiResponse } from "next";
import admin from "firebase-admin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ success: false, message: "User ID is required" });
  }

  const userRef = db.collection("users").doc(userId);
  const userSnap = await userRef.get();

  const loginReward = 500;

  if (!userSnap.exists) {
    await userRef.set({
      loginStreak: 1,
      lastLogin: Date.now(),
      shrock: loginReward
    });
  } else {
    await userRef.update({
      loginStreak: admin.firestore.FieldValue.increment(1),
      lastLogin: Date.now(),
      shrock: admin.firestore.FieldValue.increment(loginReward)
    });
  }

  res.status(200).json({
    success: true,
    loginReward,
  });
}

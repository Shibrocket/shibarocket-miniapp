import { db } from "../../utils/firebaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // Get all users from Firestore
    const usersSnapshot = await db.collection("users").get();

    // Create a batch write
    const batch = db.batch();

    usersSnapshot.forEach((userDoc) => {
      // Update each user's energy back to 400
      batch.update(userDoc.ref, { energy: 400 });
    });

    // Commit the batch
    await batch.commit();

    res.status(200).json({ message: "Energy reset successfully for all users." });
  } catch (error) {
    console.error("Error resetting energy:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

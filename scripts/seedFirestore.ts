import { db } from "../utils/firebaseAdmin";

async function seedFirestore() {
  // Users - example user
  await db.collection("users").doc("guestUser").set({
    totalTaps: 2400,
    shrockEarned: 12000,
    energy: 400,
    lastLoginDate: "2025-05-01"
  });

  // Pools
  const pools = {
    daily: 1000000000,
    login: 666000000,
    referral: 666000000,
    social: 666000000,
    presale: 333000000,
  };

  for (const [key, value] of Object.entries(pools)) {
    await db.collection("pools").doc(key).set({ amount: value });
  }

  console.log("Firestore seeded successfully!");
}

seedFirestore().catch(console.error);

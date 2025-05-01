import { db } from "../utils/firebaseAdmin";

const seed = async () => {
  const testUsers = [
    { userId: "testuser1", energy: 400, boostedEnergy: 0, loginStreak: 1, referrals: 0, shrockEarned: 0, lastLoginDate: "2025-04-30" },
    { userId: "testuser2", energy: 300, boostedEnergy: 50, loginStreak: 2, referrals: 1, shrockEarned: 1000, lastLoginDate: "2025-04-30" },
    { userId: "testuser3", energy: 200, boostedEnergy: 100, loginStreak: 3, referrals: 2, shrockEarned: 2500, lastLoginDate: "2025-04-30" },
  ];

  const batch = db.batch();

  testUsers.forEach(user => {
    const userRef = db.collection("users").doc(user.userId);
    batch.set(userRef, user, { merge: true });
  });

  await batch.commit();
  console.log("Test users seeded successfully.");
};

seed().catch(console.error);

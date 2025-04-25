import { initFirebaseAdmin, db } from '../../utils/firebaseAdmin';

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  await initFirebaseAdmin();
  const usersRef = db.collection("users");
  const snapshot = await usersRef.get();

  const batch = db.batch();
  snapshot.forEach(doc => {
    batch.update(doc.ref, {
      energy: 400,
      tapsToday: 0,
      boostEnergy: 0,
      lastEnergyReset: new Date().toISOString()
    });
  });

  await batch.commit();
  return res.status(200).json({ message: "Energy reset complete" });
}

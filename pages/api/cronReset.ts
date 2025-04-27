import { NextApiRequest, NextApiResponse } from "next";
import { initFirebaseAdmin } from "../../utils/firebaseAdmin";
import { getFirestore, doc, getDoc, setDoc } from "firebase-admin/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    initFirebaseAdmin();
    const db = getFirestore();

    const poolRef = doc(db, "dailyPool", "dailyPool");
    const poolSnap = await getDoc(poolRef);

    if (!poolSnap.exists()) {
      return res.status(404).json({ message: "dailyPool not found" });
    }

    const data = poolSnap.data();

    const {
      tappingPool = 0,
      socialTaskPool = 0,
      referralPool = 0,
      loginPool = 0,
      presaleTaskPool = 0,
      rolloverTapping = 0,
      rolloverSocialTask = 0,
      rolloverReferral = 0,
      rolloverLogin = 0,
      rolloverPresaleTask =

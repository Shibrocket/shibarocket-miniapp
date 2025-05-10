"use client";

import React, { useEffect, useState } from "react"; import Countdown from "react-countdown"; import Link from "next/link"; import { useRouter } from "next/navigation"; import { doc, getDoc, updateDoc, setDoc, increment, collection, getDocs, serverTimestamp, } from "firebase/firestore"; import { db } from "@/lib/firebase";

const claimAvailableDate = new Date("2025-06-01T00:00:00Z");

export default function MainPage({ userId }) { const router = useRouter();

const [energy, setEnergy] = useState(0); const [earned, setEarned] = useState(0); const [adsWatched, setAdsWatched] = useState(false); const [isAdmin, setIsAdmin] = useState(false); const [loginRewardClaimed, setLoginRewardClaimed] = useState(false); const [socialTaskClaimed, setSocialTaskClaimed] = useState(false); const [presaleRewardClaimed, setPresaleRewardClaimed] = useState(false); const [referralRewardClaimed, setReferralRewardClaimed] = useState(false); const [presaleStats, setPresaleStats] = useState({ totalEarned: 0, totalClaimed: 0, remaining: 0, }); const [claimAvailable, setClaimAvailable] = useState(false);

const MAX_ENERGY = 500; const FREE_TAP_LIMIT = 400; const BONUS_TAP_LIMIT = 100; const presaleDate = new Date("2025-06-01T00:00:00Z"); const getToday = () => new Date().toISOString().slice(0, 10);

useEffect(() => { if (!userId) return; const today = getToday();

const fetchData = async () => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      energy: 0,
      earned: 0,
      referrals: 0,
      referralRewardClaimed: false,
      loginStreak: 0,
      totalTaps: 0,
      shrockEarned: 0,
      shrockUnclaimed: 0,
      claimed: 0,
      lastUpdated: today,
      createdAt: serverTimestamp(),
    });
  }

  const freshSnap = await getDoc(userRef);
  if (freshSnap.exists()) {
    const data = freshSnap.data();

    if (data?.lastUpdated !== today) {
      await updateDoc(userRef, {
        energy: 0,
        earned: 0,
        adsWatched: "",
        lastUpdated: today,
      });
      setEnergy(0);
      setEarned(0);
      setAdsWatched(false);
    } else {
      setEnergy(data.energy || 0);
      setEarned(data.earned || 0);
      setAdsWatched(data.adsWatched === today);
    }

    setLoginRewardClaimed(data.loginRewardClaimed === today);
    setSocialTaskClaimed(data.socialTaskClaimed === today);
    setPresaleRewardClaimed(data.presaleRewardClaimed === today);
    setReferralRewardClaimed(data.referralRewardClaimed || false);
  }

  const adminRef = doc(db, "admins", userId);
  const adminSnap = await getDoc(adminRef);
  if (adminSnap.exists() && adminSnap.data().isAdmin) {
    setIsAdmin(true);
  }

  await ensureDailyPoolsExist(today);
  await fetchPresaleStats();
  checkClaimAvailability();
};

fetchData();

}, [userId]);

const ensureDailyPoolsExist = async (date) => { const pools = [ { path: dailyPools/socialTaskPool/${date}, amount: 666_000_000 }, { path: dailyPools/presalePool/${date}, amount: 333_000_000 }, { path: dailyPools/referralPool/${date}, amount: 666_000_000 }, ]; for (let pool of pools) { const ref = doc(db, pool.path); const snap = await getDoc(ref); if (!snap.exists()) { await setDoc(ref, { remaining: pool.amount }); } } };

const getMaxEnergy = () => (adsWatched ? MAX_ENERGY : FREE_TAP_LIMIT);

const handleClaim = () => { if (!claimAvailable) { alert("Claiming is only available from June 1st."); return; } router.push("/claim"); };

return ( <div className="bg-black min-h-screen text-white font-sans flex flex-col items-center"> <div className="pt-8"> <img src="/shrock-coin.png" alt="$SHROCK" className="w-28 h-28 mx-auto" /> <h1 className="text-3xl font-bold text-orange-400 neon-text mt-2">ShibaRocket</h1> <p className="text-sm mt-1">Presale Countdown:</p> <Countdown date={presaleDate} renderer={({ days, hours, minutes, seconds }) => ( <p className="text-lg text-purple-400 mt-1"> {days}d : {hours}h : {minutes}m : {seconds}s </p> )} /> </div>

<div className="mt-6 text-center">
    <p>Energy: {energy} / {getMaxEnergy()}</p>
    <p>Earned Today: {earned.toLocaleString()} $SHROCK</p>
    {claimAvailable && (
      <button onClick={handleClaim} className="bg-green-600 text-white px-6 py-2 rounded-full mt-4">
        Claim $SHROCK
      </button>
    )}
  </div>

  <div className="fixed bottom-0 w-full bg-zinc-900 border-t border-gray-700 flex justify-around p-2">
    <button className="text-xs text-white">Tasks</button>
    <button className="text-xs text-white">Boost</button>
    <button className="text-xs text-white">W-AI</button>
    <button className="text-xs text-white">Referrals</button>
    <button className="text-xs text-white">Claim</button>
  </div>

  <style jsx>{`
    .neon-text {
      text-shadow: 0 0 10px #ff4500, 0 0 20px #ff4500;
    }
  `}</style>
</div>

); }



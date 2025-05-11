"use client";

import React, { useEffect, useState } from "react";
import Countdown from "react-countdown";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  collection,
  getDocs,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@lib/firebase";

const presaleDate = new Date("2025-06-01T00:00:00Z");
const getToday = () => new Date().toISOString().slice(0, 10);

export default function MainPage({ userId }: { userId: string }) {
  const router = useRouter();

  const [energy, setEnergy] = useState(0);
  const [earned, setEarned] = useState(0);
  const [adsWatched, setAdsWatched] = useState(false);
  const [loginRewardClaimed, setLoginRewardClaimed] = useState(false);
  const [socialTaskClaimed, setSocialTaskClaimed] = useState(false);
  const [presaleRewardClaimed, setPresaleRewardClaimed] = useState(false);
  const [referralRewardClaimed, setReferralRewardClaimed] = useState(false);
  const [claimAvailable, setClaimAvailable] = useState(false);
  const [presaleStats, setPresaleStats] = useState({
    totalEarned: 0,
    totalClaimed: 0,
    remaining: 0,
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [tasksCount, setTasksCount] = useState(39);
  const [aiCount, setAiCount] = useState(1);
  const [boostCount, setBoostCount] = useState(15);

  const MAX_ENERGY = 500;
  const FREE_TAP_LIMIT = 400;
  const BONUS_TAP_LIMIT = 100;
  const TAP_REWARD = 5;

  useEffect(() => {
    if (!userId) return;
    const today = getToday();

    const fetchData = async () => {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          energy: FREE_TAP_LIMIT,
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
      const data = freshSnap.data();

      if (data?.lastUpdated !== today) {
        await updateDoc(userRef, {
          energy: FREE_TAP_LIMIT,
          earned: 0,
          adsWatched: "",
          lastUpdated: today,
        });
        setEnergy(FREE_TAP_LIMIT);
        setEarned(0);
        setAdsWatched(false);
      } else {
        setEnergy(data.energy || FREE_TAP_LIMIT);
        setEarned(data.earned || 0);
        setAdsWatched(data.adsWatched === today);
      }

      setLoginRewardClaimed(data?.loginRewardClaimed === today);
      setSocialTaskClaimed(data?.socialTaskClaimed === today);
      setPresaleRewardClaimed(data?.presaleRewardClaimed === today);
      setReferralRewardClaimed(data?.referralRewardClaimed || false);

      const adminSnap = await getDoc(doc(db, "admins", userId));
      if (adminSnap.exists()) setIsAdmin(true);

      await ensureDailyPoolsExist(today);
      checkClaimAvailability();
      fetchPresaleStats();
    };

    fetchData();
  }, [userId]);

  const ensureDailyPoolsExist = async (date: string) => {
    const pools = [
      { path: `dailyPools/socialTaskPool/${date}`, amount: 666_000_000 },
      { path: `dailyPools/presalePool/${date}`, amount: 333_000_000 },
      { path: `dailyPools/referralPool/${date}`, amount: 666_000_000 },
    ];
    for (let pool of pools) {
      const ref = doc(db, pool.path);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, { remaining: pool.amount });
      }
    }
  };

  const getMaxEnergy = () => (adsWatched ? MAX_ENERGY : FREE_TAP_LIMIT);

  const handleAdWatch = async () => {
    if (adsWatched || energy >= MAX_ENERGY) return;
    const bonus = Math.min(BONUS_TAP_LIMIT, MAX_ENERGY - energy);
    const newEnergy = energy + bonus;
    setEnergy(newEnergy);
    setAdsWatched(true);
    await updateDoc(doc(db, "users", userId), {
      energy: newEnergy,
      adsWatched: getToday(),
      lastUpdated: getToday(),
    });
  };

  const handleTap = async () => {
    if (energy <= 0) return alert("No taps remaining!");
    const newEnergy = energy - 1;
    const newEarned = earned + TAP_REWARD;
    setEnergy(newEnergy);
    setEarned(newEarned);
    await updateDoc(doc(db, "users", userId), {
      energy: newEnergy,
      earned: newEarned,
      lastUpdated: getToday(),
    });
  };

  const handleLoginReward = async () => {
    if (loginRewardClaimed) return;
    const reward = 500;
    await updateDoc(doc(db, "users", userId), {
      earned: increment(reward),
      loginRewardClaimed: getToday(),
      lastUpdated: getToday(),
    });
    setEarned((prev) => prev + reward);
    setLoginRewardClaimed(true);
  };

  const handleSocialTask = async () => {
    if (socialTaskClaimed) return;
    const poolRef = doc(db, `dailyPools/socialTaskPool/${getToday()}`);
    const poolSnap = await getDoc(poolRef);
    const pool = poolSnap.data();
    const reward = 20000;
    if (!pool || pool.remaining < reward) return alert("Social task rewards are finished!");
    await updateDoc(poolRef, { remaining: increment(-reward) });
    await updateDoc(doc(db, "users", userId), {
      earned: increment(reward),
      socialTaskClaimed: getToday(),
      lastUpdated: getToday(),
    });
    setEarned((prev) => prev + reward);
    setSocialTaskClaimed(true);
  };

  const handleReferralReward = async () => {
    if (referralRewardClaimed) return;
    const poolRef = doc(db, `dailyPools/referralPool/${getToday()}`);
    const poolSnap = await getDoc(poolRef);
    const pool = poolSnap.data();
    const reward = 30000;
    if (!pool || pool.remaining < reward) return alert("Referral reward pool is empty!");
    await updateDoc(poolRef, { remaining: increment(-reward) });
    await updateDoc(doc(db, "users", userId), {
      earned: increment(reward),
      referralRewardClaimed: true,
      lastUpdated: getToday(),
    });
    setEarned((prev) => prev + reward);
    setReferralRewardClaimed(true);
  };

  const fetchPresaleStats = async () => {
    const userSnap = await getDocs(collection(db, "users"));
    let totalEarned = 0;
    let totalClaimed = 0;
    userSnap.forEach((doc) => {
      const data = doc.data();
      totalEarned += data.earned || 0;
      totalClaimed += data.claimed || 0;
    });
    const totalAirdrop = 100_000_000_000;
    const remaining = totalAirdrop - totalClaimed;
    setPresaleStats({ totalEarned, totalClaimed, remaining });
  };

  const checkClaimAvailability = () => {
    setClaimAvailable(new Date() >= presaleDate);
  };

  const handleClaim = () => {
    if (!claimAvailable) {
      alert("Claiming starts June 1st.");
      return;
    }
    router.push(`/claim?userId=${userId}`);
  };

  return (
    <div className="main-page min-h-screen text-white font-sans flex flex-col items-center relative">
      <div className="pt-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <img src="/assets/shrock-coin.png" className="w-20 h-20 rounded-full" alt="$SHROCK" />
          <h1 className="text-2xl font-bold neon-text">$SHROCK</h1>
        </div>
        <p className="text-sm text-center text-purple-300">Presale Countdown:</p>
        <Countdown
          date={presaleDate}
          renderer={({ days, hours, minutes, seconds }) => (
            <p className="text-lg text-yellow-300 mt-1 text-center">
              {days}d : {hours}h : {minutes}m : {seconds}s
            </p>
          )}
        />
      </div>

      <div className="mt-6 text-center w-full max-w-md">
        <p className="text-cyan-300">Energy: {energy}/{getMaxEnergy()}</p>
        <p className="text-pink-300">Your Balance: {earned.toLocaleString()} $SHROCK</p>

        <div className="interactive-buttons mt-6 flex flex-col items-center gap-3">
          <button className="cosmic-button" onClick={() => alert('Interact with $SHROCK!')}>
            $SHROCK
          </button>
          <button className="cosmic-button" onClick={() => alert('Go to $SHROCK-Galaxy!')}>
            $SHROCK-Galaxy
          </button>
          <button className="cosmic-button" onClick={() => alert('Explore $SHROCK-Treasures!')}>
            $SHROCK-Treasures
          </button>
        </div>

        <div className="decorative-elements absolute top-1/4 left-4 flex flex-col gap-4">
          <img src="/assets/heart-icon.png" alt="Heart" className="w-10 h-10 animate-float" />
          <img src="/assets/sapphire-ticket.png" alt="Sapphire Ticket" className="w-16 h-10 animate-float" />
        </div>

        <div className="shrock-button-container mt-4">
          <button onClick={handleTap} className="shrock-button">
            <img src="/assets/shrock-coin.png" alt="$SHROCK Coin" className="shrock-logo" />
          </button>
        </div>

        {claimAvailable && (
          <button onClick={handleClaim} className="bg-green-600 text-white px-6 py-2 rounded-full mt-4">
            Claim $SHROCK
          </button>
        )}
      </div>

      <div className="mt-6 px-4 w-full max-w-md">
        <h2 className="text-lg font-bold text-purple-400 mb-2 text-center">Free Daily Boosters</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-zinc-800 rounded-lg p-3 text-center">
            <p className="text-sm mb-1 text-gray-300">Full Battery</p>
            <button
              disabled={adsWatched}
              onClick={handleAdWatch}
              className={`px-3 py-1 text-xs rounded ${adsWatched ? "bg-gray-600" : "bg-green-600"}`}
            >
              {adsWatched ? "Used" : "Watch Ad"}
            </button>
          </div>
          <div className="bg-zinc-800 rounded-lg p-3 text-center">
            <p className="text-sm mb-1 text-gray-300">Lucky Dice</p>
            <button
              onClick={() => alert("Lucky Dice feature coming soon!")}
              className="px-3 py-1 text-xs bg-blue-500 rounded"
            >
              Roll
            </button>
          </div>
        </div>
      </div>

      <div className="navigation fixed bottom-0 w-full flex justify-around p-2">
        <Link href="/tasks" className="nav-item">
          Tasks <span className="badge">{tasksCount}</span>
        </Link>
        <Link href="/w-ai" className="nav-item">
          $SHROCK-AI <span className="badge">{aiCount}</span>
        </Link>
        <Link href="/boost" className="nav-item">
          Boost <span className="badge">{boostCount}</span>
        </Link>
        <Link href="/referrals" className="nav-item">Referrals</Link>
        <Link href="/claim" className="nav-item">Claim</Link>
      </div>
    </div>
  );
}

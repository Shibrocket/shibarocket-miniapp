"use client";

import React, { useEffect, useState } from "react"; import Countdown from "react-countdown"; import { useRouter } from "next/navigation"; import Link from "next/link"; import { doc, getDoc, updateDoc, setDoc, collection, getDocs, increment, serverTimestamp, } from "firebase/firestore"; import { db } from "@/lib/firebase";

const presaleDate = new Date("2025-06-01T00:00:00Z"); const getToday = () => new Date().toISOString().slice(0, 10);

export default function MainPage({ userId }) { const router = useRouter();

const [energy, setEnergy] = useState(0); const [earned, setEarned] = useState(0); const [adsWatched, setAdsWatched] = useState(false); const [claimAvailable, setClaimAvailable] = useState(false); const [isAdmin, setIsAdmin] = useState(false); const [presaleStats, setPresaleStats] = useState({ totalEarned: 0, totalClaimed: 0, remaining: 0, });

useEffect(() => { if (!userId) return; const today = getToday();

const fetchData = async () => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      energy: 0,
      earned: 0,
      referrals: 0,
      claimed: 0,
      loginStreak: 0,
      adsWatched: "",
      lastUpdated: today,
      createdAt: serverTimestamp(),
    });
  }

  const freshSnap = await getDoc(userRef);
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

  const adminSnap = await getDoc(doc(db, "admins", userId));
  if (adminSnap.exists()) setIsAdmin(true);

  checkClaimAvailability();
  fetchPresaleStats();
};

fetchData();

}, [userId]);

const handleAdWatch = async () => { if (adsWatched || energy >= 500) return; const bonus = Math.min(100, 500 - energy); await updateDoc(doc(db, "users", userId), { energy: energy + bonus, adsWatched: getToday(), }); setEnergy((prev) => prev + bonus); setAdsWatched(true); };

const fetchPresaleStats = async () => { const usersSnap = await getDocs(collection(db, "users")); let totalEarned = 0; let totalClaimed = 0; usersSnap.forEach((doc) => { const data = doc.data(); totalEarned += data.earned || 0; totalClaimed += data.claimed || 0; }); setPresaleStats({ totalEarned, totalClaimed, remaining: 100_000_000_000 - totalClaimed, }); };

const checkClaimAvailability = () => { setClaimAvailable(new Date() >= presaleDate); };

const handleClaim = () => { if (!claimAvailable) return alert("Claiming starts June 1st."); router.push(/claim?userId=${userId}); };

return ( <div className="bg-black min-h-screen text-white font-sans flex flex-col items-center"> <div className="pt-8 w-full max-w-md"> <div className="flex justify-between items-center px-4 mb-4"> <img src="/shrock-coin.png" className="w-14 h-14" alt="$SHROCK" /> <h1 className="text-2xl font-bold text-orange-400 neon-text">ShibaRocket</h1> </div> <Countdown date={presaleDate} renderer={({ days, hours, minutes, seconds }) => ( <p className="text-center text-purple-400"> Presale starts in: {days}d {hours}h {minutes}m {seconds}s </p> )} />

<div className="mt-4 text-center">
      <p>Energy: {energy} / {adsWatched ? 500 : 400}</p>
      <p>Earned: {earned.toLocaleString()} $SHROCK</p>
    </div>

    {claimAvailable && (
      <button onClick={handleClaim} className="mt-4 w-full bg-green-600 py-2 rounded">
        Claim $SHROCK
      </button>
    )}

    <div className="mt-6">
      <h2 className="text-center text-lg text-purple-300 mb-2">Free Boosters</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-800 p-3 rounded text-center">
          <p>Full Battery</p>
          <button
            onClick={handleAdWatch}
            disabled={adsWatched}
            className={`mt-2 px-3 py-1 rounded text-sm ${adsWatched ? 'bg-gray-500' : 'bg-green-500'}`}
          >
            {adsWatched ? 'Used' : 'Watch Ad'}
          </button>
        </div>
        <div className="bg-zinc-800 p-3 rounded text-center">
          <p>Lucky Dice</p>
          <button className="mt-2 px-3 py-1 bg-blue-500 rounded text-sm">Coming Soon</button>
        </div>
      </div>
    </div>

    <div className="mt-6 bg-zinc-900 p-4 rounded text-sm">
      <p><strong>Total Earned:</strong> {presaleStats.totalEarned.toLocaleString()} $SHROCK</p>
      <p><strong>Total Claimed:</strong> {presaleStats.totalClaimed.toLocaleString()} $SHROCK</p>
      <p><strong>Remaining:</strong> {presaleStats.remaining.toLocaleString()} $SHROCK</p>
    </div>

    {isAdmin && (
      <div className="mt-6 text-center">
        <Link href="/admin">
          <button className="bg-red-600 px-4 py-2 rounded text-white">Go to Admin Dashboard</button>
        </Link>
      </div>
    )}
  </div>

  <div className="fixed bottom-0 w-full bg-zinc-900 border-t border-gray-700 flex justify-around p-2 text-sm">
    <button onClick={() => router.push("/tasks")} className="text-white">Tasks</button>
    <button onClick={() => router.push("/boost")} className="text-white">Boost</button>
    <button onClick={() => router.push("/w-ai")} className="text-white">W-AI</button>
    <button onClick={() => router.push("/referrals")} className="text-white">Referrals</button>
    <button onClick={() => router.push("/claim?userId=" + userId)} className="text-white">Claim</button>
  </div>

  <style jsx>{`
    .neon-text {
      text-shadow: 0 0 10px #ff4500, 0 0 20px #ff4500;
    }
  `}</style>
</div>

); }



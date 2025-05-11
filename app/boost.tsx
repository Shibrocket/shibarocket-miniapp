"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, updateDoc, serverTimestamp, addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@lib/firebase";
import Confetti from "react-confetti"; // Import Confetti

export default function BoostPage({ userId }) {
  const [energy, setEnergy] = useState(0);
  const [adsWatched, setAdsWatched] = useState(false);
  const [luckyDiceResult, setLuckyDiceResult] = useState<number | null>(null);
  const [cooldownActive, setCooldownActive] = useState(false);
  const [timer, setTimer] = useState(0);
  const router = useRouter();

  const MAX_ENERGY = 500;
  const FREE_TAP_LIMIT = 400;
  const BONUS_TAP_LIMIT = 100;

  useEffect(() => {
    if (!userId) return;
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      setEnergy(data.energy || 0);
      setAdsWatched(data.adsWatched === getToday());
      checkCooldown();
    }
  };

  const getToday = () => new Date().toISOString().slice(0, 10);

  const handleAdWatch = async () => {
    if (adsWatched || energy >= MAX_ENERGY) return;
    const bonus = Math.min(BONUS_TAP_LIMIT, MAX_ENERGY - energy);
    const newEnergy = energy + bonus;
    setEnergy(newEnergy);
    setAdsWatched(true);

    await updateDoc(doc(db, "users", userId), {
      energy: newEnergy,
      adsWatched: getToday(),
      lastUpdated: serverTimestamp(),
    });
  };

  const handleLuckyDice = async () => {
    if (cooldownActive) {
      alert("You can only roll once every 24 hours.");
      return;
    }

    const random = Math.floor(Math.random() * 100);
    const reward = random < 50 ? 10000 : random < 80 ? 50000 : 100000;
    setLuckyDiceResult(reward);

    // Store in Firestore
    await updateDoc(doc(db, "users", userId), {
      earned: reward,
      lastUpdated: serverTimestamp(),
    });

    await addDoc(collection(db, "users", userId, "diceHistory"), {
      result: reward,
      timestamp: serverTimestamp(),
    });

    // Check if confetti should be shown
    if (reward >= 100000) {
      <Confetti />;
    }

    checkCooldown(); // Recheck cooldown after rolling
  };

  const checkCooldown = async () => {
    const historySnap = await getDocs(collection(db, "users", userId, "diceHistory"));
    const lastRoll = historySnap.docs
      .sort((a, b) => b.data().timestamp.seconds - a.data().timestamp.seconds)[0];

    if (lastRoll) {
      const lastTimestamp = new Date(lastRoll.data().timestamp.seconds * 1000);
      const now = new Date();
      const diffHours = (now.getTime() - lastTimestamp.getTime()) / 1000 / 60 / 60;
      setCooldownActive(diffHours < 24);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans flex flex-col items-center">
      <div className="pt-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <img src="/shrock-coin.png" alt="$SHROCK" className="w-20 h-20" />
          <h1 className="text-2xl font-bold text-orange-400 neon-text">Boost Page</h1>
        </div>
        <div className="text-center">
          <p>Energy: {energy} / {MAX_ENERGY}</p>
          <p className="mt-2">Earned Today: {luckyDiceResult ? luckyDiceResult.toLocaleString() : "0"} $SHROCK</p>
        </div>
        <div className="mt-6 px-4 w-full max-w-md">
          <h2 className="text-lg font-bold text-purple-400 mb-2 text-center">Free Daily Boosters</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-800 rounded-lg p-3 text-center">
              <p className="text-sm mb-1">Full Battery</p>
              <button
                disabled={adsWatched}
                onClick={handleAdWatch}
                className={`px-3 py-1 text-xs rounded ${adsWatched ? 'bg-gray-600' : 'bg-green-600'}`}
              >
                {adsWatched ? "Used" : "Watch Ad"}
              </button>
            </div>
            <div className="bg-zinc-800 rounded-lg p-3 text-center">
              <p className="text-sm mb-1">Lucky Dice</p>
              <button
                onClick={handleLuckyDice}
                className="px-3 py-1 text-xs bg-blue-500 rounded"
              >
                Roll
              </button>
              {luckyDiceResult !== null && (
                <div className="mt-2">
                  <p className="text-sm">You won {luckyDiceResult.toLocaleString()} $SHROCK</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {luckyDiceResult >= 100000 && <Confetti />}  {/* Show Confetti for high rewards */}

      <div className="fixed bottom-0 w-full bg-zinc-900 border-t border-gray-700 flex justify-around p-2">
        {/* Bottom tab navigation */}
        <button onClick={() => router.push("/tasks")} className="text-xs text-white">Tasks</button>
        <button onClick={() => router.push("/boost")} className="text-xs text-white">Boost</button>
        <button onClick={() => router.push("/w-ai")} className="text-xs text-white">W-AI</button>
        <button onClick={() => router.push("/referrals")} className="text-xs text-white">Referrals</button>
        <button onClick={() => router.push("/claim")} className="text-xs text-white">Claim</button>
      </div>

      <style jsx>{`
        .neon-text {
          text-shadow: 0 0 10px #ff4500, 0 0 20px #ff4500;
        }
      `}</style>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, updateDoc, increment, serverTimestamp } from "firebase/firestore";
import { db } from "@lib/firebase";
import { useUser } from "@/context/UserContext";  // Access userId from context

export default function TasksPage() {
  const { userId } = useUser();
  const [loginRewardClaimed, setLoginRewardClaimed] = useState(false);
  const [socialTaskClaimed, setSocialTaskClaimed] = useState(false);
  const [presaleRewardClaimed, setPresaleRewardClaimed] = useState(false);
  const [earned, setEarned] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getToday = () => new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setEnergy(data.energy || 0);
          setEarned(data.earned || 0);
          setLoginRewardClaimed(data.loginRewardClaimed === getToday());
          setSocialTaskClaimed(data.socialTaskClaimed === getToday());
          setPresaleRewardClaimed(data.presaleRewardClaimed === getToday());
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleTaskClaim = async (taskKey: string, reward: number, setState: React.Dispatch<React.SetStateAction<boolean>>) => {
    try {
      const userRef = doc(db, "users", userId!);
      await updateDoc(userRef, {
        earned: increment(reward),
        [taskKey]: getToday(),
        lastUpdated: serverTimestamp(),
      });
      setEarned((prev) => prev + reward);
      setState(true);
    } catch (error) {
      console.error(`Failed to claim ${taskKey} reward:`, error);
      alert("Something went wrong. Try again later.");
    }
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center">
        <p>Loading your tasks...</p>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold text-center text-pink-500 mb-6">Cosmic Task Center</h1>

      <p className="text-center text-yellow-400 mb-4">Total Earned: {earned.toLocaleString()} $SHROCK</p>

      <div className="w-full max-w-md px-4">
        <p className="text-lg text-center mb-4">Earn $SHROCK by completing these tasks!</p>

        {/* Login Reward */}
        <div className="bg-gray-800 rounded-lg p-4 mb-4 text-center">
          <p className="text-xl text-blue-400 mb-2">Daily Login Reward</p>
          <button
            onClick={() => handleTaskClaim("loginRewardClaimed", 500, setLoginRewardClaimed)}
            className={`w-full py-2 rounded text-white ${loginRewardClaimed ? "bg-gray-600" : "bg-blue-600"}`}
            disabled={loginRewardClaimed}
          >
            {loginRewardClaimed ? "Reward Claimed" : "Claim 500 $SHROCK"}
          </button>
        </div>

        {/* Social Task */}
        <div className="bg-gray-800 rounded-lg p-4 mb-4 text-center">
          <p className="text-xl text-purple-400 mb-2">Complete Social Task</p>
          <button
            onClick={() => handleTaskClaim("socialTaskClaimed", 20000, setSocialTaskClaimed)}
            className={`w-full py-2 rounded text-white ${socialTaskClaimed ? "bg-gray-600" : "bg-purple-600"}`}
            disabled={socialTaskClaimed}
          >
            {socialTaskClaimed ? "Task Claimed" : "Earn 20,000 $SHROCK"}
          </button>
        </div>

        {/* Presale Task */}
        <div className="bg-gray-800 rounded-lg p-4 mb-4 text-center">
          <p className="text-xl text-green-400 mb-2">Presale Reminder</p>
          <button
            onClick={() => handleTaskClaim("presaleRewardClaimed", 75000, setPresaleRewardClaimed)}
            className={`w-full py-2 rounded text-white ${presaleRewardClaimed ? "bg-gray-600" : "bg-green-600"}`}
            disabled={presaleRewardClaimed}
          >
            {presaleRewardClaimed ? "Reward Claimed" : "Claim 75,000 $SHROCK"}
          </button>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded-full"
          >
            Back to Main Page
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes cosmic {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 100% 100%;
          }
        }
        body {
          background: linear-gradient(45deg, #1a202c, #2b6cb0);
          background-size: 200% 200%;
          animation: cosmic 3s infinite;
        }
      `}</style>
    </div>
  );
}

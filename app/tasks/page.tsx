'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, updateDoc, increment, serverTimestamp } from "firebase/firestore";
import { db } from "@lib/firebase";
import { useUser } from "@/context/UserContext";  // Import the UserContext

export default function TasksPage() {
  const { userId } = useUser();  // Access userId from context
  const [loginRewardClaimed, setLoginRewardClaimed] = useState(false);
  const [socialTaskClaimed, setSocialTaskClaimed] = useState(false);
  const [presaleRewardClaimed, setPresaleRewardClaimed] = useState(false);
  const [earned, setEarned] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [loading, setLoading] = useState(true);  // Track loading state
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
        setLoading(false);  // Set loading to false after fetching data
      }
    };

    fetchData();
  }, [userId]);

  const handleLoginReward = async () => {
    if (loginRewardClaimed) return;
    try {
      const userRef = doc(db, "users", userId);
      const reward = 500;
      await updateDoc(userRef, {
        earned: increment(reward),
        loginRewardClaimed: getToday(),
        lastUpdated: serverTimestamp(),
      });

      setEarned((prev) => prev + reward);
      setLoginRewardClaimed(true);
    } catch (error) {
      console.error("Failed to claim login reward:", error);
      alert("Something went wrong. Try again later.");
    }
  };

  const handleSocialTask = async () => {
    if (socialTaskClaimed) return;
    try {
      const userRef = doc(db, "users", userId);
      const reward = 20000;
      await updateDoc(userRef, {
        earned: increment(reward),
        socialTaskClaimed: getToday(),
        lastUpdated: serverTimestamp(),
      });

      setEarned((prev) => prev + reward);
      setSocialTaskClaimed(true);
    } catch (error) {
      console.error("Failed to claim social task reward:", error);
      alert("Something went wrong. Try again later.");
    }
  };

  const handlePresaleTask = async () => {
    if (presaleRewardClaimed) return;
    try {
      const userRef = doc(db, "users", userId);
      const reward = 75000;
      await updateDoc(userRef, {
        earned: increment(reward),
        presaleRewardClaimed: getToday(),
        lastUpdated: serverTimestamp(),
      });

      setEarned((prev) => prev + reward);
      setPresaleRewardClaimed(true);
    } catch (error) {
      console.error("Failed to claim presale task reward:", error);
      alert("Something went wrong. Try again later.");
    }
  };

  const goBack = () => {
    router.push("/");  // Redirect to the main page
  };

  // Loading state: return loading spinner or message if still fetching user data
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
            onClick={handleLoginReward}
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
            onClick={handleSocialTask}
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
            onClick={handlePresaleTask}
            className={`w-full py-2 rounded text-white ${presaleRewardClaimed ? "bg-gray-600" : "bg-green-600"}`}
            disabled={presaleRewardClaimed}
          >
            {presaleRewardClaimed ? "Reward Claimed" : "Claim 75,000 $SHROCK"}
          </button>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={goBack}
            className="bg-blue-600 text-white px-6 py-2 rounded-full"
          >
            Back to Main Page
          </button>
        </div>
      </div>

      {/* Cosmic Background Animation */}
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
}}


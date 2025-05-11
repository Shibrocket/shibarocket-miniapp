"use client";

import React from "react";

export default function BoostPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white flex flex-col items-center pt-10 px-4">
      <h1 className="text-2xl font-bold text-purple-400 mb-4 neon-text">Daily Boost Center</h1>

      <div className="w-full max-w-md space-y-4">
        <div className="bg-zinc-800 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Watch Ad to Refill Energy</h2>
          <p className="text-sm mt-1 mb-3 text-gray-300">Get +100 energy instantly!</p>
          <button className="bg-green-600 px-4 py-2 rounded text-white w-full">
            Watch Ad
          </button>
        </div>

        <div className="bg-zinc-800 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Lucky Dice</h2>
          <p className="text-sm mt-1 mb-3 text-gray-300">Roll to win bonus SHROCK!</p>
          <button className="bg-blue-500 px-4 py-2 rounded text-white w-full">
            Roll Dice
          </button>
        </div>
      </div>

      <style jsx>{`
        .neon-text {
          text-shadow: 0 0 10px #8e44ad, 0 0 20px #8e44ad;
        }
      `}</style>
    </div>
  );
}

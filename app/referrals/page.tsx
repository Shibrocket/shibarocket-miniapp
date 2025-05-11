"use client";

import React from "react";

export default function ReferralsPage() {
  const referralLink = typeof window !== "undefined"
    ? `${window.location.origin}/?ref=YOUR_USER_ID`
    : "";

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white flex flex-col items-center pt-10 px-4">
      <h1 className="text-2xl font-bold text-purple-400 mb-4 neon-text">Referral Center</h1>

      <div className="w-full max-w-md space-y-6">
        <div className="bg-zinc-800 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Your Referral Link</h2>
          <input
            className="w-full bg-zinc-900 text-white p-2 mt-2 rounded"
            readOnly
            value={referralLink}
          />
        </div>

        <div className="bg-zinc-800 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Referral Rewards</h2>
          <p className="text-sm text-gray-300 mt-2">
            Invite friends and earn:
            <ul className="list-disc pl-6 mt-2">
              <li>Referrer: 70,000 $SHROCK</li>
              <li>New User: 30,000 $SHROCK</li>
            </ul>
          </p>
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

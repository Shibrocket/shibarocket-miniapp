"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function AdminPage() {
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    const fetchTopUsers = async () => {
      const usersSnap = await getDocs(collection(db, "users"));
      const users = [];
      usersSnap.forEach(doc => {
        const data = doc.data();
        users.push({
          id: doc.id,
          earned: data.totalEarned || 0,
          claimed: data.claimed || 0,
          taps: data.totalTaps || 0,
        });
      });

      const sorted = users.sort((a, b) => b.earned - a.earned).slice(0, 10);
      setTopUsers(sorted);
    };

    fetchTopUsers();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-xl font-bold text-center text-orange-400 mb-4">Admin Leaderboard</h1>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-gray-600">
            <th className="p-2">User ID</th>
            <th className="p-2">Earned</th>
            <th className="p-2">Claimed</th>
            <th className="p-2">Taps</th>
          </tr>
        </thead>
        <tbody>
          {topUsers.map(user => (
            <tr key={user.id} className="border-b border-gray-700">
              <td className="p-2">{user.id}</td>
              <td className="p-2">{user.earned.toLocaleString()}</td>
              <td className="p-2">{user.claimed.toLocaleString()}</td>
              <td className="p-2">{user.taps.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// pages/admin.tsx
import React, { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTaps: 0,
    totalTokens: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/adminStats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">ShibaRocket Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold">Total Users</h2>
          <p className="text-2xl text-blue-600 mt-2">{stats.totalUsers}</p>
        </div>
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold">Total Taps</h2>
          <p className="text-2xl text-green-600 mt-2">{stats.totalTaps}</p>
        </div>
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold">Total $SHROCK</h2>
          <p className="text-2xl text-purple-600 mt-2">{stats.totalTokens}</p>
        </div>
      </div>
    </div>
  );
}

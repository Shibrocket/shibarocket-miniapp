"use client";
import { useEffect, useState } from "react";

interface Stats {
  totalUsers: number;
  totalTaps: number;
  pools: {
    tappingPool?: number;
    loginPool?: number;
    referralPool?: number;
    socialTaskPool?: number;
    presalePool?: number;
    totalDaily?: number;
    lastPoolUpdateDate?: string;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/adminStats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Failed to fetch stats:", err));
  }, []);

  if (!stats) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md space-y-2">
        <p><strong>Total Users:</strong> {stats.totalUsers}</p>
        <p><strong>Total Taps:</strong> {stats.totalTaps}</p>
        <p><strong>Tapping Pool:</strong> {stats.pools.tappingPool?.toLocaleString() ?? 0} SHROCK</p>
        <p><strong>Login Pool:</strong> {stats.pools.loginPool?.toLocaleString() ?? 0} SHROCK</p>
        <p><strong>Referral Pool:</strong> {stats.pools.referralPool?.toLocaleString() ?? 0} SHROCK</p>
        <p><strong>Social Task Pool:</strong> {stats.pools.socialTaskPool?.toLocaleString() ?? 0} SHROCK</p>
        <p><strong>Presale Pool:</strong> {stats.pools.presalePool?.toLocaleString() ?? 0} SHROCK</p>
        <p><strong>Total Daily:</strong> {stats.pools.totalDaily?.toLocaleString() ?? 0} SHROCK</p>
        <p><strong>Last Pool Update:</strong> {stats.pools.lastPoolUpdateDate ?? "N/A"}</p>
      </div>
    </div>
  );
}

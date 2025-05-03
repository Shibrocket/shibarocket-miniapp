'use client';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    const res = await fetch('/api/checkAdminPassword', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();
    if (data.success) {
      setIsAuthenticated(true);
      fetchStats();
    } else {
      setError("Incorrect password");
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/adminStats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Admin Login</h1>
        <input
          type="password"
          placeholder="Enter admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 mr-2"
        />
        <button onClick={handleSubmit} className="bg-black text-white p-2">
          Submit
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    );
  }

  if (!stats) return <p className="p-6">Loading stats...</p>;

  return (
    <div className="p-6 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <p><strong>Total Users:</strong> {stats.totalUsers}</p>
        <p><strong>Total Taps:</strong> {stats.totalTaps}</p>
        <p><strong>Tapping Pool:</strong> {stats.pools.tappingPool?.toLocaleString()} SHROCK</p>
        <p><strong>Login Pool:</strong> {stats.pools.loginPool?.toLocaleString()} SHROCK</p>
        <p><strong>Referral Pool:</strong> {stats.pools.referralPool?.toLocaleString()} SHROCK</p>
        <p><strong>Social Task Pool:</strong> {stats.pools.socialTaskPool?.toLocaleString()} SHROCK</p>
        <p><strong>Presale Pool:</strong> {stats.pools.presalePool?.toLocaleString()} SHROCK</p>
        <p><strong>Total Daily:</strong> {stats.pools.totalDaily?.toLocaleString()} SHROCK</p>
        <p><strong>Last Pool Update:</strong> {stats.pools.lastPoolUpdateDate}</p>
      </div>
    </div>
  );
}

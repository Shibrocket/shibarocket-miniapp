import { useState } from "react";

export default function AdminDashboard() {
  const [passwordInput, setPasswordInput] = useState("");
  const [granted, setGranted] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (passwordInput === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setGranted(true);
      setLoading(true);
      const res = await fetch("/api/adminStats");
      const data = await res.json();
      setStats(data);
      setLoading(false);
    } else {
      alert("Incorrect password");
    }
  };

  if (!granted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
          <h1 className="text-xl font-semibold mb-4">Admin Login</h1>
          <input
            type="password"
            placeholder="Enter admin password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  if (loading) return <div className="p-4">Loading stats...</div>;
  if (!stats?.success) return <div className="p-4 text-red-500">Failed to load stats</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard label="Total Users" value={stats.totalUsers} />
        <StatCard label="SHROCK Distributed" value={stats.totalShrock} />
        <StatCard label="Total Taps" value={stats.totalTaps} />
        <StatCard label="Referrals" value={stats.totalReferrals} />
        <StatCard label="Login Rewards" value={stats.totalLoginRewards} />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl shadow p-4 bg-white border border-gray-100">
      <h2 className="text-sm text-gray-600 mb-1">{label}</h2>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}

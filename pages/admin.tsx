import { useEffect, useState } from "react";

interface AdminStats {
  totalUsers: number;
  totalTaps: number;
  pools: {
    tappingPool: number;
    socialTaskPool: number;
    referralPool: number;
    loginPool: number;
    presalePool: number;
    totalDaily: number;
    lastPoolUpdateDate: string;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/adminStats");
        const data = await res.json();
        setStats(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="p-4">Loading admin stats...</div>;
  if (!stats) return <div className="p-4">No data available</div>;

  const { totalUsers, totalTaps, pools } = stats;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 shadow rounded-xl">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p>{totalUsers}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-xl">
          <h2 className="text-lg font-semibold">Total Taps</h2>
          <p>{totalTaps}</p>
        </div>
      </div>

      <div className="bg-white p-4 shadow rounded-xl">
        <h2 className="text-lg font-semibold mb-2">Daily Pool (SHROCK)</h2>
        <ul className="space-y-1">
          <li>Login Pool: {pools.loginPool?.toLocaleString()} SHROCK</li>
          <li>Referral Pool: {pools.referralPool?.toLocaleString()} SHROCK</li>
          <li>Social Task Pool: {pools.socialTaskPool?.toLocaleString()} SHROCK</li>
          <li>Presale Task Pool: {pools.presalePool?.toLocaleString()} SHROCK</li>
          <li>Tapping Pool: {pools.tappingPool?.toLocaleString()} SHROCK</li>
          <li>Total Daily: {pools.totalDaily?.toLocaleString()} SHROCK</li>
          <li>Last Updated: {pools.lastPoolUpdateDate}</li>
        </ul>
      </div>
    </div>
  );
}

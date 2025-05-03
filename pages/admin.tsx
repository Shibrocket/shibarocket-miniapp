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
  settings: any;
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

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 shadow rounded-xl">
          <h2 className="text-lg font-semibold">Users</h2>
          <p>{stats.totalUsers}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-xl">
          <h2 className="text-lg font-semibold">Total Taps</h2>
          <p>{stats.totalTaps}</p>
        </div>
      </div>

      <div className="bg-white p-4 shadow rounded-xl">
        <h2 className="text-lg font-semibold mb-2">Daily Pools</h2>
        <ul className="space-y-1">
          <li>Tapping Pool: {stats.pools.tappingPool.toLocaleString()}</li>
          <li>Social Task Pool: {stats.pools.socialTaskPool.toLocaleString()}</li>
          <li>Referral Pool: {stats.pools.referralPool.toLocaleString()}</li>
          <li>Login Pool: {stats.pools.loginPool.toLocaleString()}</li>
          <li>Presale Pool: {stats.pools.presalePool.toLocaleString()}</li>
          <li>Total Daily Pool: {stats.pools.totalDaily.toLocaleString()}</li>
          <li>Last Updated: {stats.pools.lastPoolUpdateDate}</li>
        </ul>
      </div>

      <div className="bg-white p-4 shadow rounded-xl">
        <h2 className="text-lg font-semibold mb-2">Settings</h2>
        <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
          {JSON.stringify(stats.settings, null, 2)}
        </pre>
      </div>
    </div>
  );
}

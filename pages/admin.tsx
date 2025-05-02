import { useEffect, useState } from "react";

export default function AdminDashboard() { const [stats, setStats] = useState<any>(null); const [loading, setLoading] = useState(true);

useEffect(() => { fetch("/api/adminStats") .then((res) => res.json()) .then((data) => { setStats(data); setLoading(false); }); }, []);

if (loading) return <div className="p-4">Loading admin stats...</div>; if (!stats?.success) return <div className="p-4 text-red-500">Failed to load stats</div>;

return ( <div className="p-6 max-w-3xl mx-auto"> <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1> <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> <StatCard label="Total Users" value={stats.totalUsers} /> <StatCard label="Total SHROCK Distributed" value={stats.totalShrock} /> <StatCard label="Total Taps" value={stats.totalTaps} /> <StatCard label="Total Referrals" value={stats.totalReferrals} /> <StatCard label="Login Rewards Given" value={stats.totalLoginRewards} /> </div> </div> ); }

function StatCard({ label, value }: { label: string; value: number }) { return ( <div className="rounded-2xl shadow p-4 bg-white border border-gray-100"> <h2 className="text-sm text-gray-600 mb-1">{label}</h2> <div className="text-xl font-semibold">{value}</div> </div> ); }



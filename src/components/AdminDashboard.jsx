// src/components/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const AdminDashboard = () => {
  const [poolData, setPoolData] = useState(null);
  const [stats, setStats] = useState({
    totalClaimed: 0,
    totalUnclaimed: 0,
    tappedUsers: 0,
    claimedUsers: 0,
    referredUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const today = new Date().toISOString().slice(0, 10);

        const poolSnap = await getDoc(doc(db, "dailyPools", today));
        if (poolSnap.exists()) {
          setPoolData(poolSnap.data());
        }

        const usersSnap = await getDocs(collection(db, "users"));
        let totalClaimed = 0;
        let tappedUsers = 0;
        let claimedUsers = 0;
        let referredUsers = 0;

        usersSnap.forEach(doc => {
          const user = doc.data();
          totalClaimed += user.shrock || 0;
          if (user.totalTaps && user.totalTaps > 0) tappedUsers++;
          if (user.hasClaimedPresale) claimedUsers++;
          if (user.referrals && user.referrals > 0) referredUsers++;
        });

        const totalUnclaimed = poolSnap.exists() ? poolSnap.data().totalDaily - totalClaimed : 0;

        setStats({
          totalClaimed,
          totalUnclaimed,
          tappedUsers,
          claimedUsers,
          referredUsers,
        });

      } catch (err) {
        console.error("Error fetching admin stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const chartData = [
    { name: "Tapped", value: stats.tappedUsers },
    { name: "Claimed", value: stats.claimedUsers },
    { name: "Referred", value: stats.referredUsers },
  ];

  if (loading) return <div>Loading Admin Dashboard...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>
      {poolData ? (
        <div style={{
          backgroundColor: "#fff",
          padding: 20,
          borderRadius: 12,
          boxShadow: "0 0 10px rgba(0,0,0,0.1)"
        }}>
          <p><strong>Date:</strong> {poolData.date}</p>
          <p><strong>Tapping Pool:</strong> {poolData.tappingPool}</p>
          <p><strong>Login Pool:</strong> {poolData.loginPool}</p>
          <p><strong>Referral Pool:</strong> {poolData.referralPool}</p>
          <p><strong>Social Task Pool:</strong> {poolData.socialTaskPool}</p>
          <p><strong>Presale Pool:</strong> {poolData.presalePool}</p>
          <p><strong>Total Daily:</strong> {poolData.totalDaily}</p>

          <hr />

          <p><strong>Total Claimed $SHROCK:</strong> {stats.totalClaimed.toLocaleString()}</p>
          <p><strong>Unclaimed $SHROCK:</strong> {stats.totalUnclaimed.toLocaleString()}</p>
          <p><strong>Users Who Tapped:</strong> {stats.tappedUsers}</p>
          <p><strong>Users Who Claimed:</strong> {stats.claimedUsers}</p>
          <p><strong>Users Who Referred:</strong> {stats.referredUsers}</p>

          <h3>User Engagement Chart</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : <p>No pool data found for today.</p>}
    </div>
  );
};

export default AdminDashboard;

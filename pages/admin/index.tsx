// pages/admin/index.tsx

import { useState, useEffect } from "react";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../lib/firebase"; // adjust path if needed

const ADMIN_PASSWORD = "shibarocketadmin"; // <<< Set your Admin password here

export default function AdminPanel() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (authenticated) {
      fetchStats();
    }
  }, [authenticated]);

  const fetchStats = async () => {
    try {
      const poolRef = doc(db, "pools", "dailyPool");
      const poolSnap = await getDoc(poolRef);

      if (poolSnap.exists()) {
        setStats(poolSnap.data());
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
    } else {
      alert("Incorrect password!");
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      {!authenticated ? (
        <div style={{ maxWidth: 400, margin: "auto", textAlign: "center" }}>
          <h1>Admin Login</h1>
          <input
            type="password"
            placeholder="Enter Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: 10, width: "100%", marginBottom: 10 }}
          />
          <button
            onClick={handleLogin}
            style={{ padding: 10, width: "100%", backgroundColor: "#4CAF50", color: "white" }}
          >
            Login
          </button>
        </div>
      ) : (
        <div>
          <h1>ShibaRocket Admin Dashboard</h1>
          {stats ? (
            <div>
              <h2>Daily Pools:</h2>
              <ul>
                <li>Tapping Pool: {stats.tappingPool?.toLocaleString()} $SHROCK</li>
                <li>Social Task Pool: {stats.socialTaskPool?.toLocaleString()} $SHROCK</li>
                <li>Referral Pool: {stats.referralPool?.toLocaleString()} $SHROCK</li>
                <li>Login Reward Pool: {stats.loginPool?.toLocaleString()} $SHROCK</li>
                <li>Presale Task Pool: {stats.presaleTaskPool?.toLocaleString()} $SHROCK</li>
              </ul>

              <h2>Rollovers:</h2>
              <ul>
                <li>Rollover Tapping: {stats.rolloverTapping?.toLocaleString()}</li>
                <li>Rollover Social Task: {stats.rolloverSocialTask?.toLocaleString()}</li>
                <li>Rollover Referral: {stats.rolloverRefferal?.toLocaleString()}</li>
                <li>Rollover Login: {stats.rolloverLogin?.toLocaleString()}</li>
                <li>Rollover Presale Task: {stats.rolloverPresaleTask?.toLocaleString()}</li>
              </ul>

              <h2>Other Info:</h2>
              <ul>
                <li>Total Tapped Today: {stats.totalTappedToday?.toLocaleString()} $SHROCK</li>
                <li>Last Reset: {new Date(stats.lastReset?.seconds * 1000).toUTCString()}</li>
              </ul>
            </div>
          ) : (
            <p>Loading stats...</p>
          )}
        </div>
      )}
    </div>
  );
}

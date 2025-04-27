// pages/admin.tsx

import { useState, useEffect } from "react";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [loadingStats, setLoadingStats] = useState(false);
  const [stats, setStats] = useState<any>(null);

  const adminPassword = "shrock123"; // <<< Set your secret password here

  const handleLogin = () => {
    if (passwordInput === adminPassword) {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password!");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      setLoadingStats(true);
      fetch("/api/adminStats")
        .then((res) => res.json())
        .then((data) => {
          setStats(data.data);
          setLoadingStats(false);
        })
        .catch((err) => {
          console.error("Failed to load admin stats", err);
          setLoadingStats(false);
        });
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h1>Admin Login</h1>
        <input
          type="password"
          placeholder="Enter admin password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            width: "250px",
            marginBottom: "10px",
          }}
        />
        <br />
        <button
          onClick={handleLogin}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#ff5733",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Enter
        </button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>ShibaRocket Admin Dashboard</h1>
      {loadingStats ? (
        <p>Loading stats...</p>
      ) : stats ? (
        <div>
          <h2>Pool Stats:</h2>
          <pre style={{ textAlign: "left", display: "inline-block" }}>
            {JSON.stringify(stats, null, 2)}
          </pre>
        </div>
      ) : (
        <p>No stats available.</p>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import axios from "axios";

const AdminPage = () => {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [stats, setStats] = useState<any>(null);

  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "shibarocketadmin";

  const fetchStats = async () => {
    try {
      const res = await axios.get("/api/adminStats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const handleLogin = () => {
    if (password === adminPassword) {
      setAuthenticated(true);
      fetchStats();
    } else {
      alert("Incorrect Password!");
    }
  };

  if (!authenticated) {
    return (
      <div style={styles.container}>
        <h1>Admin Login</h1>
        <input
          type="password"
          placeholder="Enter admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleLogin} style={styles.button}>Login</button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div style={styles.container}>
        <h1>Loading stats...</h1>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1>Admin Dashboard</h1>
      <div style={styles.statsBox}>
        <p><strong>Total Users:</strong> {stats.totalUsers}</p>
        <p><strong>Total Taps:</strong> {stats.totalTaps}</p>
        <p><strong>Daily Pool:</strong> {stats.dailyPool} SHROCK</p>
        <p><strong>Login Pool:</strong> {stats.loginPool} SHROCK</p>
        <p><strong>Referral Pool:</strong> {stats.referralPool} SHROCK</p>
        <p><strong>Social Task Pool:</strong> {stats.socialTaskPool} SHROCK</p>
        <p><strong>Presale Task Pool:</strong> {stats.presaleTaskPool} SHROCK</p>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fafafa",
    fontFamily: "Arial, sans-serif",
  },
  input: {
    padding: "0.8rem",
    margin: "1rem 0",
    width: "250px",
    fontSize: "16px",
  },
  button: {
    padding: "0.8rem 2rem",
    backgroundColor: "#0070f3",
    color: "#fff",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: "5px",
  },
  statsBox: {
    marginTop: "2rem",
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "left",
    width: "100%",
    maxWidth: "500px",
  },
};

export default AdminPage;

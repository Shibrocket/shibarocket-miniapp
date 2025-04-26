import { useState } from "react";

export default function Home() {
  const [energy, setEnergy] = useState(400);
  const [shrockEarned, setShrockEarned] = useState(0);
  const [lastLoginDate, setLastLoginDate] = useState<string>("");

  // Handle TAP
  const handleTap = () => {
    if (energy > 0) {
      setEnergy(energy - 1);
      setShrockEarned(shrockEarned + 5); // 1 tap = 5 $SHROCK
    }
  };

  // Watch Ad for +100 Energy
  const handleWatchAd = () => {
    setEnergy(prev => Math.min(prev + 100, 500)); // Max 500 energy
  };

  // Daily Login Reward
  const handleDailyLogin = () => {
    const today = new Date().toISOString().split('T')[0];
    if (lastLoginDate !== today) {
      setLastLoginDate(today);
      setShrockEarned(prev => prev + 50); // Day 1 reward
      alert("You received your Daily Login Reward: 50 $SHROCK!");
    } else {
      alert("You already claimed today's reward!");
    }
  };

  // Claim $SHROCK (placeholder)
  const handleClaim = () => {
    alert("Wallet connection coming soon! Claim will be live on May 20.");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>ShibaRocket Mini App</h1>

      <h2>Energy: {energy}</h2>
      <h2>Earned: {shrockEarned} $SHROCK</h2>

      <button
        onClick={handleTap}
        style={{ fontSize: "24px", padding: "10px 30px", marginTop: "20px" }}
      >
        TAP
      </button>

      <div style={{ marginTop: "40px" }}>
        <button
          onClick={handleWatchAd}
          style={{ fontSize: "18px", margin: "10px", padding: "10px 20px" }}
        >
          Watch Ad for +100 Energy
        </button>

        <button
          onClick={handleDailyLogin}
          style={{ fontSize: "18px", margin: "10px", padding: "10px 20px" }}
        >
          Daily Login Reward
        </button>

        <button
          onClick={handleClaim}
          style={{ fontSize: "18px", margin: "10px", padding: "10px 20px" }}
        >
          Claim $SHROCK
        </button>
      </div>
    </div>
  );
}


import { useState } from "react";

export default function Home() {
  const [energy, setEnergy] = useState(400);
  const [shrockEarned, setShrockEarned] = useState(0);

  const handleTap = () => {
    if (energy > 0) {
      setEnergy(energy - 1);
      setShrockEarned(shrockEarned + 5); // 1 tap = 5 $SHROCK
    }
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
          style={{ fontSize: "18px", margin: "10px", padding: "8px 20px" }}
        >
          Watch Ad for +100 Energy
        </button>

        <button
          style={{ fontSize: "18px", margin: "10px", padding: "8px 20px" }}
        >
          Daily Login Reward
        </button>

        <button
          style={{ fontSize: "18px", margin: "10px", padding: "8px 20px" }}
        >
          Claim $SHROCK
        </button>
      </div>
    </div>
  );
}


import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function Home() {
  const [energy, setEnergy] = useState<number>(400);
  const [shrockEarned, setShrockEarned] = useState<number>(0);
  const [dailyPool, setDailyPool] = useState<number>(0);

  // Fetch Daily Pool from API
  useEffect(() => {
    const fetchPool = async () => {
      try {
        const response = await fetch("/api/pool");
        const data = await response.json();
        setDailyPool(data.dailyPool || 0);
      } catch (error) {
        console.error("Error fetching pool:", error);
      }
    };

    fetchPool();
  }, []);

  const handleTap = async () => {
    if (energy > 0) {
      setEnergy((prev) => prev - 1);
      setShrockEarned((prev) => prev + 5);

      // Save user data to Firestore
      try {
        const userId = "exampleUserId"; // Replace with real user ID if you have auth later
        const userRef = doc(db, "users", userId);
        await setDoc(userRef, {
          energy: energy - 1,
          shrockEarned: shrockEarned + 5,
          updatedAt: new Date(),
        }, { merge: true });
      } catch (error) {
        console.error("Error saving tap data:", error);
      }
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>ShibaRocket Mini App</h1>
      <h2>Energy: {energy}</h2>
      <h2>Earned: {shrockEarned} $SHROCK</h2>
      <h3>Daily Pool: {dailyPool.toLocaleString()} $SHROCK</h3>

      <button
        onClick={handleTap}
        style={{
          marginTop: "20px",
          padding: "20px 40px",
          fontSize: "24px",
          backgroundColor: "#ff4d4d",
          color: "white",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
        }}
      >
        Tap to Earn
      </button>
    </div>
  );
}


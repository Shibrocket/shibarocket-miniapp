// pages/index.tsx

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  updateDoc,
  setDoc,
} from "firebase/firestore";

export default function HomePage() {
  const [taps, setTaps] = useState(0);
  const [tokensEarned, setTokensEarned] = useState(0);

  const userId = "7684906960"; // Replace with dynamic Telegram ID if integrated

  useEffect(() => {
    const fetchUserData = async () => {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setTaps(data.taps || 0);
        setTokensEarned(data.tokens || 0);
      } else {
        await setDoc(doc(db, "users", userId), { taps: 0, tokens: 0 });
      }
    };
    fetchUserData();
  }, []);

  const handleTap = async () => {
    setTaps((prev) => prev + 1);
    setTokensEarned((prev) => prev + 10); // 10 SHROCK per tap

    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      taps: increment(1),
      tokens: increment(10),
    });
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", textAlign: "center" }}>
      <h1>ShibaRocket Mini App</h1>
      <p>Welcome, Tap to earn $SHROCK!</p>

      <div style={{ margin: "2rem 0" }}>
        <button
          onClick={handleTap}
          style={{
            padding: "1rem 2rem",
            fontSize: "1.5rem",
            backgroundColor: "#ff5c5c",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          TAP
        </button>
      </div>

      <div>
        <p>Total Taps: <strong>{taps}</strong></p>
        <p>Tokens Earned: <strong>{tokensEarned} $SHROCK</strong></p>
      </div>

      <hr style={{ margin: "2rem 0" }} />

      <nav style={{ display: "flex", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap" }}>
        <a href="/social-tasks">Social Tasks</a>
        <a href="/referral">Referrals</a>
        <a href="/admin">Admin Panel</a>
        <a href="/presale">Presale</a>
      </nav>
    </div>
  );
}

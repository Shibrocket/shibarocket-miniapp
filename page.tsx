'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import Link from 'next/link';

export default function MainPage({ searchParams }: { searchParams: URLSearchParams }) {
  const userId = searchParams.get("userId") || "7684906960";
  const [energy, setEnergy] = useState(0);
  const [earned, setEarned] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setEnergy(data.energy || 0);
        setEarned(data.earned || 0);
      }

      const adminRef = doc(db, "admins", userId);
      const adminSnap = await getDoc(adminRef);
      if (adminSnap.exists() && adminSnap.data().isAdmin) {
        setIsAdmin(true);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleTap = () => {
    setEnergy((prev) => Math.max(0, prev - 1));
    setEarned((prev) => prev + 5); // Add 5 tokens per tap
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#ff4500' }}>ShibaRocket Mini App</h1>

      <h3>Presale Countdown:<span style={{ marginLeft: 10 }}>15:00:10:50</span></h3>
      <p>Get ready for the $SHROCK Presale!</p>

      <h2>Energy: {energy}</h2>
      <h2>Earned: {earned} $SHROCK</h2>

      <button
        onClick={handleTap}
        style={{
          backgroundColor: 'green',
          color: 'white',
          padding: 10,
          fontSize: 18,
          borderRadius: 5,
          marginTop: 10,
        }}
      >
        TAP
      </button>

      <div style={{ marginTop: 20 }}>
        <button style={{ backgroundColor: '#007bff', color: 'white', padding: 10, borderRadius: 5, marginBottom: 10 }}>
          Watch Ad for +100 Energy
        </button>
        <br />
        <button style={{ backgroundColor: 'orange', color: 'white', padding: 10, borderRadius: 5, marginBottom: 10 }}>
          Daily Login Reward
        </button>
        <br />
        <button style={{ backgroundColor: 'purple', color: 'white', padding: 10, borderRadius: 5 }}>
          Claim $SHROCK
        </button>
      </div>

      <h3 style={{ marginTop: 30 }}>Complete Social Tasks:</h3>

      {isAdmin && (
        <Link href={`/adminDashboard?userId=${userId}`}>
          <button style={{ marginTop: 20, background: "#000", color: "#fff", padding: 10, borderRadius: 5 }}>
            Go to Admin Dashboard
          </button>
        </Link>
      )}
    </div>
  );
}

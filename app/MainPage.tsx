'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/app/firebaseConfig';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function MainPage() {
  const searchParams = useSearchParams();
  const userId = searchParams?.get("userId") || "7684906960";

  const [energy, setEnergy] = useState(0);
  const [earned, setEarned] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const userRef = doc(db, "users", userId);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
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

  const handleTap = async () => {
    if (energy <= 0 || energy > 500) return;

    const newEnergy = energy - 1;
    const newEarned = earned + 5;

    setEnergy(newEnergy);
    setEarned(newEarned);

    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      energy: newEnergy,
      earned: newEarned,
    });
  };

  const handleAdWatch = async () => {
    if (energy >= 500) return;

    const bonus = energy + 100 > 500 ? 500 - energy : 100;
    const newEnergy = energy + bonus;

    setEnergy(newEnergy);

    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { energy: newEnergy });
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
      <h1 style={{ color: '#ff4500' }}>ShibaRocket Mini App</h1>
      <h3>Presale Countdown: <span style={{ marginLeft: 10 }}>15:00:10:50</span></h3>
      <p>Get ready for the $SHROCK Presale!</p>

      <h2>Energy: {energy} / 500</h2>
      <h2>Earned: {earned} $SHROCK</h2>

      <button
        onClick={handleTap}
        disabled={energy <= 0}
        style={{
          backgroundColor: energy > 0 ? 'green' : 'gray',
          color: 'white',
          padding: 10,
          fontSize: 18,
          borderRadius: 5,
          marginTop: 10,
          width: 150,
        }}
      >
        TAP
      </button>

      <div style={{ marginTop: 20 }}>
        <button
          onClick={handleAdWatch}
          disabled={energy >= 500}
          style={{
            backgroundColor: energy < 500 ? '#6c757d' : 'gray',
            color: 'white',
            padding: 10,
            borderRadius: 5,
            marginTop: 10,
            width: 220,
          }}
        >
          Ad Watched (+100 Energy)
        </button>
        <br />
        <button style={{ backgroundColor: 'orange', color: 'white', padding: 10, borderRadius: 5, marginTop: 10 }}>
          Daily Login Reward
        </button>
        <br />
        <button style={{ backgroundColor: 'purple', color: 'white', padding: 10, borderRadius: 5, marginTop: 10 }}>
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

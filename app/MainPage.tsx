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
  const [hasWatchedAd, setHasWatchedAd] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const userRef = doc(db, "users", userId);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setEnergy(data.energy || 0);
        setEarned(data.earned || 0);
        setHasWatchedAd(data.hasWatchedAd === true); // check if ad was watched
      }

      const adminRef = doc(db, "admins", userId);
      const adminSnap = await getDoc(adminRef);
      if (adminSnap.exists()) {
        const adminData = adminSnap.data();
        if (adminData.isAdmin) setIsAdmin(true);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleTap = async () => {
    if (energy <= 0) return;

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

  const handleWatchAd = async () => {
    if (hasWatchedAd) return;

    const newEnergy = energy + 100;
    setEnergy(newEnergy);
    setHasWatchedAd(true);

    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      energy: newEnergy,
      hasWatchedAd: true,
    });
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#ff4500' }}>ShibaRocket Mini App</h1>
      <h3>Presale Countdown:<span style={{ marginLeft: 10 }}>15:00:10:50</span></h3>
      <p>Get ready for the $SHROCK Presale!</p>

      <h2>Energy: {energy} / 500</h2>
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
        disabled={energy <= 0}
      >
        TAP
      </button>

      <div style={{ marginTop: 20 }}>
        <button
          onClick={handleWatchAd}
          style={{
            backgroundColor: hasWatchedAd ? 'gray' : '#007bff',
            color: 'white',
            padding: 10,
            borderRadius: 5,
          }}
          disabled={hasWatchedAd}
        >
          {hasWatchedAd ? 'Ad Watched (+100 Energy)' : 'Watch Ad for +100 Energy'}
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

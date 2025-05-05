'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/app/firebaseConfig';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Countdown from 'react-countdown';

export default function MainPage() {
  const searchParams = useSearchParams();
  const userId = searchParams?.get("userId") || "7684906960";

  const [energy, setEnergy] = useState(0);
  const [earned, setEarned] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adsWatched, setAdsWatched] = useState(false);

  const MAX_ENERGY = 500;
  const FREE_TAP_LIMIT = 400;
  const BONUS_TAP_LIMIT = 100;
  const presaleDate = new Date('2025-06-20T15:00:00Z');

  useEffect(() => {
    const fetchUserData = async () => {
      const userRef = doc(db, "users", userId);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setEnergy(data.energy || 0);
        setEarned(data.earned || 0);
        setAdsWatched(data.adsWatched || false);
      }

      const adminRef = doc(db, "admins", userId);
      const adminSnap = await getDoc(adminRef);
      if (adminSnap.exists() && adminSnap.data().isAdmin) {
        setIsAdmin(true);
      }
    };

    fetchUserData();
  }, [userId]);

  const getMaxEnergy = () => (adsWatched ? MAX_ENERGY : FREE_TAP_LIMIT);

  const handleTap = async () => {
    const maxEnergy = getMaxEnergy();
    if (energy >= maxEnergy) return;

    const newEnergy = energy + 1;
    const newEarned = earned + 2;

    setEnergy(newEnergy);
    setEarned(newEarned);

    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      energy: newEnergy,
      earned: newEarned,
    });
  };

  const handleAdWatch = async () => {
    if (adsWatched || energy >= MAX_ENERGY) return;

    const bonus = Math.min(BONUS_TAP_LIMIT, MAX_ENERGY - energy);
    const newEnergy = energy + bonus;

    setEnergy(newEnergy);
    setAdsWatched(true);

    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      energy: newEnergy,
      adsWatched: true,
    });
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
      <h1 style={{ color: '#ff4500' }}>ShibaRocket Mini App</h1>

      <h3>
        Presale Countdown:{' '}
        <Countdown
          date={presaleDate}
          daysInHours
          renderer={({ days, hours, minutes, seconds }) => (
            <span style={{ marginLeft: 10 }}>
              {String(days).padStart(2, '0')}d : {String(hours).padStart(2, '0')}h : {String(minutes).padStart(2, '0')}m : {String(seconds).padStart(2, '0')}s
            </span>
          )}
        />
      </h3>

      <p>Get ready for the $SHROCK Presale!</p>

      <h2>Energy: {energy} / {getMaxEnergy()}</h2>
      <h2>Earned: {earned} $SHROCK</h2>

      <button
        onClick={handleTap}
        disabled={energy >= getMaxEnergy()}
        style={{
          backgroundColor: energy < getMaxEnergy() ? 'green' : 'gray',
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
          disabled={adsWatched || energy >= MAX_ENERGY}
          style={{
            backgroundColor: !adsWatched && energy < MAX_ENERGY ? '#6c757d' : 'gray',
            color: 'white',
            padding: 10,
            borderRadius: 5,
            marginTop: 10,
            width: 220,
          }}
        >
          {adsWatched ? 'Ad Watched (+100 Energy)' : 'Watch Ad for +100 Energy'}
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

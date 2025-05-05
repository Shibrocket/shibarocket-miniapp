'use client';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import Countdown from 'react-countdown';

const MAX_ENERGY = 500;
const FREE_TAP_LIMIT = 400;
const BONUS_TAP_LIMIT = 100;

const MainPage = () => {
  const [energy, setEnergy] = useState(0);
  const [earned, setEarned] = useState(0);
  const [userId, setUserId] = useState('');
  const [adsWatched, setAdsWatched] = useState(false);
  const [lastReset, setLastReset] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const presaleDate = new Date('2025-06-20T15:00:00Z');

  // Auto reset daily energy and earnings
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        setUserId(uid);
        const userRef = doc(db, 'users', uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const last = data.lastReset?.toDate?.() || new Date(0);
          const now = new Date();

          // If a day has passed since last reset
          if (now.toDateString() !== last.toDateString()) {
            await updateDoc(userRef, {
              energy: 0,
              earned: 0,
              adsWatched: false,
              lastReset: serverTimestamp(),
            });
            setEnergy(0);
            setEarned(0);
            setAdsWatched(false);
          } else {
            setEnergy(data.energy || 0);
            setEarned(data.earned || 0);
            setAdsWatched(data.adsWatched || false);
          }
          setLastReset(last);
        } else {
          await setDoc(userRef, {
            energy: 0,
            earned: 0,
            adsWatched: false,
            lastReset: serverTimestamp(),
          });
        }
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleTap = async () => {
    if (!userId) return;

    const totalCap = FREE_TAP_LIMIT + (adsWatched ? BONUS_TAP_LIMIT : 0);
    if (energy < totalCap) {
      const userRef = doc(db, 'users', userId);
      const newEnergy = energy + 1;
      const newEarned = earned + 2;

      await updateDoc(userRef, {
        energy: newEnergy,
        earned: newEarned,
      });

      setEnergy(newEnergy);
      setEarned(newEarned);
    }
  };

  const handleWatchAd = async () => {
    if (!userId || adsWatched) return;
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      adsWatched: true,
    });
    setAdsWatched(true);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div style={{ textAlign: 'center', padding: 20 }}>
      <h1 style={{ color: 'orangered' }}>ShibaRocket Mini App</h1>
      <h3>
        Presale Countdown:{' '}
        <Countdown date={presaleDate} daysInHours />
      </h3>
      <p>Get ready for the $SHROCK Presale!</p>

      <h2>Energy: {energy} / {adsWatched ? MAX_ENERGY : FREE_TAP_LIMIT}</h2>
      <h2>Earned: {earned} $SHROCK</h2>

      <button
        onClick={handleTap}
        style={{
          backgroundColor: 'green',
          color: 'white',
          fontSize: 20,
          padding: '10px 30px',
          margin: 10,
          borderRadius: 8,
        }}
      >
        TAP
      </button>
      <br />
      <button
        onClick={handleWatchAd}
        disabled={adsWatched}
        style={{
          backgroundColor: 'gray',
          color: 'white',
          padding: '10px 30px',
          margin: 10,
          borderRadius: 8,
        }}
      >
        {adsWatched ? 'Ad Watched (+100 Energy)' : 'Watch Ad for +100 Energy'}
      </button>
      <br />
      <button
        style={{
          backgroundColor: 'orange',
          color: 'black',
          padding: '10px 30px',
          margin: 10,
          borderRadius: 8,
        }}
      >
        Daily Login Reward
      </button>
      <br />
      <button
        style={{
          backgroundColor: 'purple',
          color: 'white',
          padding: '10px 30px',
          margin: 10,
          borderRadius: 8,
        }}
      >
        Claim $SHROCK
      </button>

      <h3>Complete Social Tasks:</h3>
    </div>
  );
};

export default MainPage;

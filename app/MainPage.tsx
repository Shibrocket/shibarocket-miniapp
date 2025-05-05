"use client";

import React, { useEffect, useState } from 'react';
import Countdown from 'react-countdown';
import Link from 'next/link';
import { doc, getDoc, updateDoc, setDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function MainPage({ userId }) {
  const [energy, setEnergy] = useState(0);
  const [earned, setEarned] = useState(0);
  const [adsWatched, setAdsWatched] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginRewardClaimed, setLoginRewardClaimed] = useState(false);
  const [socialTaskClaimed, setSocialTaskClaimed] = useState(false);
  const [presaleRewardClaimed, setPresaleRewardClaimed] = useState(false);
  const [referralRewardClaimed, setReferralRewardClaimed] = useState(false);

  const MAX_ENERGY = 500;
  const FREE_TAP_LIMIT = 400;
  const BONUS_TAP_LIMIT = 100;
  const presaleDate = new Date('2025-06-01T00:00:00Z');

  const getToday = () => new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      const today = getToday();
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setEnergy(data.energy || 0);
        setEarned(data.earned || 0);
        setAdsWatched(data.adsWatched || false);
        setLoginRewardClaimed(data.loginRewardClaimed === today);
        setSocialTaskClaimed(data.socialTaskClaimed === today);
        setPresaleRewardClaimed(data.presaleRewardClaimed === today);
        setReferralRewardClaimed(data.referralRewardClaimed === true);
      }

      const adminRef = doc(db, 'admins', userId);
      const adminSnap = await getDoc(adminRef);
      if (adminSnap.exists() && adminSnap.data().isAdmin) {
        setIsAdmin(true);
      }

      await ensureDailyPoolsExist(today);
    };

    fetchData();
  }, [userId]);

  const ensureDailyPoolsExist = async (date) => {
    const pools = [
      { path: `dailyPools/socialTaskPool/${date}`, amount: 666_000_000 },
      { path: `dailyPools/presalePool/${date}`, amount: 333_000_000 },
      { path: `dailyPools/referralPool/${date}`, amount: 666_000_000 },
    ];

    for (let pool of pools) {
      const ref = doc(db, pool.path);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, { remaining: pool.amount });
      }
    }
  };

  const getMaxEnergy = () => (adsWatched ? MAX_ENERGY : FREE_TAP_LIMIT);

  const handleTap = async () => {
    if (energy >= getMaxEnergy()) return;
    const newEnergy = energy + 1;
    const newEarned = earned + 5;

    setEnergy(newEnergy);
    setEarned(newEarned);

    await updateDoc(doc(db, 'users', userId), {
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

    await updateDoc(doc(db, 'users', userId), {
      energy: newEnergy,
      adsWatched: true,
    });
  };

  const handleLoginReward = async () => {
    const today = getToday();
    if (loginRewardClaimed) return;

    const reward = 500; // Basic reward; you can extend to streak later

    await updateDoc(doc(db, 'users', userId), {
      earned: increment(reward),
      loginRewardClaimed: today,
    });

    setEarned((prev) => prev + reward);
    setLoginRewardClaimed(true);
  };

  const handleSocialTask = async () => {
    const today = getToday();
    if (socialTaskClaimed) return;

    const poolRef = doc(db, `dailyPools/socialTaskPool/${today}`);
    const poolSnap = await getDoc(poolRef);
    const pool = poolSnap.data();

    const reward = 20000;
    if (!pool || pool.remaining < reward) {
      return alert("Social task rewards are finished!");
    }

    await updateDoc(poolRef, { remaining: increment(-reward) });
    await updateDoc(doc(db, 'users', userId), {
      earned: increment(reward),
      socialTaskClaimed: today,
    });

    setEarned((prev) => prev + reward);
    setSocialTaskClaimed(true);
  };

  const handlePresaleTask = async () => {
    const today = getToday();
    if (presaleRewardClaimed) return;

    const poolRef = doc(db, `dailyPools/presalePool/${today}`);
    const poolSnap = await getDoc(poolRef);
    const pool = poolSnap.data();

    const reward = 75000;
    if (!pool || pool.remaining < reward) {
      return alert("Presale rewards are finished!");
    }

    await updateDoc(poolRef, { remaining: increment(-reward) });
    await updateDoc(doc(db, 'users', userId), {
      earned: increment(reward),
      presaleRewardClaimed: today,
    });

    setEarned((prev) => prev + reward);
    setPresaleRewardClaimed(true);
  };

  const handleReferralReward = async () => {
    if (referralRewardClaimed) return;

    await updateDoc(doc(db, 'users', userId), {
      earned: increment(30000),
      referralRewardClaimed: true,
    });

    setEarned((prev) => prev + 30000);
    setReferralRewardClaimed(true);
  };

  if (!userId) return <div>Loading user data...</div>;

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
      <h1 style={{ color: '#ff4500' }}>ShibaRocket Mini App</h1>

      <h3>
        Presale Countdown:
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

      <h2>Energy: {energy} / {getMaxEnergy()}</h2>
      <h2>Earned: {earned.toLocaleString()} $SHROCK</h2>

      <button
        onClick={handleTap}
        disabled={energy >= getMaxEnergy()}
        style={{
          backgroundColor: energy < getMaxEnergy() ? 'green' : 'gray',
          color: 'white', padding: 10, fontSize: 18, borderRadius: 5, marginTop: 10, width: 150
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
            color: 'white', padding: 10, borderRadius: 5, marginTop: 10, width: 220
          }}
        >
          {adsWatched ? 'Ad Watched (+100 Energy)' : 'Watch Ad for +100 Energy'}
        </button>

        <br />
        <button
          onClick={handleLoginReward}
          disabled={loginRewardClaimed}
          style={{
            backgroundColor: loginRewardClaimed ? 'gray' : 'orange',
            color: 'white', padding: 10, borderRadius: 5, marginTop: 10
          }}
        >
          {loginRewardClaimed ? 'Login Reward Claimed' : 'Daily Login Reward'}
        </button>

        <br />
        <button
          onClick={handleSocialTask}
          disabled={socialTaskClaimed}
          style={{
            backgroundColor: socialTaskClaimed ? 'gray' : 'blue',
            color: 'white', padding: 10, borderRadius: 5, marginTop: 10
          }}
        >
          {socialTaskClaimed ? 'Social Task Claimed' : 'Complete Social Task'}
        </button>

        <br />
        <button
          onClick={handlePresaleTask}
          disabled={presaleRewardClaimed}
          style={{
            backgroundColor: presaleRewardClaimed ? 'gray' : 'green',
            color: 'white', padding: 10, borderRadius: 5, marginTop: 10
          }}
        >
          {presaleRewardClaimed ? 'Presale Task Claimed' : 'Join Presale Event'}
        </button>

        <br />
        <button
          onClick={handleReferralReward}
          disabled={referralRewardClaimed}
          style={{
            backgroundColor: referralRewardClaimed ? 'gray' : 'purple',
            color: 'white', padding: 10, borderRadius: 5, marginTop: 10
          }}
        >
          {referralRewardClaimed ? 'Referral Bonus Claimed' : 'Claim Referral Bonus'}
        </button>
      </div>

      {isAdmin && (
        <Link href={`/adminDashboard?userId=${userId}`}>
          <button style={{ marginTop: 30, background: "#000", color: "#fff", padding: 10, borderRadius: 5 }}>
            Go to Admin Dashboard
          </button>
        </Link>
      )}
    </div>
  );
}

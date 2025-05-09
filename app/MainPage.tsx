"use client";

import React, { useEffect, useState } from 'react';
import Countdown from 'react-countdown';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  increment,
  collection,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

const claimAvailableDate = new Date('2025-06-01T00:00:00Z');

export default function MainPage({ userId }) {
  const router = useRouter();

  const [energy, setEnergy] = useState(0);
  const [earned, setEarned] = useState(0);
  const [adsWatched, setAdsWatched] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginRewardClaimed, setLoginRewardClaimed] = useState(false);
  const [socialTaskClaimed, setSocialTaskClaimed] = useState(false);
  const [presaleRewardClaimed, setPresaleRewardClaimed] = useState(false);
  const [referralRewardClaimed, setReferralRewardClaimed] = useState(false);
  const [presaleStats, setPresaleStats] = useState({ totalEarned: 0, totalClaimed: 0, remaining: 0 });
  const [claimAvailable, setClaimAvailable] = useState(false);

  const MAX_ENERGY = 500;
  const FREE_TAP_LIMIT = 400;
  const BONUS_TAP_LIMIT = 100;
  const presaleDate = new Date('2025-06-01T00:00:00Z');
  const getToday = () => new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (!userId) return;

    const today = getToday();

    const fetchData = async () => {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          energy: 0,
          earned: 0,
          referrals: 0,
          referralRewardClaimed: false,
          loginStreak: 0,
          totalTaps: 0,
          shrockEarned: 0,
          shrockUnclaimed: 0,
          claimed: 0,
          lastUpdated: today,
          createdAt: serverTimestamp(),
        });
      }

      const freshSnap = await getDoc(userRef);
      const data = freshSnap.data();

      const freshSnap = await getDoc(userRef);

      if (freshSnap.exists()) {
        const data = freshSnap.data();

        if (data?.lastUpdated !== today) {
          await updateDoc(userRef, {
            energy: 0,
            earned: 0,
            adsWatched: '',
            lastUpdated: today
          });
          setEnergy(0);
          setEarned(0);
          setAdsWatched(false);
        } else {
          setEnergy(data.energy || 0);
          setEarned(data.earned || 0);
          setAdsWatched(data.adsWatched === today);
        }

        setLoginRewardClaimed(data.loginRewardClaimed === today);
        setSocialTaskClaimed(data.socialTaskClaimed === today);
      setPresaleRewardClaimed(data.presaleRewardClaimed === today);
      setReferralRewardClaimed(data.referralRewardClaimed || false);
      }

      const adminRef = doc(db, 'admins', userId);
      const adminSnap = await getDoc(adminRef);
      if (adminSnap.exists() && adminSnap.data().isAdmin) {
        setIsAdmin(true);
      }

      await ensureDailyPoolsExist(today);
      await fetchPresaleStats();
      checkClaimAvailability();
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
      lastUpdated: getToday()
    });
  };

  const handleAdWatch = async () => {
    const today = getToday();
    if (adsWatched || energy >= MAX_ENERGY) return;
    const bonus = Math.min(BONUS_TAP_LIMIT, MAX_ENERGY - energy);
    const newEnergy = energy + bonus;
    setEnergy(newEnergy);
    setAdsWatched(true);
    await updateDoc(doc(db, 'users', userId), {
      energy: newEnergy,
      adsWatched: today,
      lastUpdated: today
    });
  };

  const handleLoginReward = async () => {
    const today = getToday();
    if (loginRewardClaimed) return;
    const reward = 500;
    await updateDoc(doc(db, 'users', userId), {
      earned: increment(reward),
      loginRewardClaimed: today,
      lastUpdated: today
    });
    setEarned(prev => prev + reward);
    setLoginRewardClaimed(true);
  };

  const handleSocialTask = async () => {
    const today = getToday();
    if (socialTaskClaimed) return;
    const poolRef = doc(db, `dailyPools/socialTaskPool/${today}`);
    const poolSnap = await getDoc(poolRef);
    const pool = poolSnap.data();
    const reward = 20000;
    if (!pool || pool.remaining < reward) return alert("Social task rewards are finished!");
    await updateDoc(poolRef, { remaining: increment(-reward) });
    await updateDoc(doc(db, 'users', userId), {
      earned: increment(reward),
      socialTaskClaimed: today,
      lastUpdated: today
    });
    setEarned(prev => prev + reward);
    setSocialTaskClaimed(true);
  };

  const handlePresaleTask = async () => {
    const today = getToday();
    if (presaleRewardClaimed) return;
    const poolRef = doc(db, `dailyPools/presalePool/${today}`);
    const poolSnap = await getDoc(poolRef);
    const pool = poolSnap.data();
    const reward = 75000;
    if (!pool || pool.remaining < reward) return alert("Presale rewards are finished!");
    await updateDoc(poolRef, { remaining: increment(-reward) });
    await updateDoc(doc(db, 'users', userId), {
      earned: increment(reward),
      presaleRewardClaimed: today,
      lastUpdated: today
    });
    setEarned(prev => prev + reward);
    setPresaleRewardClaimed(true);
  };

  const handleReferralReward = async () => {
    const today = getToday();
    if (referralRewardClaimed) return;
    const poolRef = doc(db, `dailyPools/referralPool/${today}`);
    const poolSnap = await getDoc(poolRef);
    const pool = poolSnap.data();
    const reward = 30000;
    if (!pool || pool.remaining < reward) return alert("Referral reward pool is empty!");
    await updateDoc(poolRef, { remaining: increment(-reward) });
    await updateDoc(doc(db, 'users', userId), {
      earned: increment(reward),
      referralRewardClaimed: true,
      lastUpdated: today
    });
    setEarned(prev => prev + reward);
    setReferralRewardClaimed(true);
  };

  const fetchPresaleStats = async () => {
    const userSnap = await getDocs(collection(db, 'users'));
    let totalEarned = 0;
    let totalClaimed = 0;
    userSnap.forEach(doc => {
      const data = doc.data();
      totalEarned += data.earned || 0;
      totalClaimed += data.claimed || 0;
    });
    const totalAirdrop = 100_000_000_000;
    const remaining = totalAirdrop - totalClaimed;
    setPresaleStats({ totalEarned, totalClaimed, remaining });
  };

  const checkClaimAvailability = () => {
    const now = new Date();
    setClaimAvailable(now >= claimAvailableDate);
  };

  const handleClaim = () => {
    if (!claimAvailable) {
      alert("Claiming is only available from June 1st.");
      return;
    }
    router.push('/claim');
  };

  if (!userId) return <div>Loading user data...</div>;

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
      <h1 style={{ color: '#ff4500' }}>ShibaRocket Mini App</h1>
      <h3>
        Presale Countdown:
        <Countdown
          date={presaleDate}
          renderer={({ days, hours, minutes, seconds }) => (
            <span style={{ marginLeft: 10 }}>
              {String(days).padStart(2, '0')}d : {String(hours).padStart(2, '0')}h : {String(minutes).padStart(2, '0')}m : {String(seconds).padStart(2, '0')}s
            </span>
          )}
        />
      </h3>

      <div style={{ marginTop: 20 }}>
        <p><strong>Energy:</strong> {energy}/{getMaxEnergy()}</p>
        <p><strong>Earned Today:</strong> {earned} $SHROCK</p>

        <button onClick={handleTap} disabled={energy >= getMaxEnergy()}>Tap</button>
        <button onClick={handleAdWatch} disabled={adsWatched}>Watch Ad</button>
        <button onClick={handleLoginReward} disabled={loginRewardClaimed}>Daily Login</button>
        <button onClick={handleSocialTask} disabled={socialTaskClaimed}>Social Task</button>
        <button onClick={handlePresaleTask} disabled={presaleRewardClaimed}>Presale Reminder</button>
        <button onClick={handleReferralReward} disabled={referralRewardClaimed}>Referral Bonus</button>

        {claimAvailable && (
          <div style={{ marginTop: 20 }}>
            <button onClick={handleClaim}>Claim $SHROCK</button>
          </div>
        )}
      </div>

      <div style={{ marginTop: 30 }}>
        <h4>Presale Stats:</h4>
        <p><strong>Total Earned:</strong> {presaleStats.totalEarned.toLocaleString()} $SHROCK</p>
        <p><strong>Total Claimed:</strong> {presaleStats.totalClaimed.toLocaleString()} $SHROCK</p>
        <p><strong>Remaining Airdrop:</strong> {presaleStats.remaining.toLocaleString()} $SHROCK</p>
      </div>

      {isAdmin && (
        <div style={{ marginTop: 30 }}>
          <Link href="/admin">
            <button>Go to Admin Dashboard</button>
          </Link>
        </div>
      )}
    </div>
  );
}

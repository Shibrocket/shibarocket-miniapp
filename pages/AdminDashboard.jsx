'use client';

import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

const AdminDashboard = () => {
  const [telegramUserId, setTelegramUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalTaps, setTotalTaps] = useState(0);

  const pools = {
    tappingPool: 1000000000,
    loginPool: 666000000,
    referralPool: 666000000,
    socialTaskPool: 666000000,
    presalePool: 333000000,
    totalDaily: 3330000000,
    lastPoolUpdateDate: "2025-05-03",
  };

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    const id = tg?.initDataUnsafe?.user?.id;

    if (!id) {
      console.warn('No Telegram ID found.');
      setLoading(false);
      return;
    }

    setTelegramUserId(id);

    const checkAdminAndFetchStats = async () => {
      try {
        const adminRef = doc(db, 'admins', id.toString());
        const adminSnap = await getDoc(adminRef);

        if (adminSnap.exists() && adminSnap.data().isAdmin === true) {
          setIsAdmin(true);

          const usersSnap = await getDocs(collection(db, 'users'));
          setTotalUsers(usersSnap.size);

          const tapsSnap = await getDocs(collection(db, 'taps'));
          let total = 0;
          tapsSnap.forEach(doc => {
            total += doc.data().tapCount || 0;
          });
          setTotalTaps(total);
        }
      } catch (err) {
        console.error('Error fetching admin status or stats:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndFetchStats();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!isAdmin) return <p>Access denied. You are not an admin.</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="bg-white rounded-xl shadow-md p-4">
        <p><strong>Total Users:</strong> {totalUsers}</p>
        <p><strong>Total Taps:</strong> {totalTaps}</p>
        <p><strong>Last Pool Update:</strong> {pools.lastPoolUpdateDate}</p>
        <p><strong>Tapping Pool:</strong> {pools.tappingPool.toLocaleString()} SHROCK</p>
        <p><strong>Login Pool:</strong> {pools.loginPool.toLocaleString()} SHROCK</p>
        <p><strong>Referral Pool:</strong> {pools.referralPool.toLocaleString()} SHROCK</p>
        <p><strong>Social Task Pool:</strong> {pools.socialTaskPool.toLocaleString()} SHROCK</p>
        <p><strong>Presale Pool:</strong> {pools.presalePool.toLocaleString()} SHROCK</p>
        <p><strong>Total Daily:</strong> {pools.totalDaily.toLocaleString()} SHROCK</p>
      </div>
    </div>
  );
};

export default AdminDashboard;

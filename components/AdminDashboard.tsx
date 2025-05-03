k'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

const AdminDashboard = () => {
  const [inputPassword, setInputPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalTaps, setTotalTaps] = useState(0);

  const pools = {
    tappingPool: 1_000_000_000,
    socialTaskPool: 666_000_000,
    referralPool: 666_000_000,
    loginPool: 666_000_000,
    presalePool: 333_000_000,
    totalDaily: 3_330_000_000,
  };

  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        setTotalUsers(usersSnapshot.size);

        let totalTapCount = 0;
        usersSnapshot.forEach((doc) => {
          const data = doc.data();
          totalTapCount += data.totalTaps || 0;
        });
        setTotalTaps(totalTapCount);
      };
      fetchData();
    }
  }, [isAuthenticated]);

  const formatShrock = (value: number) => `${value.toLocaleString()} $SHROCK`;

  const handleLogin = () => {
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    if (inputPassword === correctPassword) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="p-4 max-w-sm mx-auto text-center">
        <h2 className="text-xl font-semibold mb-4">Enter Admin Password</h2>
        <input
          type="password"
          className="border px-2 py-1 rounded w-full mb-2"
          value={inputPassword}
          onChange={(e) => setInputPassword(e.target.value)}
          placeholder="Admin password"
        />
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Admin Dashboard</h1>
      <div className="bg-white shadow-md rounded p-4 space-y-3 text-sm sm:text-base">
        <p><strong>Total Users:</strong> {totalUsers}</p>
        <p><strong>Total Taps:</strong> {totalTaps.toLocaleString()} taps</p>
        <p><strong>Tapping Earnings:</strong> {formatShrock(totalTaps * 5)}</p>
        <p><strong>Daily Pool:</strong> {formatShrock(pools.totalDaily)}</p>
        <p><strong>Login Pool:</strong> {formatShrock(pools.loginPool)}</p>
        <p><strong>Referral Pool:</strong> {formatShrock(pools.referralPool)}</p>
        <p><strong>Social Task Pool:</strong> {formatShrock(pools.socialTaskPool)}</p>
        <p><strong>Presale Task Pool:</strong> {formatShrock(pools.presalePool)}</p>
        <p><strong>Tapping Pool:</strong> {formatShrock(pools.tappingPool)}</p>
      </div>
    </div>
  );
};

export default AdminDashboard;


'use client';
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const AdminDashboard = () => {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalTaps, setTotalTaps] = useState(0);
  const [pools, setPools] = useState(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const adminDoc = await getDoc(doc(db, 'admins', '7684906960'));
      if (adminDoc.exists() && adminDoc.data().isAdmin) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        router.push('/');
      }
    };

    const fetchStats = async () => {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      setTotalUsers(usersSnapshot.size);

      const tapsSnapshot = await getDocs(collection(db, 'taps'));
      setTotalTaps(tapsSnapshot.size);

      const poolsDoc = await getDoc(doc(db, 'pools', 'dailyPools'));
      if (poolsDoc.exists()) {
        setPools(poolsDoc.data());
      }
    };

    checkAdmin();
    fetchStats();
  }, []);

  if (isAdmin === null || pools === null) return <p>Loading...</p>;

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

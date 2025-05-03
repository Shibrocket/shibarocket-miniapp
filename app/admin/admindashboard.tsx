'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, getCountFromServer } from 'firebase/firestore';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');
  const [stats, setStats] = useState<any>(null);

  const handlePasswordSubmit = async () => {
    const adminDoc = await getDoc(doc(db, 'settings', 'admin'));
    const correctPassword = adminDoc.exists() ? adminDoc.data().adminPassword : null;

    if (passwordInput === correctPassword) {
      setIsAuthenticated(true);
      fetchStats();
    } else {
      setError('Incorrect password');
    }
  };

  const fetchStats = async () => {
    const usersSnap = await getCountFromServer(collection(db, 'users'));
    const tapsSnap = await getCountFromServer(collection(db, 'taps'));
    const poolsDoc = await getDoc(doc(db, 'pools', 'current'));

    setStats({
      totalUsers: usersSnap.data().count,
      totalTaps: tapsSnap.data().count,
      ...poolsDoc.data(),
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Admin Login</h1>
        <input
          type="password"
          placeholder="Enter admin password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          className="border p-2 mr-2"
        />
        <button onClick={handlePasswordSubmit} className="bg-black text-white p-2">
          Submit
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    );
  }

  if (!stats) return <div className="p-6">Loading dashboard...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p><strong>Total Users:</strong> {stats.totalUsers}</p>
      <p><strong>Total Taps:</strong> {stats.totalTaps}</p>
      <p><strong>Tapping Pool:</strong> {stats.tappingPool.toLocaleString()} SHROCK</p>
      <p><strong>Login Pool:</strong> {stats.loginPool.toLocaleString()} SHROCK</p>
      <p><strong>Referral Pool:</strong> {stats.referralPool.toLocaleString()} SHROCK</p>
      <p><strong>Social Task Pool:</strong> {stats.socialTaskPool.toLocaleString()} SHROCK</p>
      <p><strong>Presale Pool:</strong> {stats.presalePool.toLocaleString()} SHROCK</p>
      <p><strong>Total Daily:</strong> {stats.totalDaily.toLocaleString()} SHROCK</p>
      <p><strong>Last Pool Update:</strong> {stats.lastUpdated}</p>
    </div>
  );
}

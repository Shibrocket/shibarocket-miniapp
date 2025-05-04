import React from 'react';

const AdminDashboard = () => {
  // Static values for now
  const totalUsers = 0; // Replace with actual if needed
  const totalTaps = 0;  // Replace with actual if needed
  const pools = {
    tappingPool: 1000000000,
    loginPool: 666000000,
    referralPool: 666000000,
    socialTaskPool: 666000000,
    presalePool: 333000000,
    totalDaily: 3330000000,
    lastPoolUpdateDate: "2025-05-03",
  };

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

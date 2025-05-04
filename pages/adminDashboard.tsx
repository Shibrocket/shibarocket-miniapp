import React, { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { doc, getDoc } from "firebase/firestore";

const AdminDashboard = () => {
  const [pools, setPools] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPools = async () => {
      try {
        const docRef = doc(db, "pools", "dailyPools");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPools(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching pool data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPools();
  }, []);

  if (loading) return <p>Loading admin dashboard...</p>;
  if (!pools) return <p>No pool data available</p>;

  const {
    tappingPool = 0,
    usedTappingPool = 0,
    referralPool = 0,
    usedReferralPool = 0,
    loginPool = 0,
    usedLoginPool = 0,
    presalePool = 0,
    usedPresalePool = 0,
    socialTaskPool = 0,
    usedSocialTaskPool = 0,
    totalDaily = 0,
    lastPoolUpdateDate = "N/A",
  } = pools;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Admin Dashboard</h1>
      <p><strong>Last Pool Update:</strong> {lastPoolUpdateDate}</p>
      <p><strong>Total Daily Allocation:</strong> {totalDaily.toLocaleString()} $SHROCK</p>

      <h2>Daily Pools</h2>
      <ul>
        <li><strong>Tapping Pool:</strong> {usedTappingPool.toLocaleString()} used / {tappingPool.toLocaleString()} total</li>
        <li><strong>Referral Pool:</strong> {usedReferralPool.toLocaleString()} used / {referralPool.toLocaleString()} total</li>
        <li><strong>Login Pool:</strong> {usedLoginPool.toLocaleString()} used / {loginPool.toLocaleString()} total</li>
        <li><strong>Presale Pool:</strong> {usedPresalePool.toLocaleString()} used / {presalePool.toLocaleString()} total</li>
        <li><strong>Social Task Pool:</strong> {usedSocialTaskPool.toLocaleString()} used / {socialTaskPool.toLocaleString()} total</li>
      </ul>
    </div>
  );
};

export default AdminDashboard;

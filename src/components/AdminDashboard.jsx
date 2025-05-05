// src/components/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const AdminDashboard = () => {
  const [poolData, setPoolData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPools = async () => {
      try {
        const today = new Date().toISOString().slice(0, 10);
        const docRef = doc(db, "dailyPools", today);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPoolData(docSnap.data());
        } else {
          console.log("No pool data for today");
        }
      } catch (error) {
        console.error("Error fetching pool data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPools();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>
      {poolData ? (
        <div style={{
          backgroundColor: "#fff",
          padding: 20,
          borderRadius: 12,
          boxShadow: "0 0 10px rgba(0,0,0,0.1)"
        }}>
          <p><strong>Date:</strong> {poolData.date}</p>
          <p><strong>Tapping Pool:</strong> {poolData.tappingPool}</p>
          <p><strong>Login Pool:</strong> {poolData.loginPool}</p>
          <p><strong>Referral Pool:</strong> {poolData.referralPool}</p>
          <p><strong>Social Task Pool:</strong> {poolData.socialTaskPool}</p>
          <p><strong>Presale Pool:</strong> {poolData.presalePool}</p>
          <p><strong>Total Daily:</strong> {poolData.totalDaily}</p>
        </div>
      ) : <p>No pool data found for today.</p>}
    </div>
  );
};

export default AdminDashboard;


// src/components/AdminDashboard.js
import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const AdminDashboard = () => {
  const [poolData, setPoolData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPools = async () => {
      try {
        const docRef = doc(db, "pools", "dailyPools");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPoolData(data.dailyPools); // nested dailyPools object
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
          <p><strong>Last Update:</strong> {poolData.lastPoolUpdateDate}</p>
          <p><strong>Tapping Pool:</strong> {poolData.tappingPool}</p>
          <p><strong>Login Pool:</strong> {poolData.loginPool}</p>
          <p><strong>Referral Pool:</strong> {poolData.referralPool}</p>
          <p><strong>Social Task Pool:</strong> {poolData.socialTaskPool}</p>
          <p><strong>Presale Pool:</strong> {poolData.presalePool}</p>
          <p><strong>Total Daily:</strong> {poolData.totalDaily}</p>
        </div>
      ) : <p>No pool data found.</p>}
    </div>
  );
};

export default AdminDashboard;

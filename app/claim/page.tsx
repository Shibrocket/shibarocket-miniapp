"use client";

import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useSearchParams } from 'next/navigation';

export default function ClaimPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const [claimed, setClaimed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [shrockAmount, setShrockAmount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      const ref = doc(db, 'users', userId);
      const snap = await getDoc(ref);
      const data = snap.data();

      if (data) {
        setShrockAmount(data.earned || 0);
        setClaimed(data.hasClaimedPresale || false);
      }

      setLoading(false);
    };

    fetchUser();
  }, [userId]);

  const handleClaim = async () => {
    if (!userId) return;

    const ref = doc(db, 'users', userId);
    await updateDoc(ref, {
      claimed: shrockAmount,
      hasClaimedPresale: true
    });

    setClaimed(true);
    alert(`You claimed ${shrockAmount.toLocaleString()} $SHROCK!`);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ textAlign: 'center', padding: 20, fontFamily: 'Arial' }}>
      <h1>Claim Your $SHROCK</h1>
      <p>You earned: <strong>{shrockAmount.toLocaleString()} $SHROCK</strong></p>
      {claimed ? (
        <p style={{ color: 'green', fontWeight: 'bold' }}>Already Claimed</p>
      ) : (
        <button
          onClick={handleClaim}
          style={{
            marginTop: 20,
            backgroundColor: '#28a745',
            color: 'white',
            padding: 10,
            borderRadius: 5,
            fontSize: 18
          }}
        >
          Claim $SHROCK
        </button>
      )}
    </div>
  );
}

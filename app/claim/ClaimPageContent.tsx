"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  increment,
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@lib/firebase";
import { useSearchParams, useRouter } from "next/navigation";

export default function ClaimPageContent() {
  const [loading, setLoading] = useState(true);
  const [claimedAmount, setClaimedAmount] = useState(0);
  const [totalClaimed, setTotalClaimed] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams?.get("userId") || "";

  useEffect(() => {
    if (!userId) return;
    claimTokens();
  }, [userId]);

  const claimTokens = async () => {
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        setError("User data not found.");
        setLoading(false);
        return;
      }

      const data = userSnap.data();
      const unclaimed = data.earned || 0;
      const previousClaimed = data.claimed || 0;

      if (unclaimed <= 0) {
        setError("No $SHROCK tokens to claim.");
        setLoading(false);
        fetchClaimHistory();
        return;
      }

      await updateDoc(userRef, {
        claimed: increment(unclaimed),
        earned: 0,
      });

      const historyRef = collection(db, "claims", userId, "history");
      await addDoc(historyRef, {
        amount: unclaimed,
        timestamp: serverTimestamp(),
      });

      setClaimedAmount(unclaimed);
      setTotalClaimed(previousClaimed + unclaimed);
      setSuccess(true);
      fetchClaimHistory();
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const fetchClaimHistory = async () => {
    try {
      const historyRef = collection(db, "claims", userId, "history");
      const historySnap = await getDocs(historyRef);
      const historyData = historySnap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => {
          const aTime = (a as any)?.timestamp?.seconds || 0;
          const bTime = (b as any)?.timestamp?.seconds || 0;
          return bTime - aTime;
        });
      setHistory(historyData);
    } catch (err) {
      console.error("Failed to fetch claim history", err);
    }
  };

  const goBack = () => {
    router.push(`/?userId=${userId}`);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp?.seconds) return "Unknown";
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString();
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif", textAlign: "center", minHeight: "100vh" }}>
      <h1 style={{ color: "#ff4500" }}>Claim Your $SHROCK</h1>

      {loading && <p>Processing your claim...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {success && (
        <div style={{ marginTop: 30 }}>
          <div style={{ fontSize: 80, animation: "pop 0.6s ease" }}>✅</div>
          <h2 style={{ color: "green" }}>Claim Successful!</h2>
          <p>You have claimed <strong>{claimedAmount.toLocaleString()}</strong> $SHROCK.</p>
          <p>Your total claimed balance is now <strong>{totalClaimed.toLocaleString()}</strong> $SHROCK.</p>
          <button
            onClick={goBack}
            style={{
              marginTop: 20,
              padding: 10,
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: 6,
              fontSize: 16,
            }}
          >
            Return to Mini App
          </button>
        </div>
      )}

      {history.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <h3>Claim History</h3>
          <table style={{ margin: "0 auto", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ padding: 8, borderBottom: "1px solid #ccc" }}>Date</th>
                <th style={{ padding: 8, borderBottom: "1px solid #ccc" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry) => (
                <tr key={entry.id}>
                  <td style={{ padding: 8 }}>{formatDate(entry.timestamp)}</td>
                  <td style={{ padding: 8 }}>{entry.amount.toLocaleString()} $SHROCK</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style jsx>{`
        @keyframes pop {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

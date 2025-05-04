// pages/adminDashboard.tsx

import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../utils/firebaseClient";
import { useRouter } from "next/router";

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [data, setData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (!user) {
          setIsAdmin(false);
          return router.push("/");
        }

        const adminRef = doc(db, "admins", user.uid);
        const adminSnap = await getDoc(adminRef);

        if (adminSnap.exists() && adminSnap.data().isAdmin) {
          setIsAdmin(true);
          // Fetch dashboard data here if needed
        } else {
          setIsAdmin(false);
          router.push("/");
        }
      });

      return () => unsubscribe();
    };

    checkAdmin();
  }, []);

  if (isAdmin === null) return <p>Checking admin access...</p>;
  if (!isAdmin) return <p>Access denied</p>;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, admin!</p>
      {/* Add total users, taps, token pools, etc. */}
    </div>
  );
}

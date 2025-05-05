import { useEffect, useState } from 'react';
import Link from 'next/link';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

const AdminButton = ({ userId }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!userId) return;
      const adminDoc = await getDoc(doc(db, 'admins', userId));
      setIsAdmin(adminDoc.exists());
    };
    checkAdmin();
  }, [userId]);

  if (!isAdmin) return null;

  return (
    <Link href="/admin">
      <button style={{ margin: 10, padding: 10, background: 'black', color: 'white' }}>
        Go to Admin Dashboard
      </button>
    </Link>
  );
};

export default AdminButton;

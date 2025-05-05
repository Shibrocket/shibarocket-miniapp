'use client';

import { Suspense, useEffect, useState } from 'react';
import MainPage from './MainPage';

export default function Page() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    alert("useEffect ran");

    const tg = (window as any).Telegram?.WebApp;
    alert("Telegram WebApp: " + JSON.stringify(tg));

    if (tg?.initDataUnsafe?.user?.id) {
      const id = tg.initDataUnsafe.user.id.toString();
      alert("User ID found: " + id);
      setUserId(id);
    } else {
      alert("Telegram user ID not found! Using test user ID.");
      setUserId("7684906960"); // fallback for local testing
    }
  }, []);

  if (!userId) {
    return <div>Loading ShibaRocket Mini App...</div>;
  }

  return (
    <Suspense fallback={<div>Loading ShibaRocket Mini App...</div>}>
      <MainPage userId={userId} />
    </Suspense>
  );
}

'use client';

import { Suspense, useEffect, useState } from 'react';
import MainPage from './MainPage';

export default function Page() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.initDataUnsafe?.user?.id) {
      setUserId(tg.initDataUnsafe.user.id.toString());
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

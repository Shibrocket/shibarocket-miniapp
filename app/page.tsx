import { Suspense } from 'react';
import MainPage from './MainPage';

export default function Home() {
  return (
    <Suspense fallback={<div>Loading ShibaRocket Mini App...</div>}>
      <MainPage />
    </Suspense>
  );
}

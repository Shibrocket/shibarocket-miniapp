import { useEffect, useState } from 'react';

export default function Home() {
  const [energy, setEnergy] = useState(5);
  const [reward, setReward] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy(prev => (prev < 5 ? prev + 1 : prev));
    }, 1800000); // refill every 30 mins
    return () => clearInterval(interval);
  }, []);

  const handleTap = () => {
    if (energy > 0) {
      setEnergy(energy - 1);
      setReward(reward + 10); // 10 $SHROCK per tap
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: 20 }}>
      <h1>ShibaRocket</h1>
      <p>Energy: {energy}/5</p>
      <button onClick={handleTap}>Tap to Earn</button>
      <p>Reward: {reward} $SHROCK</p>

      {new Date() >= new Date("2025-05-20") && (
        <button onClick={() => alert('Claiming SHROCK...')}>Claim $SHROCK</button>
      )}

      <div style={{ marginTop: 20 }}>
        <a href="https://twitter.com/Shibrocket_EGC" target="_blank">Follow on Twitter</a><br />
        <a href="https://t.me/ShibaRocketPack" target="_blank">Join Telegram</a><br />
        <a href="https://instagram.com/shibarocket_egc20" target="_blank">Follow on Instagram</a>
      </div>
    </div>
  );
}

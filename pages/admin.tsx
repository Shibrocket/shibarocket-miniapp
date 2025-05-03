// pages/admin.tsx
import { useState } from 'react';
import AdminDashboard from '../components/AdminDashboard';

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuthorized(true);
    } else {
      alert('Incorrect password');
    }
  };

  if (!authorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-xl font-semibold mb-4">Enter Admin Password</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 mb-2 rounded"
        />
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Login
        </button>
      </div>
    );
  }

  return <AdminDashboard />;
}

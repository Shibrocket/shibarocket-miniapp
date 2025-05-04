'use client';

import AdminDashboard from '../../components/AdminDashboard';

export default function AdminPage() {
  const telegramUserId = 7684906960; // Replace with dynamic Telegram ID if available

  return <AdminDashboard telegramUserId={telegramUserId} />;
}

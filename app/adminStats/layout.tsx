// app/adminStats/layout.tsx
import React from 'react';

export default function AdminStatsLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}

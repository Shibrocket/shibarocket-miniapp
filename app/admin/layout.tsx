// app/admin/layout.tsx
import React from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <div className="admin-layout">
          {children}
        </div>
      </body>
    </html>
  );
}

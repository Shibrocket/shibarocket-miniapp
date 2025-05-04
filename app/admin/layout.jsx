// app/admin/layout.jsx
import React from 'react';

export const metadata = {
  title: 'Admin Dashboard',
  description: 'ShibaRocket Admin Dashboard',
};

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'sans-serif' }}>
        {children}
      </body>
    </html>
  );
}

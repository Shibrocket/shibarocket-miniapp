// app/admin/layout.tsx

import React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header className="p-4 bg-black text-white text-center text-xl font-bold">
        ShibaRocket Admin
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}

// app/layout.tsx
export const metadata = {
  title: 'ShibaRocket Mini App',
  description: 'Earn $SHROCK by tapping, referring, and completing tasks!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>{children}</body>
    </html>
  );
}

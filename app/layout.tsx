import { UserProvider } from '@/context/UserContext';

export const metadata = {
  title: 'ShibaRocket Mini App',
  description: 'Earn $SHROCK by tapping, referring, and completing tasks!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}

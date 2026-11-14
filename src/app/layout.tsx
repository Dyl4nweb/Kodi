import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'KODI — Windows Dynamic Island',
  description: 'Lightweight, elegant Windows Dynamic Island with Google Antigravity quota monitoring.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark bg-transparent">
      <body className="bg-transparent font-sans antialiased overflow-x-hidden min-h-screen select-none">
        {children}
      </body>
    </html>
  );
}


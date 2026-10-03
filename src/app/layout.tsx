import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kasa AutoBox Cloud — Automotive Ephemeral Sandboxes on AWS',
  description: 'Instrument-grade ephemeral cloud sandbox platform for automotive workshop management, OBD-II telematics, and ECU diagnostic testbenches on AWS.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-ground text-slate-100 min-h-screen antialiased selection:bg-nominal/20 selection:text-nominal">
        {children}
      </body>
    </html>
  );
}

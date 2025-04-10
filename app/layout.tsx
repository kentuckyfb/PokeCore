// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';


export const metadata: Metadata = {
  title: 'Pokémon Card Explorer',
  description: 'Explore Pokémon information in a beautiful card format',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );

};
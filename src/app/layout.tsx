import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ajman Coach — Player Management',
  description: 'Football player management system for coaches in Ajman, UAE.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en"><body>{children}</body></html>
  );
}
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: {
    default: 'Ai Vault - Discover the Best AI Tools Directory',
    template: '%s | Ai Vault',
  },
  description: 'Discover, compare, and review 40+ curated AI tools across writing, image, video, coding, audio, and design categories. Find the perfect AI tool for your workflow.',
  keywords: ['AI tools', 'artificial intelligence', 'AI directory', 'ChatGPT', 'Midjourney', 'AI writing', 'AI coding', 'AI image generator', 'AI video', 'AI audio'],
  authors: [{ name: 'Ai Vault' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Ai Vault',
    title: 'Ai Vault - Discover the Best AI Tools Directory',
    description: 'Discover, compare, and review 40+ curated AI tools. Find the perfect AI tool for your workflow.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ai Vault - Discover the Best AI Tools Directory',
    description: 'Discover, compare, and review 40+ curated AI tools. Find the perfect AI tool for your workflow.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col font-sans antialiased selection:bg-primary/30">
        <Providers>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}

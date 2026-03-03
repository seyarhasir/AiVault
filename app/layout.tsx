import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: {
    default: 'AiVault - Discover the Best AI Tools Directory',
    template: '%s | AiVault',
  },
  description: 'Discover, compare, and review 40+ curated AI tools across writing, image, video, coding, audio, and design categories. Find the perfect AI tool for your workflow.',
  keywords: ['AI tools', 'artificial intelligence', 'AI directory', 'ChatGPT', 'Midjourney', 'AI writing', 'AI coding', 'AI image generator', 'AI video', 'AI audio'],
  authors: [{ name: 'AiVault' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'AiVault',
    title: 'AiVault - Discover the Best AI Tools Directory',
    description: 'Discover, compare, and review 40+ curated AI tools. Find the perfect AI tool for your workflow.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AiVault - Discover the Best AI Tools Directory',
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

import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Long Nguyen - Full Stack Developer & Game Developer',
    template: '%s | Long Nguyen'
  },
  description: 'Full stack developer and game developer specializing in modern web technologies and game development frameworks.',
  keywords: ['Full Stack Developer', 'Game Developer', 'React', 'Next.js', 'Unity', 'TypeScript', 'Web Development'],
  authors: [{ name: 'Long Nguyen' }],
  creator: 'Long Nguyen',
  publisher: 'Long Nguyen',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://long18.github.io',
    title: 'Long Nguyen - Full Stack Developer & Game Developer',
    description: 'Full stack developer and game developer specializing in modern web technologies and game development frameworks.',
    siteName: 'Long Nguyen Portfolio',
    images: [
      {
        url: '/assets/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Long Nguyen Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Long Nguyen - Full Stack Developer & Game Developer',
    description: 'Full stack developer and game developer specializing in modern web technologies and game development frameworks.',
    creator: '@long18dev',
    images: ['/assets/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}

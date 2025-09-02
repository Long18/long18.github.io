import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/context/ThemeContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Lê Nguyễn Thành Long - Game Engineer',
    template: '%s | Lê Nguyễn Thành Long'
  },
  description: 'Game developer specializing in modern web technologies and game development frameworks.',
  keywords: ['Game Developer', 'React', 'Next.js', 'Unity', 'TypeScript', 'Web Development'],
  authors: [{ name: 'Lê Nguyễn Thành Long' }],
  creator: 'Lê Nguyễn Thành Long',
  publisher: 'Lê Nguyễn Thành Long',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://long18.github.io',
    title: 'Lê Nguyễn Thành Long - Game Engineer',
    description: 'Game developer specializing in modern web technologies and game development frameworks.',
    siteName: 'Lê Nguyễn Thành Long Portfolio',
    images: [
      {
        url: '/assets/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Lê Nguyễn Thành Long Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lê Nguyễn Thành Long - Game Engineer',
    description: 'Game developer specializing in modern web technologies and game development frameworks.',
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
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

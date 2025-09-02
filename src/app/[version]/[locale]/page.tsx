import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MainApp from '@/components/MainApp';

// Define valid versions and locales
const validVersions = ['v1.0', 'v2.0', 'current'];
const validLocales = ['en', 'vi'];

interface PageProps {
  params: {
    version: string;
    locale: string;
  };
}

export function generateStaticParams() {
  return [
    { version: 'v1.0', locale: 'en' },
    { version: 'v1.0', locale: 'vi' },
    { version: 'v2.0', locale: 'en' },
    { version: 'v2.0', locale: 'vi' },
    { version: 'v3.0', locale: 'en' },
    { version: 'v3.0', locale: 'vi' }
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = params;

  const titles = {
    en: 'Long Nguyen - Game Developer Portfolio',
    vi: 'Long Nguyen - Portfolio Nhà Phát Triển Game',
  };

  const descriptions = {
    en: 'Professional game developer portfolio showcasing Unity, Unreal Engine, and web development projects.',
    vi: 'Portfolio chuyên nghiệp của nhà phát triển game, trình bày các dự án Unity, Unreal Engine và phát triển web.',
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
  };
}

export default function VersionedPage({ params }: PageProps) {
  const { version, locale } = params;

  // Validate version and locale
  if (!validVersions.includes(version) || !validLocales.includes(locale)) {
    notFound();
  }

  return <MainApp />;
}

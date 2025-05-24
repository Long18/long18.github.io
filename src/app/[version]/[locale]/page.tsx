import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MainApp from '../../../components/MainApp';

interface Props {
  params: {
    locale: string;
    version: string;
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

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'William - Game Developer & Software Engineer',
    description: 'Passionate Game Developer with solid background of using Unreal Engine and Unity Engine in game development.',
  };
}

export default async function HomePage({ params }: Props) {
  const { locale, version } = params;
  
  // Verify that the incoming `locale` is valid
  if (!['en', 'vi'].includes(locale)) {
    notFound();
  }

  // Verify that the incoming `version` is valid
  if (!['v1.0', 'v2.0', 'v3.0'].includes(version)) {
    notFound();
  }

  return <MainApp locale={locale} />;
}
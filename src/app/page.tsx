import { Metadata } from 'next';
import MainApp from '../components/MainApp';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'William - Game Developer & Software Engineer',
    description: 'Passionate Game Developer with solid background of using Unreal Engine and Unity Engine in game development.',
    metadataBase: new URL('https://long18.github.io'),
  };
}

export default async function HomePage() {
  // Default to English locale
  const locale = 'en';
  
  return <MainApp locale={locale} />;
}

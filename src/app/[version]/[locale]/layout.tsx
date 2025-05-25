import type { Metadata } from 'next';
import I18nProvider from '../../../components/providers/I18nProvider';
import '../../globals.css';

interface Props {
  children: React.ReactNode;
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: {
      default: 'Lê Nguyễn Thành Long - William - Portfolio',
      template: '%s | William'
    },
    description: 'Passionate Game Developer with solid background of using Unreal Engine and Unity Engine in game development. Expertise in creating and customizing game logic, utilizing SOLID principles for scalable codebases.',
    keywords: ['Game Developer', 'Unity Developer', 'Unreal Developer', 'C#', 'C++', 'Game Development', 'Software Engineer'],
    authors: [{ name: 'Lê Nguyễn Thành Long (William)' }],
    creator: 'William',
    openGraph: {
      type: 'website',
      locale: locale,
      url: 'https://long18.github.io',
      title: 'Lê Nguyễn Thành Long - William - Portfolio',
      description: 'Passionate Game Developer with solid background of using Unreal Engine and Unity Engine in game development.',
      siteName: 'William Portfolio',
    },
  };
}

export default function LocaleLayout({ children, params }: Props) {
  const { locale } = params;

  return (
    <I18nProvider locale={locale}>
      {children}
    </I18nProvider>
  );
}
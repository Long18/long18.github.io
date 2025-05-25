import type { Metadata } from 'next';

interface Props {
  children: React.ReactNode;
  params: {
    version: string;
  };
}

export function generateStaticParams() {
  return [
    { version: 'v1.0' },
    { version: 'v2.0' },
    { version: 'v3.0' }
  ];
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      default: 'Lê Nguyễn Thành Long - William - Portfolio',
      template: '%s | William'
    },
    description: 'Passionate Game Developer with solid background of using Unreal Engine and Unity Engine in game development.',
  };
}

export default function VersionLayout({ children }: Props) {
  return children;
}
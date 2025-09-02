import { Metadata } from 'next';
import MainApp from '@/components/MainApp';

export const metadata: Metadata = {
  title: 'Long Nguyen - Game Developer Portfolio',
  description: 'Professional game developer portfolio showcasing Unity, Unreal Engine, and web development projects.',
};

export default function RootPage() {
  return <MainApp />;
}

import { Metadata } from 'next';
import MainApp from '@/components/MainApp';

export const metadata: Metadata = {
  title: 'Long Nguyen - Portfolio Nhà Phát Triển Game',
  description: 'Portfolio chuyên nghiệp của nhà phát triển game, trình bày các dự án Unity, Unreal Engine và phát triển web.',
};

export default async function VietnamesePage() {
  return <MainApp />;
}

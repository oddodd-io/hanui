import type { Metadata } from 'next';
import MobileMenuPage from './content';

export const metadata: Metadata = {
  title: 'MobileMenu 모바일 전체메뉴 (Vue)',
  description:
    'KRDS 기반 MobileMenu 컴포넌트. 왼쪽 1depth 탭과 오른쪽 목록으로 구성된 모바일 전체메뉴. Vue 전용, 접근성 AA 준수.',
  alternates: {
    canonical: '/components/mobile-menu',
  },
};

export default function Page() {
  return <MobileMenuPage />;
}

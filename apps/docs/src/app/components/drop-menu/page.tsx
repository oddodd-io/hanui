import type { Metadata } from 'next';
import DropMenuPage from './content';

export const metadata: Metadata = {
  title: 'DropMenu 드롭다운 메뉴 (Vue)',
  description:
    'KRDS 기반 DropMenu 컴포넌트. 헤더 유틸 메뉴, 나의 GOV, 페이지 타이틀 메뉴에 쓰는 드롭다운. Vue 전용, 접근성 AA 준수.',
  alternates: {
    canonical: '/components/drop-menu',
  },
};

export default function Page() {
  return <DropMenuPage />;
}

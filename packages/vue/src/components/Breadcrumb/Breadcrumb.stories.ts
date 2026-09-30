import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Breadcrumb } from './index';

/**
 * KRDS `nav.krds-breadcrumb-wrap` 래퍼. 모바일(화면 폭 축소)에서는 KRDS CSS가 홈·현재 위치만 보이고 중간은 말줄임으로 바꾼다.
 * 원본에 없는 aria-current="page"를 마지막 항목에 붙인다.
 * 원본 예제: reference/krds-uiux/html/code/breadcrumb.html
 */
const meta = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  argTypes: { home: { control: 'boolean' }, label: { control: 'text' } },
  args: {
    items: [
      { label: '홈', href: '#' },
      { label: '서비스 신청', href: '#' },
      { label: '서비스 신청2', href: '#' },
    ],
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

/** breadcrumb.html */
export const Default: Story = {};

/** A01 공개 홈페이지 — 공지사항 상세 (현재 페이지는 링크 없이 텍스트) */
export const NoticeDetail: Story = {
  args: {
    items: [
      { label: '홈', href: '#' },
      { label: '알림마당', href: '#' },
      { label: '공지사항', href: '#' },
      { label: '2026년 하반기 민원 안내' },
    ],
  },
};

/** KRDS 고대비 모드 */
export const HighContrast: Story = {
  globals: { krdsMode: 'high-contrast' },
};

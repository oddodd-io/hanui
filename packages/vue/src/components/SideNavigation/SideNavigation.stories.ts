import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { SideNavigation } from './index';

/**
 * KRDS `nav.krds-side-navigation` 사이드 메뉴(LNB). 2depth 펼치기 · 3depth 팝업(4depth 목록) · 현재 페이지 강조.
 * 원본의 menubar/menu 역할은 방향키 동작이 없어 쓰지 않고, 목록 + aria-expanded 버튼으로 둔다.
 * 원본 예제: reference/krds-uiux/html/code/side_navigation.html
 */
const meta = {
  title: 'Layout/SideNavigation',
  component: SideNavigation,
  tags: ['autodocs'],
  args: {
    title: '알림마당',
    items: [
      {
        label: '공지사항',
        children: [
          {
            label: '분야별 공지',
            children: [
              { label: '행정', href: '#' },
              { label: '복지', href: '#' },
              { label: '교통', href: '#' },
            ],
          },
          { label: '전체 공지', href: '#', selected: true },
          { label: '긴급 공지', href: '#' },
        ],
      },
      {
        label: '보도자료',
        children: [
          { label: '보도자료 목록', href: '#' },
          { label: '해명자료', href: '#' },
        ],
      },
      { label: '채용공고', href: '#' },
      { label: '자료실', href: '#' },
    ],
  },
  render: (args) => ({
    components: { SideNavigation },
    setup: () => ({ args }),
    template:
      '<div style="max-width:280px"><SideNavigation v-bind="args" /></div>',
  }),
} satisfies Meta<typeof SideNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

/** side_navigation.html — 공지사항 > 전체 공지가 현재 페이지 */
export const Default: Story = {};

/** KRDS 고대비 모드 */
export const HighContrast: Story = { globals: { krdsMode: 'high-contrast' } };

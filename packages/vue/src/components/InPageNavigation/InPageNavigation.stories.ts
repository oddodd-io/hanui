import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { InPageNavigation } from './index';

/**
 * KRDS `.krds-in-page-navigation-area` 본문 내 탐색(이 페이지의 구성). 스크롤 위치에 따라 현재 구역을 강조하고,
 * 항목을 누르면 헤더 높이만큼 띄워 스크롤한 뒤 제목에 초점을 옮긴다.
 * KRDS CSS는 상위 `.krds-in-page-navigation-type`이 있어야 걸리며, 배치(fixed·sticky)는 쓰는 쪽 레이아웃이 정한다.
 * 원본 예제: reference/krds-uiux/html/code/in_page_navigation.html
 */
const meta = {
  title: 'Layout/InPageNavigation',
  component: InPageNavigation,
  tags: ['autodocs'],
  args: {
    title: '장애아동수당',
    items: [
      { label: '서비스 개요', href: '#section_01' },
      { label: '서비스 상세', href: '#section_02' },
      { label: '신청 방법 및 절차', href: '#section_03' },
      { label: '제출 서류', href: '#section_04' },
    ],
  },
  render: (args) => ({
    components: { InPageNavigation },
    setup: () => ({ args }),
    template: `
      <div class="krds-in-page-navigation-type" style="display:grid;grid-template-columns:1fr 16rem;gap:4rem">
        <div>
          <section v-for="(item, i) in args.items" :key="item.href" style="min-height:60vh">
            <h2 :id="item.href.slice(1)">{{ item.label }}</h2>
            <p>구역 {{ i + 1 }} 내용</p>
          </section>
        </div>
        <div><InPageNavigation v-bind="args" style="position:sticky;top:2rem" /></div>
      </div>`,
  }),
} satisfies Meta<typeof InPageNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

/** in_page_navigation.html */
export const Default: Story = {};

/** 신청 버튼 등 action 영역 */
export const WithAction: Story = {
  render: (args) => ({
    components: { InPageNavigation },
    setup: () => ({ args }),
    template: `
      <div class="krds-in-page-navigation-type" style="max-width:16rem">
        <InPageNavigation v-bind="args" style="position:static">
          <template #action>
            <button type="button" class="krds-btn medium">온라인 신청하기</button>
            <p class="quick-info">장애아동수당 외 <strong>1건</strong></p>
          </template>
        </InPageNavigation>
      </div>`,
  }),
};

/** KRDS 고대비 모드 */
export const HighContrast: Story = {
  globals: { krdsMode: 'high-contrast' },
};

import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { DropMenu } from './index';
import type { DropMenuItem } from './index';

/**
 * KRDS `.krds-drop-wrap` 드롭다운. 헤더 유틸 메뉴·나의 GOV 등에 쓴다.
 * 동작: 토글 · 하나만 열림 · Esc/바깥 클릭/초점 이탈 시 닫힘 · 화면 밖으로 넘치면 좌우 정렬.
 * 원본 예제: reference/krds-uiux/html/code/header.html
 */
const meta = {
  title: 'Components/DropMenu',
  component: DropMenu,
  tags: ['autodocs'],
  args: {
    label: '메뉴명',
    items: [
      { label: '메뉴명', href: '#' },
      { label: '메뉴명', href: '#' },
    ],
  },
  render: (args) => ({
    components: { DropMenu },
    setup: () => ({ args }),
    template:
      '<div style="padding:8px 0 200px;display:flex;justify-content:center"><DropMenu v-bind="args" /></div>',
  }),
} satisfies Meta<typeof DropMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** header.html — 유틸 메뉴 드롭다운 */
export const Default: Story = {};

/** 새 창 링크 목록 (.ico-go) */
export const ExternalLinks: Story = {
  args: {
    label: '관련 사이트',
    items: [
      { label: '정부24', href: 'https://www.gov.kr', external: true },
      {
        label: '국민신문고',
        href: 'https://www.epeople.go.kr',
        external: true,
      },
    ],
  },
};

/** 선택형 — 글자 크기 (선택 항목 .active + "선택됨") */
export const Selectable: Story = {
  render: () => ({
    components: { DropMenu },
    setup: () => {
      const sizes = ['sm', 'md', 'lg', 'xlg', 'xxlg'];
      const labels = ['작게', '보통', '크게', '더 크게', '가장 크게'];
      const current = ref('md');
      const items = () =>
        sizes.map<DropMenuItem>((size, i) => ({
          label: labels[i],
          class: size,
          active: size === current.value,
        }));
      const onSelect = (_: DropMenuItem, index: number) =>
        (current.value = sizes[index]);
      return { items, onSelect, current };
    },
    template: `
      <div style="padding:8px 0 320px;display:flex;justify-content:center">
        <DropMenu label="글자 크기" wrap-class="krds-resize" :items="items()" @select="onSelect" />
      </div>
    `,
  }),
};

/** 화면 오른쪽 끝 — 넘치면 .drop-right로 정렬 */
export const EdgeAlign: Story = {
  render: (args) => ({
    components: { DropMenu },
    setup: () => ({ args }),
    template:
      '<div style="padding:8px 0 200px;display:flex;justify-content:space-between"><DropMenu v-bind="args" label="왼쪽 끝" /><DropMenu v-bind="args" label="오른쪽 끝" /></div>',
  }),
};

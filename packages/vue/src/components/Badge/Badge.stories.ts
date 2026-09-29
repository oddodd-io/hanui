import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Badge } from './index';

const colors = [
  'primary',
  'secondary',
  'gray',
  'point',
  'danger',
  'warning',
  'success',
  'information',
  'disabled',
];

/**
 * KRDS `span.krds-badge` 래퍼. 스타일 3종(outline · bg · bg-light) × 색 9종, 숫자형(.number), 점형(.dot).
 * 색·숫자만으로 의미가 전달되지 않을 때는 label(sr-only)로 설명을 붙인다.
 * 원본 예제: reference/krds-uiux/html/code/badge.html, badge_size.html, badge_number.html
 */
const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['outline', 'bg', 'bg-light'] },
    color: { control: 'select', options: colors },
    size: {
      control: 'select',
      options: [undefined, 'small', 'medium', 'large'],
    },
    count: { control: 'number' },
    max: { control: 'number' },
    dot: { control: 'boolean' },
    label: { control: 'text' },
  },
  args: { variant: 'bg', color: 'primary' },
  render: (args) => ({
    components: { Badge },
    setup: () => ({ args }),
    template: '<Badge v-bind="args">Label</Badge>',
  }),
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const grid = (template: string) => ({
  components: { Badge },
  setup: () => ({ colors }),
  template: `<div style="display:flex;flex-direction:column;gap:16px">${template}</div>`,
});

/** badge.html — outline · bg · bg-light × 9색 */
export const Variants: Story = {
  render: () =>
    grid(`
      <div v-for="variant in ['outline', 'bg', 'bg-light']" :key="variant" class="krds-badge-wrap">
        <Badge v-for="color in colors" :key="color" :variant="variant" :color="color">Label</Badge>
      </div>
    `),
};

/** badge_size.html — large · medium · small (KRDS CSS는 large만 크기를 바꾼다) */
export const Sizes: Story = {
  render: () =>
    grid(`
      <div class="krds-badge-wrap" style="align-items:center">
        <Badge size="large" variant="outline">large</Badge>
        <Badge size="medium" variant="outline">medium</Badge>
        <Badge size="small" variant="outline">small</Badge>
        <Badge variant="outline">기본</Badge>
      </div>
    `),
};

/** badge_number.html — 숫자형. max 초과 시 "999+", label로 무엇의 개수인지 알린다 */
export const Number: Story = {
  render: () =>
    grid(`
      <div class="krds-badge-wrap">
        <Badge :count="5" label="읽지 않은 알림" />
        <Badge :count="1200" label="읽지 않은 알림" />
      </div>
      <div class="krds-badge-wrap">
        <Badge color="point" :count="5" label="새 댓글" />
        <Badge color="point" :count="120" :max="99" label="새 댓글" />
      </div>
    `),
};

/** 점형 — 새 글 표시. 내용이 없으므로 label 필수 */
export const Dot: Story = {
  render: () =>
    grid(`
      <p style="display:flex;align-items:center;gap:8px;font-size:16px">
        2026년 하반기 민원 안내 <Badge dot color="point" label="새 글" />
      </p>
    `),
};

/** M03 관리자 공지 목록 — 게시 상태 표시 예 */
export const NoticeStatus: Story = {
  render: () =>
    grid(`
      <div class="krds-badge-wrap">
        <Badge variant="bg-light" color="success">게시 중</Badge>
        <Badge variant="bg-light" color="gray">초안</Badge>
        <Badge variant="bg-light" color="information">예약</Badge>
        <Badge variant="bg-light" color="danger">게시 중단</Badge>
      </div>
    `),
};

/** KRDS 고대비 모드 */
export const HighContrast: Story = {
  globals: { krdsMode: 'high-contrast' },
  render: Variants.render,
};

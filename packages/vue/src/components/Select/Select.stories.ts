import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { Select } from './index';
import { FormField } from '../FormField';

const statusOptions = [
  { value: 'all', label: '전체' },
  { value: 'published', label: '게시 중' },
  { value: 'draft', label: '초안' },
  { value: 'unpublished', label: '게시 중단' },
];

/**
 * KRDS 네이티브 `select.krds-form-select` 래퍼. 키보드·스크린리더 동작은 브라우저가 담당한다.
 * 원본 예제: reference/krds-uiux/html/code/select*.html
 */
const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'sort'] },
    size: {
      control: 'select',
      options: [undefined, 'small', 'medium', 'large'],
    },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  args: { options: statusOptions, placeholder: '선택', variant: 'default' },
  render: (args) => ({
    components: { Select, FormField },
    setup: () => ({ args, value: ref('') }),
    template: `
      <div style="max-width:320px">
        <FormField label="게시 상태" hint="도움말">
          <Select v-bind="args" v-model="value" />
        </FormField>
      </div>
    `,
  }),
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

/** select.html — 기본 (large) */
export const Default: Story = {};

const column = (template: string, setup?: () => Record<string, unknown>) => ({
  components: { Select, FormField },
  setup: setup ?? (() => ({ options: statusOptions })),
  template: `<div class="fieldset" style="display:flex;flex-direction:column;gap:24px;max-width:320px">${template}</div>`,
});

/** select.html — 기본 · 선택완료(.completed) · 에러 · disabled */
export const States: Story = {
  render: () =>
    column(`
      <FormField label="기본" hint="도움말"><Select :options="options" placeholder="선택" /></FormField>
      <FormField label="선택완료" hint="값이 있으면 .completed"><Select :options="options" model-value="published" /></FormField>
      <FormField label="에러" status="error" message="상태를 선택하세요"><Select :options="options" placeholder="선택" /></FormField>
      <FormField label="비활성" hint="도움말" disabled><Select :options="options" model-value="draft" /></FormField>
    `),
};

/** select_size.html */
export const Sizes: Story = {
  render: () =>
    column(`
      <FormField label="large (기본)"><Select :options="options" model-value="all" /></FormField>
      <FormField label="medium"><Select :options="options" model-value="all" size="medium" /></FormField>
      <FormField label="small"><Select :options="options" model-value="all" size="small" /></FormField>
    `),
};

/** select_sorting.html — 목록 정렬용. 테두리 없음, 기본 medium. FormField 없이 title/aria-label로 이름을 준다 */
export const Sort: Story = {
  render: () => ({
    components: { Select },
    setup: () => ({
      sortOptions: [
        { value: 'latest', label: '최신순' },
        { value: 'title', label: '제목순' },
        { value: 'views', label: '조회순' },
      ],
      value: ref('latest'),
    }),
    template: `
      <div style="display:flex;gap:16px;align-items:center">
        <Select v-model="value" variant="sort" :options="sortOptions" aria-label="정렬" size="large" />
        <Select v-model="value" variant="sort" :options="sortOptions" aria-label="정렬" />
        <Select v-model="value" variant="sort" :options="sortOptions" aria-label="정렬" size="small" />
      </div>
    `,
  }),
};

/** M03 관리자 공지 목록 — 게시 상태 필터 (전체가 실제 값이므로 placeholder 없음) */
export const NoticeStatusFilter: Story = {
  render: () =>
    column(
      `<FormField label="게시 상태"><Select v-model="status" :options="options" /></FormField>
       <p style="font-size:14px;color:#555">선택: {{ status }}</p>`,
      () => ({ options: statusOptions, status: ref('all') })
    ),
};

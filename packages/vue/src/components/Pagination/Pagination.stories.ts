import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { Pagination } from './index';

/**
 * KRDS `.krds-pagination` 래퍼. `getHref`를 주면 `<a href>` 링크, 없으면 `<button>` + v-model.
 * 비활성 이전·다음은 KRDS 원본대로 `<span class="disabled">`이며, 현재 페이지는 sr-only "현재페이지 "로 알린다.
 * 원본 예제: reference/krds-uiux/html/code/pagination.html
 */
const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  argTypes: {
    totalPages: { control: { type: 'number', min: 0 } },
    siblingCount: { control: { type: 'number', min: 0 } },
  },
  args: { totalPages: 99, modelValue: 4, siblingCount: 2 },
  render: (args) => ({
    components: { Pagination },
    setup: () => ({ args, page: ref(args.modelValue ?? 1) }),
    template: `
      <div>
        <Pagination v-bind="args" v-model="page" />
        <p style="margin-top:16px;font-size:14px;color:#555">현재 페이지: {{ page }}</p>
      </div>
    `,
  }),
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

/** pagination.html — 99페이지 중 4페이지 (버튼 모드) */
export const Default: Story = {};

/** 첫 페이지 — 이전이 비활성 span */
export const FirstPage: Story = { args: { modelValue: 1 } };

/** 중간 페이지 — 양쪽 생략 기호 */
export const MiddlePage: Story = { args: { modelValue: 50 } };

/** 마지막 페이지 — 다음이 비활성 span */
export const LastPage: Story = { args: { modelValue: 99 } };

/** 적은 페이지 — 생략 없이 전부 */
export const FewPages: Story = { args: { totalPages: 5, modelValue: 2 } };

/** 링크 모드 — 공개 사이트 목록처럼 `?page=N` 링크 (서버 라우팅·검색엔진 수집) */
export const AsLinks: Story = {
  args: { modelValue: 4, getHref: (page: number) => `?page=${page}` },
};

/** KRDS 고대비 모드 */
export const HighContrast: Story = {
  globals: { krdsMode: 'high-contrast' },
};

import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { Textarea } from './index';
import { FormField } from '../FormField';

/**
 * KRDS `textarea.krds-input` 래퍼. 글자수 카운트(`.textarea-count`)는 maxlength가 있을 때 표시된다.
 * 원본 예제: reference/krds-uiux/html/code/textarea.html
 */
const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    maxlength: { control: 'number' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  args: { placeholder: '플레이스홀더', maxlength: 100 },
  render: (args) => ({
    components: { Textarea, FormField },
    setup: () => ({ args, value: ref('') }),
    template: `
      <div style="max-width:480px">
        <FormField label="레이블">
          <Textarea v-bind="args" v-model="value" />
        </FormField>
      </div>
    `,
  }),
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

/** textarea.html — 글자수 카운트 포함 */
export const Default: Story = {};

/** maxlength 없음 → 카운트 없음 */
export const WithoutCount: Story = {
  args: { maxlength: undefined },
};

const column = (template: string, setup?: () => Record<string, unknown>) => ({
  components: { Textarea, FormField },
  setup: setup ?? (() => ({})),
  template: `<div class="fieldset" style="display:flex;flex-direction:column;gap:24px;max-width:480px">${template}</div>`,
});

/** readonly · disabled */
export const States: Story = {
  render: () =>
    column(`
      <FormField label="읽기 전용"><Textarea model-value="수정할 수 없는 내용" readonly :maxlength="100" /></FormField>
      <FormField label="비활성" disabled><Textarea model-value="비활성 내용" :maxlength="100" /></FormField>
    `),
};

/** FormField status=error → 테두리·카운트 숫자가 빨강 */
export const Error: Story = {
  render: () =>
    column(`
      <FormField label="본문" required status="error" message="본문을 입력하세요">
        <Textarea model-value="" :maxlength="2000" />
      </FormField>
    `),
};

/** M04 공지 작성 — 본문 (에디터 도입 전 임시) */
export const NoticeBody: Story = {
  render: () =>
    column(
      `<FormField label="본문" required hint="제목·문단·목록·링크·이미지·단순 표를 넣을 수 있습니다">
        <Textarea v-model="body" :maxlength="5000" placeholder="공지 내용을 입력하세요" />
      </FormField>`,
      () => ({
        body: ref('2026년 사업 안내\n\n1. 신청 기간: 9월 22일 ~ 10월 15일'),
      })
    ),
};

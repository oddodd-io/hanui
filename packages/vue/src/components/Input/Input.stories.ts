import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { Input } from './index';
import { FormField } from '../FormField';

/**
 * KRDS `input.krds-input` 래퍼. 레이블·상태·메시지는 FormField가 담당한다.
 * 원본 예제: reference/krds-uiux/html/code/text_input*.html
 */
const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large', 'xlarge'],
    },
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'tel', 'url', 'search', 'number'],
    },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    required: { control: 'boolean' },
    clearable: { control: 'boolean' },
    passwordToggle: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
  args: { size: 'large', type: 'text', placeholder: '플레이스홀더' },
  render: (args) => ({
    components: { Input, FormField },
    setup: () => {
      const value = ref('');
      return { args, value };
    },
    template: `
      <FormField label="레이블" hint="도움말">
        <Input v-bind="args" v-model="value" />
      </FormField>
    `,
  }),
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본: large. FormField 안에서 label·hint가 자동 연결된다 */
export const Default: Story = {};

const fieldset = (template: string, setup?: () => Record<string, unknown>) => ({
  components: { Input, FormField },
  setup: setup ?? (() => ({})),
  template: `<div class="fieldset" style="display:flex;flex-direction:column;gap:24px;max-width:480px">${template}</div>`,
});

/** text_input.html — 기본·readonly·disabled */
export const States: Story = {
  render: () =>
    fieldset(`
      <FormField label="레이블" hint="도움말"><Input placeholder="플레이스홀더" /></FormField>
      <FormField label="레이블" hint="도움말"><Input model-value="readonly" readonly /></FormField>
      <FormField label="레이블" hint="도움말" disabled><Input model-value="disabled" /></FormField>
    `),
};

/** text_input_size.html */
export const Sizes: Story = {
  render: () =>
    fieldset(`
      <FormField label="small"><Input size="small" placeholder="플레이스홀더" /></FormField>
      <FormField label="medium"><Input size="medium" placeholder="플레이스홀더" /></FormField>
      <FormField label="large"><Input size="large" placeholder="플레이스홀더" /></FormField>
      <FormField label="xlarge"><Input size="xlarge" placeholder="플레이스홀더" /></FormField>
    `),
};

/** text_input_state.html — FormField status에 따라 .is-* 와 메시지가 붙는다 */
export const Validation: Story = {
  render: () =>
    fieldset(`
      <FormField label="레이블" status="error" message="에러 메시지"><Input model-value="에러" /></FormField>
      <FormField label="레이블" status="success" message="성공 메시지"><Input model-value="성공" /></FormField>
      <FormField label="레이블" status="information" message="정보 메시지"><Input model-value="정보" /></FormField>
    `),
};

/** text_input_icon.html — 비밀번호 보기 · 내용 삭제 · 둘 다 */
export const WithIconButtons: Story = {
  render: () =>
    fieldset(
      `
      <FormField label="비밀번호"><Input v-model="pw" type="password" password-toggle placeholder="8-12자의 영문자, 숫자, 특수문자 조합" /></FormField>
      <FormField label="검색어"><Input v-model="keyword" clearable placeholder="내용을 입력하세요" /></FormField>
      <FormField label="비밀번호 (삭제 + 보기)"><Input v-model="pw2" type="password" clearable password-toggle /></FormField>
    `,
      () => ({
        pw: ref('1234567890'),
        keyword: ref('검색어'),
        pw2: ref('1234567890'),
      })
    ),
};

/** 필수 항목: FormField required → input required + aria-required */
export const Required: Story = {
  render: () =>
    fieldset(`
      <FormField label="제목" required hint="필수, 최대 200자"><Input maxlength="200" /></FormField>
    `),
};

/** FormField 없이 단독 사용 — aria-label로 이름을 준다 (검색창 등) */
export const Standalone: Story = {
  render: () => ({
    components: { Input },
    template: `<div style="max-width:320px"><Input aria-label="검색어" placeholder="검색어를 입력하세요" /></div>`,
  }),
};

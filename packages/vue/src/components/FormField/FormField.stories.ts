import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { FormField } from './index';
import { Input } from '../Input';

/**
 * KRDS `.form-group` 래퍼. label · 도움말 · 상태 메시지를 담당하고,
 * 안쪽 컨트롤(Input, Textarea, Select…)에 id · aria-describedby · required · disabled를 자동으로 잇는다.
 * 원본 예제: reference/krds-uiux/html/code/text_input*.html, resources/scss/component/_form_layout.scss
 */
const meta = {
  title: 'Components/FormField',
  component: FormField,
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: [undefined, 'error', 'success', 'information'],
    },
    label: { control: 'text' },
    hint: { control: 'text' },
    message: { control: 'text' },
    id: { control: 'text' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    label: '레이블',
    hint: '도움말',
    message: '상태 메시지',
    required: false,
    disabled: false,
  },
  render: (args) => ({
    components: { FormField, Input },
    setup: () => ({ args, value: ref('') }),
    template: `
      <div style="max-width:480px">
        <FormField v-bind="args">
          <Input v-model="value" placeholder="플레이스홀더" />
        </FormField>
      </div>
    `,
  }),
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본: label + hint. 컨트롤에 id·aria-describedby가 자동으로 붙는다 */
export const Default: Story = {};

const column = (template: string) => ({
  components: { FormField, Input },
  setup: () => ({ value: ref('') }),
  template: `<div class="fieldset" style="display:flex;flex-direction:column;gap:24px;max-width:480px">${template}</div>`,
});

/** hint 없이 label만 */
export const LabelOnly: Story = {
  render: () =>
    column(
      `<FormField label="레이블"><Input placeholder="플레이스홀더" /></FormField>`
    ),
};

/** text_input_state.html — status에 따라 .form-conts.is-* 와 .form-hint-* 메시지가 붙는다 */
export const Statuses: Story = {
  render: () =>
    column(`
      <FormField label="에러" status="error" message="에러 메시지"><Input model-value="에러" /></FormField>
      <FormField label="성공" status="success" message="성공 메시지"><Input model-value="성공" /></FormField>
      <FormField label="정보" status="information" message="정보 메시지"><Input model-value="정보" /></FormField>
    `),
};

/** hint와 상태 메시지가 함께 있으면 둘 다 aria-describedby로 연결된다 */
export const HintAndMessage: Story = {
  args: {
    status: 'error',
    message: '제목은 공백만 입력할 수 없습니다',
    hint: '필수, 최대 200자',
  },
};

/** required → 컨트롤에 required + aria-required */
export const Required: Story = {
  args: { required: true, hint: '필수 항목입니다' },
};

/** disabled → 컨트롤 disabled */
export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => ({
    components: { FormField, Input },
    setup: () => ({ args }),
    template: `<div style="max-width:480px"><FormField v-bind="args"><Input model-value="disabled" /></FormField></div>`,
  }),
};

/** id를 직접 지정 — 서버 렌더·외부 스크립트에서 고정 id가 필요할 때 */
export const CustomId: Story = {
  args: { id: 'consult_name', hint: 'label[for]와 input[id]가 consult_name' },
};

/** 여러 FormField를 .fieldset으로 묶은 폼 예시 (M04 공지 작성 화면 일부) */
export const InForm: Story = {
  render: () => ({
    components: { FormField, Input },
    setup: () => ({ title: ref(''), pw: ref('') }),
    template: `
      <form class="fieldset" style="display:flex;flex-direction:column;gap:24px;max-width:480px" @submit.prevent>
        <FormField label="제목" required hint="필수, 최대 200자">
          <Input v-model="title" maxlength="200" />
        </FormField>
        <FormField label="비밀번호" required status="error" message="8-12자의 영문자, 숫자, 특수문자 조합이어야 합니다">
          <Input v-model="pw" type="password" password-toggle clearable />
        </FormField>
      </form>
    `,
  }),
};

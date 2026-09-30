import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { Spinner } from './index';
import { FormField } from '../FormField';
import { Input } from '../Input';

/**
 * KRDS `.krds-spinner[role="status"]` 로딩 표시. 화면 문구가 있으면 sr-only 문구를 생략한다(원본은 두 번 읽힘).
 * 원본 예제: reference/krds-uiux/html/code/spinner.html
 */
const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  args: { label: '로딩 중' },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 스크린리더 문구만 (화면에는 회전 원만) */
export const Default: Story = {};

/** spinner.html — 화면 문구와 함께 */
export const WithText: Story = {
  render: () => ({
    components: { Spinner },
    template: '<Spinner>데이터를 불러오는 중입니다</Spinner>',
  }),
};

/** spinner.html — 입력창 안 스피너 (.form-spinner로 Input과 조합) */
export const InInput: Story = {
  render: () => ({
    components: { Spinner, FormField, Input },
    setup: () => ({ value: ref('서울') }),
    template: `
      <div style="max-width:360px">
        <FormField label="기관명 검색">
          <div class="form-spinner">
            <Input v-model="value" />
            <Spinner label="검색 중" />
          </div>
        </FormField>
      </div>
    `,
  }),
};

/** KRDS 고대비 모드 */
export const HighContrast: Story = {
  globals: { krdsMode: 'high-contrast' },
  render: WithText.render,
};

import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Identifier } from './index';

/**
 * KRDS `.krds-identifier` 운영기관 식별자. 보통 Footer 하단에 들어간다.
 * 원본 예제: reference/krds-uiux/html/code/identifier.html
 */
const meta = {
  title: 'Layout/Identifier',
  component: Identifier,
  tags: ['autodocs'],
  args: { text: '이 누리집은 보건복지부 누리집입니다.' },
} satisfies Meta<typeof Identifier>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const HighContrast: Story = { globals: { krdsMode: 'high-contrast' } };

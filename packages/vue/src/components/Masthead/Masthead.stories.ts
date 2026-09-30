import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Masthead } from './index';

/**
 * KRDS `#krds-masthead` 공식 전자정부 누리집 표시. 레이아웃 최상단(SkipLink 다음, Header 앞)에 하나만 둔다.
 * 원본 예제: reference/krds-uiux/html/code/masthead.html
 */
const meta = {
  title: 'Layout/Masthead',
  component: Masthead,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Masthead>;

export default meta;
type Story = StoryObj<typeof meta>;

/** masthead.html */
export const Default: Story = {};

/** KRDS 고대비 모드 */
export const HighContrast: Story = {
  globals: { krdsMode: 'high-contrast' },
};

import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Button } from './index';

/**
 * KRDS `.krds-btn` 래퍼.
 * 스타일은 vendor/krds-uiux 원본 그대로이며, 이 컴포넌트는 클래스 조립·동작·접근성만 담당한다.
 * 원본 예제: reference/krds-uiux/html/code/button*.html
 */
const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'text', 'link'],
    },
    size: {
      control: 'select',
      options: ['xsmall', 'small', 'medium', 'large', 'xlarge'],
    },
    type: { control: 'select', options: ['button', 'submit', 'reset'] },
    icon: { control: 'boolean' },
    border: { control: 'boolean' },
    pure: { control: 'boolean' },
    basic: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    href: { control: 'text' },
    onClick: { action: 'click' },
  },
  args: {
    variant: 'primary',
    size: 'large',
    disabled: false,
  },
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: `<Button v-bind="args">버튼</Button>`,
  }),
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본값: primary · large (KRDS 기본) */
export const Default: Story = {};

const row = (template: string) => ({
  components: { Button },
  template: `<div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">${template}</div>`,
});

/** button_hierarchy.html · button_text.html · link.html */
export const Hierarchy: Story = {
  render: () =>
    row(`
      <Button variant="primary">primary</Button>
      <Button variant="secondary">secondary</Button>
      <Button variant="tertiary">tertiary</Button>
      <Button variant="text">text <i class="svg-icon ico-more" /></Button>
      <Button variant="link" href="#">link <i class="svg-icon ico-go" /></Button>
    `),
};

/** button_size.html */
export const Sizes: Story = {
  render: () =>
    row(`
      <Button size="xsmall">xsmall</Button>
      <Button size="small">small</Button>
      <Button size="medium">medium</Button>
      <Button size="large">large</Button>
      <Button size="xlarge">xlarge</Button>
    `),
};

/** button_with_icon.html — 아이콘은 default 슬롯 안에 KRDS `.svg-icon.ico-*`로 넣는다 */
export const WithIcon: Story = {
  render: () =>
    row(`
      <Button size="small">검색 <i class="svg-icon ico-sch" /></Button>
      <Button size="large">파일다운로드 <i class="svg-icon ico-down" /></Button>
      <Button size="xlarge"><i class="svg-icon ico-sch" /> x-large</Button>
      <Button variant="secondary" size="large">공유 <i class="svg-icon ico-share" /></Button>
    `),
};

/** button_icon.html — `icon` + `label`(sr-only 이름) 필수. `border`는 테두리형 */
export const IconOnly: Story = {
  render: () =>
    row(`
      <Button icon size="large" label="검색"><i class="svg-icon ico-sch" /></Button>
      <Button icon size="medium" label="도움말"><i class="svg-icon ico-help" /></Button>
      <Button icon border size="large" label="새로고침"><i class="svg-icon ico-refresh" /></Button>
      <Button icon border size="large" label="열기" disabled><i class="svg-icon ico-angle down" /></Button>
    `),
};

/** disabled: button은 native disabled, 링크는 href 제거 + aria-disabled */
export const Disabled: Story = {
  render: () =>
    row(`
      <Button disabled>primary</Button>
      <Button variant="secondary" disabled>secondary</Button>
      <Button variant="tertiary" disabled>tertiary</Button>
      <Button variant="text" disabled>text</Button>
      <Button href="/notice" disabled>disabled 링크</Button>
    `),
};

/** href가 있으면 `<a>`로 렌더. target=_blank면 rel 자동 보강 */
export const AsLink: Story = {
  render: () =>
    row(`
      <Button href="/notice">내부 링크</Button>
      <Button variant="secondary" href="https://www.krds.go.kr" target="_blank">새 창 <i class="svg-icon ico-go" /></Button>
      <Button variant="link" href="#" pure>pure 링크</Button>
      <Button variant="link" href="#" basic>basic 링크</Button>
    `),
};

/** 툴바의 "모드"에서 High Contrast로 바꿔 확인한다 */
export const HighContrast: Story = {
  globals: { krdsMode: 'high-contrast' },
  render: () =>
    row(`
      <Button variant="primary">primary</Button>
      <Button variant="secondary">secondary</Button>
      <Button variant="tertiary">tertiary</Button>
      <Button variant="text">text</Button>
      <Button disabled>disabled</Button>
    `),
};

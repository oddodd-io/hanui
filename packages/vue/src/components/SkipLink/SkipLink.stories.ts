import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { SkipLink } from './index';

/**
 * KRDS `#krds-skip-link` 건너뛰기 링크. 평소에는 숨겨져 있고 Tab으로 초점이 가면 화면 상단에 나타난다.
 * 누르면 대상 요소로 초점을 옮긴다 (해시 라우터에서도 라우트가 바뀌지 않음).
 * KRDS CSS가 id 선택자이므로 레이아웃에 하나만 둔다.
 * 원본 예제: reference/krds-uiux/html/code/skip_link.html
 */
const meta = {
  title: 'Components/SkipLink',
  component: SkipLink,
  tags: ['autodocs'],
  render: (args) => ({
    components: { SkipLink },
    setup: () => ({ args }),
    template: `
      <div>
        <SkipLink v-bind="args" />
        <p style="margin-bottom:16px">미리보기를 클릭한 뒤 Tab을 누르면 상단에 건너뛰기 링크가 나타납니다.</p>
        <nav id="gnb" aria-label="주메뉴" style="display:flex;gap:16px;margin-bottom:24px">
          <a href="#">기관소개</a><a href="#">알림마당</a><a href="#">민원안내</a>
        </nav>
        <main id="main-content">
          <h1 style="font-size:24px;font-weight:700">공지사항</h1>
          <p>건너뛰기 링크를 누르면 이 영역으로 초점이 옮겨집니다.</p>
        </main>
      </div>
    `,
  }),
} satisfies Meta<typeof SkipLink>;

export default meta;
type Story = StoryObj<typeof meta>;

/** skip_link.html — 본문 바로가기 */
export const Default: Story = {};

/** 본문 + 주메뉴 바로가기 */
export const MultipleLinks: Story = {
  args: {
    links: [
      { target: 'main-content', label: '본문 바로가기' },
      { target: 'gnb', label: '주메뉴 바로가기' },
    ],
  },
};

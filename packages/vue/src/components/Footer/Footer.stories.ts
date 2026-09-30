import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Footer } from './index';

/**
 * KRDS `footer#krds-footer`. 주소·연락처·바로가기·SNS·정책 링크·저작권·운영기관 식별자를 props로 받는다.
 * 관련 사이트 영역(.foot-quick)은 quick 슬롯. KRDS CSS가 id 선택자이므로 레이아웃에 하나만 둔다.
 * 원본 예제: reference/krds-uiux/html/code/footer.html
 */
const meta = {
  title: 'Layout/Footer',
  component: Footer,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    address: '(26464) 강원특별자치도 원주시 건강로 32(반곡동) 국민건강보험공단',
    contacts: [
      { title: '대표전화 1577-1000', note: '(유료, 평일 09시~18시)' },
      { title: '해외이용 82-33-811-2001', note: '(유료, 평일 09시~18시)' },
    ],
    links: [
      { label: '찾아오시는 길', href: '#' },
      { label: '이용안내', href: '#' },
      { label: '직원검색', href: '#' },
    ],
    sns: [
      { label: '인스타그램', href: '#', icon: 'instagram' },
      { label: '유튜브', href: '#', icon: 'youtube' },
      { label: 'X', href: '#', icon: 'sns-x' },
      { label: '페이스북', href: '#', icon: 'facebook' },
      { label: '블로그', href: '#', icon: 'blog' },
    ],
    policies: [
      { label: '개인정보처리방침', href: '#', point: true },
      { label: '저작권 정책', href: '#' },
      { label: '웹 접근성 품질인증 마크 획득', href: '#' },
    ],
    copyright:
      '© 2023 National Health Insurance Service. All rights reserved.',
    identifier: '이 누리집은 보건복지부 누리집입니다.',
  },
  render: (args) => ({
    components: { Footer },
    setup: () => ({ args }),
    template: `
      <Footer v-bind="args">
        <template #quick>
          <button v-for="n in 4" :key="n" type="button" class="link" title="관련 사이트 레이어">관련 사이트</button>
        </template>
      </Footer>
    `,
  }),
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** footer.html */
export const Default: Story = {};

/** KRDS 고대비 모드 */
export const HighContrast: Story = { globals: { krdsMode: 'high-contrast' } };

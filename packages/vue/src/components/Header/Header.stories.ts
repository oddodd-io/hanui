import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Header } from './index';
import { Masthead } from '../Masthead';
import { SkipLink } from '../SkipLink';
import { DropMenu } from '../DropMenu';

/**
 * KRDS `header#krds-header` 뼈대. 유틸 메뉴·로고·버튼 영역을 슬롯으로 받는다.
 * KRDS 페이지 구조(#wrap > … #container) 안에서 스크롤을 내리면 헤더가 숨고, 올리면 나타난다.
 * 주메뉴(PC)·모바일 전체메뉴는 다음 단계에서 menu / mobile 슬롯에 넣는다.
 * 원본 예제: reference/krds-uiux/html/code/header.html
 */
const meta = {
  title: 'Layout/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: { logoHref: '#', logoText: 'KRDS - Korea Design System' },
  render: (args) => ({
    components: { Header, Masthead, SkipLink, DropMenu },
    setup: () => ({
      args,
      paragraphs: Array.from({ length: 30 }, (_, i) => i + 1),
    }),
    template: `
      <div id="wrap">
        <SkipLink />
        <Masthead />
        <Header v-bind="args">
          <template #utility>
            <li><a href="#" class="krds-btn small text" target="_blank" title="새 창 열기">메뉴명 <i class="svg-icon ico-go" aria-hidden="true"></i></a></li>
            <li><DropMenu label="메뉴명" :items="[{ label: '메뉴명', href: '#' }, { label: '메뉴명', href: '#' }]" /></li>
            <li><DropMenu label="관련 사이트" :items="[{ label: '정부24', href: '#', external: true }, { label: '국민신문고', href: '#', external: true }]" /></li>
          </template>
          <template #actions>
            <button type="button" class="btn-navi sch" title="통합검색 레이어">통합검색</button>
            <a href="#" class="btn-navi login">로그인</a>
            <button type="button" class="btn-navi join">회원가입</button>
            <DropMenu label="나의 GOV" button-class="btn-navi my" :toggle-icon="false" wrap-class="my-drop"
              :items="[{ label: '나의 GOV 홈', href: '#' }, { label: '나의 신청내역', href: '#' }]">
              <template #top><p class="my-name">홍길동님</p></template>
              <template #bottom><button type="button" class="krds-btn medium text"><i class="svg-icon ico-logout" aria-hidden="true"></i> 로그아웃</button></template>
            </DropMenu>
            <button type="button" class="btn-navi all">전체메뉴</button>
          </template>
        </Header>
        <div id="container" class="inner" style="padding-top:40px">
          <main id="main-content">
            <h1 style="font-size:28px;font-weight:700;margin-bottom:16px">본문</h1>
            <p v-for="n in paragraphs" :key="n" style="margin-bottom:16px">
              스크롤을 내리면 헤더가 숨고, 올리면 다시 나타납니다. ({{ n }})
            </p>
          </main>
        </div>
      </div>
    `,
  }),
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

/** header.html — 유틸 메뉴 · 로고 · 버튼 영역 + 스크롤 동작 */
export const Default: Story = {};

/** KRDS 고대비 모드 (고대비 로고로 바뀜) */
export const HighContrast: Story = {
  globals: { krdsMode: 'high-contrast' },
};

import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { MobileMenu } from './index';
import type { MobileMenuNode } from './index';
import { Header } from '../Header';
import { Masthead } from '../Masthead';

const agencyMenu: MobileMenuNode[] = [
  {
    label: '기관소개',
    children: [
      { label: '인사말', href: '#' },
      { label: '비전 및 목표', href: '#' },
      {
        label: '조직 및 업무',
        children: [
          { label: '조직도', href: '#' },
          {
            label: '부서별 업무',
            children: [
              { label: '기획예산과', href: '#' },
              { label: '민원봉사과', href: '#' },
              { label: '정보통신과', href: '#' },
            ],
          },
        ],
      },
      { label: '찾아오시는 길', href: '#' },
    ],
  },
  {
    label: '정보공개',
    children: [
      { label: '사전정보공표', href: '#' },
      { label: '정보공개 청구', href: '#', external: true },
      { label: '공공데이터', href: '#' },
    ],
  },
  {
    label: '알림마당',
    children: [
      { label: '공지사항', href: '#', selected: true },
      { label: '보도자료', href: '#' },
      { label: '채용공고', href: '#' },
      { label: '입찰공고', href: '#' },
    ],
  },
  {
    label: '민원안내',
    children: [
      { label: '민원 신청', href: '#' },
      { label: '민원 서식', href: '#' },
      { label: '자주 묻는 질문', href: '#' },
    ],
  },
  {
    label: '참여마당',
    children: [
      { label: '자유게시판', href: '#' },
      { label: '설문조사', href: '#' },
    ],
  },
];

/**
 * KRDS `.krds-main-menu-mobile` 모바일 전체메뉴(기본형: 왼쪽 탭). Header의 mobile 슬롯에 넣고,
 * 헤더의 전체메뉴 버튼(`.btn-navi.all`, aria-controls="mobile-nav")으로 연다. PC 폭(1024px~)에서는 KRDS CSS가 숨긴다.
 * 미리보기 창을 1023px 이하로 줄여서 확인한다.
 * 원본 예제: reference/krds-uiux/html/code/main_menu_mobile.html
 */
const meta = {
  title: 'Layout/MobileMenu',
  component: MobileMenu,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: { items: agencyMenu },
  render: (args) => ({
    components: { MobileMenu, Header, Masthead },
    setup: () => ({ args, open: ref(false) }),
    template: `
      <div id="wrap">
        <Masthead />
        <Header logo-href="#" :scroll-behavior="false">
          <template #actions>
            <button type="button" class="btn-navi sch" title="통합검색 레이어">통합검색</button>
            <a href="#" class="btn-navi login">로그인</a>
            <button type="button" class="btn-navi all" aria-controls="mobile-nav" :aria-expanded="open ? 'true' : 'false'" @click="open = true">전체메뉴</button>
          </template>
          <template #mobile>
            <MobileMenu v-bind="args" v-model:open="open">
              <template #utils>
                <li><a href="#" class="krds-btn xsmall text">누리집 안내</a></li>
                <li><a href="#" class="krds-btn xsmall text">English</a></li>
              </template>
              <template #login>
                <button type="button" class="krds-btn large text"><i class="svg-icon ico-log" aria-hidden="true"></i> 로그인을 해주세요</button>
              </template>
              <template #search>
                <input type="text" class="krds-input" placeholder="찾고자 하는 메뉴명을 입력해 주세요" aria-label="찾고자 하는 메뉴명 입력" />
                <button type="button" class="krds-btn medium icon ico-search"><span class="sr-only">검색</span><i class="svg-icon ico-sch" aria-hidden="true"></i></button>
              </template>
              <template #bottom>
                <a href="#" class="krds-btn medium text">사이트맵 <i class="svg-icon ico-angle right" aria-hidden="true"></i></a>
                <a href="#" class="krds-btn medium text" target="_blank" title="새 창 열기">관련 사이트 <i class="svg-icon ico-go" aria-hidden="true"></i></a>
              </template>
            </MobileMenu>
          </template>
        </Header>
        <div id="container" class="inner" style="padding-top:24px">
          <p>미리보기 폭을 1023px 이하로 줄이면 전체메뉴 버튼이 나타납니다.</p>
        </div>
      </div>
    `,
  }),
} satisfies Meta<typeof MobileMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** main_menu_mobile.html — 공공기관 메뉴 예 (알림마당 > 공지사항이 현재 위치) */
export const Default: Story = {};

/** KRDS 고대비 모드 */
export const HighContrast: Story = {
  globals: { krdsMode: 'high-contrast' },
};

import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { MainMenu } from './index';
import type { MainMenuItem } from './index';
import { Header } from '../Header';

const agencyMenu: MainMenuItem[] = [
  {
    label: '기관소개',
    children: [
      {
        label: '인사말',
        href: '#',
        items: [
          { label: '기관장 인사말', href: '#' },
          { label: '비전 및 목표', href: '#' },
          { label: '연혁', href: '#' },
          { label: '상징', href: '#' },
        ],
      },
      {
        label: '조직 및 업무',
        href: '#',
        layout: 'between',
        items: [
          { label: '조직도', href: '#' },
          { label: '부서별 업무', href: '#' },
          { label: '직원 찾기', href: '#' },
        ],
      },
      { label: '찾아오시는 길', href: '#' },
      { label: '관련 기관', href: '#', external: true },
    ],
  },
  {
    label: '정보공개',
    children: [
      {
        label: '사전정보공표',
        descriptions: [
          {
            title: '사전정보공표 목록',
            href: '#',
            text: '정보공개법에 따라 미리 공개하는 정보 목록입니다.',
          },
          {
            title: '정보공개 청구',
            href: '#',
            text: '정보공개포털에서 공개를 청구할 수 있습니다.',
            external: true,
          },
        ],
      },
      {
        label: '공공데이터',
        layout: 'between',
        descriptions: [
          {
            title: '공공데이터 개방',
            href: '#',
            text: '기관이 보유한 데이터를 내려받을 수 있습니다.',
          },
        ],
      },
    ],
  },
  {
    label: '알림마당',
    selected: true,
    list: {
      label: '알림마당',
      layout: 'between',
      items: [
        { label: '공지사항', href: '#', active: true },
        { label: '보도자료', href: '#' },
        { label: '채용공고', href: '#' },
        { label: '입찰공고', href: '#' },
        { label: '행사안내', href: '#' },
        { label: '자료실', href: '#' },
      ],
    },
  },
  { label: '민원안내', href: '#' },
];

/**
 * KRDS `nav.krds-main-menu` PC 주메뉴(메가메뉴). Header의 menu 슬롯에 넣는다. 태블릿·모바일 폭에서는 KRDS CSS가 숨긴다.
 * 1depth 클릭으로 열고, 바깥 클릭·Esc·Tab 이탈로 닫는다. 방향키·Home·End로 같은 단계 메뉴 사이를 이동한다.
 * 원본 예제: reference/krds-uiux/html/code/main_menu_pc.html
 */
const meta = {
  title: 'Layout/MainMenu',
  component: MainMenu,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: { items: agencyMenu },
  render: (args) => ({
    components: { MainMenu, Header },
    setup: () => ({ args }),
    template: `
      <div id="wrap" style="min-height:720px">
        <Header logo-href="#" :scroll-behavior="false">
          <template #actions>
            <button type="button" class="btn-navi sch" title="통합검색 레이어">통합검색</button>
            <a href="#" class="btn-navi login">로그인</a>
          </template>
          <template #menu>
            <MainMenu v-bind="args">
              <template #banner="{ sub }">
                <span class="krds-badge bg-secondary">신규 서비스</span>
                <a href="#" class="krds-btn medium text">{{ sub.label }} 안내 <i class="svg-icon ico-angle right" aria-hidden="true"></i></a>
              </template>
            </MainMenu>
          </template>
        </Header>
        <div id="container" class="inner" style="padding-top:40px"><p>본문</p></div>
      </div>
    `,
  }),
} satisfies Meta<typeof MainMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 공공기관 대표 홈페이지 예 — 목록형 · 설명형 · 단일 목록 · 바로가기 */
export const Default: Story = {};

/** KRDS 고대비 모드 */
export const HighContrast: Story = {
  globals: { krdsMode: 'high-contrast' },
};

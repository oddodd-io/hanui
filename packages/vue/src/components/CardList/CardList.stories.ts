import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { CardList, type CardListItem } from './index';

// 썸네일 — 외부 요청 없이 보이도록 인라인 SVG data URI를 쓴다
const thumb = (label: string, bg: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360"><rect width="480" height="360" fill="${bg}"/><text x="240" y="195" font-family="sans-serif" font-size="40" fill="#ffffff" text-anchor="middle">${label}</text></svg>`
  )}`;

const galleryItems: CardListItem[] = [
  {
    title: '2026 가을 문화한마당',
    href: '#',
    thumbSrc: thumb('행사', '#256ef4'),
    text: '주민 누구나 참여할 수 있는 가을 문화행사입니다. 체험 부스와 공연이 함께 열립니다.',
    meta: [{ key: '행사 기간', value: '2026.10.01-2026.10.03' }],
    badge: '행사',
    tags: ['문화', '가족'],
  },
  {
    title: '어린이 도서관 개관식',
    href: '#',
    thumbSrc: thumb('개관', '#008a61'),
    text: '어린이 전용 열람실과 이야기방을 갖춘 도서관이 문을 열었습니다.',
    meta: [{ key: '촬영일', value: '2026.09.18' }],
    badge: '소식',
    badgeColor: 'success',
  },
  {
    title: '겨울철 제설 대비 훈련',
    href: '#',
    text: '썸네일이 없는 글은 같은 비율의 빈 자리를 둬서 카드 높이를 맞춥니다.',
    meta: [{ key: '촬영일', value: '2026.09.05' }],
  },
];

const meta: Meta<typeof CardList> = {
  title: 'Components/CardList',
  component: CardList,
  parameters: {
    docs: {
      description: {
        component: [
          'KRDS 구조화 목록(`ul.krds-structured-list`)을 쓰는 카드 목록이다. 갤러리형 게시판 목록에 쓴다.',
          '',
          '썸네일은 KRDS에 없는 영역이라 `hanui-card-thumb`으로 더했다(`styles/_hanui-additions.scss`).',
          '카드 하나에 링크 하나만 두고 그 링크의 이름은 제목이므로, 썸네일은 장식(`alt=""`)이다.',
          '썸네일에 설명을 넣으면 스크린리더가 제목과 같은 내용을 두 번 읽는다.',
        ].join('\n'),
      },
    },
  },
  args: {
    items: galleryItems,
    label: '갤러리 목록',
  },
};

export default meta;
type Story = StoryObj<typeof CardList>;

/** KRDS 기본 — 1280px 이상 3열, 좁아지면 2열 → 1열 */
export const Default: Story = {};

/** 썸네일 비율을 16:9로 */
export const WideThumb: Story = {
  args: { thumbRatio: '16 / 9' },
};

/** KRDS `.type-full` — 한 줄 전체 너비 */
export const FullWidth: Story = {
  args: { variant: 'full' },
};

/** 썸네일이 하나도 없는 목록 (일반 게시판을 카드로 보일 때) */
export const WithoutThumbnails: Story = {
  args: {
    items: galleryItems.map(({ thumbSrc: _thumbSrc, ...rest }) => rest),
  },
};

/** 글이 없을 때 */
export const Empty: Story = {
  args: { items: [], emptyText: '등록된 글이 없습니다.' },
};

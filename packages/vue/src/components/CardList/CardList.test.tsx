import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { axe } from '../../test/setup';
import CardList, { type CardListItem } from './CardList.vue';

const items: CardListItem[] = [
  {
    title: '2026 가을 문화한마당',
    href: '/boards/gallery/12',
    thumbSrc: '/files/up-1',
    text: '주민 누구나 참여할 수 있는 가을 문화행사입니다.',
    meta: [{ key: '행사 기간', value: '2026.10.01-2026.10.03' }],
    badge: '행사',
    tags: ['문화', '가족'],
  },
  {
    title: '어린이 도서관 개관',
    href: '/boards/gallery/11',
  },
];

describe('CardList 구조 (KRDS structured_list.html 기준)', () => {
  it('ul.krds-structured-list > li.structured-item > .in 구조로 렌더한다', () => {
    const wrapper = mount(CardList, { props: { items } });
    expect(wrapper.element.tagName).toBe('UL');
    expect(wrapper.classes()).toContain('krds-structured-list');
    const lis = wrapper.findAll('li');
    expect(lis).toHaveLength(2);
    expect(lis[0].classes()).toEqual(['structured-item']);
    expect(lis[0].find(':scope > .in').exists()).toBe(true);
  });

  it('제목·설명·부가정보를 KRDS 클래스에 넣는다', () => {
    const wrapper = mount(CardList, { props: { items } });
    const card = wrapper.findAll('li')[0];
    expect(card.find('.c-tit .span').text()).toBe('2026 가을 문화한마당');
    expect(card.find('.c-txt').text()).toBe(
      '주민 누구나 참여할 수 있는 가을 문화행사입니다.'
    );
    expect(card.find('.c-date .key').text()).toBe('행사 기간');
    expect(card.find('.c-date .value').text()).toBe('2026.10.01-2026.10.03');
  });

  it('뱃지·태그는 있을 때만 렌더한다', () => {
    const wrapper = mount(CardList, { props: { items } });
    const [withExtras, bare] = wrapper.findAll('li');
    expect(withExtras.find('.card-top .krds-badge').text()).toContain('행사');
    expect(withExtras.findAll('.card-btm .tag').map((t) => t.text())).toEqual([
      '문화',
      '가족',
    ]);
    expect(bare.find('.card-top').exists()).toBe(false);
    expect(bare.find('.card-btm').exists()).toBe(false);
  });

  it('variant=full이면 KRDS .type-full을 붙인다', () => {
    expect(mount(CardList, { props: { items } }).classes()).not.toContain(
      'type-full'
    );
    expect(
      mount(CardList, { props: { items, variant: 'full' } }).classes()
    ).toContain('type-full');
  });

  it('thumbRatio를 CSS 변수로 넘긴다', () => {
    const wrapper = mount(CardList, {
      props: { items, thumbRatio: '16 / 9' },
    });
    expect(wrapper.attributes('style')).toContain(
      '--hanui-card-thumb-ratio: 16 / 9'
    );
  });

  it('항목이 없으면 emptyText를, 그마저 없으면 아무것도 렌더하지 않는다', () => {
    const empty = mount(CardList, {
      props: { items: [], emptyText: '등록된 글이 없습니다.' },
    });
    expect(empty.find('ul').exists()).toBe(false);
    expect(empty.text()).toBe('등록된 글이 없습니다.');
    // emptyText가 없으면 보이는 내용이 없다 (Vue가 v-if 자리에 남기는 주석만)
    const silent = mount(CardList, { props: { items: [] } });
    expect(silent.text()).toBe('');
    expect(silent.find('ul').exists()).toBe(false);
    expect(silent.find('p').exists()).toBe(false);
  });
});

describe('CardList 접근성', () => {
  it('카드 하나에 링크 하나만 두고, 그 링크의 이름은 제목이다', () => {
    const wrapper = mount(CardList, { props: { items } });
    const card = wrapper.findAll('li')[0];
    const links = card.findAll('a');
    expect(links).toHaveLength(1);
    expect(links[0].classes()).toContain('c-text');
    // 썸네일이 링크 안에 있어 같이 눌린다
    expect(links[0].find('.hanui-card-thumb img').exists()).toBe(true);
    // 링크 이름에 제목이 들어간다
    expect(links[0].text()).toContain('2026 가을 문화한마당');
  });

  it('썸네일은 장식이므로 alt를 빈 값으로 둔다 (제목과 중복 낭독 방지)', () => {
    const wrapper = mount(CardList, { props: { items } });
    const img = wrapper.find('.hanui-card-thumb img');
    expect(img.attributes('alt')).toBe('');
  });

  it('썸네일이 없어도 같은 비율의 빈 자리를 둔다', () => {
    const wrapper = mount(CardList, { props: { items } });
    const bare = wrapper.findAll('li')[1];
    expect(bare.find('.hanui-card-thumb').exists()).toBe(true);
    expect(bare.find('.hanui-card-thumb img').exists()).toBe(false);
  });

  it('external이면 새 창임을 알리고 rel을 붙인다', () => {
    const wrapper = mount(CardList, {
      props: {
        items: [
          { title: '외부 안내', href: 'https://example.go.kr', external: true },
        ],
      },
    });
    const link = wrapper.find('a');
    expect(link.attributes('target')).toBe('_blank');
    expect(link.attributes('title')).toBe('새 창 열기');
    expect(link.attributes('rel')).toBe('noopener noreferrer');
  });

  it('label을 목록 이름으로 넣는다', () => {
    const wrapper = mount(CardList, {
      props: { items, label: '갤러리 목록' },
    });
    expect(wrapper.attributes('aria-label')).toBe('갤러리 목록');
  });

  it('axe 위반이 없다', async () => {
    const wrapper = mount(CardList, {
      props: { items, label: '갤러리 목록' },
      attachTo: document.body,
    });
    expect(await axe(wrapper.element)).toHaveNoViolations();
    wrapper.unmount();
  });
});

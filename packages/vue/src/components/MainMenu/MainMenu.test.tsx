import { describe, it, expect, afterEach } from 'vitest';
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils';
import { axe } from '../../test/setup';
import MainMenu, { type MainMenuItem } from './MainMenu.vue';

const items: MainMenuItem[] = [
  {
    label: '기관소개',
    children: [
      {
        label: '인사말',
        href: '/about',
        items: [
          { label: '기관장 인사말', href: '/about/greeting' },
          { label: '연혁', href: '/about/history', active: true },
        ],
      },
      {
        label: '조직',
        layout: 'between',
        descriptions: [
          {
            title: '조직도',
            href: '/org',
            text: '부서별 업무를 안내합니다.',
            external: true,
          },
        ],
      },
      { label: '찾아오시는 길', href: '/map' },
      { label: '관련 기관', href: 'https://www.gov.kr', external: true },
    ],
  },
  {
    label: '알림마당',
    selected: true,
    list: {
      label: '알림마당',
      layout: 'between',
      items: [
        { label: '공지사항', href: '/notice' },
        { label: '보도자료', href: '/press' },
      ],
    },
  },
  { label: '민원안내', href: '/civil' },
];

const mounted: VueWrapper[] = [];
afterEach(() => {
  mounted.splice(0).forEach((w) => w.unmount());
  document.body.innerHTML = '';
  document.body.className = '';
});

const mountMenu = (slots: Record<string, string> = {}) => {
  const wrapper = mount(MainMenu, {
    props: { items },
    slots,
    attachTo: document.body,
  });
  mounted.push(wrapper);
  return wrapper;
};

const mainTriggers = (w: VueWrapper) =>
  w.findAll('.gnb-menu > li > .gnb-main-trigger');
const backdrop = () => document.querySelector('.gnb-backdrop')!;

describe('MainMenu 구조 (KRDS main_menu_pc.html 기준)', () => {
  it('nav.krds-main-menu[aria-label="메인 메뉴"] > .inner > ul.gnb-menu > li > .gnb-main-trigger[data-trigger]', () => {
    const wrapper = mountMenu();
    expect(wrapper.element.tagName).toBe('NAV');
    expect(wrapper.classes()).toEqual(['krds-main-menu']);
    expect(wrapper.attributes('aria-label')).toBe('메인 메뉴');
    const triggers = mainTriggers(wrapper);
    expect(triggers.map((t) => t.text())).toEqual([
      '기관소개',
      '알림마당',
      '민원안내',
    ]);
    expect(triggers.every((t) => t.attributes('data-trigger') === 'gnb')).toBe(
      true
    );
  });

  it('하위 메뉴가 있는 1depth는 button(aria-controls·expanded·haspopup), 없으면 a.is-link', () => {
    const wrapper = mountMenu();
    const [about, , civil] = mainTriggers(wrapper);
    expect(about.element.tagName).toBe('BUTTON');
    expect(about.attributes('aria-expanded')).toBe('false');
    expect(about.attributes('aria-haspopup')).toBe('true');
    const wrap = wrapper.find(`#${about.attributes('aria-controls')}`);
    expect(wrap.classes()).toContain('gnb-toggle-wrap');
    expect(civil.element.tagName).toBe('A');
    expect(civil.classes()).toContain('is-link');
    expect(civil.attributes('href')).toBe('/civil');
  });

  it('selected 1depth는 .selected + aria-current', () => {
    const wrapper = mountMenu();
    expect(mainTriggers(wrapper)[1].classes()).toContain('selected');
  });

  it('children은 .gnb-main-list[data-has-submenu] > ul > li > .gnb-sub-trigger로 렌더한다', () => {
    const wrapper = mountMenu();
    const subs = wrapper.findAll(
      '.gnb-main-list[data-has-submenu="true"] > ul > li > .gnb-sub-trigger'
    );
    expect(subs.map((s) => s.text())).toEqual([
      '인사말',
      '조직',
      '찾아오시는 길',
      '관련 기관',
    ]);
    expect(subs[0].element.tagName).toBe('BUTTON');
    expect(subs[2].classes()).toEqual(['gnb-sub-trigger', 'is-link']);
    expect(subs[3].classes()).toContain('external-link');
    expect(subs[3].attributes('target')).toBe('_blank');
    expect(subs[3].attributes('title')).toBe('새 창 열림');
  });

  it('첫 2depth 목록이 기본 선택되고(.active, aria-expanded) 나머지는 닫혀 있다', () => {
    const wrapper = mountMenu();
    const [greet, org] = wrapper.findAll('button.gnb-sub-trigger');
    expect(greet.classes()).toContain('active');
    expect(greet.attributes('aria-expanded')).toBe('true');
    expect(
      wrapper.find(`#${greet.attributes('aria-controls')}`).classes()
    ).toContain('active');
    expect(org.attributes('aria-expanded')).toBe('false');
  });

  it('3depth 목록: 제목 + 바로가기(sr-only 대상 포함) + 링크, 현재 페이지는 .active + aria-current', () => {
    const wrapper = mountMenu();
    const list = wrapper.findAll('.gnb-sub-list')[0];
    const title = list.find('.gnb-sub-content > h2.sub-title');
    expect(title.text()).toContain('인사말');
    const more = title.find('a.krds-btn.link.basic.small');
    expect(more.attributes('href')).toBe('/about');
    expect(more.find('.underline').text()).toBe('바로가기');
    const links = list.findAll('.gnb-sub-content > ul > li > a');
    expect(links.map((a) => a.text())).toEqual(['기관장 인사말', '연혁']);
    expect(links[1].classes()).toContain('active');
    expect(links[1].attributes('aria-current')).toBe('page');
  });

  it('설명형은 ul.type-description > li > h3.tit > a + p.txt, between 레이아웃', () => {
    const wrapper = mountMenu();
    const list = wrapper.findAll('.gnb-sub-list')[1];
    expect(list.classes()).toContain('between');
    const li = list.find('ul.type-description > li');
    expect(li.find('h3.tit > a').attributes('href')).toBe('/org');
    expect(li.find('h3.tit i.ico-go').exists()).toBe(true);
    expect(li.find('p.txt').text()).toBe('부서별 업무를 안내합니다.');
  });

  it('list는 .gnb-sub-list.single-list로 렌더한다 (왼쪽 목록 없음)', () => {
    const wrapper = mountMenu();
    const single = wrapper.find('.gnb-sub-list.single-list');
    expect(single.classes()).toContain('between');
    expect(single.find('.sub-title span').text()).toBe('알림마당');
    expect(single.findAll('ul > li > a').map((a) => a.text())).toEqual([
      '공지사항',
      '보도자료',
    ]);
  });

  it('banner 슬롯은 .gnb-sub-banner에 렌더한다', () => {
    const wrapper = mountMenu({
      banner: '<span class="krds-badge bg-secondary">신규 서비스</span>',
    });
    expect(wrapper.findAll('.gnb-sub-banner .krds-badge').length).toBe(3);
  });

  it('.gnb-backdrop을 body에 둔다', () => {
    mountMenu();
    expect(backdrop().parentElement).toBe(document.body);
    expect(backdrop().classList.contains('active')).toBe(false);
  });
});

describe('MainMenu 열기·닫기 (KRDS krds_mainMenuPC)', () => {
  it('1depth를 누르면 .active · aria-expanded · .is-open · 배경 · body.is-gnb-web', async () => {
    const wrapper = mountMenu();
    const about = mainTriggers(wrapper)[0];
    await about.trigger('click');
    await flushPromises();
    expect(about.classes()).toContain('active');
    expect(about.attributes('aria-expanded')).toBe('true');
    expect(wrapper.find('.gnb-toggle-wrap').classes()).toContain('is-open');
    expect(backdrop().classList.contains('active')).toBe(true);
    expect(document.body.classList.contains('is-gnb-web')).toBe(true);
  });

  it('다시 누르면 닫고, 다른 1depth를 누르면 그것만 열린다', async () => {
    const wrapper = mountMenu();
    const [about, news] = mainTriggers(wrapper);
    await about.trigger('click');
    await news.trigger('click');
    expect(about.attributes('aria-expanded')).toBe('false');
    expect(news.attributes('aria-expanded')).toBe('true');
    await news.trigger('click');
    expect(news.attributes('aria-expanded')).toBe('false');
    expect(backdrop().classList.contains('active')).toBe(false);
    expect(document.body.classList.contains('is-gnb-web')).toBe(false);
  });

  it('2depth를 누르면 그 목록만 .active', async () => {
    const wrapper = mountMenu();
    await mainTriggers(wrapper)[0].trigger('click');
    const [greet, org] = wrapper.findAll('button.gnb-sub-trigger');
    await org.trigger('click');
    expect(org.classes()).toContain('active');
    expect(org.attributes('aria-expanded')).toBe('true');
    expect(greet.classes()).not.toContain('active');
    const lists = wrapper.findAll('[data-has-submenu] .gnb-sub-list');
    expect(lists.map((l) => l.classes().includes('active'))).toEqual([
      false,
      true,
    ]);
  });

  it('바깥을 클릭하면 닫힌다', async () => {
    const wrapper = mountMenu();
    await mainTriggers(wrapper)[0].trigger('click');
    document.body.click();
    await flushPromises();
    expect(mainTriggers(wrapper)[0].attributes('aria-expanded')).toBe('false');
  });

  it('Esc로 닫고 1depth 버튼에 초점을 돌려준다', async () => {
    const wrapper = mountMenu();
    const about = mainTriggers(wrapper)[0];
    await about.trigger('click');
    const link = wrapper.find('.gnb-sub-list a').element as HTMLElement;
    link.focus();
    link.dispatchEvent(
      new KeyboardEvent('keyup', { key: 'Escape', bubbles: true })
    );
    await flushPromises();
    expect(about.attributes('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(about.element);
  });

  it('초점이 메뉴 밖으로 나간 뒤 키를 떼면 닫힌다 (Tab 이탈)', async () => {
    const outside = document.createElement('button');
    document.body.appendChild(outside);
    const wrapper = mountMenu();
    await mainTriggers(wrapper)[0].trigger('click');
    outside.focus();
    outside.dispatchEvent(
      new KeyboardEvent('keyup', { key: 'Tab', bubbles: true })
    );
    await flushPromises();
    expect(mainTriggers(wrapper)[0].attributes('aria-expanded')).toBe('false');
  });

  it('열린 채 언마운트되면 body 상태를 되돌린다', async () => {
    const wrapper = mountMenu();
    await mainTriggers(wrapper)[0].trigger('click');
    mounted.splice(mounted.indexOf(wrapper), 1);
    wrapper.unmount();
    expect(document.body.classList.contains('is-gnb-web')).toBe(false);
  });
});

describe('MainMenu 키보드 이동', () => {
  const press = (el: Element, key: string) =>
    el.dispatchEvent(
      new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
    );

  it('1depth에서 방향키로 이전·다음, Home·End로 처음·끝', () => {
    const wrapper = mountMenu();
    const [about, news, civil] = mainTriggers(wrapper).map(
      (t) => t.element as HTMLElement
    );
    about.focus();
    press(about, 'ArrowRight');
    expect(document.activeElement).toBe(news);
    press(news, 'ArrowDown');
    expect(document.activeElement).toBe(civil);
    press(civil, 'ArrowLeft');
    expect(document.activeElement).toBe(news);
    press(news, 'End');
    expect(document.activeElement).toBe(civil);
    press(civil, 'Home');
    expect(document.activeElement).toBe(about);
  });

  it('2depth에서는 같은 단계 안에서만 이동한다 (Home/End 포함)', async () => {
    const wrapper = mountMenu();
    await mainTriggers(wrapper)[0].trigger('click');
    const subs = wrapper
      .findAll('.gnb-main-list > ul > li > .gnb-sub-trigger')
      .map((s) => s.element as HTMLElement);
    subs[0].focus();
    press(subs[0], 'ArrowDown');
    expect(document.activeElement).toBe(subs[1]);
    press(subs[1], 'End');
    expect(document.activeElement).toBe(subs[3]);
    press(subs[3], 'Home');
    expect(document.activeElement).toBe(subs[0]);
  });

  it('처음·끝에서 더 가면 그대로 둔다', () => {
    const wrapper = mountMenu();
    const about = mainTriggers(wrapper)[0].element as HTMLElement;
    about.focus();
    press(about, 'ArrowLeft');
    expect(document.activeElement).toBe(about);
  });
});

describe('MainMenu 접근성', () => {
  it('열린 상태 axe 위반이 없다', async () => {
    const wrapper = mountMenu();
    await mainTriggers(wrapper)[0].trigger('click');
    await flushPromises();
    expect(await axe(wrapper.element)).toHaveNoViolations();
  });
});

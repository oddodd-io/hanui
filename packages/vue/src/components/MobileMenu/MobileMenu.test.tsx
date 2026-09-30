import { describe, it, expect, afterEach, vi } from 'vitest';
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils';
import { defineComponent, ref } from 'vue';
import { axe } from '../../test/setup';
import MobileMenu, { type MobileMenuNode } from './MobileMenu.vue';
import { resetModalStack } from '../Modal/modal-stack';

const items: MobileMenuNode[] = [
  {
    label: '기관소개',
    children: [
      { label: '인사말', href: '/greeting' },
      {
        label: '조직',
        children: [
          { label: '조직도', href: '/org' },
          {
            label: '부서 안내',
            children: [
              { label: '기획팀', href: '/dept/plan' },
              { label: '민원팀', href: '/dept/civil' },
            ],
          },
        ],
      },
    ],
  },
  {
    label: '알림마당',
    children: [
      { label: '공지사항', href: '/notice', selected: true },
      { label: '보도자료', href: '/press' },
    ],
  },
  { label: '민원안내', children: [{ label: '민원 신청', href: '/civil' }] },
];

const mounted: VueWrapper[] = [];
afterEach(() => {
  mounted.splice(0).forEach((w) => w.unmount());
  resetModalStack();
  document.body.innerHTML = '';
  document.body.className = '';
  document.body.removeAttribute('style');
  vi.useRealTimers();
});

/** 여는 버튼 + 모바일 메뉴 + 본문을 가진 페이지 */
const mountPage = (props: Record<string, unknown> = {}) => {
  const page = document.createElement('div');
  document.body.appendChild(page);
  const wrapper = mount(
    defineComponent({
      components: { MobileMenu },
      setup: () => ({ open: ref(false), items, props }),
      template: `
        <header id="krds-header">
          <div class="header-in">
            <button id="open-menu" type="button" class="btn-navi all" aria-controls="mobile-nav" @click="open = true">전체메뉴</button>
          </div>
          <MobileMenu v-model:open="open" :items="items" v-bind="props">
            <template #login><button type="button" class="krds-btn large text">로그인을 해주세요</button></template>
            <template #bottom><a href="/sitemap" class="krds-btn medium text">사이트맵</a></template>
          </MobileMenu>
        </header>
        <div id="container"><a href="#">본문 링크</a></div>
      `,
    }),
    { attachTo: page }
  );
  mounted.push(wrapper);
  return wrapper;
};

const root = () =>
  document.querySelector<HTMLElement>('.krds-main-menu-mobile')!;
const $ = <T extends HTMLElement = HTMLElement>(sel: string) =>
  document.querySelector<T>(sel)!;
const $$ = (sel: string) =>
  Array.from(document.querySelectorAll<HTMLElement>(sel));

const openMenu = async (wrapper: VueWrapper) => {
  $('#open-menu').focus();
  await wrapper.find('#open-menu').trigger('click');
  await flushPromises();
};

const press = async (key: string, opts: KeyboardEventInit = {}) => {
  (document.activeElement ?? document.body).dispatchEvent(
    new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      cancelable: true,
      ...opts,
    })
  );
  await flushPromises();
};

describe('MobileMenu 구조 (KRDS main_menu_mobile.html 기준)', () => {
  it('#mobile-nav.krds-main-menu-mobile > .gnb-wrap > .gnb-header · .gnb-body · #close-nav', () => {
    mountPage();
    const el = root();
    expect(el.id).toBe('mobile-nav');
    expect(el.style.display).toBe('none');
    expect(
      el.querySelector(':scope > .gnb-wrap > .gnb-header > .gnb-login')
    ).not.toBeNull();
    expect(
      el.querySelector('.gnb-body > .gnb-menu > .menu-wrap')
    ).not.toBeNull();
    expect(el.querySelector('.gnb-body > .gnb-bottom a')?.textContent).toBe(
      '사이트맵'
    );
    const close = el.querySelector('.gnb-wrap > button#close-nav')!;
    expect(close.querySelector('.sr-only')?.textContent).toBe('전체메뉴 닫기');
  });

  it('메뉴 영역은 role="dialog" aria-modal="true" aria-label="전체메뉴" (KRDS 원본 보완)', () => {
    mountPage();
    const wrap = $('.gnb-wrap');
    expect(wrap.getAttribute('role')).toBe('dialog');
    expect(wrap.getAttribute('aria-modal')).toBe('true');
    expect(wrap.getAttribute('aria-label')).toBe('전체메뉴');
  });

  it('1depth는 tablist > li[role=none] > a.gnb-main-trigger[role=tab], 목록은 tabpanel로 연결된다', () => {
    mountPage();
    const tabs = $$('.menu-wrap a.gnb-main-trigger');
    expect(tabs.map((t) => t.textContent?.trim())).toEqual([
      '기관소개',
      '알림마당',
      '민원안내',
    ]);
    expect($('.menu-wrap ul').getAttribute('role')).toBe('tablist');
    tabs.forEach((tab) => {
      expect(tab.getAttribute('role')).toBe('tab');
      const panel = document.getElementById(
        tab.getAttribute('aria-controls')!
      )!;
      expect(panel.classList.contains('gnb-sub-list')).toBe(true);
      expect(panel.getAttribute('role')).toBe('tabpanel');
      expect(panel.getAttribute('aria-labelledby')).toBe(tab.id);
      expect(tab.getAttribute('href')).toBe(`#${panel.id}`);
    });
  });

  it('selected가 들어 있는 1depth 탭이 처음 활성이고, 선택 탭만 Tab 순서에 들어간다', () => {
    mountPage();
    const tabs = $$('.menu-wrap a.gnb-main-trigger');
    expect(tabs.map((t) => t.getAttribute('aria-selected'))).toEqual([
      'false',
      'true',
      'false',
    ]);
    expect(tabs[1].classList.contains('active')).toBe(true);
    expect(tabs.map((t) => t.getAttribute('tabindex'))).toEqual([
      '-1',
      '0',
      '-1',
    ]);
  });

  it('2depth 링크는 a.gnb-sub-trigger, 현재 위치는 .selected + aria-current', () => {
    mountPage();
    const notice = $$('.gnb-sub-trigger').find(
      (a) => a.textContent?.trim() === '공지사항'
    )!;
    expect(notice.tagName).toBe('A');
    expect(notice.classList.contains('selected')).toBe(true);
    expect(notice.getAttribute('aria-current')).toBe('page');
  });

  it('하위가 있는 2depth는 button.gnb-sub-trigger.has-depth3 + .depth3-wrap (a[href="#"] 대신 button)', () => {
    mountPage();
    const btn = $('button.has-depth3');
    expect(btn.textContent?.trim()).toBe('조직');
    expect(btn.getAttribute('aria-expanded')).toBe('false');
    expect(btn.nextElementSibling?.classList.contains('depth3-wrap')).toBe(
      true
    );
    expect($('button.depth3-trigger.has-depth4').textContent?.trim()).toBe(
      '부서 안내'
    );
    expect($$('a.depth3-trigger').map((a) => a.textContent?.trim())).toEqual([
      '조직도',
    ]);
  });
});

describe('MobileMenu 열기·닫기', () => {
  it('열면 display·is-open·is-backdrop, body.is-gnb-mobile, 메뉴 영역에 초점', async () => {
    const wrapper = mountPage();
    await openMenu(wrapper);
    const el = root();
    expect(el.style.display).toBe('block');
    expect(el.classList.contains('is-open')).toBe(true);
    expect(el.classList.contains('is-backdrop')).toBe(true);
    expect(document.body.classList.contains('is-gnb-mobile')).toBe(true);
    expect(document.activeElement).toBe($('.gnb-wrap'));
  });

  it('열린 동안 메뉴 바깥(.header-in · #container)을 inert로 막는다 (원본의 고정 id 의존 보완)', async () => {
    const wrapper = mountPage();
    await openMenu(wrapper);
    expect($('.header-in').hasAttribute('inert')).toBe(true);
    expect($('#container').hasAttribute('inert')).toBe(true);
    expect(root().hasAttribute('inert')).toBe(false);
  });

  it('닫기 버튼으로 닫고 여는 버튼에 초점을 돌려주며 400ms 뒤 숨긴다', async () => {
    const wrapper = mountPage();
    await openMenu(wrapper);
    vi.useFakeTimers();
    $('#close-nav').click();
    await flushPromises();
    expect(root().classList.contains('is-open')).toBe(false);
    expect(document.activeElement?.id).toBe('open-menu');
    expect($('#container').hasAttribute('inert')).toBe(false);
    vi.advanceTimersByTime(400);
    await flushPromises();
    expect(root().style.display).toBe('none');
    expect(document.body.classList.contains('is-gnb-mobile')).toBe(false);
  });

  it('Esc로 닫는다 (원본 없음)', async () => {
    const wrapper = mountPage();
    await openMenu(wrapper);
    await press('Escape');
    expect(root().classList.contains('is-open')).toBe(false);
    expect(document.activeElement?.id).toBe('open-menu');
  });

  it('배경을 클릭하면 닫지 않고 메뉴 영역으로 초점을 옮긴다 (KRDS)', async () => {
    const wrapper = mountPage();
    await openMenu(wrapper);
    $('#close-nav').focus();
    root().click();
    await flushPromises();
    expect(root().classList.contains('is-open')).toBe(true);
    expect(document.activeElement).toBe($('.gnb-wrap'));
  });

  it('PC 폭(1024px 이상)이 되면 닫는다', async () => {
    const wrapper = mountPage();
    await openMenu(wrapper);
    const original = window.innerWidth;
    Object.defineProperty(window, 'innerWidth', {
      value: 1280,
      configurable: true,
    });
    window.dispatchEvent(new Event('resize'));
    await flushPromises();
    expect(root().classList.contains('is-open')).toBe(false);
    Object.defineProperty(window, 'innerWidth', {
      value: original,
      configurable: true,
    });
  });
});

describe('MobileMenu 초점 가두기', () => {
  it('마지막(닫기)에서 Tab이면 처음으로, 처음에서 Shift+Tab이면 마지막으로', async () => {
    const wrapper = mountPage();
    await openMenu(wrapper);
    $('#close-nav').focus();
    await press('Tab');
    expect(document.activeElement?.textContent?.trim()).toBe(
      '로그인을 해주세요'
    );
    await press('Tab', { shiftKey: true });
    expect(document.activeElement).toBe($('#close-nav'));
  });

  it('메뉴 영역 자체에서 Shift+Tab이면 마지막으로 간다', async () => {
    const wrapper = mountPage();
    await openMenu(wrapper);
    await press('Tab', { shiftKey: true });
    expect(document.activeElement).toBe($('#close-nav'));
  });
});

describe('MobileMenu 1depth 탭', () => {
  it('탭을 누르면 활성으로 바꾸고 해당 목록으로 스크롤한다', async () => {
    const wrapper = mountPage();
    await openMenu(wrapper);
    const body = $('.gnb-body');
    const scrollTo = vi.fn();
    body.scrollTo = scrollTo as unknown as typeof body.scrollTo;
    const tabs = $$('.menu-wrap a.gnb-main-trigger');
    tabs[2].click();
    await flushPromises();
    expect(tabs[2].getAttribute('aria-selected')).toBe('true');
    expect(scrollTo).toHaveBeenCalledWith(
      expect.objectContaining({ behavior: 'smooth' })
    );
  });

  it('↓ ↑ Home End로 탭을 옮기고 활성으로 바꾼다', async () => {
    const wrapper = mountPage();
    await openMenu(wrapper);
    const tabs = $$('.menu-wrap a.gnb-main-trigger');
    tabs[1].focus();
    await press('ArrowDown');
    expect(document.activeElement).toBe(tabs[2]);
    expect(tabs[2].getAttribute('aria-selected')).toBe('true');
    await press('ArrowUp');
    expect(document.activeElement).toBe(tabs[1]);
    await press('Home');
    expect(document.activeElement).toBe(tabs[0]);
    await press('End');
    expect(document.activeElement).toBe(tabs[2]);
    expect(tabs.map((t) => t.getAttribute('tabindex'))).toEqual([
      '-1',
      '-1',
      '0',
    ]);
  });
});

describe('MobileMenu 3depth · 4depth', () => {
  it('has-depth3 버튼으로 3depth를 펼치고 접는다', async () => {
    const wrapper = mountPage();
    await openMenu(wrapper);
    const btn = $('button.has-depth3');
    btn.click();
    await flushPromises();
    expect(btn.getAttribute('aria-expanded')).toBe('true');
    expect(btn.classList.contains('active')).toBe(true);
    expect(btn.nextElementSibling?.classList.contains('is-open')).toBe(true);
    btn.click();
    await flushPromises();
    expect(btn.getAttribute('aria-expanded')).toBe('false');
  });

  it('has-depth4 버튼으로 4depth 패널을 열고 이전화면 버튼에 초점을 준다', async () => {
    const wrapper = mountPage();
    await openMenu(wrapper);
    $('button.has-depth3').click();
    await flushPromises();
    $('button.has-depth4').click();
    await flushPromises();
    const panel = $('.depth4-wrap');
    expect(panel.classList.contains('is-open')).toBe(true);
    expect(panel.getAttribute('role')).toBe('dialog');
    expect(
      panel.querySelector('.depth4-body > h4.sub-title')?.textContent
    ).toBe('부서 안내');
    expect($$('.depth4-ul a').map((a) => a.textContent?.trim())).toEqual([
      '기획팀',
      '민원팀',
    ]);
    expect(document.activeElement).toBe(panel.querySelector('.trigger-prev'));
  });

  it('4depth 본문은 ul 안 h4(HTML 위반) 대신 div.depth4-body', async () => {
    const wrapper = mountPage();
    await openMenu(wrapper);
    $('button.has-depth3').click();
    await flushPromises();
    $('button.has-depth4').click();
    await flushPromises();
    expect($('.depth4-body').tagName).toBe('DIV');
  });

  it('이전화면·Esc는 4depth만 닫고 여는 버튼에 초점, 전체메뉴 닫기는 메뉴 전체를 닫는다', async () => {
    const wrapper = mountPage();
    await openMenu(wrapper);
    $('button.has-depth3').click();
    await flushPromises();
    const trigger = $('button.has-depth4');
    trigger.click();
    await flushPromises();
    $('.trigger-prev').click();
    await flushPromises();
    expect(document.querySelector('.depth4-wrap.is-open')).toBeNull();
    expect(document.activeElement).toBe(trigger);

    trigger.click();
    await flushPromises();
    await press('Escape');
    expect(document.querySelector('.depth4-wrap.is-open')).toBeNull();
    expect(root().classList.contains('is-open')).toBe(true);

    trigger.click();
    await flushPromises();
    $('.trigger-close').click();
    await flushPromises();
    expect(root().classList.contains('is-open')).toBe(false);
  });

  it('4depth 패널이 열려 있으면 그 안에 초점을 가둔다', async () => {
    const wrapper = mountPage();
    await openMenu(wrapper);
    $('button.has-depth3').click();
    await flushPromises();
    $('button.has-depth4').click();
    await flushPromises();
    const links = $$('.depth4-ul a');
    links[links.length - 1].focus();
    await press('Tab');
    expect(document.activeElement).toBe($('.trigger-prev'));
  });

  it('selected가 3depth 안에 있으면 해당 2depth가 펼쳐진 채 시작한다', () => {
    const nested: MobileMenuNode[] = [
      {
        label: 'A',
        children: [
          {
            label: 'A-1',
            children: [{ label: 'A-1-a', href: '/x', selected: true }],
          },
        ],
      },
    ];
    const wrapper = mount(MobileMenu, {
      props: { items: nested },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    expect($('button.has-depth3').getAttribute('aria-expanded')).toBe('true');
    expect($('a.depth3-trigger').classList.contains('selected')).toBe(true);
  });
});

describe('MobileMenu 접근성', () => {
  it('열린 메뉴 axe 위반이 없다', async () => {
    const wrapper = mountPage();
    await openMenu(wrapper);
    expect(await axe(root())).toHaveNoViolations();
  });
});

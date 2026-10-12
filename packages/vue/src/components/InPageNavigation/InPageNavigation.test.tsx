import { describe, it, expect, afterEach, vi } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import { h } from 'vue';
import { axe } from '../../test/setup';
import InPageNavigation, { type InPageNavItem } from './InPageNavigation.vue';

const items: InPageNavItem[] = [
  { label: '이용 대상', href: '#sec-1' },
  { label: '주요 구성', href: '#sec-2' },
  { label: '자주 묻는 질문', href: '#sec-3' },
];

const mounted: VueWrapper[] = [];
afterEach(() => {
  mounted.splice(0).forEach((w) => w.unmount());
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

const mountNav = (slots = {}) => {
  const wrapper = mount(InPageNavigation, {
    props: { title: 'KRDS 시작하기', items },
    slots,
    attachTo: document.body,
  });
  mounted.push(wrapper);
  return wrapper;
};

describe('InPageNavigation 구조 (KRDS in_page_navigation.html 기준)', () => {
  it('.krds-in-page-navigation-area > .in-page-navigation-header + nav.in-page-navigation-list > ul > li > a', () => {
    const wrapper = mountNav();
    expect(wrapper.classes()).toEqual(['krds-in-page-navigation-area']);
    expect(
      wrapper.find('.in-page-navigation-header .quick-caption').text()
    ).toBe('이 페이지의 구성');
    expect(wrapper.find('.in-page-navigation-header .quick-title').text()).toBe(
      'KRDS 시작하기'
    );
    const links = wrapper.findAll('nav.in-page-navigation-list > ul > li > a');
    expect(links.map((a) => a.text())).toEqual([
      '이용 대상',
      '주요 구성',
      '자주 묻는 질문',
    ]);
    expect(links.map((a) => a.attributes('href'))).toEqual([
      '#sec-1',
      '#sec-2',
      '#sec-3',
    ]);
  });

  it('nav 이름은 머리말(.quick-caption)', () => {
    const wrapper = mountNav();
    const caption = wrapper.find('.quick-caption');
    expect(wrapper.find('nav').attributes('aria-labelledby')).toBe(
      caption.attributes('id')
    );
  });

  it('처음에는 첫 항목이 .active + aria-current="location"', () => {
    const wrapper = mountNav();
    const links = wrapper.findAll('a');
    expect(links[0]!.classes()).toContain('active');
    expect(links[0]!.attributes('aria-current')).toBe('location');
    expect(links[1]!.attributes('aria-current')).toBeUndefined();
  });

  it('action 슬롯이 없으면 .in-page-navigation-action을 그리지 않는다', () => {
    expect(mountNav().find('.in-page-navigation-action').exists()).toBe(false);
    const withAction = mountNav({
      action: () =>
        h('button', { class: 'krds-btn medium' }, '온라인 신청하기'),
    });
    expect(withAction.find('.in-page-navigation-action .krds-btn').text()).toBe(
      '온라인 신청하기'
    );
  });
});

describe('InPageNavigation 동작', () => {
  it('항목을 누르면 해당 구역으로 스크롤하고 제목에 초점을 옮긴 뒤 현재 항목으로 표시한다', async () => {
    const section = document.createElement('h2');
    section.id = 'sec-2';
    section.textContent = '주요 구성';
    document.body.appendChild(section);
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});

    const wrapper = mountNav();
    const link = wrapper.findAll('a')[1]!;
    await link.trigger('click');

    expect(scrollTo).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(section);
    expect(section.getAttribute('tabindex')).toBe('-1');
    expect(link.classes()).toContain('active');
    expect(link.attributes('aria-current')).toBe('location');
  });

  it('구역이 없는 항목은 기본 링크 동작을 막지 않는다', async () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    const wrapper = mountNav();
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    wrapper.findAll('a')[2]!.element.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    expect(scrollTo).not.toHaveBeenCalled();
  });
});

describe('InPageNavigation 접근성', () => {
  it('axe 위반이 없다', async () => {
    const wrapper = mountNav();
    expect(await axe(wrapper.element)).toHaveNoViolations();
  });
});

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { axe } from '../../test/setup';
import Breadcrumb from './Breadcrumb.vue';

const items = [
  { label: '홈', href: '/' },
  { label: '알림마당', href: '/news' },
  { label: '공지사항', href: '/news/notice' },
];

describe('Breadcrumb 구조 (KRDS breadcrumb.html 기준)', () => {
  it('nav.krds-breadcrumb-wrap[aria-label="현재 경로"] > ol.breadcrumb > li > a.txt 구조로 렌더한다', () => {
    const wrapper = mount(Breadcrumb, { props: { items } });
    const nav = wrapper.element as HTMLElement;
    expect(nav.tagName).toBe('NAV');
    expect(nav.className).toBe('krds-breadcrumb-wrap');
    expect(nav.getAttribute('aria-label')).toBe('현재 경로');
    const links = wrapper.findAll('ol.breadcrumb > li > a.txt');
    expect(links.map((a) => a.text())).toEqual(['홈', '알림마당', '공지사항']);
    expect(links.map((a) => a.attributes('href'))).toEqual([
      '/',
      '/news',
      '/news/notice',
    ]);
  });

  it('첫 항목에 .home을 붙이고 home=false면 붙이지 않는다', () => {
    const wrapper = mount(Breadcrumb, { props: { items } });
    expect(wrapper.findAll('li').map((li) => li.classes())).toEqual([
      ['home'],
      [],
      [],
    ]);
    const noHome = mount(Breadcrumb, { props: { items, home: false } });
    expect(noHome.find('li.home').exists()).toBe(false);
  });

  it('마지막 항목에만 aria-current="page"를 붙인다 (KRDS 원본 보완)', () => {
    const wrapper = mount(Breadcrumb, { props: { items } });
    const currents = wrapper
      .findAll('.txt')
      .map((el) => el.attributes('aria-current'));
    expect(currents).toEqual([undefined, undefined, 'page']);
  });

  it('href가 없으면 span.txt로 렌더한다', () => {
    const wrapper = mount(Breadcrumb, {
      props: { items: [items[0], { label: '공지사항' }] },
    });
    const last = wrapper.findAll('li')[1].find('.txt');
    expect(last.element.tagName).toBe('SPAN');
    expect(last.attributes('aria-current')).toBe('page');
  });

  it('label·id를 바꿀 수 있다', () => {
    const wrapper = mount(Breadcrumb, {
      props: { items, label: '위치', id: 'breadcrumb' },
    });
    expect(wrapper.attributes('aria-label')).toBe('위치');
    expect(wrapper.attributes('id')).toBe('breadcrumb');
  });

  it('#item 슬롯으로 RouterLink 등을 쓸 수 있고 class·aria-current를 넘겨받는다', () => {
    const wrapper = mount(Breadcrumb, {
      props: { items },
      slots: {
        item: ({
          item,
          attrs,
        }: {
          item: { label: string; href?: string };
          attrs: Record<string, unknown>;
        }) =>
          h(
            'a',
            { ...attrs, href: `#${item.href}`, 'data-router': '' },
            item.label
          ),
      },
    });
    const links = wrapper.findAll('a[data-router]');
    expect(links).toHaveLength(3);
    expect(links[0].classes()).toEqual(['txt']);
    expect(links[2].attributes('aria-current')).toBe('page');
  });
});

describe('Breadcrumb 접근성', () => {
  it('axe 위반이 없다', async () => {
    const wrapper = mount(Breadcrumb, {
      props: { items },
      attachTo: document.body,
    });
    expect(await axe(wrapper.element)).toHaveNoViolations();
    wrapper.unmount();
  });
});

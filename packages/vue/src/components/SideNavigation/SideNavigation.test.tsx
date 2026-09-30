import { describe, it, expect, afterEach } from 'vitest';
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils';
import { axe } from '../../test/setup';
import SideNavigation, { type SideNavNode } from './SideNavigation.vue';

const items: SideNavNode[] = [
  {
    label: '공지사항',
    children: [
      {
        label: '분야별 공지',
        children: [
          { label: '행정', href: '/notice/admin' },
          { label: '복지', href: '/notice/welfare' },
        ],
      },
      { label: '전체 공지', href: '/notice' },
      { label: '긴급 공지', href: '/notice/urgent', selected: true },
    ],
  },
  { label: '보도자료', children: [{ label: '보도자료 목록', href: '/press' }] },
  { label: '자료실', href: '/archive' },
];

const mounted: VueWrapper[] = [];
afterEach(() => {
  mounted.splice(0).forEach((w) => w.unmount());
  document.body.innerHTML = '';
});

const mountNav = (list = items) => {
  const wrapper = mount(SideNavigation, {
    props: { title: '알림마당', items: list },
    attachTo: document.body,
  });
  mounted.push(wrapper);
  return wrapper;
};

describe('SideNavigation 구조 (KRDS side_navigation.html 기준)', () => {
  it('nav.krds-side-navigation > h2.lnb-tit + ul.lnb-list > li.lnb-item, nav 이름은 제목', () => {
    const wrapper = mountNav();
    expect(wrapper.element.tagName).toBe('NAV');
    expect(wrapper.classes()).toEqual(['krds-side-navigation']);
    const title = wrapper.find('h2.lnb-tit');
    expect(title.text()).toBe('알림마당');
    expect(wrapper.attributes('aria-labelledby')).toBe(title.attributes('id'));
    expect(wrapper.findAll('ul.lnb-list > li.lnb-item')).toHaveLength(3);
  });

  it('menubar/menu/menuitem 역할을 쓰지 않는다 (방향키 없는 menu 역할 오용 보완)', () => {
    const wrapper = mountNav();
    expect(wrapper.find('[role="menubar"]').exists()).toBe(false);
    expect(wrapper.find('[role="menu"]').exists()).toBe(false);
    expect(wrapper.find('[role="menuitem"]').exists()).toBe(false);
  });

  it('하위가 있는 2depth는 button.lnb-btn.lnb-toggle(aria-controls → .lnb-submenu > ul)', () => {
    const wrapper = mountNav();
    const btn = wrapper.findAll('.lnb-item > button.lnb-toggle')[0];
    expect(btn.classes()).toEqual(
      expect.arrayContaining(['lnb-btn', 'lnb-toggle'])
    );
    const ul = wrapper.find(`#${btn.attributes('aria-controls')}`);
    expect(ul.element.tagName).toBe('UL');
    expect(ul.element.parentElement?.classList.contains('lnb-submenu')).toBe(
      true
    );
  });

  it('하위가 없는 2depth는 a.lnb-btn 링크', () => {
    const wrapper = mountNav();
    const link = wrapper.findAll('.lnb-item')[2].find('a.lnb-btn');
    expect(link.attributes('href')).toBe('/archive');
    expect(link.classes()).not.toContain('lnb-toggle');
  });

  it('3depth 링크는 li.lnb-subitem > a.lnb-btn.lnb-link, 현재 페이지는 li.active + .selected + aria-current', () => {
    const wrapper = mountNav();
    const subitems = wrapper.findAll('.lnb-submenu li.lnb-subitem');
    const current = subitems[2];
    expect(current.classes()).toContain('active');
    const a = current.find('a.lnb-btn.lnb-link');
    expect(a.classes()).toContain('selected');
    expect(a.attributes('aria-current')).toBe('page');
  });

  it('3depth 팝업: button.lnb-toggle-popup(aria-haspopup) + .lnb-submenu-lv2 > button.lnb-btn-tit + ul > li > a.lnb-btn', () => {
    const wrapper = mountNav();
    const trigger = wrapper.find('button.lnb-toggle-popup');
    expect(trigger.attributes('aria-haspopup')).toBe('true');
    expect(trigger.attributes('aria-expanded')).toBe('false');
    const popup = wrapper.find(`#${trigger.attributes('aria-controls')}`);
    expect(popup.classes()).toContain('lnb-submenu-lv2');
    expect(popup.find('button.lnb-btn-tit').text()).toContain('분야별 공지');
    expect(popup.find('button.lnb-btn-tit .sr-only').text()).toBe('닫기');
    expect(popup.findAll('ul > li > a.lnb-btn').map((a) => a.text())).toEqual([
      '행정',
      '복지',
    ]);
  });

  it('현재 페이지가 들어 있는 2depth는 펼친 채 시작한다', () => {
    const wrapper = mountNav();
    const [notice, press] = wrapper.findAll('.lnb-item');
    expect(notice.classes()).toContain('active');
    expect(notice.find('.lnb-toggle').attributes('aria-expanded')).toBe('true');
    expect(press.classes()).not.toContain('active');
  });

  it('selected인 2depth 링크는 li.active + .active.selected', () => {
    const wrapper = mountNav([
      { label: '자료실', href: '/archive', selected: true },
    ]);
    expect(wrapper.find('.lnb-item').classes()).toContain('active');
    expect(wrapper.find('a.lnb-btn').classes()).toEqual(
      expect.arrayContaining(['active', 'selected'])
    );
  });
});

describe('SideNavigation 동작 (KRDS krds_sideNavigation)', () => {
  it('2depth 버튼으로 펼치고 접으며, 여러 개를 동시에 펼칠 수 있다', async () => {
    const wrapper = mountNav();
    const [notice, press] = wrapper.findAll('.lnb-item > button.lnb-toggle');
    await press.trigger('click');
    expect(press.attributes('aria-expanded')).toBe('true');
    expect(notice.attributes('aria-expanded')).toBe('true');
    await notice.trigger('click');
    expect(notice.attributes('aria-expanded')).toBe('false');
    expect(wrapper.findAll('.lnb-item')[0].classes()).not.toContain('active');
  });

  it('팝업 버튼으로 열고(.active, aria-expanded) 제목 버튼에 초점을 준다', async () => {
    const wrapper = mountNav();
    const trigger = wrapper.find('button.lnb-toggle-popup');
    await trigger.trigger('click');
    await flushPromises();
    expect(trigger.attributes('aria-expanded')).toBe('true');
    expect(wrapper.find('.lnb-submenu-lv2').classes()).toContain('active');
    expect(document.activeElement).toBe(wrapper.find('.lnb-btn-tit').element);
  });

  it('제목 버튼을 누르면 닫고 여는 버튼에 초점을 돌려준다', async () => {
    const wrapper = mountNav();
    const trigger = wrapper.find('button.lnb-toggle-popup');
    await trigger.trigger('click');
    await flushPromises();
    await wrapper.find('.lnb-btn-tit').trigger('click');
    expect(wrapper.find('.lnb-submenu-lv2').classes()).not.toContain('active');
    expect(document.activeElement).toBe(trigger.element);
  });

  it('Esc로 닫고 여는 버튼에 초점을 돌려준다', async () => {
    const wrapper = mountNav();
    const trigger = wrapper.find('button.lnb-toggle-popup');
    await trigger.trigger('click');
    await flushPromises();
    const link = wrapper.find('.lnb-submenu-lv2 a').element as HTMLElement;
    link.focus();
    link.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    );
    await flushPromises();
    expect(trigger.attributes('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(trigger.element);
  });

  it('팝업 밖으로 초점이 나가면 닫되, 초점을 여는 버튼으로 끌고 가지 않는다', async () => {
    const wrapper = mountNav();
    const trigger = wrapper.find('button.lnb-toggle-popup');
    await trigger.trigger('click');
    await flushPromises();
    const links = wrapper.findAll('.lnb-submenu-lv2 a');
    const outside = wrapper.findAll('a.lnb-link')[0].element as HTMLElement;
    await links[0].trigger('focusout', { relatedTarget: links[1].element });
    expect(wrapper.find('.lnb-submenu-lv2').classes()).toContain('active');
    outside.focus();
    await links[1].trigger('focusout', { relatedTarget: outside });
    await flushPromises();
    expect(wrapper.find('.lnb-submenu-lv2').classes()).not.toContain('active');
    expect(document.activeElement).toBe(outside);
  });
});

describe('SideNavigation 접근성', () => {
  it('axe 위반이 없다 (팝업 열림 포함)', async () => {
    const wrapper = mountNav();
    expect(await axe(wrapper.element)).toHaveNoViolations();
    await wrapper.find('button.lnb-toggle-popup').trigger('click');
    await flushPromises();
    expect(await axe(wrapper.element)).toHaveNoViolations();
  });
});

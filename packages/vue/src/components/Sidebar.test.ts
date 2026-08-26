import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { axe } from '../test/setup';
import Sidebar from './Sidebar.vue';
import type { SidebarMenuItem } from './Sidebar.vue';

const MENU: SidebarMenuItem[] = [
  { label: '대시보드', href: '/admin', active: true },
  {
    label: '게시판',
    children: [
      { label: '공지사항', href: '/admin/notice' },
      { label: '자료실', href: '/admin/files', active: true },
    ],
  },
  { label: '설정', href: '/admin/settings' },
];

describe('Sidebar', () => {
  it('이름을 가진 complementary 랜드마크여야 합니다', () => {
    const wrapper = mount(Sidebar, { props: { menuItems: MENU } });
    expect(wrapper.element.tagName).toBe('ASIDE');
    expect(wrapper.attributes('aria-label')).toBe('사이드바 메뉴');
  });

  it('메뉴 항목이 렌더링되어야 합니다', () => {
    const wrapper = mount(Sidebar, { props: { menuItems: MENU } });
    expect(wrapper.text()).toContain('대시보드');
    expect(wrapper.text()).toContain('게시판');
  });

  it('활성 하위 항목이 있는 메뉴는 처음부터 펼쳐져야 합니다', () => {
    const wrapper = mount(Sidebar, { props: { menuItems: MENU } });
    // 자료실이 active이므로 게시판 그룹이 열려 있어야 한다
    expect(wrapper.text()).toContain('자료실');
    const toggle = wrapper
      .findAll('button')
      .find((b) => b.text().includes('게시판'));
    expect(toggle?.attributes('aria-expanded')).toBe('true');
  });

  it('하위 메뉴 토글이 aria-expanded를 반영해야 합니다', async () => {
    const wrapper = mount(Sidebar, { props: { menuItems: MENU } });
    const toggle = wrapper
      .findAll('button')
      .find((b) => b.text().includes('게시판'))!;

    await toggle.trigger('click');
    expect(toggle.attributes('aria-expanded')).toBe('false');

    await toggle.trigger('click');
    expect(toggle.attributes('aria-expanded')).toBe('true');
  });

  it('활성 항목에 aria-current="page"가 있어야 합니다', () => {
    const wrapper = mount(Sidebar, { props: { menuItems: MENU } });
    const current = wrapper.findAll('[aria-current="page"]');
    expect(current.length).toBeGreaterThan(0);
    expect(current.some((el) => el.text().includes('대시보드'))).toBe(true);
  });

  it('메뉴 클릭 시 menuClick을 emit하고 기본 이동을 막아야 합니다', async () => {
    const wrapper = mount(Sidebar, { props: { menuItems: MENU } });
    const link = wrapper.findAll('a').find((a) => a.text().includes('설정'))!;

    await link.trigger('click');
    expect(wrapper.emitted('menuClick')?.[0]).toEqual(['/admin/settings']);
  });

  it('접기 버튼이 상태에 따라 접근명을 바꿔야 합니다', async () => {
    const wrapper = mount(Sidebar, { props: { menuItems: MENU } });
    const toggle = wrapper.get('[aria-label="사이드바 접기"]');

    await toggle.trigger('click');
    expect(wrapper.find('[aria-label="사이드바 펼치기"]').exists()).toBe(true);
    expect(wrapper.emitted('collapsedChange')?.[0]).toEqual([true]);
  });

  it('접힌 상태에서도 메뉴가 접근명을 가져야 합니다', async () => {
    const wrapper = mount(Sidebar, {
      props: { menuItems: MENU, defaultCollapsed: true },
    });
    // 라벨 텍스트가 숨겨지므로 aria-label로 대체돼야 한다
    const link = wrapper.findAll('a')[0];
    expect(link.attributes('aria-label')).toBe('대시보드');
  });

  it('아이콘은 보조기기에 노출되지 않아야 합니다', () => {
    const wrapper = mount(Sidebar, { props: { menuItems: MENU } });
    wrapper.findAll('svg').forEach((svg) => {
      const hidden =
        svg.attributes('aria-hidden') === 'true' ||
        svg.element.closest('[aria-hidden="true"]') !== null;
      expect(hidden).toBe(true);
    });
  });

  it('접근성 위반이 없어야 합니다', async () => {
    const wrapper = mount(Sidebar, { props: { menuItems: MENU } });
    const results = await axe(wrapper.element);
    expect(results).toHaveNoViolations();
  });

  it('접힌 상태에서도 접근성 위반이 없어야 합니다', async () => {
    const wrapper = mount(Sidebar, {
      props: { menuItems: MENU, defaultCollapsed: true },
    });
    const results = await axe(wrapper.element);
    expect(results).toHaveNoViolations();
  });
});

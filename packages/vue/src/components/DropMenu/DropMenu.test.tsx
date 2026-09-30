import { describe, it, expect, afterEach } from 'vitest';
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils';
import { axe } from '../../test/setup';
import DropMenu from './DropMenu.vue';

const mounted: VueWrapper[] = [];
afterEach(() => {
  mounted.splice(0).forEach((w) => w.unmount());
  document.body.innerHTML = '';
});

const items = [
  { label: '공지사항', href: '/notice' },
  { label: '보도자료', href: '/press' },
  { label: '관련 사이트', href: 'https://www.gov.kr', external: true },
];

const mountMenu = (
  props: Record<string, unknown> = {},
  slots: Record<string, string> = {}
) => {
  const wrapper = mount(DropMenu, {
    props: { label: '알림마당', items, ...props },
    slots,
    attachTo: document.body,
  });
  mounted.push(wrapper);
  return wrapper;
};

const isOpen = (wrapper: VueWrapper) =>
  (wrapper.find('.drop-menu').element as HTMLElement).style.display === 'block';

describe('DropMenu 구조 (KRDS header.html krds-drop-wrap 기준)', () => {
  it('.krds-drop-wrap > button.drop-btn + .drop-menu > .drop-in > ul.drop-list > li > .item-link', () => {
    const wrapper = mountMenu();
    expect(wrapper.classes()).toContain('krds-drop-wrap');
    const btn = wrapper.find('button.drop-btn');
    expect(btn.classes()).toEqual(['krds-btn', 'small', 'text', 'drop-btn']);
    expect(btn.text()).toBe('알림마당');
    expect(btn.find('i.svg-icon.ico-toggle').attributes('aria-hidden')).toBe(
      'true'
    );
    const links = wrapper.findAll(
      '.drop-menu > .drop-in > ul.drop-list > li > a.item-link'
    );
    expect(links.map((a) => a.text())).toEqual([
      '공지사항',
      '보도자료',
      '관련 사이트',
    ]);
  });

  it('처음에는 닫혀 있고 aria-expanded="false"이며 버튼이 메뉴를 aria-controls로 가리킨다', () => {
    const wrapper = mountMenu();
    const btn = wrapper.find('.drop-btn');
    expect(isOpen(wrapper)).toBe(false);
    expect(btn.attributes('aria-expanded')).toBe('false');
    expect(btn.attributes('aria-controls')).toBe(
      wrapper.find('.drop-menu').attributes('id')
    );
  });

  it('새 창 항목은 .ico-go · target="_blank" · title="새 창 열림" · rel을 가진다', () => {
    const wrapper = mountMenu();
    const ext = wrapper.findAll('a.item-link')[2];
    expect(ext.classes()).toContain('ico-go');
    expect(ext.attributes('target')).toBe('_blank');
    expect(ext.attributes('title')).toBe('새 창 열림');
    expect(ext.attributes('rel')).toBe('noopener noreferrer');
  });

  it('href 없는 항목은 button.item-link, active 항목은 .active + sr-only "선택됨" (aria-selected 없음)', () => {
    const wrapper = mountMenu({
      label: '글자 크기',
      items: [
        { label: '작게', class: 'sm' },
        { label: '보통', class: 'md', active: true },
      ],
    });
    const [sm, md] = wrapper.findAll('button.item-link');
    expect(sm.classes()).toContain('sm');
    expect(md.classes()).toEqual(
      expect.arrayContaining(['item-link', 'md', 'active'])
    );
    expect(md.find('.sr-only').text()).toBe('선택됨');
    expect(md.attributes('aria-selected')).toBeUndefined();
  });

  it('top·bottom 슬롯은 .drop-top · .drop-bottom에 렌더한다', () => {
    const wrapper = mountMenu(
      {
        label: '나의 GOV',
        buttonClass: 'btn-navi my',
        toggleIcon: false,
        wrapClass: 'my-drop',
      },
      {
        top: '<p class="my-name">홍길동님</p>',
        bottom: '<button type="button">로그아웃</button>',
      }
    );
    expect(wrapper.classes()).toContain('my-drop');
    expect(wrapper.find('.drop-btn').classes()).toEqual([
      'btn-navi',
      'my',
      'drop-btn',
    ]);
    expect(wrapper.find('.drop-btn i').exists()).toBe(false);
    expect(wrapper.find('.drop-top .my-name').text()).toBe('홍길동님');
    expect(wrapper.find('.drop-bottom button').text()).toBe('로그아웃');
  });
});

describe('DropMenu 동작 (KRDS krds_dropEvent)', () => {
  it('버튼을 누르면 열리고 .active · aria-expanded="true", 다시 누르면 닫힌다', async () => {
    const wrapper = mountMenu();
    const btn = wrapper.find('.drop-btn');
    await btn.trigger('click');
    await flushPromises();
    expect(isOpen(wrapper)).toBe(true);
    expect(btn.classes()).toContain('active');
    expect(btn.attributes('aria-expanded')).toBe('true');
    await btn.trigger('click');
    expect(isOpen(wrapper)).toBe(false);
    expect(btn.attributes('aria-expanded')).toBe('false');
  });

  it('다른 드롭다운을 열면 먼저 열린 드롭다운이 닫힌다', async () => {
    const a = mountMenu();
    const b = mountMenu({ label: '민원안내' });
    await a.find('.drop-btn').trigger('click');
    await b.find('.drop-btn').trigger('click');
    await flushPromises();
    expect(isOpen(a)).toBe(false);
    expect(isOpen(b)).toBe(true);
  });

  it('Esc로 닫고 버튼으로 초점을 돌려준다', async () => {
    const wrapper = mountMenu();
    await wrapper.find('.drop-btn').trigger('click');
    const link = wrapper.find('a.item-link').element as HTMLElement;
    link.focus();
    link.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    );
    await flushPromises();
    expect(isOpen(wrapper)).toBe(false);
    expect(document.activeElement).toBe(wrapper.find('.drop-btn').element);
  });

  it('바깥을 클릭하면 닫힌다', async () => {
    const wrapper = mountMenu();
    await wrapper.find('.drop-btn').trigger('click');
    document.body.click();
    await flushPromises();
    expect(isOpen(wrapper)).toBe(false);
  });

  it('초점이 드롭다운 밖으로 나가면 닫히고, 안에서 옮겨 다니면 유지된다', async () => {
    const outside = document.createElement('button');
    document.body.appendChild(outside);
    const wrapper = mountMenu();
    await wrapper.find('.drop-btn').trigger('click');
    const links = wrapper.findAll('a.item-link');
    await links[0].trigger('focusout', { relatedTarget: links[1].element });
    expect(isOpen(wrapper)).toBe(true);
    await links[1].trigger('focusout', { relatedTarget: outside });
    expect(isOpen(wrapper)).toBe(false);
  });

  it('항목을 누르면 select를 보내고 닫은 뒤 버튼에 초점을 준다', async () => {
    const wrapper = mountMenu({
      items: [{ label: '작게' }, { label: '보통' }],
    });
    await wrapper.find('.drop-btn').trigger('click');
    await wrapper.findAll('button.item-link')[1].trigger('click');
    await flushPromises();
    expect(wrapper.emitted('select')?.[0]).toEqual([{ label: '보통' }, 1]);
    expect(isOpen(wrapper)).toBe(false);
    expect(document.activeElement).toBe(wrapper.find('.drop-btn').element);
  });
});

describe('DropMenu 접근성', () => {
  it('열린 상태 axe 위반이 없다', async () => {
    const wrapper = mountMenu();
    await wrapper.find('.drop-btn').trigger('click');
    await flushPromises();
    expect(await axe(wrapper.element)).toHaveNoViolations();
  });
});

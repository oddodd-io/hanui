import { describe, it, expect, afterEach, vi } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import { axe } from '../../test/setup';
import SkipLink from './SkipLink.vue';

const mounted: VueWrapper[] = [];

const setupPage = (html: string) => {
  const page = document.createElement('div');
  page.innerHTML = html;
  document.body.appendChild(page);
};

const mountSkip = (props: Record<string, unknown> = {}) => {
  const host = document.createElement('div');
  document.body.prepend(host);
  const wrapper = mount(SkipLink, { props, attachTo: host });
  mounted.push(wrapper);
  return wrapper;
};

afterEach(() => {
  mounted.splice(0).forEach((w) => w.unmount());
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('SkipLink 구조 (KRDS skip_link.html 기준)', () => {
  it('div#krds-skip-link > a[href="#main-content"] "본문 바로가기"가 기본이다', () => {
    const wrapper = mountSkip();
    expect(wrapper.element.id).toBe('krds-skip-link');
    const a = wrapper.find('a');
    expect(a.attributes('href')).toBe('#main-content');
    expect(a.text()).toBe('본문 바로가기');
  });

  it('links로 여러 건너뛰기 링크를 둘 수 있다', () => {
    const wrapper = mountSkip({
      links: [
        { target: 'main-content', label: '본문 바로가기' },
        { target: 'gnb', label: '주메뉴 바로가기' },
      ],
    });
    expect(wrapper.findAll('a').map((a) => a.attributes('href'))).toEqual([
      '#main-content',
      '#gnb',
    ]);
  });
});

describe('SkipLink 이동', () => {
  it('누르면 대상에 초점을 주고, 초점을 받지 못하는 요소면 tabindex="-1"을 붙인다', async () => {
    setupPage('<main id="main-content"><h1>공지사항</h1></main>');
    const wrapper = mountSkip();
    const main = document.getElementById('main-content')!;
    await wrapper.find('a').trigger('click');
    expect(main.getAttribute('tabindex')).toBe('-1');
    expect(document.activeElement).toBe(main);
  });

  it('이미 초점을 받는 대상은 tabindex를 바꾸지 않는다', async () => {
    setupPage('<a id="main-content" href="/x">본문</a>');
    const wrapper = mountSkip();
    await wrapper.find('a').trigger('click');
    const target = document.getElementById('main-content')!;
    expect(target.hasAttribute('tabindex')).toBe(false);
    expect(document.activeElement).toBe(target);
  });

  it('기본 해시 이동을 막아 해시 라우터의 라우트를 바꾸지 않는다', async () => {
    setupPage('<main id="main-content"></main>');
    const wrapper = mountSkip();
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    wrapper.find('a').element.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it('대상이 없으면 기본 동작을 막지 않고 개발 경고를 낸다', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const wrapper = mountSkip();
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    wrapper.find('a').element.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('main-content'));
  });
});

describe('SkipLink 접근성', () => {
  it('axe 위반이 없다', async () => {
    setupPage('<main id="main-content"></main>');
    const wrapper = mountSkip();
    expect(await axe(wrapper.element)).toHaveNoViolations();
  });
});

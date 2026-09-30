import { describe, it, expect, afterEach } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import { axe } from '../../test/setup';
import Header from './Header.vue';

const mounted: VueWrapper[] = [];
afterEach(() => {
  mounted.splice(0).forEach((w) => w.unmount());
  document.body.innerHTML = '';
  window.scrollY = 0;
});

const mountHeader = (
  props: Record<string, unknown> = {},
  slots: Record<string, string> = {},
  attachTo?: HTMLElement
) => {
  const wrapper = mount(Header, {
    props,
    slots,
    attachTo: attachTo ?? document.body,
  });
  mounted.push(wrapper);
  return wrapper;
};

describe('Header 구조 (KRDS header.html 기준)', () => {
  it('header#krds-header > .header-in > .header-container > .inner > .header-branding > .logo > a', () => {
    const wrapper = mountHeader();
    expect(wrapper.element.tagName).toBe('HEADER');
    expect(wrapper.element.id).toBe('krds-header');
    const a = wrapper.find(
      '.header-in > .header-container > .inner > .header-branding > h2.logo > a'
    );
    expect(a.attributes('href')).toBe('/');
    expect(a.find('.sr-only').text()).toBe('KRDS - Korea Design System');
  });

  it('logoHref·logoText·logoTag를 바꿀 수 있다', () => {
    const wrapper = mountHeader({
      logoHref: '/main',
      logoText: '한국기관',
      logoTag: 'h1',
    });
    const a = wrapper.find('h1.logo > a');
    expect(a.attributes('href')).toBe('/main');
    expect(a.text()).toBe('한국기관');
  });

  it('logoSrc가 있으면 img(alt=기관명)를 넣고 KRDS 기본 배경 로고를 끈다', () => {
    const wrapper = mountHeader({ logoSrc: '/logo.svg', logoText: '한국기관' });
    const a = wrapper.find('.logo > a');
    expect(a.attributes('style')).toContain('background-image: none');
    const img = a.find('img');
    expect(img.attributes('src')).toBe('/logo.svg');
    expect(img.attributes('alt')).toBe('한국기관');
    expect(a.find('.sr-only').exists()).toBe(false);
  });

  it('utility 슬롯은 .header-utility > ul.utility-list 안에, actions는 .header-actions에 렌더한다', () => {
    const wrapper = mountHeader(
      {},
      {
        utility:
          '<li><a href="#" class="krds-btn small text">누리집 안내</a></li>',
        actions: '<a href="#" class="btn-navi login">로그인</a>',
      }
    );
    expect(
      wrapper.find('.header-utility > ul.utility-list > li a').text()
    ).toBe('누리집 안내');
    expect(
      wrapper
        .find('.header-branding > .header-actions > a.btn-navi.login')
        .exists()
    ).toBe(true);
  });

  it('utility·actions가 없으면 해당 영역을 렌더하지 않는다', () => {
    const wrapper = mountHeader();
    expect(wrapper.find('.header-utility').exists()).toBe(false);
    expect(wrapper.find('.header-actions').exists()).toBe(false);
  });

  it('menu 슬롯은 .header-in 안, mobile 슬롯은 .header-in 밖에 렌더한다', () => {
    const wrapper = mountHeader(
      {},
      {
        menu: '<nav class="krds-main-menu"></nav>',
        mobile: '<div id="mobile-nav" class="krds-main-menu-mobile"></div>',
      }
    );
    expect(wrapper.find('.header-in > nav.krds-main-menu').exists()).toBe(true);
    expect(wrapper.find('#krds-header > #mobile-nav').exists()).toBe(true);
    expect(wrapper.find('.header-in #mobile-nav').exists()).toBe(false);
  });
});

describe('Header 스크롤 동작 (KRDS scrollManager)', () => {
  const setupLayout = () => {
    document.body.innerHTML =
      '<div id="wrap"><div id="header-slot"></div><div id="container"></div></div>';
    const container = document.getElementById('container')!;
    Object.defineProperty(container, 'offsetTop', {
      value: 100,
      configurable: true,
    });
    return {
      wrap: document.getElementById('wrap')!,
      slot: document.getElementById('header-slot')!,
    };
  };

  const scrollTo = (y: number) => {
    window.scrollY = y;
    window.dispatchEvent(new Event('scroll'));
  };

  it('#container + 50px 아래로 내리면 #wrap.scroll-down, 올리면 scroll-up, 위로 돌아오면 해제', () => {
    const { wrap, slot } = setupLayout();
    mountHeader({}, {}, slot);
    scrollTo(100);
    expect(wrap.className).toBe('');
    scrollTo(300);
    expect(wrap.classList.contains('scroll-down')).toBe(true);
    scrollTo(200);
    expect(wrap.classList.contains('scroll-up')).toBe(true);
    expect(wrap.classList.contains('scroll-down')).toBe(false);
    scrollTo(50);
    expect(wrap.className).toBe('');
  });

  it('scrollBehavior=false면 클래스를 붙이지 않는다', () => {
    const { wrap, slot } = setupLayout();
    mountHeader({ scrollBehavior: false }, {}, slot);
    scrollTo(300);
    expect(wrap.className).toBe('');
  });

  it('#wrap이 없으면 아무것도 하지 않는다', () => {
    mountHeader();
    expect(() => scrollTo(500)).not.toThrow();
  });

  it('언마운트하면 #wrap의 스크롤 클래스를 지운다', () => {
    const { wrap, slot } = setupLayout();
    const wrapper = mountHeader({}, {}, slot);
    scrollTo(300);
    mounted.splice(mounted.indexOf(wrapper), 1);
    wrapper.unmount();
    expect(wrap.className).toBe('');
  });
});

describe('Header 접근성', () => {
  it('axe 위반이 없다', async () => {
    const wrapper = mountHeader(
      {},
      {
        utility:
          '<li><a href="#" class="krds-btn small text">누리집 안내</a></li>',
        actions: '<a href="#" class="btn-navi login">로그인</a>',
      }
    );
    expect(await axe(wrapper.element)).toHaveNoViolations();
  });
});

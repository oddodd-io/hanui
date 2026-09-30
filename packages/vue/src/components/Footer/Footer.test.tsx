import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { axe } from '../../test/setup';
import Footer, { type FooterProps } from './Footer.vue';

const full: FooterProps = {
  logoText: '한국기관',
  address: '(26464) 강원특별자치도 원주시 건강로 32',
  contacts: [
    { title: '대표전화 1577-1000', note: '(유료, 평일 09시~18시)' },
    { title: '팩스 033-000-0000' },
  ],
  links: [
    { label: '찾아오시는 길', href: '/map' },
    { label: '정부24', href: 'https://www.gov.kr', external: true },
  ],
  sns: [
    { label: '인스타그램', href: 'https://instagram.com/x', icon: 'instagram' },
    { label: '유튜브', href: 'https://youtube.com/x', icon: 'youtube' },
  ],
  policies: [
    { label: '개인정보처리방침', href: '/privacy', point: true },
    { label: '저작권 정책', href: '/copyright' },
  ],
  copyright: '© 2026 한국기관. All rights reserved.',
  identifier: '이 누리집은 보건복지부 누리집입니다.',
};

describe('Footer 구조 (KRDS footer.html 기준)', () => {
  it('footer#krds-footer > .inner > .f-logo · .f-cnt · .f-btm', () => {
    const wrapper = mount(Footer, { props: full });
    expect(wrapper.element.tagName).toBe('FOOTER');
    expect(wrapper.element.id).toBe('krds-footer');
    const inner = wrapper.find(':scope > .inner');
    expect(inner.find('.f-logo .sr-only').text()).toBe('한국기관');
    expect(inner.find('.f-cnt > .f-info').exists()).toBe(true);
    expect(inner.find('.f-cnt > .f-link').exists()).toBe(true);
    expect(inner.find('.f-btm > .f-btm-text').exists()).toBe(true);
  });

  it('주소와 연락처(strong.strong + span.span)를 렌더한다', () => {
    const wrapper = mount(Footer, { props: full });
    expect(wrapper.find('.f-info > p.info-addr').text()).toBe(full.address);
    const items = wrapper.findAll('ul.info-cs > li');
    expect(items[0].find('strong.strong').text()).toBe('대표전화 1577-1000');
    expect(items[0].find('span.span').text()).toBe('(유료, 평일 09시~18시)');
    expect(items[1].find('span.span').exists()).toBe(false);
  });

  it('바로가기는 a.krds-btn.medium.text + ico-angle, 외부 링크는 새 창 + ico-go', () => {
    const wrapper = mount(Footer, { props: full });
    const [map, gov] = wrapper.findAll('.link-go > a');
    expect(map.classes()).toEqual(['krds-btn', 'medium', 'text']);
    expect(map.find('i.ico-angle.right').attributes('aria-hidden')).toBe(
      'true'
    );
    expect(map.attributes('target')).toBeUndefined();
    expect(gov.attributes('target')).toBe('_blank');
    expect(gov.attributes('title')).toBe('새 창 열기');
    expect(gov.attributes('rel')).toBe('noopener noreferrer');
    expect(gov.find('i.ico-go').exists()).toBe(true);
  });

  it('SNS는 a.krds-btn.xlarge.icon.border(새 창) + sr-only 이름 + 아이콘', () => {
    const wrapper = mount(Footer, { props: full });
    const [insta] = wrapper.findAll('.link-sns > a');
    expect(insta.classes()).toEqual(['krds-btn', 'xlarge', 'icon', 'border']);
    expect(insta.attributes('target')).toBe('_blank');
    expect(insta.find('.sr-only').text()).toBe('인스타그램');
    expect(
      insta.find('i.svg-icon.ico-instagram').attributes('aria-hidden')
    ).toBe('true');
  });

  it('정책 링크 중 point는 .point, 저작권은 p.f-copy', () => {
    const wrapper = mount(Footer, { props: full });
    const policies = wrapper.findAll('.f-menu > a');
    expect(policies[0].classes()).toEqual(['point']);
    expect(policies[1].classes()).toEqual([]);
    expect(wrapper.find('p.f-copy').text()).toBe(full.copyright);
  });

  it('identifier가 있으면 .f-btm 안에 .krds-identifier를 렌더한다', () => {
    const wrapper = mount(Footer, { props: full });
    expect(wrapper.find('.f-btm > .krds-identifier .ban-txt').text()).toBe(
      full.identifier
    );
  });

  it('quick 슬롯은 .foot-quick > .inner에, 없으면 .foot-quick을 렌더하지 않는다', () => {
    const withQuick = mount(Footer, {
      props: full,
      slots: {
        quick: '<button type="button" class="link">관련 사이트</button>',
      },
    });
    expect(withQuick.find('.foot-quick > .inner > button.link').text()).toBe(
      '관련 사이트'
    );
    expect(mount(Footer, { props: full }).find('.foot-quick').exists()).toBe(
      false
    );
  });

  it('비어 있는 영역은 렌더하지 않는다', () => {
    const wrapper = mount(Footer);
    expect(wrapper.find('.info-addr').exists()).toBe(false);
    expect(wrapper.find('.f-link').exists()).toBe(false);
    expect(wrapper.find('.f-menu').exists()).toBe(false);
    expect(wrapper.find('.krds-identifier').exists()).toBe(false);
  });

  it('logoSrc가 있으면 img(alt)를 넣고 KRDS 배경 로고를 끈다', () => {
    const wrapper = mount(Footer, {
      props: { logoSrc: '/logo.svg', logoText: '한국기관' },
    });
    expect(wrapper.find('.f-logo').attributes('style')).toContain(
      'background-image: none'
    );
    expect(wrapper.find('.f-logo img').attributes('alt')).toBe('한국기관');
  });
});

describe('Footer 접근성', () => {
  it('axe 위반이 없다', async () => {
    const wrapper = mount(Footer, { props: full, attachTo: document.body });
    expect(await axe(wrapper.element)).toHaveNoViolations();
    wrapper.unmount();
  });
});

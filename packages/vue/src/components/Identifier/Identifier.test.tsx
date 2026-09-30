import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { axe } from '../../test/setup';
import Identifier from './Identifier.vue';

describe('Identifier (KRDS identifier.html 기준)', () => {
  it('.krds-identifier > span.logo(sr-only) + span.ban-txt', () => {
    const wrapper = mount(Identifier, {
      props: { text: '이 누리집은 보건복지부 누리집입니다.' },
    });
    expect(wrapper.classes()).toEqual(['krds-identifier']);
    expect(wrapper.find('span.logo > .sr-only').text()).toBe(
      'KRDS - Korea Design System'
    );
    expect(wrapper.find('span.ban-txt').text()).toBe(
      '이 누리집은 보건복지부 누리집입니다.'
    );
  });

  it('logoSrc가 있으면 img(alt)를 넣고 KRDS 배경 로고를 끈다', () => {
    const wrapper = mount(Identifier, {
      props: { text: 't', logoSrc: '/ministry.svg', logoText: '보건복지부' },
    });
    const logo = wrapper.find('.logo');
    expect(logo.attributes('style')).toContain('background-image: none');
    expect(logo.find('img').attributes('alt')).toBe('보건복지부');
  });

  it('axe 위반이 없다', async () => {
    const wrapper = mount(Identifier, {
      props: { text: '이 누리집은 보건복지부 누리집입니다.' },
      attachTo: document.body,
    });
    expect(await axe(wrapper.element)).toHaveNoViolations();
    wrapper.unmount();
  });
});

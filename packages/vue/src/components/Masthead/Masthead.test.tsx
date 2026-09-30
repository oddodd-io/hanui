import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { axe } from '../../test/setup';
import Masthead from './Masthead.vue';

describe('Masthead 구조 (KRDS masthead.html 기준)', () => {
  it('#krds-masthead > .toggle-wrap > .toggle-head > .inner > .nuri-txt 구조로 렌더한다', () => {
    const wrapper = mount(Masthead);
    expect(wrapper.element.id).toBe('krds-masthead');
    const txt = wrapper.find(
      '.toggle-wrap > .toggle-head > .inner > span.nuri-txt'
    );
    expect(txt.text()).toBe('이 누리집은 대한민국 공식 전자정부 누리집입니다.');
  });

  it('text로 문구를 바꿀 수 있다', () => {
    const wrapper = mount(Masthead, { props: { text: '공식 누리집' } });
    expect(wrapper.find('.nuri-txt').text()).toBe('공식 누리집');
  });

  it('axe 위반이 없다', async () => {
    const wrapper = mount(Masthead, { attachTo: document.body });
    expect(await axe(wrapper.element)).toHaveNoViolations();
    wrapper.unmount();
  });
});

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { axe } from '../../test/setup';
import Spinner from './Spinner.vue';

describe('Spinner (KRDS spinner.html 기준)', () => {
  it('div.krds-spinner[role="status"] > span.sr-only "로딩 중"', () => {
    const wrapper = mount(Spinner);
    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.classes()).toEqual(['krds-spinner']);
    expect(wrapper.attributes('role')).toBe('status');
    expect(wrapper.find('span.sr-only').text()).toBe('로딩 중');
  });

  it('label로 스크린리더 문구를 바꿀 수 있다', () => {
    const wrapper = mount(Spinner, { props: { label: '검색 중' } });
    expect(wrapper.find('.sr-only').text()).toBe('검색 중');
  });

  it('화면 문구가 있으면 sr-only 문구를 생략해 두 번 읽히지 않게 한다 (원본 보완)', () => {
    const wrapper = mount(Spinner, {
      slots: { default: '데이터를 불러오는 중입니다' },
    });
    expect(wrapper.find('.sr-only').exists()).toBe(false);
    expect(wrapper.text()).toBe('데이터를 불러오는 중입니다');
  });

  it('axe 위반이 없다', async () => {
    const wrapper = mount(Spinner, { attachTo: document.body });
    expect(await axe(wrapper.element)).toHaveNoViolations();
    wrapper.unmount();
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { axe } from '../test/setup';
import CopyButton from './CopyButton.vue';

const setClipboard = (impl: () => Promise<void>) => {
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: vi.fn(impl) },
    configurable: true,
  });
};

describe('CopyButton', () => {
  beforeEach(() => setClipboard(() => Promise.resolve()));
  afterEach(() => vi.useRealTimers());

  it('복사 버튼으로 렌더링되어야 합니다', () => {
    const wrapper = mount(CopyButton, { props: { value: '복사할 값' } });
    expect(wrapper.attributes('aria-label')).toBe('복사');
  });

  it('클릭하면 클립보드에 값을 쓰고 copy를 emit해야 합니다', async () => {
    const wrapper = mount(CopyButton, { props: { value: 'hello' } });
    await wrapper.trigger('click');
    await new Promise((r) => setTimeout(r, 0));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('hello');
    expect(wrapper.emitted('copy')?.[0]).toEqual(['hello']);
  });

  it('복사 후 접근명이 바뀌어야 합니다', async () => {
    const wrapper = mount(CopyButton, { props: { value: 'hello' } });
    await wrapper.trigger('click');
    await new Promise((r) => setTimeout(r, 0));
    await wrapper.vm.$nextTick();

    expect(wrapper.attributes('aria-label')).toBe('복사됨');
  });

  it('value가 비어 있으면 비활성화돼야 합니다', () => {
    const wrapper = mount(CopyButton, { props: { value: '' } });
    expect(wrapper.attributes('disabled')).toBeDefined();
  });

  it('Clipboard API가 없으면 error를 emit해야 합니다', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      configurable: true,
    });
    const wrapper = mount(CopyButton, { props: { value: 'hello' } });
    await wrapper.trigger('click');

    expect(wrapper.emitted('error')?.[0]?.[0]).toBeInstanceOf(Error);
  });

  it('복사 실패 시 error를 emit해야 합니다', async () => {
    setClipboard(() => Promise.reject(new Error('denied')));
    const wrapper = mount(CopyButton, { props: { value: 'hello' } });
    await wrapper.trigger('click');
    await new Promise((r) => setTimeout(r, 0));

    expect(wrapper.emitted('error')?.[0]?.[0]).toBeInstanceOf(Error);
    expect(wrapper.emitted('copy')).toBeUndefined();
  });

  it('아이콘은 보조기기에 노출되지 않아야 합니다', () => {
    const wrapper = mount(CopyButton, { props: { value: 'hello' } });
    wrapper.findAll('svg').forEach((svg) => {
      expect(svg.attributes('aria-hidden')).toBe('true');
    });
  });

  it('접근성 위반이 없어야 합니다', async () => {
    const wrapper = mount(CopyButton, { props: { value: 'hello' } });
    const results = await axe(wrapper.element);
    expect(results).toHaveNoViolations();
  });
});

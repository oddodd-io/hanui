import { describe, it, expect, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { axe } from '../../test/setup';
import OtpVerify from './OtpVerify.vue';

afterEach(() => vi.useRealTimers());

describe('OtpVerify', () => {
  it('자릿수만큼 입력칸이 있어야 합니다', () => {
    const wrapper = mount(OtpVerify, { props: { codeLength: 6 } });
    expect(wrapper.findAll('input')).toHaveLength(6);
  });

  it('각 칸이 구분되는 접근명을 가져야 합니다', () => {
    const wrapper = mount(OtpVerify, { props: { codeLength: 4 } });
    const labels = wrapper
      .findAll('input')
      .map((i) => i.attributes('aria-label'));
    expect(labels).toEqual([
      '인증번호 1번째 자리',
      '인증번호 2번째 자리',
      '인증번호 3번째 자리',
      '인증번호 4번째 자리',
    ]);
  });

  it('입력칸 묶음이 제목으로 이름지어져야 합니다', () => {
    const wrapper = mount(OtpVerify);
    const group = wrapper.get('[role="group"]');
    const id = group.attributes('aria-labelledby')!;
    expect(
      wrapper.element.querySelector(`[id="${id}"]`)?.textContent
    ).toContain('인증번호 입력');
  });

  it('첫 칸에 one-time-code 힌트가 있어야 합니다', () => {
    const wrapper = mount(OtpVerify);
    const inputs = wrapper.findAll('input');
    expect(inputs[0].attributes('autocomplete')).toBe('one-time-code');
    expect(inputs[1].attributes('autocomplete')).toBe('off');
  });

  it('다 채우기 전에는 제출할 수 없어야 합니다', () => {
    const wrapper = mount(OtpVerify, { props: { codeLength: 2 } });
    expect(
      wrapper.get('button[type="submit"]').attributes('disabled')
    ).toBeDefined();
  });

  it('다 채우면 제출값을 emit해야 합니다', async () => {
    const wrapper = mount(OtpVerify, {
      props: { codeLength: 2, showTimer: false },
    });
    const inputs = wrapper.findAll('input');
    await inputs[0].setValue('1');
    await inputs[1].setValue('2');
    await wrapper.get('form').trigger('submit');

    expect(wrapper.emitted('submit')?.[0]?.[0]).toEqual({ code: '12' });
  });

  it('autoSubmit이면 마지막 칸 입력과 동시에 제출해야 합니다', async () => {
    const wrapper = mount(OtpVerify, {
      props: { codeLength: 2, autoSubmit: true, showTimer: false },
    });
    const inputs = wrapper.findAll('input');
    await inputs[0].setValue('1');
    expect(wrapper.emitted('submit')).toBeUndefined();

    await inputs[1].setValue('2');
    expect(wrapper.emitted('submit')?.[0]?.[0]).toEqual({ code: '12' });
  });

  it('숫자가 아닌 입력은 무시해야 합니다', async () => {
    const wrapper = mount(OtpVerify, {
      props: { codeLength: 2, showTimer: false },
    });
    const first = wrapper.findAll('input')[0];
    await first.setValue('a');
    await wrapper.vm.$nextTick();

    expect((first.element as HTMLInputElement).value).toBe('');
  });

  it('타이머가 만료되면 알리고 제출을 막아야 합니다', async () => {
    vi.useFakeTimers();
    const wrapper = mount(OtpVerify, {
      props: { codeLength: 1, timerSeconds: 1 },
    });
    vi.advanceTimersByTime(1500);
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('인증번호가 만료되었습니다');
    expect(
      wrapper.get('button[type="submit"]').attributes('disabled')
    ).toBeDefined();
  });

  it('남은 시간이 aria-live로 전달되어야 합니다', () => {
    const wrapper = mount(OtpVerify, { props: { timerSeconds: 180 } });
    const timer = wrapper.get('[aria-live="polite"]');
    expect(timer.text()).toContain('3:00');
  });

  it('에러는 alert로 알려야 합니다', () => {
    const wrapper = mount(OtpVerify, {
      props: { error: '인증번호가 올바르지 않습니다' },
    });
    expect(wrapper.get('[role="alert"]').text()).toBe(
      '인증번호가 올바르지 않습니다'
    );
  });

  it('재전송하면 입력이 비워지고 emit해야 합니다', async () => {
    const wrapper = mount(OtpVerify, {
      props: { codeLength: 2, showTimer: false },
    });
    await wrapper.findAll('input')[0].setValue('1');

    const resend = wrapper
      .findAll('button')
      .find((b) => b.text() === '재전송')!;
    await resend.trigger('click');

    expect(wrapper.emitted('resend')).toHaveLength(1);
    expect(
      (wrapper.findAll('input')[0].element as HTMLInputElement).value
    ).toBe('');
  });

  it('접근성 위반이 없어야 합니다', async () => {
    const wrapper = mount(OtpVerify);
    const results = await axe(wrapper.element);
    expect(results).toHaveNoViolations();
  });
});

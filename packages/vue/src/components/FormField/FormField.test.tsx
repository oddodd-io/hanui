import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { axe } from '../../test/setup';
import FormField from './FormField.vue';
import Input from '../Input/Input.vue';

const mountField = (
  props: Record<string, unknown>,
  inputProps: Record<string, unknown> = {}
) =>
  mount(FormField, {
    props: { label: '레이블', ...props },
    slots: { default: () => [<Input {...inputProps} />] },
    attachTo: document.body,
  });

describe('FormField 구조 (KRDS text_input.html 기준)', () => {
  it('.form-group > .form-tit > label + .form-conts + .form-hint 구조로 렌더된다', () => {
    const wrapper = mountField({ hint: '도움말' });
    expect(wrapper.classes()).toContain('form-group');
    expect(wrapper.find('.form-tit > label').text()).toBe('레이블');
    expect(wrapper.find('.form-conts > input.krds-input').exists()).toBe(true);
    expect(wrapper.find('p.form-hint').text()).toBe('도움말');
    wrapper.unmount();
  });

  it('label[for]와 input[id]가 자동으로 연결된다', () => {
    const wrapper = mountField({});
    const forAttr = wrapper.find('label').attributes('for');
    expect(forAttr).toBeTruthy();
    expect(wrapper.find('input').attributes('id')).toBe(forAttr);
    wrapper.unmount();
  });

  it('id를 지정하면 그 id를 쓴다', () => {
    const wrapper = mountField({ id: 'consult_name' });
    expect(wrapper.find('label').attributes('for')).toBe('consult_name');
    expect(wrapper.find('input').attributes('id')).toBe('consult_name');
    wrapper.unmount();
  });

  it('hint가 있으면 input의 aria-describedby로 연결된다', () => {
    const wrapper = mountField({ hint: '도움말' });
    const hintId = wrapper.find('p.form-hint').attributes('id');
    expect(wrapper.find('input').attributes('aria-describedby')).toBe(hintId);
    wrapper.unmount();
  });
});

describe('FormField 상태 (text_input_state.html 기준)', () => {
  it.each([
    ['error', 'is-error', 'form-hint-invalid'],
    ['success', 'is-success', 'form-hint-success'],
    ['information', 'is-information', 'form-hint-information'],
  ] as const)(
    'status=%s → .form-conts.%s + p.%s',
    (status, contsClass, msgClass) => {
      const wrapper = mountField({ status, message: '메시지' });
      expect(wrapper.find('.form-conts').classes()).toContain(contsClass);
      expect(wrapper.find(`p.${msgClass}`).text()).toBe('메시지');
      wrapper.unmount();
    }
  );

  it('error면 input에 aria-invalid, 메시지에 role=alert, describedby에 hint+message', () => {
    const wrapper = mountField({
      hint: '도움말',
      status: 'error',
      message: '에러',
    });
    const input = wrapper.find('input');
    expect(input.attributes('aria-invalid')).toBe('true');
    const msg = wrapper.find('p.form-hint-invalid');
    expect(msg.attributes('role')).toBe('alert');
    expect(input.attributes('aria-describedby')).toBe(
      `${wrapper.find('p.form-hint').attributes('id')} ${msg.attributes('id')}`
    );
    wrapper.unmount();
  });

  it('status 없이 message만 있으면 메시지를 렌더하지 않는다', () => {
    const wrapper = mountField({ message: '메시지' });
    expect(wrapper.find('[class^=form-hint-]').exists()).toBe(false);
    wrapper.unmount();
  });

  it('required·disabled가 input으로 전달된다', () => {
    const wrapper = mountField({ required: true, disabled: true });
    const el = wrapper.find('input').element as HTMLInputElement;
    expect(el.required).toBe(true);
    expect(el.disabled).toBe(true);
    wrapper.unmount();
  });
});

describe('FormField 접근성', () => {
  it.each([
    ['기본', {}],
    ['hint', { hint: '도움말' }],
    ['error', { status: 'error', message: '에러' }],
    ['required', { required: true }],
  ])('%s 상태는 접근성 위반이 없다', async (_n, props) => {
    const wrapper = mountField(props);
    expect(await axe(wrapper.element)).toHaveNoViolations();
    wrapper.unmount();
  });
});

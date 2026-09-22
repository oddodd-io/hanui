import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { axe } from '../../test/setup';
import Textarea from './Textarea.vue';
import FormField from '../FormField/FormField.vue';

describe('Textarea 구조 (KRDS textarea.html 기준)', () => {
  it('.textarea-wrap > textarea.krds-input 으로 렌더된다', () => {
    const wrapper = mount(Textarea, { attrs: { 'aria-label': '본문' } });
    expect(wrapper.classes()).toContain('textarea-wrap');
    expect(wrapper.find('textarea.krds-input').exists()).toBe(true);
  });

  it('maxlength가 있으면 .textarea-count(.count-now/.count-total)를 표시하고 describedby로 연결한다', () => {
    const wrapper = mount(Textarea, {
      props: { maxlength: 100, modelValue: '안녕' },
      attrs: { 'aria-label': '본문' },
    });
    const count = wrapper.find('p.textarea-count');
    expect(count.exists()).toBe(true);
    expect(count.find('.count-now').text()).toBe('2');
    expect(count.find('.count-total').text()).toBe('/100');
    expect(wrapper.find('textarea').attributes('maxlength')).toBe('100');
    expect(wrapper.find('textarea').attributes('aria-describedby')).toBe(
      count.attributes('id')
    );
  });

  it('maxlength가 없으면 카운트를 렌더하지 않는다', () => {
    const wrapper = mount(Textarea, { attrs: { 'aria-label': '본문' } });
    expect(wrapper.find('.textarea-count').exists()).toBe(false);
    expect(
      wrapper.find('textarea').attributes('aria-describedby')
    ).toBeUndefined();
  });

  it('글자수는 코드포인트 기준으로 센다 (이모지 1글자)', () => {
    const wrapper = mount(Textarea, {
      props: { maxlength: 10, modelValue: '가😀' },
      attrs: { 'aria-label': '본문' },
    });
    expect(wrapper.find('.count-now').text()).toBe('2');
  });

  it('placeholder·name·readonly·disabled·required가 반영된다', () => {
    const wrapper = mount(Textarea, {
      props: {
        placeholder: '플레이스홀더',
        name: 'body',
        readonly: true,
        disabled: true,
        required: true,
      },
      attrs: { 'aria-label': '본문' },
    });
    const el = wrapper.find('textarea').element as HTMLTextAreaElement;
    expect(el.placeholder).toBe('플레이스홀더');
    expect(el.name).toBe('body');
    expect(el.readOnly).toBe(true);
    expect(el.disabled).toBe(true);
    expect(el.required).toBe(true);
  });
});

describe('Textarea v-model', () => {
  it('입력하면 update:modelValue를 emit하고 카운트가 바뀐다', async () => {
    const wrapper = mount(Textarea, {
      props: { modelValue: '', maxlength: 100 },
      attrs: { 'aria-label': '본문' },
    });
    await wrapper.find('textarea').setValue('본문 내용');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['본문 내용']);
    await wrapper.setProps({ modelValue: '본문 내용' });
    expect(wrapper.find('.count-now').text()).toBe('5');
  });
});

describe('Textarea + FormField', () => {
  const mountInField = (
    fieldProps: Record<string, unknown>,
    textareaProps: Record<string, unknown> = {}
  ) =>
    mount(FormField, {
      props: { label: '본문', ...fieldProps },
      slots: { default: () => [<Textarea {...textareaProps} />] },
      attachTo: document.body,
    });

  it('label[for]·id·hint describedby가 자동 연결된다', () => {
    const wrapper = mountInField({ hint: '도움말' }, { maxlength: 100 });
    const ta = wrapper.find('textarea');
    expect(ta.attributes('id')).toBe(wrapper.find('label').attributes('for'));
    const hintId = wrapper.find('p.form-hint').attributes('id');
    const countId = wrapper.find('p.textarea-count').attributes('id');
    expect(ta.attributes('aria-describedby')).toBe(`${hintId} ${countId}`);
    wrapper.unmount();
  });

  it('status=error면 aria-invalid, .form-conts.is-error (카운트가 빨강으로 바뀌는 KRDS 셀렉터)', () => {
    const wrapper = mountInField(
      { status: 'error', message: '본문을 입력하세요' },
      { maxlength: 100 }
    );
    expect(wrapper.find('textarea').attributes('aria-invalid')).toBe('true');
    expect(
      wrapper.find('.form-conts.is-error .textarea-count .count-now').exists()
    ).toBe(true);
    wrapper.unmount();
  });

  it('required·disabled가 전달된다', () => {
    const wrapper = mountInField({ required: true, disabled: true });
    const el = wrapper.find('textarea').element as HTMLTextAreaElement;
    expect(el.required).toBe(true);
    expect(el.disabled).toBe(true);
    wrapper.unmount();
  });
});

describe('Textarea 접근성', () => {
  it.each([
    ['단독', {}],
    ['카운트', { maxlength: 100, modelValue: 'abc' }],
  ])('%s Textarea는 접근성 위반이 없다', async (_n, props) => {
    const wrapper = mount(Textarea, {
      props,
      attrs: { 'aria-label': '본문' },
      attachTo: document.body,
    });
    expect(await axe(wrapper.element)).toHaveNoViolations();
    wrapper.unmount();
  });

  it('FormField + error + 카운트 조합도 접근성 위반이 없다', async () => {
    const wrapper = mount(FormField, {
      props: {
        label: '본문',
        required: true,
        status: 'error',
        message: '본문을 입력하세요',
      },
      slots: { default: () => [<Textarea maxlength={2000} modelValue="" />] },
      attachTo: document.body,
    });
    expect(await axe(wrapper.element)).toHaveNoViolations();
    wrapper.unmount();
  });
});

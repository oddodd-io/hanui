import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { axe } from '../../test/setup';
import ContactForm from './ContactForm.vue';

describe('ContactForm', () => {
  it('모든 입력이 레이블과 연결되어야 합니다', () => {
    const wrapper = mount(ContactForm);
    const labels = wrapper.findAll('label[for]');
    expect(labels).toHaveLength(4);
    labels.forEach((l) => {
      const id = l.attributes('for')!;
      expect(wrapper.element.querySelector(`[id="${id}"]`)).not.toBeNull();
    });
  });

  it('폼이 여러 개여도 id가 겹치지 않아야 합니다', () => {
    const Two = { render: () => h('div', [h(ContactForm), h(ContactForm)]) };
    const wrapper = mount(Two);
    const fors = wrapper.findAll('label[for]').map((l) => l.attributes('for'));
    expect(new Set(fors).size).toBe(fors.length);
  });

  it('필수 항목이 비면 제출할 수 없어야 합니다', async () => {
    const wrapper = mount(ContactForm);
    expect(
      wrapper.get('button[type="submit"]').attributes('disabled')
    ).toBeDefined();
  });

  it('모두 채우면 제출값을 emit해야 합니다', async () => {
    const wrapper = mount(ContactForm);
    const inputs = wrapper.findAll('input');
    await inputs[0].setValue('홍길동');
    await inputs[1].setValue('hong@example.com');
    await inputs[2].setValue('문의합니다');
    await wrapper.get('textarea').setValue('내용입니다');
    await wrapper.get('form').trigger('submit');

    expect(wrapper.emitted('submit')?.[0]?.[0]).toEqual({
      name: '홍길동',
      email: 'hong@example.com',
      subject: '문의합니다',
      message: '내용입니다',
    });
  });

  it('autocomplete 힌트가 있어야 합니다', () => {
    const wrapper = mount(ContactForm);
    const inputs = wrapper.findAll('input');
    expect(inputs[0].attributes('autocomplete')).toBe('name');
    expect(inputs[1].attributes('autocomplete')).toBe('email');
  });

  it('접근성 위반이 없어야 합니다', async () => {
    const wrapper = mount(ContactForm);
    const results = await axe(wrapper.element);
    expect(results).toHaveNoViolations();
  });
});

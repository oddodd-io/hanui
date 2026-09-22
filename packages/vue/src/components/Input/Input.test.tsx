import { describe, it, expect } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { axe } from '../../test/setup';
import Input from './Input.vue';
import FormField from '../FormField/FormField.vue';

describe('Input 구조 (KRDS text_input.html 기준)', () => {
  it('기본은 input.krds-input.large, type=text', () => {
    const wrapper = mount(Input, { attrs: { 'aria-label': '이름' } });
    const el = wrapper.find('input').element as HTMLInputElement;
    expect(el.classList.contains('krds-input')).toBe(true);
    expect(el.classList.contains('large')).toBe(true);
    expect(el.type).toBe('text');
  });

  it.each(['small', 'medium', 'large', 'xlarge'] as const)(
    'size=%s 클래스가 붙는다',
    (size) => {
      const wrapper = mount(Input, {
        props: { size },
        attrs: { 'aria-label': '이름' },
      });
      expect(wrapper.find('input').classes()).toContain(size);
    }
  );

  it('placeholder·name·readonly·disabled·required가 input에 반영된다', () => {
    const wrapper = mount(Input, {
      props: {
        placeholder: '플레이스홀더',
        name: 'title',
        readonly: true,
        disabled: true,
        required: true,
      },
      attrs: { 'aria-label': '제목' },
    });
    const el = wrapper.find('input').element as HTMLInputElement;
    expect(el.placeholder).toBe('플레이스홀더');
    expect(el.name).toBe('title');
    expect(el.readOnly).toBe(true);
    expect(el.disabled).toBe(true);
    expect(el.required).toBe(true);
  });

  it('추가 속성(aria-label, maxlength 등)은 input으로 전달된다', () => {
    const wrapper = mount(Input, {
      attrs: { 'aria-label': '제목', maxlength: '200' },
    });
    expect(wrapper.find('input').attributes('maxlength')).toBe('200');
  });
});

describe('Input v-model', () => {
  it('입력하면 update:modelValue를 emit한다', async () => {
    const wrapper = mount(Input, {
      props: { modelValue: '' },
      attrs: { 'aria-label': '이름' },
    });
    await wrapper.find('input').setValue('홍길동');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['홍길동']);
  });

  it('modelValue가 바뀌면 값이 반영된다', async () => {
    const wrapper = mount(Input, {
      props: { modelValue: 'a' },
      attrs: { 'aria-label': '이름' },
    });
    await wrapper.setProps({ modelValue: 'b' });
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('b');
  });
});

describe('Input 아이콘 버튼 (text_input_icon.html 기준)', () => {
  // setIconWrap이 자식 setup에서 호출되므로 부모 DOM 반영은 다음 tick이다
  const mountInField = async (inputProps: Record<string, unknown>) => {
    const wrapper = mount(FormField, {
      props: { label: '레이블' },
      slots: { default: () => [<Input {...inputProps} />] },
      attachTo: document.body,
    });
    await nextTick();
    return wrapper;
  };

  it('passwordToggle: 보기 버튼을 누르면 type이 text로 바뀌고 이름·아이콘이 바뀐다', async () => {
    const wrapper = await mountInField({
      type: 'password',
      passwordToggle: true,
      modelValue: '1234',
    });
    expect(wrapper.find('.form-conts').classes()).toContain('btn-ico-wrap');
    const btn = wrapper.find('button.krds-btn.icon');
    expect(btn.find('.sr-only').text()).toBe('입력한 비밀번호 보기');
    expect(btn.find('i').classes()).toContain('ico-pw-visible');
    expect(btn.attributes('aria-pressed')).toBe('false');

    await btn.trigger('click');
    expect((wrapper.find('input').element as HTMLInputElement).type).toBe(
      'text'
    );
    expect(btn.find('.sr-only').text()).toBe('입력한 비밀번호 가리기');
    expect(btn.find('i').classes()).toContain('ico-pw-visible-on');
    expect(btn.attributes('aria-pressed')).toBe('true');
    wrapper.unmount();
  });

  it('clearable: 값이 없으면 삭제 버튼이 숨겨진다', async () => {
    const wrapper = await mountInField({ clearable: true, modelValue: '' });
    expect(wrapper.find('.form-conts').attributes('data-delete')).toBe('true');
    expect(wrapper.find('button.btn-delete-input').isVisible()).toBe(false);
    wrapper.unmount();
  });

  it('clearable: 값이 있으면 삭제 버튼이 보이고, 누르면 값을 비우고 초점을 되돌린다', async () => {
    const wrapper = await mountInField({ clearable: true, modelValue: '내용' });
    const btn = wrapper.find('button.btn-delete-input');
    expect(btn.isVisible()).toBe(true);
    const input = wrapper.findComponent(Input);

    await btn.trigger('click');
    expect(input.emitted('update:modelValue')?.at(-1)).toEqual(['']);
    expect(input.emitted('clear')).toHaveLength(1);
    expect(document.activeElement).toBe(input.find('input').element);
    wrapper.unmount();
  });

  it('clearable + passwordToggle은 .btn-group으로 묶인다', async () => {
    const wrapper = await mountInField({
      type: 'password',
      clearable: true,
      passwordToggle: true,
      modelValue: 'x',
    });
    const group = wrapper.find('.form-conts > .btn-group');
    expect(group.exists()).toBe(true);
    expect(group.findAll('button')).toHaveLength(2);
    wrapper.unmount();
  });

  it('아이콘 버튼이 없으면 .btn-ico-wrap이 붙지 않는다', async () => {
    const wrapper = await mountInField({});
    expect(wrapper.find('.form-conts').classes()).not.toContain('btn-ico-wrap');
    wrapper.unmount();
  });
});

describe('Input 접근성', () => {
  it('aria-label만 있는 단독 Input은 접근성 위반이 없다', async () => {
    const wrapper = mount(Input, {
      attrs: { 'aria-label': '검색어' },
      attachTo: document.body,
    });
    expect(await axe(wrapper.element)).toHaveNoViolations();
    wrapper.unmount();
  });

  it('비밀번호 보기 버튼이 있는 FormField는 접근성 위반이 없다', async () => {
    const wrapper = mount(FormField, {
      props: { label: '비밀번호' },
      slots: {
        default: () => [
          <Input type="password" passwordToggle clearable modelValue="1234" />,
        ],
      },
      attachTo: document.body,
    });
    expect(await axe(wrapper.element)).toHaveNoViolations();
    wrapper.unmount();
  });
});

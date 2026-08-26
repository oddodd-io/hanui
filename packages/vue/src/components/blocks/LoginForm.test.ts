import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { axe } from '../../test/setup';
import LoginForm from './LoginForm.vue';

describe('LoginForm', () => {
  it('제목과 설명이 렌더링되어야 합니다', () => {
    const wrapper = mount(LoginForm);
    expect(wrapper.text()).toContain('로그인');
    expect(wrapper.text()).toContain('계정에 로그인하여');
  });

  it('입력이 레이블과 연결되어야 합니다', () => {
    const wrapper = mount(LoginForm);
    const labels = wrapper.findAll('label[for]');
    expect(labels.length).toBeGreaterThanOrEqual(2);
    labels.forEach((label) => {
      const id = label.attributes('for')!;
      // mount는 document에 붙지 않으므로 wrapper 안에서 속성 선택자로 찾는다
      expect(wrapper.element.querySelector(`[id="${id}"]`)).not.toBeNull();
    });
  });

  it('폼이 여러 개여도 id가 겹치지 않아야 합니다', () => {
    // id가 하드코딩되면 두 번째 폼의 label이 첫 번째 입력을 가리킨다.
    // useId는 앱 단위로 채번하므로 같은 앱 안에 둘 다 있어야 의미가 있다.
    const Two = { render: () => h('div', [h(LoginForm), h(LoginForm)]) };
    const wrapper = mount(Two);

    const ids = wrapper
      .findAll('input[type="text"]')
      .map((el) => el.attributes('id'));
    expect(ids).toHaveLength(2);
    expect(ids.every(Boolean)).toBe(true);
    expect(new Set(ids).size).toBe(2);

    const fors = wrapper
      .findAll('label[for]')
      .map((el) => el.attributes('for'));
    expect(new Set(fors).size).toBe(fors.length);
  });

  it('아이디·비밀번호가 비어 있으면 제출할 수 없어야 합니다', async () => {
    const wrapper = mount(LoginForm);
    const submit = wrapper.get('button[type="submit"]');
    expect(submit.attributes('disabled')).toBeDefined();

    await wrapper.get('input[type="text"]').setValue('hong');
    expect(submit.attributes('disabled')).toBeDefined();

    await wrapper.get('input[type="password"]').setValue('pw');
    expect(submit.attributes('disabled')).toBeUndefined();
  });

  it('제출 시 입력값을 emit해야 합니다', async () => {
    const wrapper = mount(LoginForm);
    await wrapper.get('input[type="text"]').setValue('hong');
    await wrapper.get('input[type="password"]').setValue('pw1234');
    await wrapper.get('form').trigger('submit');

    expect(wrapper.emitted('submit')?.[0]?.[0]).toEqual({
      username: 'hong',
      password: 'pw1234',
      rememberMe: false,
      autoLogin: false,
    });
  });

  it('체크박스 상태가 제출값에 반영되어야 합니다', async () => {
    const wrapper = mount(LoginForm);
    await wrapper.get('input[type="text"]').setValue('hong');
    await wrapper.get('input[type="password"]').setValue('pw');

    await wrapper
      .get('[aria-label="아이디 저장"], [role="checkbox"]')
      .trigger('click');
    await wrapper.get('form').trigger('submit');

    expect(wrapper.emitted('submit')?.[0]?.[0]).toMatchObject({
      rememberMe: true,
    });
  });

  it('autocomplete 힌트가 있어야 합니다', () => {
    const wrapper = mount(LoginForm);
    expect(wrapper.get('input[type="text"]').attributes('autocomplete')).toBe(
      'username'
    );
    expect(
      wrapper.get('input[type="password"]').attributes('autocomplete')
    ).toBe('current-password');
  });

  it('링크를 숨길 수 있어야 합니다', () => {
    const wrapper = mount(LoginForm, {
      props: { showForgotPassword: false, showSignupLink: false },
    });
    expect(wrapper.findAll('a')).toHaveLength(0);
  });

  it('구분자는 보조기기에 노출되지 않아야 합니다', () => {
    const wrapper = mount(LoginForm);
    const sep = wrapper
      .findAll('[aria-hidden="true"]')
      .find((el) => el.text() === '|');
    expect(sep).toBeDefined();
  });

  it('접근성 위반이 없어야 합니다', async () => {
    const wrapper = mount(LoginForm);
    const results = await axe(wrapper.element);
    expect(results).toHaveNoViolations();
  });
});

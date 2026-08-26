import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { axe } from '../../test/setup';
import AccountRecovery from './AccountRecovery.vue';

describe('AccountRecovery', () => {
  it('두 개의 탭을 제공해야 합니다', () => {
    const wrapper = mount(AccountRecovery);
    expect(wrapper.findAll('[role="tab"]').map((t) => t.text())).toEqual([
      '아이디 찾기',
      '비밀번호 찾기',
    ]);
  });

  it('입력이 레이블과 연결되어야 합니다', () => {
    const wrapper = mount(AccountRecovery);
    wrapper.findAll('label[for]').forEach((l) => {
      const id = l.attributes('for')!;
      expect(wrapper.element.querySelector(`[id="${id}"]`)).not.toBeNull();
    });
  });

  it('휴대폰 번호에 하이픈을 자동으로 넣어야 합니다', async () => {
    const wrapper = mount(AccountRecovery);
    const phone = wrapper.get('input[type="tel"]');

    await phone.setValue('01012345678');
    expect((phone.element as HTMLInputElement).value).toBe('010-1234-5678');
  });

  it('숫자가 아닌 입력은 걸러야 합니다', async () => {
    const wrapper = mount(AccountRecovery);
    const phone = wrapper.get('input[type="tel"]');

    await phone.setValue('010abc1234');
    expect((phone.element as HTMLInputElement).value).toBe('010-1234');
  });

  it('번호가 완성되기 전에는 제출할 수 없어야 합니다', async () => {
    const wrapper = mount(AccountRecovery);
    const submit = wrapper.get('button[type="submit"]');

    await wrapper.get('input[type="text"]').setValue('홍길동');
    expect(submit.attributes('disabled')).toBeDefined();

    await wrapper.get('input[type="tel"]').setValue('01012345678');
    expect(submit.attributes('disabled')).toBeUndefined();
  });

  it('아이디 찾기 제출값을 emit해야 합니다', async () => {
    const wrapper = mount(AccountRecovery);
    await wrapper.get('input[type="text"]').setValue('홍길동');
    await wrapper.get('input[type="tel"]').setValue('01012345678');
    await wrapper.get('form').trigger('submit');

    expect(wrapper.emitted('findId')?.[0]?.[0]).toEqual({
      name: '홍길동',
      phone: '010-1234-5678',
    });
  });

  it('비밀번호 찾기 탭에서 이메일을 emit해야 합니다', async () => {
    const wrapper = mount(AccountRecovery, {
      props: { defaultTab: 'reset-password' },
    });
    await wrapper.get('input[type="email"]').setValue('hong@example.com');
    await wrapper.get('form').trigger('submit');

    expect(wrapper.emitted('resetPassword')?.[0]?.[0]).toEqual({
      email: 'hong@example.com',
    });
  });

  it('접근성 위반이 없어야 합니다', async () => {
    const wrapper = mount(AccountRecovery);
    const results = await axe(wrapper.element);
    expect(results).toHaveNoViolations();
  });
});

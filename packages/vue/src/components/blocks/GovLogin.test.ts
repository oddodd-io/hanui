import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { axe } from '../../test/setup';
import GovLogin from './GovLogin.vue';

describe('GovLogin', () => {
  it('세 가지 로그인 방식을 탭으로 제공해야 합니다', () => {
    const wrapper = mount(GovLogin);
    const tabs = wrapper.findAll('[role="tab"]');
    expect(tabs.map((t) => t.text())).toEqual([
      '아이디 로그인',
      '간편인증',
      '공동인증서',
    ]);
  });

  it('입력이 레이블과 연결되어야 합니다', () => {
    const wrapper = mount(GovLogin);
    const labels = wrapper.findAll('label[for]');
    expect(labels.length).toBeGreaterThanOrEqual(2);
    labels.forEach((l) => {
      const id = l.attributes('for')!;
      expect(wrapper.element.querySelector(`[id="${id}"]`)).not.toBeNull();
    });
  });

  it('아이디 로그인 제출값을 emit해야 합니다', async () => {
    const wrapper = mount(GovLogin);
    await wrapper.get('input[type="text"]').setValue('hong');
    await wrapper.get('input[type="password"]').setValue('pw');
    await wrapper.get('form').trigger('submit');

    expect(wrapper.emitted('login')?.[0]?.[0]).toMatchObject({
      username: 'hong',
      password: 'pw',
    });
  });

  it('간편인증 탭에서 방법을 선택하면 emit해야 합니다', async () => {
    const wrapper = mount(GovLogin);
    await wrapper.findAll('[role="tab"]')[1].trigger('click');

    const kakao = wrapper
      .findAll('button')
      .find((b) => b.text() === '카카오톡')!;
    await kakao.trigger('click');
    expect(wrapper.emitted('simpleAuth')?.[0]).toEqual(['kakao']);
  });

  it('공동인증서 탭에서 emit해야 합니다', async () => {
    const wrapper = mount(GovLogin);
    await wrapper.findAll('[role="tab"]')[2].trigger('click');

    const btn = wrapper
      .findAll('button')
      .find((b) => b.text() === '공동인증서 로그인')!;
    await btn.trigger('click');
    expect(wrapper.emitted('certAuth')).toHaveLength(1);
  });

  it('간편인증 방법을 바꿀 수 있어야 합니다', async () => {
    const wrapper = mount(GovLogin, {
      props: { simpleAuthMethods: [{ id: 'toss', label: '토스' }] },
    });
    await wrapper.findAll('[role="tab"]')[1].trigger('click');
    expect(wrapper.text()).toContain('토스');
  });

  it('접근성 위반이 없어야 합니다', async () => {
    const wrapper = mount(GovLogin);
    const results = await axe(wrapper.element);
    expect(results).toHaveNoViolations();
  });
});

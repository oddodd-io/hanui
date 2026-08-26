import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { axe } from '../../test/setup';
import SignupForm from './SignupForm.vue';

/** default variant 폼을 끝까지 채운다 */
const fill = async (wrapper: ReturnType<typeof mount>) => {
  const inputs = wrapper.findAll('input');
  await inputs[0].setValue('홍길동');
  await inputs[1].setValue('hong@example.com');
  await inputs[2].setValue('Passw0rd!123');
  await inputs[3].setValue('Passw0rd!123');
  const boxes = wrapper.findAll('[role="checkbox"]');
  await boxes[1].trigger('click');
  await boxes[2].trigger('click');
};

describe('SignupForm', () => {
  it('제목과 설명이 렌더링되어야 합니다', () => {
    const wrapper = mount(SignupForm);
    expect(wrapper.text()).toContain('회원가입');
  });

  it('모든 입력이 레이블과 연결되어야 합니다', () => {
    const wrapper = mount(SignupForm);
    const labels = wrapper.findAll('label[for]');
    expect(labels.length).toBeGreaterThanOrEqual(4);
    labels.forEach((l) => {
      const id = l.attributes('for')!;
      expect(wrapper.element.querySelector(`[id="${id}"]`)).not.toBeNull();
    });
  });

  it('폼이 여러 개여도 id가 겹치지 않아야 합니다', () => {
    const Two = { render: () => h('div', [h(SignupForm), h(SignupForm)]) };
    const wrapper = mount(Two);
    const fors = wrapper.findAll('label[for]').map((l) => l.attributes('for'));
    expect(new Set(fors).size).toBe(fors.length);
  });

  it('비밀번호를 입력하면 강도가 표시되어야 합니다', async () => {
    const wrapper = mount(SignupForm);
    expect(wrapper.find('[role="progressbar"]').exists()).toBe(false);

    await wrapper.findAll('input')[2].setValue('abc');
    expect(wrapper.get('[role="progressbar"]').attributes('aria-label')).toBe(
      '비밀번호 강도'
    );
    expect(wrapper.text()).toContain('약함');
  });

  it('강한 비밀번호는 높은 등급으로 표시되어야 합니다', async () => {
    const wrapper = mount(SignupForm);
    await wrapper.findAll('input')[2].setValue('Passw0rd!123');
    expect(wrapper.text()).toContain('매우 강함');
  });

  it('비밀번호 불일치를 alert로 알려야 합니다', async () => {
    const wrapper = mount(SignupForm);
    const inputs = wrapper.findAll('input');
    await inputs[2].setValue('Passw0rd!123');
    await inputs[3].setValue('different');

    expect(wrapper.get('[role="alert"]').text()).toBe(
      '비밀번호가 일치하지 않습니다'
    );
  });

  it('모두 동의 체크가 개별 항목에 반영되어야 합니다', async () => {
    const wrapper = mount(SignupForm);
    const boxes = wrapper.findAll('[role="checkbox"]');
    await boxes[0].trigger('click');

    expect(boxes[1].attributes('aria-checked')).toBe('true');
    expect(boxes[2].attributes('aria-checked')).toBe('true');
  });

  it('약관 링크를 눌러도 체크가 토글되지 않아야 합니다', async () => {
    // 레이블 안의 링크 클릭까지 토글로 삼으면 약관을 볼 수 없다
    const wrapper = mount(SignupForm);
    const link = wrapper.findAll('a').find((a) => a.text() === '이용약관')!;
    await link.trigger('click');

    const boxes = wrapper.findAll('[role="checkbox"]');
    expect(boxes[1].attributes('aria-checked')).toBe('false');
  });

  it('필수 항목을 다 채우기 전에는 제출할 수 없어야 합니다', () => {
    const wrapper = mount(SignupForm);
    expect(
      wrapper.get('button[type="submit"]').attributes('disabled')
    ).toBeDefined();
  });

  it('다 채우면 제출값을 emit해야 합니다', async () => {
    const wrapper = mount(SignupForm);
    await fill(wrapper);
    await wrapper.get('form').trigger('submit');

    expect(wrapper.emitted('submit')?.[0]?.[0]).toEqual({
      name: '홍길동',
      email: 'hong@example.com',
      password: 'Passw0rd!123',
      passwordConfirm: 'Passw0rd!123',
      agreeTerms: true,
      agreePrivacy: true,
    });
  });

  it('SNS 가입 버튼이 제공자를 emit해야 합니다', async () => {
    const wrapper = mount(SignupForm, {
      props: { showSnsLogin: true, snsProviders: ['kakao'] },
    });
    const btn = wrapper
      .findAll('button')
      .find((b) => b.text().includes('카카오로 시작하기'))!;
    await btn.trigger('click');

    expect(wrapper.emitted('snsLogin')?.[0]).toEqual(['kakao']);
  });

  it('SNS 브랜드 마크는 보조기기에 노출되지 않아야 합니다', () => {
    const wrapper = mount(SignupForm, {
      props: { showSnsLogin: true, snsProviders: ['kakao', 'naver'] },
    });
    wrapper.findAll('svg').forEach((svg) => {
      expect(svg.attributes('aria-hidden')).toBe('true');
    });
  });

  it('stepped variant는 3단계로 진행되어야 합니다', async () => {
    const wrapper = mount(SignupForm, { props: { variant: 'stepped' } });
    expect(wrapper.text()).toContain('기본 정보');

    await wrapper.findAll('input')[0].setValue('홍길동');
    await wrapper.findAll('input')[1].setValue('hong@example.com');
    await wrapper.get('form').trigger('submit');

    // 2단계: 비밀번호
    expect(wrapper.find('[role="progressbar"]').exists()).toBe(false);
    const pw = wrapper.findAll('input');
    await pw[0].setValue('Passw0rd!123');
    await pw[1].setValue('Passw0rd!123');
    await wrapper.get('form').trigger('submit');

    // 3단계: 약관
    expect(wrapper.text()).toContain('모두 동의합니다');
  });

  it('stepped variant에서 이전으로 돌아갈 수 있어야 합니다', async () => {
    const wrapper = mount(SignupForm, { props: { variant: 'stepped' } });
    await wrapper.findAll('input')[0].setValue('홍길동');
    await wrapper.findAll('input')[1].setValue('hong@example.com');
    await wrapper.get('form').trigger('submit');

    const prev = wrapper.findAll('button').find((b) => b.text() === '이전')!;
    await prev.trigger('click');
    expect(wrapper.findAll('label').some((l) => l.text() === '이름')).toBe(
      true
    );
  });

  it('접근성 위반이 없어야 합니다', async () => {
    const wrapper = mount(SignupForm, { props: { showSnsLogin: true } });
    const results = await axe(wrapper.element);
    expect(results).toHaveNoViolations();
  });

  it('stepped variant도 접근성 위반이 없어야 합니다', async () => {
    const wrapper = mount(SignupForm, { props: { variant: 'stepped' } });
    const results = await axe(wrapper.element);
    expect(results).toHaveNoViolations();
  });
});

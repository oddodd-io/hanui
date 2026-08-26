import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { axe } from '../../test/setup';
import ErrorPage from './ErrorPage.vue';

describe('ErrorPage', () => {
  it('code에 맞는 기본 문구가 나와야 합니다', () => {
    const wrapper = mount(ErrorPage, { props: { code: '404' } });
    expect(wrapper.text()).toContain('페이지를 찾을 수 없습니다');
  });

  it.each([
    ['500', '서버 오류가 발생했습니다'],
    ['403', '접근 권한이 없습니다'],
  ])('code=%s일 때 %s가 나와야 합니다', (code, title) => {
    const wrapper = mount(ErrorPage, { props: { code } });
    expect(wrapper.text()).toContain(title);
  });

  it('알 수 없는 code는 404 문구로 대체돼야 합니다', () => {
    const wrapper = mount(ErrorPage, { props: { code: '418' } });
    expect(wrapper.text()).toContain('418');
    expect(wrapper.text()).toContain('페이지를 찾을 수 없습니다');
  });

  it('title/description을 직접 지정할 수 있어야 합니다', () => {
    const wrapper = mount(ErrorPage, {
      props: { title: '점검 중', description: '잠시 후 이용해주세요' },
    });
    expect(wrapper.text()).toContain('점검 중');
    expect(wrapper.text()).toContain('잠시 후 이용해주세요');
  });

  it('제목이 h1이어야 합니다', () => {
    const wrapper = mount(ErrorPage);
    expect(wrapper.get('h1').text()).toBe('페이지를 찾을 수 없습니다');
  });

  it('버튼 클릭 시 각각 emit해야 합니다', async () => {
    const wrapper = mount(ErrorPage);
    const buttons = wrapper.findAll('button');

    await buttons[0].trigger('click');
    expect(wrapper.emitted('goHome')).toHaveLength(1);

    await buttons[1].trigger('click');
    expect(wrapper.emitted('goBack')).toHaveLength(1);
  });

  it('버튼을 숨길 수 있어야 합니다', () => {
    const wrapper = mount(ErrorPage, {
      props: { showHome: false, showBack: false },
    });
    expect(wrapper.findAll('button')).toHaveLength(0);
  });

  it('접근성 위반이 없어야 합니다', async () => {
    const wrapper = mount(ErrorPage);
    const results = await axe(wrapper.element);
    expect(results).toHaveNoViolations();
  });
});

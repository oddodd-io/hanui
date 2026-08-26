import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { axe } from '../../test/setup';
import ProfileCard from './ProfileCard.vue';

describe('ProfileCard', () => {
  it('이름이 제목으로 렌더링되어야 합니다', () => {
    const wrapper = mount(ProfileCard, { props: { name: '홍길동' } });
    expect(wrapper.get('h3').text()).toBe('홍길동');
  });

  it('이니셜을 이름에서 만들어야 합니다', () => {
    const wrapper = mount(ProfileCard, { props: { name: '홍길동' } });
    expect(wrapper.text()).toContain('홍길');
  });

  it('이니셜은 장식이므로 보조기기에 노출되지 않아야 합니다', () => {
    // 이름이 h3로 이미 읽히므로 이니셜을 또 읽을 필요가 없다
    const wrapper = mount(ProfileCard, { props: { name: '홍길동' } });
    const initials = wrapper.findAll('[aria-hidden="true"]');
    expect(initials.some((el) => el.text() === '홍길')).toBe(true);
  });

  it('아바타 이미지에 대체 텍스트가 있어야 합니다', () => {
    const wrapper = mount(ProfileCard, {
      props: { name: '홍길동', avatarUrl: '/avatar.png' },
    });
    expect(wrapper.get('img').attributes('alt')).toBe('홍길동 프로필 이미지');
  });

  it('연락처가 이름-값 쌍으로 표현되어야 합니다', () => {
    const wrapper = mount(ProfileCard, {
      props: {
        name: '홍길동',
        email: 'hong@example.com',
        phone: '02-000-0000',
      },
    });
    const dts = wrapper.findAll('dt').map((el) => el.text());
    const dds = wrapper.findAll('dd').map((el) => el.text());
    expect(dts).toEqual(['이메일', '연락처']);
    expect(dds).toEqual(['hong@example.com', '02-000-0000']);
  });

  it('연락처가 없으면 목록이 없어야 합니다', () => {
    const wrapper = mount(ProfileCard, { props: { name: '홍길동' } });
    expect(wrapper.find('dl').exists()).toBe(false);
  });

  it('editable일 때만 편집 버튼이 나오고 edit을 emit해야 합니다', async () => {
    const wrapper = mount(ProfileCard, {
      props: { name: '홍길동', editable: true },
    });
    await wrapper.get('button').trigger('click');
    expect(wrapper.emitted('edit')).toHaveLength(1);
  });

  it('editable이 아니면 버튼이 없어야 합니다', () => {
    const wrapper = mount(ProfileCard, { props: { name: '홍길동' } });
    expect(wrapper.findAll('button')).toHaveLength(0);
  });

  it('접근성 위반이 없어야 합니다', async () => {
    const wrapper = mount(ProfileCard, {
      props: {
        name: '홍길동',
        role: '주무관',
        department: '정보화담당관',
        email: 'hong@example.com',
        phone: '02-000-0000',
        badgeText: '관리자',
        editable: true,
      },
    });
    const results = await axe(wrapper.element);
    expect(results).toHaveNoViolations();
  });
});

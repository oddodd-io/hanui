import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { axe } from '../../test/setup';
import EmptyState from './EmptyState.vue';

describe('EmptyState', () => {
  it('기본 문구가 렌더링되어야 합니다', () => {
    const wrapper = mount(EmptyState);
    expect(wrapper.text()).toContain('데이터가 없습니다');
  });

  it('제목과 설명을 바꿀 수 있어야 합니다', () => {
    const wrapper = mount(EmptyState, {
      props: {
        title: '검색 결과 없음',
        description: '다른 검색어를 시도해보세요',
      },
    });
    expect(wrapper.text()).toContain('검색 결과 없음');
    expect(wrapper.text()).toContain('다른 검색어를 시도해보세요');
  });

  it('액션이 없으면 버튼이 렌더링되지 않아야 합니다', () => {
    const wrapper = mount(EmptyState);
    expect(wrapper.findAll('button')).toHaveLength(0);
  });

  it('actionLabel을 주면 버튼이 나오고 클릭 시 action을 emit해야 합니다', async () => {
    const wrapper = mount(EmptyState, {
      props: { actionLabel: '새로 만들기' },
    });
    const btn = wrapper.get('button');
    expect(btn.text()).toBe('새로 만들기');

    await btn.trigger('click');
    expect(wrapper.emitted('action')).toHaveLength(1);
  });

  it('보조 액션도 동작해야 합니다', async () => {
    const wrapper = mount(EmptyState, {
      props: { actionLabel: '만들기', secondaryActionLabel: '가져오기' },
    });
    const buttons = wrapper.findAll('button');
    expect(buttons).toHaveLength(2);

    await buttons[1].trigger('click');
    expect(wrapper.emitted('secondaryAction')).toHaveLength(1);
  });

  it('기본 아이콘은 보조기기에 노출되지 않아야 합니다', () => {
    const wrapper = mount(EmptyState);
    expect(wrapper.get('svg').attributes('aria-hidden')).toBe('true');
  });

  it('icon 슬롯으로 아이콘을 교체할 수 있어야 합니다', () => {
    const wrapper = mount(EmptyState, {
      slots: { icon: '<span data-test="custom">아이콘</span>' },
    });
    expect(wrapper.find('[data-test="custom"]').exists()).toBe(true);
    expect(wrapper.find('svg').exists()).toBe(false);
  });

  it('접근성 위반이 없어야 합니다', async () => {
    const wrapper = mount(EmptyState, {
      props: { actionLabel: '새로 만들기', secondaryActionLabel: '가져오기' },
    });
    const results = await axe(wrapper.element);
    expect(results).toHaveNoViolations();
  });
});

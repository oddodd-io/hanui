import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { axe } from '../../test/setup';
import StatsCard from './StatsCard.vue';
import type { StatItem } from './StatsCard.vue';

const ITEMS: StatItem[] = [
  { label: '총 사용자', value: '12,345', change: 12.5 },
  { label: '신규 가입', value: 234, change: -2.1 },
  { label: '조회수', value: '1.2M' },
];

describe('StatsCard', () => {
  it('항목이 렌더링되어야 합니다', () => {
    const wrapper = mount(StatsCard, { props: { items: ITEMS } });
    expect(wrapper.text()).toContain('총 사용자');
    expect(wrapper.text()).toContain('12,345');
  });

  it('items를 주지 않으면 기본 예시가 나와야 합니다', () => {
    const wrapper = mount(StatsCard);
    expect(wrapper.text()).toContain('총 사용자');
  });

  it('변화율 방향이 텍스트로도 전달되어야 합니다', () => {
    // 화살표(↑↓)와 색상만으로는 정보를 전달할 수 없다 (WCAG 1.4.1)
    const wrapper = mount(StatsCard, { props: { items: ITEMS } });
    expect(wrapper.text()).toContain('증가 12.5%');
    expect(wrapper.text()).toContain('감소 2.1%');
  });

  it('화살표 기호는 보조기기에 노출되지 않아야 합니다', () => {
    const wrapper = mount(StatsCard, { props: { items: ITEMS } });
    const arrows = wrapper.findAll('[aria-hidden="true"]');
    expect(arrows.some((el) => el.text().includes('↑'))).toBe(true);
  });

  it('change가 없으면 뱃지가 없어야 합니다', () => {
    const wrapper = mount(StatsCard, {
      props: { items: [{ label: '조회수', value: '1.2M' }] },
    });
    expect(wrapper.text()).not.toContain('증가');
    expect(wrapper.text()).not.toContain('감소');
  });

  it('columns에 따라 그리드 클래스가 바뀌어야 합니다', () => {
    const wrapper = mount(StatsCard, { props: { items: ITEMS, columns: 2 } });
    expect(wrapper.classes().join(' ')).toContain('sm:grid-cols-2');
  });

  it('접근성 위반이 없어야 합니다', async () => {
    const wrapper = mount(StatsCard, { props: { items: ITEMS } });
    const results = await axe(wrapper.element);
    expect(results).toHaveNoViolations();
  });
});

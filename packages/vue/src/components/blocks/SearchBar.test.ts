import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { axe } from '../../test/setup';
import SearchBar from './SearchBar.vue';

describe('SearchBar', () => {
  it('search 랜드마크여야 합니다', () => {
    const wrapper = mount(SearchBar);
    expect(wrapper.element.getAttribute('role')).toBe('search');
  });

  it('검색어 입력에 접근명이 있어야 합니다', () => {
    // placeholder는 레이블이 아니다 (WCAG 1.3.1)
    const wrapper = mount(SearchBar);
    expect(wrapper.get('input[type="text"]').attributes('aria-label')).toBe(
      '검색어'
    );
  });

  it('카테고리 선택에 접근명이 있어야 합니다', () => {
    const wrapper = mount(SearchBar);
    const trigger = wrapper.get('[aria-haspopup="listbox"]');
    expect(trigger.attributes('aria-label')).toBe('검색 범위');
  });

  it('제출 시 입력값과 함께 search를 emit해야 합니다', async () => {
    const wrapper = mount(SearchBar);
    await wrapper.get('input[type="text"]').setValue('공지사항');
    await wrapper.get('form').trigger('submit');

    expect(wrapper.emitted('search')?.[0]).toEqual([
      { query: '공지사항', category: 'all' },
    ]);
  });

  it('showCategory=false면 선택이 없어야 합니다', () => {
    const wrapper = mount(SearchBar, { props: { showCategory: false } });
    expect(wrapper.find('[aria-haspopup="listbox"]').exists()).toBe(false);
  });

  it('카테고리를 직접 지정할 수 있어야 합니다', async () => {
    const wrapper = mount(SearchBar, {
      props: { categories: [{ label: '부서', value: 'dept' }] },
    });
    await wrapper.get('form').trigger('submit');
    expect(wrapper.emitted('search')?.[0]?.[0]).toMatchObject({
      category: 'dept',
    });
  });

  it('접근성 위반이 없어야 합니다', async () => {
    const wrapper = mount(SearchBar);
    const results = await axe(wrapper.element);
    expect(results).toHaveNoViolations();
  });
});

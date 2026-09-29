import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, ref, nextTick } from 'vue';
import { axe } from '../../test/setup';
import Pagination from './Pagination.vue';

/** v-model로 연결한 상위 컴포넌트를 마운트한다 */
const mountWithModel = (
  initial: number,
  totalPages: number,
  options: { attachTo?: HTMLElement } = {}
) =>
  mount(
    defineComponent({
      components: { Pagination },
      setup: () => ({ page: ref(initial), totalPages }),
      template:
        '<Pagination v-model="page" :total-pages="totalPages" /><p id="out">{{ page }}</p>',
    }),
    options
  );

/** 렌더된 페이지 목록을 숫자 / '…' 배열로 */
const pageLabels = (wrapper: ReturnType<typeof mount>) =>
  wrapper
    .findAll('.page-links .page-link')
    .map((el) =>
      el.classes().includes('link-dot')
        ? '…'
        : el.text().replace('현재페이지', '').trim()
    );

describe('Pagination 구조 (KRDS pagination.html 기준)', () => {
  it('nav.krds-pagination > 이전 · .page-links · 다음 구조로 렌더한다', () => {
    const wrapper = mount(Pagination, {
      props: { totalPages: 5, modelValue: 3 },
    });
    const nav = wrapper.element as HTMLElement;
    expect(nav.tagName).toBe('NAV');
    expect(nav.className).toBe('krds-pagination');
    expect(nav.getAttribute('aria-label')).toBe('페이지 네비게이션');
    const children = [...nav.children].map((el) => el.className);
    expect(children).toEqual([
      'page-navi prev',
      'page-links',
      'page-navi next',
    ]);
  });

  it('현재 페이지는 .active이고 sr-only "현재페이지 " 텍스트를 가진다', () => {
    const wrapper = mount(Pagination, {
      props: { totalPages: 5, modelValue: 3 },
    });
    const active = wrapper.findAll('.page-link.active');
    expect(active).toHaveLength(1);
    expect(active[0].find('.sr-only').text()).toBe('현재페이지');
    expect(active[0].text()).toContain('3');
  });

  it('첫 페이지면 이전은 span.page-navi.prev.disabled (포커스 불가)', () => {
    const wrapper = mount(Pagination, {
      props: { totalPages: 5, modelValue: 1 },
    });
    const prev = wrapper.find('.page-navi.prev');
    expect(prev.element.tagName).toBe('SPAN');
    expect(prev.classes()).toContain('disabled');
    expect(wrapper.find('.page-navi.next').element.tagName).toBe('BUTTON');
  });

  it('마지막 페이지면 다음은 span.page-navi.next.disabled', () => {
    const wrapper = mount(Pagination, {
      props: { totalPages: 5, modelValue: 5 },
    });
    const next = wrapper.find('.page-navi.next');
    expect(next.element.tagName).toBe('SPAN');
    expect(next.classes()).toContain('disabled');
  });

  it('생략 기호는 span.page-link.link-dot이고 스크린리더에서 숨긴다', () => {
    const wrapper = mount(Pagination, {
      props: { totalPages: 99, modelValue: 4 },
    });
    const dot = wrapper.find('.link-dot');
    expect(dot.element.tagName).toBe('SPAN');
    expect(dot.attributes('aria-hidden')).toBe('true');
  });

  it('prevText·nextText·label을 바꿀 수 있다', () => {
    const wrapper = mount(Pagination, {
      props: {
        totalPages: 3,
        modelValue: 2,
        prevText: 'Prev',
        nextText: 'Next',
        label: '공지 목록 페이지',
      },
    });
    expect(wrapper.find('.prev').text()).toBe('Prev');
    expect(wrapper.find('.next').text()).toBe('Next');
    expect(wrapper.attributes('aria-label')).toBe('공지 목록 페이지');
  });
});

describe('Pagination 페이지 범위', () => {
  it.each([
    [1, 1, ['1']],
    [5, 3, ['1', '2', '3', '4', '5']],
    [99, 1, ['1', '2', '3', '…', '99']],
    [99, 4, ['1', '2', '3', '4', '5', '6', '…', '99']],
    [99, 50, ['1', '…', '48', '49', '50', '51', '52', '…', '99']],
    [99, 99, ['1', '…', '97', '98', '99']],
  ] as const)(
    'totalPages=%i, 현재=%i → %j',
    (totalPages, modelValue, expected) => {
      const wrapper = mount(Pagination, { props: { totalPages, modelValue } });
      expect(pageLabels(wrapper)).toEqual(expected);
    }
  );

  it('한 페이지만 빠지는 자리는 생략 기호 대신 그 페이지를 보여준다', () => {
    // 현재 5, sibling 2 → 3~7. 1과 3 사이에 2만 빠지므로 2를 보여준다
    const wrapper = mount(Pagination, {
      props: { totalPages: 10, modelValue: 5 },
    });
    expect(pageLabels(wrapper)).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '…',
      '10',
    ]);
  });

  it('siblingCount로 양옆 개수를 조절한다', () => {
    const wrapper = mount(Pagination, {
      props: { totalPages: 20, modelValue: 10, siblingCount: 1 },
    });
    expect(pageLabels(wrapper)).toEqual(['1', '…', '9', '10', '11', '…', '20']);
  });

  it('totalPages가 1 미만·NaN이면 아무것도 렌더하지 않는다', () => {
    expect(
      mount(Pagination, { props: { totalPages: 0 } })
        .find('nav')
        .exists()
    ).toBe(false);
    expect(
      mount(Pagination, { props: { totalPages: NaN } })
        .find('nav')
        .exists()
    ).toBe(false);
  });

  it('소수 totalPages는 내림한다', () => {
    const wrapper = mount(Pagination, {
      props: { totalPages: 3.7, modelValue: 1 },
    });
    expect(pageLabels(wrapper)).toEqual(['1', '2', '3']);
  });

  it('범위를 벗어난 현재 페이지는 1~totalPages로 보정해 표시한다', () => {
    const over = mount(Pagination, { props: { totalPages: 5, modelValue: 9 } });
    expect(over.find('.page-link.active').text()).toContain('5');
    const under = mount(Pagination, {
      props: { totalPages: 5, modelValue: -2 },
    });
    expect(under.find('.page-link.active').text()).toContain('1');
  });
});

describe('Pagination 버튼 모드 (v-model)', () => {
  it('페이지 버튼은 type="button"이고 누르면 update:modelValue를 보낸다', async () => {
    const wrapper = mount(Pagination, {
      props: { totalPages: 5, modelValue: 1 },
    });
    const btn = wrapper.findAll('.page-links .page-link')[2];
    expect(btn.attributes('type')).toBe('button');
    await btn.trigger('click');
    expect(wrapper.emitted('update:modelValue')).toEqual([[3]]);
  });

  it('이전·다음은 현재 ±1 페이지를 보낸다', async () => {
    const wrapper = mount(Pagination, {
      props: { totalPages: 5, modelValue: 3 },
    });
    await wrapper.find('.prev').trigger('click');
    await wrapper.find('.next').trigger('click');
    expect(wrapper.emitted('update:modelValue')).toEqual([[2], [4]]);
  });

  it('현재 페이지를 다시 누르면 보내지 않는다', async () => {
    const wrapper = mount(Pagination, {
      props: { totalPages: 5, modelValue: 3 },
    });
    await wrapper.find('.page-link.active').trigger('click');
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('v-model로 연결하면 현재 페이지가 바뀐다', async () => {
    const wrapper = mountWithModel(1, 5);
    await wrapper.findAll('.page-links .page-link')[3].trigger('click');
    expect(wrapper.find('#out').text()).toBe('4');
    expect(wrapper.find('.page-link.active').text()).toContain('4');
  });

  it('다음을 눌러 마지막 페이지에 닿아 다음 버튼이 사라지면 현재 페이지로 초점을 옮긴다', async () => {
    const wrapper = mountWithModel(4, 5, { attachTo: document.body });
    const next = wrapper.find('.next').element as HTMLButtonElement;
    next.focus();
    next.click();
    await nextTick();
    await nextTick();
    expect(wrapper.find('.next').element.tagName).toBe('SPAN');
    expect(document.activeElement).toBe(
      wrapper.find('.page-link.active').element
    );
    wrapper.unmount();
  });

  it('페이지 버튼을 누르면 같은 번호 버튼이 유지되어 초점이 남는다', async () => {
    const wrapper = mountWithModel(1, 20, { attachTo: document.body });
    const three = wrapper.findAll('.page-links .page-link')[2]
      .element as HTMLButtonElement;
    three.focus();
    three.click();
    await nextTick();
    await nextTick();
    expect(three.isConnected).toBe(true);
    expect(document.activeElement).toBe(three);
    wrapper.unmount();
  });
});

describe('Pagination 링크 모드 (getHref)', () => {
  const getHref = (page: number) => `/notice?page=${page}`;

  it('각 페이지·이전·다음을 <a href>로 렌더한다', () => {
    const wrapper = mount(Pagination, {
      props: { totalPages: 5, modelValue: 3, getHref },
    });
    const links = wrapper.findAll('.page-links .page-link');
    expect(links.every((l) => l.element.tagName === 'A')).toBe(true);
    expect(links.map((l) => l.attributes('href'))).toEqual([
      '/notice?page=1',
      '/notice?page=2',
      '/notice?page=3',
      '/notice?page=4',
      '/notice?page=5',
    ]);
    expect(links[0].attributes('type')).toBeUndefined();
    expect(wrapper.find('.prev').attributes('href')).toBe('/notice?page=2');
    expect(wrapper.find('.next').attributes('href')).toBe('/notice?page=4');
  });

  it('링크 모드에서도 비활성 이전은 href 없는 span이다', () => {
    const wrapper = mount(Pagination, {
      props: { totalPages: 5, modelValue: 1, getHref },
    });
    const prev = wrapper.find('.prev');
    expect(prev.element.tagName).toBe('SPAN');
    expect(prev.attributes('href')).toBeUndefined();
  });
});

describe('Pagination 접근성', () => {
  it.each([
    ['버튼 모드', { totalPages: 99, modelValue: 50 }],
    [
      '링크 모드',
      { totalPages: 99, modelValue: 1, getHref: (p: number) => `?page=${p}` },
    ],
    ['한 페이지', { totalPages: 1, modelValue: 1 }],
  ])('%s axe 위반이 없다', async (_, props) => {
    const wrapper = mount(Pagination, { props, attachTo: document.body });
    expect(await axe(wrapper.element)).toHaveNoViolations();
    wrapper.unmount();
  });
});

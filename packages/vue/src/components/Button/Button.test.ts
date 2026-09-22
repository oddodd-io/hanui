import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { axe } from '../../test/setup';
import Button from './Button.vue';

describe('Button 구조 (KRDS button.html 기준)', () => {
  it('기본은 <button type="button" class="krds-btn primary large">로 렌더된다', () => {
    const wrapper = mount(Button, { slots: { default: '버튼' } });
    const el = wrapper.element as HTMLButtonElement;
    expect(el.tagName).toBe('BUTTON');
    expect(el.type).toBe('button');
    expect(el.classList.contains('krds-btn')).toBe(true);
    expect(el.classList.contains('primary')).toBe(true);
    expect(el.classList.contains('large')).toBe(true);
    expect(wrapper.text()).toBe('버튼');
  });

  it('type=submit을 지정할 수 있다', () => {
    const wrapper = mount(Button, {
      props: { type: 'submit' },
      slots: { default: '제출' },
    });
    expect((wrapper.element as HTMLButtonElement).type).toBe('submit');
  });

  it('href가 있으면 <a>로 렌더되고 type 속성이 없다', () => {
    const wrapper = mount(Button, {
      props: { href: '/notice' },
      slots: { default: '공지' },
    });
    expect(wrapper.element.tagName).toBe('A');
    expect(wrapper.attributes('href')).toBe('/notice');
    expect(wrapper.attributes('type')).toBeUndefined();
  });

  it('target=_blank 링크는 rel을 자동 보강한다', () => {
    const wrapper = mount(Button, {
      props: { href: 'https://example.com', target: '_blank' },
      slots: { default: '외부' },
    });
    expect(wrapper.attributes('rel')).toBe('noopener noreferrer');
  });

  it('class·id 등 추가 속성은 루트 요소로 전달된다', () => {
    const wrapper = mount(Button, {
      attrs: { class: 'btn-help-exec', id: 'help' },
      slots: { default: '도움말' },
    });
    expect(wrapper.classes()).toContain('krds-btn');
    expect(wrapper.classes()).toContain('btn-help-exec');
    expect(wrapper.attributes('id')).toBe('help');
  });
});

describe('Button 계층(variant)·크기(size)', () => {
  it.each(['primary', 'secondary', 'tertiary', 'text', 'link'] as const)(
    'variant=%s 클래스가 붙는다',
    (variant) => {
      const wrapper = mount(Button, {
        props: { variant },
        slots: { default: '버튼' },
      });
      expect(wrapper.classes()).toContain(variant);
    }
  );

  it.each(['xsmall', 'small', 'medium', 'large', 'xlarge'] as const)(
    'size=%s 클래스가 붙는다',
    (size) => {
      const wrapper = mount(Button, {
        props: { size },
        slots: { default: '버튼' },
      });
      expect(wrapper.classes()).toContain(size);
    }
  );

  it('link 계층에서만 pure·basic 클래스가 붙는다', () => {
    const link = mount(Button, {
      props: { variant: 'link', href: '#', pure: true, basic: true },
      slots: { default: '링크' },
    });
    expect(link.classes()).toEqual(
      expect.arrayContaining(['link', 'pure', 'basic'])
    );

    const primary = mount(Button, {
      props: { pure: true, basic: true },
      slots: { default: '버튼' },
    });
    expect(primary.classes()).not.toContain('pure');
    expect(primary.classes()).not.toContain('basic');
  });
});

describe('Button 아이콘 전용 (button_icon.html 기준)', () => {
  it('icon + label은 <span class="sr-only">이름</span> + 아이콘 구조가 되고 계층 클래스는 붙지 않는다', () => {
    const wrapper = mount(Button, {
      props: { icon: true, label: '검색' },
      slots: { default: '<i class="svg-icon ico-sch"></i>' },
    });
    expect(wrapper.classes()).toContain('icon');
    expect(wrapper.classes()).not.toContain('primary');
    const srOnly = wrapper.find('span.sr-only');
    expect(srOnly.exists()).toBe(true);
    expect(srOnly.text()).toBe('검색');
    expect(wrapper.find('i.svg-icon.ico-sch').exists()).toBe(true);
  });

  it('border는 icon일 때만 적용된다', () => {
    const iconBorder = mount(Button, {
      props: { icon: true, border: true, label: '새로고침' },
      slots: { default: '<i class="svg-icon ico-refresh"></i>' },
    });
    expect(iconBorder.classes()).toContain('border');

    const textBorder = mount(Button, {
      props: { border: true },
      slots: { default: '버튼' },
    });
    expect(textBorder.classes()).not.toContain('border');
  });

  it('개발 환경에서 이름 없는 아이콘 버튼은 경고한다', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mount(Button, {
      props: { icon: true },
      slots: { default: '<i class="svg-icon ico-sch"></i>' },
    });
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('아이콘 전용 버튼')
    );
    warn.mockRestore();
  });
});

describe('Button 상태·상호작용', () => {
  it('클릭하면 click 이벤트를 emit한다', async () => {
    const wrapper = mount(Button, { slots: { default: '버튼' } });
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  it('disabled <button>은 native disabled이고 클릭이 emit되지 않는다', async () => {
    const wrapper = mount(Button, {
      props: { disabled: true },
      slots: { default: '버튼' },
    });
    expect((wrapper.element as HTMLButtonElement).disabled).toBe(true);
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toBeUndefined();
  });

  it('disabled 링크는 href 제거·aria-disabled·tabindex=-1·disabled 클래스, 클릭 시 이동·emit 차단', async () => {
    const wrapper = mount(Button, {
      props: { href: '/notice', disabled: true },
      slots: { default: '공지' },
    });
    expect(wrapper.attributes('href')).toBeUndefined();
    expect(wrapper.attributes('aria-disabled')).toBe('true');
    expect(wrapper.attributes('tabindex')).toBe('-1');
    expect(wrapper.classes()).toContain('disabled');

    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    wrapper.element.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(wrapper.emitted('click')).toBeUndefined();
  });

  it('loading은 disabled 동작 + aria-busy + 스피너, 텍스트(접근성 이름)는 유지된다', async () => {
    const wrapper = mount(Button, {
      props: { loading: true },
      slots: { default: '저장' },
    });
    expect((wrapper.element as HTMLButtonElement).disabled).toBe(true);
    expect(wrapper.attributes('aria-busy')).toBe('true');
    expect(wrapper.find('.hanui-btn-spinner').exists()).toBe(true);
    expect(wrapper.find('.hanui-btn-spinner').attributes('aria-hidden')).toBe(
      'true'
    );
    expect(wrapper.text()).toContain('저장');
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toBeUndefined();
  });

  it('loading이 끝나면 다시 클릭할 수 있다', async () => {
    const wrapper = mount(Button, {
      props: { loading: true },
      slots: { default: '저장' },
    });
    await wrapper.setProps({ loading: false });
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toHaveLength(1);
  });
});

describe('Button 접근성 (axe)', () => {
  it.each([
    ['기본', {}, '버튼'],
    ['disabled', { disabled: true }, '버튼'],
    ['loading', { loading: true }, '저장'],
    ['링크', { href: '/notice' }, '공지'],
    ['disabled 링크', { href: '/notice', disabled: true }, '공지'],
  ])('%s 버튼은 접근성 위반이 없다', async (_name, props, text) => {
    const wrapper = mount(Button, {
      props,
      slots: { default: text },
      attachTo: document.body,
    });
    expect(await axe(wrapper.element)).toHaveNoViolations();
    wrapper.unmount();
  });

  it('아이콘 전용 버튼은 label로 접근성 이름을 가진다', async () => {
    const wrapper = mount(Button, {
      props: { icon: true, label: '검색' },
      slots: { default: '<i class="svg-icon ico-sch" aria-hidden="true"></i>' },
      attachTo: document.body,
    });
    expect(await axe(wrapper.element)).toHaveNoViolations();
    wrapper.unmount();
  });
});

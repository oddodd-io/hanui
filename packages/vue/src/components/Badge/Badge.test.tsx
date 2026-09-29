import { describe, it, expect, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { axe } from '../../test/setup';
import Badge, { type BadgeProps } from './Badge.vue';

const colors = [
  'primary',
  'secondary',
  'gray',
  'point',
  'danger',
  'warning',
  'success',
  'information',
  'disabled',
] as const;

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Badge 구조 (KRDS badge.html 기준)', () => {
  it('기본은 span.krds-badge.bg-primary이고 슬롯 텍스트를 표시한다', () => {
    const wrapper = mount(Badge, { slots: { default: '게시 중' } });
    expect(wrapper.element.tagName).toBe('SPAN');
    expect(wrapper.element.className).toBe('krds-badge bg-primary');
    expect(wrapper.text()).toBe('게시 중');
  });

  it.each(['outline', 'bg', 'bg-light'] as const)(
    'variant=%s × 9색 클래스가 KRDS 원본 이름과 같다',
    (variant) => {
      colors.forEach((color) => {
        const wrapper = mount(Badge, {
          props: { variant, color },
          slots: { default: 'Label' },
        });
        expect(wrapper.classes()).toContain(`${variant}-${color}`);
      });
    }
  );

  it.each(['small', 'medium', 'large'] as const)(
    'size=%s 클래스가 붙는다 (badge_size.html)',
    (size) => {
      const wrapper = mount(Badge, {
        props: { size },
        slots: { default: 'Label' },
      });
      expect(wrapper.classes()).toContain(size);
    }
  );

  it('size를 주지 않으면 크기 클래스가 없다', () => {
    const wrapper = mount(Badge, { slots: { default: 'Label' } });
    expect(wrapper.classes()).toEqual(['krds-badge', 'bg-primary']);
  });
});

describe('Badge 숫자형 (badge_number.html)', () => {
  it('count를 주면 .number 클래스와 숫자를 표시한다', () => {
    const wrapper = mount(Badge, { props: { count: 5 } });
    expect(wrapper.classes()).toContain('number');
    expect(wrapper.text()).toBe('5');
  });

  it('count가 0이어도 표시한다', () => {
    const wrapper = mount(Badge, { props: { count: 0 } });
    expect(wrapper.text()).toBe('0');
  });

  it('max(기본 999)를 넘으면 "999+"로 표시한다', () => {
    expect(mount(Badge, { props: { count: 999 } }).text()).toBe('999');
    expect(mount(Badge, { props: { count: 1000 } }).text()).toBe('999+');
    expect(mount(Badge, { props: { count: 120, max: 99 } }).text()).toBe('99+');
  });

  it('음수·소수는 0 이상 정수로 보정한다', () => {
    expect(mount(Badge, { props: { count: -3 } }).text()).toBe('0');
    expect(mount(Badge, { props: { count: 4.8 } }).text()).toBe('4');
  });

  it('count가 있으면 슬롯 대신 숫자를 표시한다', () => {
    const wrapper = mount(Badge, {
      props: { count: 3 },
      slots: { default: '무시' },
    });
    expect(wrapper.text()).toBe('3');
  });
});

describe('Badge 점형 (.dot)', () => {
  it('dot이면 .dot 클래스이고 화면 내용이 없다', () => {
    const wrapper = mount(Badge, { props: { dot: true, label: '새 글' } });
    expect(wrapper.classes()).toContain('dot');
    expect(wrapper.classes()).not.toContain('number');
    // 화면에 보이는 내용 없이 sr-only label만 있다
    expect(wrapper.find('.sr-only').text()).toBe('새 글');
    expect(wrapper.element.textContent).toBe('새 글');
  });

  it('dot은 count·슬롯보다 우선한다', () => {
    const wrapper = mount(Badge, {
      props: { dot: true, count: 5, label: '새 글' },
      slots: { default: '무시' },
    });
    expect(wrapper.classes()).not.toContain('number');
    expect(wrapper.text()).toBe('새 글');
  });

  it('label 없는 dot은 개발 경고를 낸다', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mount(Badge, { props: { dot: true } });
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('label'));
  });

  it('label 있는 dot은 경고하지 않는다', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mount(Badge, { props: { dot: true, label: '새 글' } });
    expect(warn).not.toHaveBeenCalled();
  });
});

describe('Badge label (sr-only)', () => {
  it('label은 sr-only로 내용 앞에 붙어 "읽지 않은 알림 5"로 읽힌다', () => {
    const wrapper = mount(Badge, {
      props: { count: 5, label: '읽지 않은 알림' },
    });
    const sr = wrapper.find('.sr-only');
    expect(sr.exists()).toBe(true);
    expect(wrapper.element.textContent).toBe('읽지 않은 알림 5');
  });

  it('텍스트 배지에도 label을 덧붙일 수 있다', () => {
    const wrapper = mount(Badge, {
      props: { label: '게시 상태:' },
      slots: { default: '게시 중' },
    });
    expect(wrapper.element.textContent).toBe('게시 상태: 게시 중');
  });

  it('label이 없으면 sr-only 요소를 만들지 않는다', () => {
    const wrapper = mount(Badge, { slots: { default: 'Label' } });
    expect(wrapper.find('.sr-only').exists()).toBe(false);
  });
});

describe('Badge 접근성', () => {
  it.each<[string, BadgeProps, string | undefined]>([
    ['텍스트', { variant: 'outline', color: 'danger' }, '반려'],
    ['숫자', { count: 1200, label: '읽지 않은 알림' }, undefined],
    ['점', { dot: true, label: '새 글' }, undefined],
  ])('%s 배지 axe 위반이 없다', async (_, props, text) => {
    const wrapper = mount(Badge, {
      props,
      slots: text ? { default: text } : {},
      attachTo: document.body,
    });
    expect(await axe(wrapper.element)).toHaveNoViolations();
    wrapper.unmount();
  });
});

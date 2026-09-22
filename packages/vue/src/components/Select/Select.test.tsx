import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { axe } from '../../test/setup';
import Select from './Select.vue';
import FormField from '../FormField/FormField.vue';

const options = [
  { value: 'all', label: '전체' },
  { value: 'published', label: '게시 중' },
  { value: 'draft', label: '초안' },
];

describe('Select 구조 (KRDS select.html 기준)', () => {
  it('기본은 select.krds-form-select 이고 크기 클래스는 붙지 않는다 (CSS 기본 large)', () => {
    const wrapper = mount(Select, {
      props: { options },
      attrs: { 'aria-label': '상태' },
    });
    const el = wrapper.element as HTMLSelectElement;
    expect(el.tagName).toBe('SELECT');
    expect(el.classList.contains('krds-form-select')).toBe(true);
    expect(el.className).toBe('krds-form-select');
  });

  it.each(['small', 'medium', 'large'] as const)(
    'size=%s 클래스가 붙는다',
    (size) => {
      const wrapper = mount(Select, {
        props: { options, size },
        attrs: { 'aria-label': '상태' },
      });
      expect(wrapper.classes()).toContain(size);
    }
  );

  it('options prop으로 <option>을 렌더한다', () => {
    const wrapper = mount(Select, {
      props: { options },
      attrs: { 'aria-label': '상태' },
    });
    const opts = wrapper.findAll('option');
    expect(opts.map((o) => o.text())).toEqual(['전체', '게시 중', '초안']);
    expect(opts.map((o) => o.attributes('value'))).toEqual([
      'all',
      'published',
      'draft',
    ]);
  });

  it('default 슬롯으로 <option>을 직접 넣을 수 있다', () => {
    const wrapper = mount(Select, {
      slots: {
        default: '<option value="a">A</option><option value="b">B</option>',
      },
      attrs: { 'aria-label': '상태' },
    });
    expect(wrapper.findAll('option')).toHaveLength(2);
  });

  it('placeholder는 첫 번째 <option value="">로 렌더되고, required면 선택 불가', () => {
    const plain = mount(Select, {
      props: { options, placeholder: '선택' },
      attrs: { 'aria-label': '상태' },
    });
    const first = plain.find('option');
    expect(first.text()).toBe('선택');
    expect(first.attributes('value')).toBe('');
    expect((first.element as HTMLOptionElement).disabled).toBe(false);

    const req = mount(Select, {
      props: { options, placeholder: '선택', required: true },
      attrs: { 'aria-label': '상태' },
    });
    expect((req.find('option').element as HTMLOptionElement).disabled).toBe(
      true
    );
  });

  it('값이 선택되면 .completed 가 붙는다', async () => {
    const wrapper = mount(Select, {
      props: { options, modelValue: '' },
      attrs: { 'aria-label': '상태' },
    });
    expect(wrapper.classes()).not.toContain('completed');
    await wrapper.setProps({ modelValue: 'draft' });
    expect(wrapper.classes()).toContain('completed');
  });

  it('title·name·disabled·required 가 select에 반영된다', () => {
    const wrapper = mount(Select, {
      props: { options, name: 'status', disabled: true, required: true },
      attrs: { title: '선택' },
    });
    const el = wrapper.element as HTMLSelectElement;
    expect(el.title).toBe('선택');
    expect(el.name).toBe('status');
    expect(el.disabled).toBe(true);
    expect(el.required).toBe(true);
  });
});

describe('Select sort 변형 (select_sorting.html 기준)', () => {
  it('variant=sort 는 select.krds-form-select-sort 이고 completed/is-error 를 붙이지 않는다', () => {
    const wrapper = mount(Select, {
      props: { options, variant: 'sort', modelValue: 'draft', size: 'small' },
      attrs: { 'aria-label': '정렬' },
    });
    expect(wrapper.classes()).toEqual(['krds-form-select-sort', 'small']);
  });
});

describe('Select v-model', () => {
  it('선택하면 update:modelValue 를 emit 한다', async () => {
    const wrapper = mount(Select, {
      props: { options, modelValue: 'all' },
      attrs: { 'aria-label': '상태' },
    });
    await wrapper.find('select').setValue('published');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['published']);
  });

  it('modelValue 가 바뀌면 선택이 반영된다', async () => {
    const wrapper = mount(Select, {
      props: { options, modelValue: 'all' },
      attrs: { 'aria-label': '상태' },
    });
    await wrapper.setProps({ modelValue: 'draft' });
    expect((wrapper.element as HTMLSelectElement).value).toBe('draft');
  });
});

describe('Select + FormField', () => {
  const mountInField = (
    fieldProps: Record<string, unknown>,
    selectProps: Record<string, unknown> = {}
  ) =>
    mount(FormField, {
      props: { label: '게시 상태', ...fieldProps },
      slots: { default: () => [<Select options={options} {...selectProps} />] },
      attachTo: document.body,
    });

  it('label[for]·id·hint describedby 가 자동 연결된다', () => {
    const wrapper = mountInField({ hint: '도움말' });
    const sel = wrapper.find('select');
    expect(sel.attributes('id')).toBe(wrapper.find('label').attributes('for'));
    expect(sel.attributes('aria-describedby')).toBe(
      wrapper.find('p.form-hint').attributes('id')
    );
    wrapper.unmount();
  });

  it('status=error 면 select.is-error + aria-invalid (KRDS 두 셀렉터 모두 대응)', () => {
    const wrapper = mountInField({
      status: 'error',
      message: '상태를 선택하세요',
    });
    const sel = wrapper.find('select');
    expect(sel.classes()).toContain('is-error');
    expect(sel.attributes('aria-invalid')).toBe('true');
    expect(wrapper.find('.form-conts.is-error').exists()).toBe(true);
    wrapper.unmount();
  });

  it('required·disabled 가 전달된다', () => {
    const wrapper = mountInField({ required: true, disabled: true });
    const el = wrapper.find('select').element as HTMLSelectElement;
    expect(el.required).toBe(true);
    expect(el.disabled).toBe(true);
    wrapper.unmount();
  });
});

describe('Select 접근성', () => {
  it('aria-label 단독 Select 는 접근성 위반이 없다', async () => {
    const wrapper = mount(Select, {
      props: { options },
      attrs: { 'aria-label': '상태' },
      attachTo: document.body,
    });
    expect(await axe(wrapper.element)).toHaveNoViolations();
    wrapper.unmount();
  });

  it('title 만으로는 axe(label-title-only)가 경고하므로 단독 사용 시 aria-label 을 써야 한다', async () => {
    // KRDS 예제의 title="선택"은 label 이 있는 form-group 안에서만 쓰인다
    const wrapper = mount(Select, {
      props: { options },
      attrs: { title: '선택' },
      attachTo: document.body,
    });
    const results = await axe(wrapper.element);
    expect(results.violations.map((v) => v.id)).toContain('label-title-only');
    wrapper.unmount();
  });

  it('FormField + error 조합도 접근성 위반이 없다', async () => {
    const wrapper = mount(FormField, {
      props: {
        label: '게시 상태',
        required: true,
        status: 'error',
        message: '상태를 선택하세요',
      },
      slots: {
        default: () => [<Select options={options} placeholder="선택" />],
      },
      attachTo: document.body,
    });
    expect(await axe(wrapper.element)).toHaveNoViolations();
    wrapper.unmount();
  });
});

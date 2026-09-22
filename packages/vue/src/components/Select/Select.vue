<script setup lang="ts">
/**
 * Select — KRDS `select.krds-form-select` / `select.krds-form-select-sort` 래퍼
 *
 * 네이티브 select를 그대로 쓰므로 키보드·스크린리더 동작은 브라우저가 담당한다.
 * 이 컴포넌트는 v-model · 크기 · completed/is-error 클래스 · FormField 연결만 담당한다.
 * FormField 없이 단독으로 쓸 때는 aria-label 로 이름을 준다 (title 만으로는 부족하다).
 * 기준: reference/krds-uiux/html/code/select*.html, resources/scss/component/_select.scss
 */
import { computed, ref, useAttrs } from 'vue';
import { useFormField } from '../../composables/useFormField';

export type SelectSize = 'small' | 'medium' | 'large';
export type SelectVariant = 'default' | 'sort';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  modelValue?: string;
  /** 옵션 목록. 대신 default 슬롯에 `<option>`을 직접 넣어도 된다 */
  options?: SelectOption[];
  /** 첫 번째에 `<option value="">`로 렌더되는 안내 문구 (예: "선택"). required면 선택 불가 */
  placeholder?: string;
  /** default: 폼용 `.krds-form-select` (기본 large) / sort: 목록 정렬용 `.krds-form-select-sort` (기본 medium, 테두리 없음) */
  variant?: SelectVariant;
  size?: SelectSize;
  id?: string;
  name?: string;
  disabled?: boolean;
  required?: boolean;
}

const props = withDefaults(defineProps<SelectProps>(), {
  modelValue: '',
  options: undefined,
  placeholder: undefined,
  variant: 'default',
  size: undefined,
  id: undefined,
  name: undefined,
  disabled: false,
  required: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

defineOptions({ inheritAttrs: false });
const attrs = useAttrs();

const field = useFormField();

const id = computed(() => props.id ?? field?.id.value);
const isDisabled = computed(() => props.disabled || !!field?.disabled.value);
const isRequired = computed(() => props.required || !!field?.required.value);
const isInvalid = computed(() => field?.status.value === 'error' || undefined);
const describedBy = computed(
  () => (attrs['aria-describedby'] as string | undefined) ?? field?.describedBy.value
);

// KRDS 기본 크기: 폼용은 large, 정렬용은 medium (CSS 기본값과 같으므로 클래스는 지정했을 때만 붙인다)
const classes = computed(() => [
  props.variant === 'sort' ? 'krds-form-select-sort' : 'krds-form-select',
  props.size,
  {
    // 값이 선택된 상태 (KRDS "선택완료" 색)
    completed: props.variant === 'default' && props.modelValue !== '',
    'is-error': props.variant === 'default' && isInvalid.value,
  },
]);

const selectRef = ref<HTMLSelectElement | null>(null);

const onChange = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLSelectElement).value);
};

defineExpose({
  /** 실제 select 요소 */
  select: selectRef,
  focus: () => selectRef.value?.focus(),
});
</script>

<template>
  <select
    :id="id"
    ref="selectRef"
    v-bind="attrs"
    :class="classes"
    :name="name"
    :value="modelValue"
    :disabled="isDisabled"
    :required="isRequired"
    :aria-required="isRequired || undefined"
    :aria-invalid="isInvalid"
    :aria-describedby="describedBy"
    @change="onChange"
  >
    <option v-if="placeholder !== undefined" value="" :disabled="isRequired">
      {{ placeholder }}
    </option>
    <template v-if="options">
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        :disabled="option.disabled"
      >
        {{ option.label }}
      </option>
    </template>
    <slot />
  </select>
</template>

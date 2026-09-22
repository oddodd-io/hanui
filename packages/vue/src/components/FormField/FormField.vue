<script setup lang="ts">
/**
 * FormField — KRDS `.form-group` 래퍼
 *
 * label · 상태(.is-error/.is-success/.is-information) · 힌트/상태 메시지를 담당하고,
 * 안쪽 컨트롤(Input, Textarea, Select…)에 id·aria-describedby·required·disabled를 provide한다.
 * 기준: reference/krds-uiux/html/code/text_input*.html, resources/scss/component/_form_layout.scss
 */
import { computed, ref, toRef, useId } from 'vue';
import { provideFormField, type FormFieldStatus } from '../../composables/useFormField';

export interface FormFieldProps {
  /** 레이블. `.form-tit > label`로 렌더된다 */
  label: string;
  /** 컨트롤 id. 생략하면 자동 생성 */
  id?: string;
  /** 도움말 (`.form-hint`) */
  hint?: string;
  /** 상태. 컨트롤 래퍼에 `.is-*`가 붙고 `message`가 상태 메시지로 렌더된다 */
  status?: FormFieldStatus;
  /** 상태 메시지 (`.form-hint-invalid` 등). status가 있을 때만 표시 */
  message?: string;
  required?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<FormFieldProps>(), {
  id: undefined,
  hint: undefined,
  status: undefined,
  message: undefined,
  required: false,
  disabled: false,
});

const generatedId = useId();
const id = computed(() => props.id ?? `hanui-field-${generatedId}`);
const hintId = computed(() => `${id.value}-hint`);
const messageId = computed(() => `${id.value}-message`);

const showMessage = computed(() => !!props.status && !!props.message);

const describedBy = computed(() => {
  const ids: string[] = [];
  if (props.hint) ids.push(hintId.value);
  if (showMessage.value) ids.push(messageId.value);
  return ids.length ? ids.join(' ') : undefined;
});

const messageClass = computed(() => {
  switch (props.status) {
    case 'error':
      return 'form-hint-invalid';
    case 'success':
      return 'form-hint-success';
    case 'information':
      return 'form-hint-information';
    default:
      return undefined;
  }
});

const iconWrap = ref(false);
const deletable = ref(false);

const contsClass = computed(() => [
  'form-conts',
  {
    'is-error': props.status === 'error',
    'is-success': props.status === 'success',
    'is-information': props.status === 'information',
    'btn-ico-wrap': iconWrap.value,
  },
]);

provideFormField({
  id,
  describedBy,
  status: toRef(props, 'status'),
  required: toRef(props, 'required'),
  disabled: toRef(props, 'disabled'),
  setIconWrap: (value, options) => {
    iconWrap.value = value;
    deletable.value = !!options?.deletable;
  },
});
</script>

<template>
  <div class="form-group">
    <div class="form-tit">
      <label :for="id">{{ label }}</label>
    </div>
    <div :class="contsClass" :data-delete="deletable ? 'true' : undefined">
      <slot />
    </div>
    <p v-if="hint" :id="hintId" class="form-hint">{{ hint }}</p>
    <p
      v-if="showMessage"
      :id="messageId"
      :class="messageClass"
      :role="status === 'error' ? 'alert' : undefined"
    >
      {{ message }}
    </p>
  </div>
</template>

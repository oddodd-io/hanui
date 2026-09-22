<script setup lang="ts">
/**
 * Textarea — KRDS `textarea.krds-input` 래퍼
 *
 * v-model · 글자수 카운트(`.textarea-count`)를 담당한다.
 * 높이는 KRDS CSS가 고정(14.4rem)하므로 rows는 효과가 없다.
 * FormField 안에 있으면 id·aria-describedby·aria-invalid·required·disabled를 자동으로 잇는다.
 * 기준: reference/krds-uiux/html/code/textarea.html, resources/scss/component/_input.scss
 */
import { computed, ref, useAttrs, useId } from 'vue';
import { useFormField } from '../../composables/useFormField';

export interface TextareaProps {
  modelValue?: string;
  id?: string;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  /** 최대 글자수. 지정하면 KRDS `.textarea-count`(현재/최대)를 표시한다 */
  maxlength?: number;
}

const props = withDefaults(defineProps<TextareaProps>(), {
  modelValue: '',
  id: undefined,
  name: undefined,
  placeholder: undefined,
  disabled: false,
  readonly: false,
  required: false,
  maxlength: undefined,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

defineOptions({ inheritAttrs: false });
const attrs = useAttrs();

const field = useFormField();

const generatedId = useId();
const id = computed(() => props.id ?? field?.id.value ?? `hanui-textarea-${generatedId}`);
const countId = computed(() => `${id.value}-count`);

const isDisabled = computed(() => props.disabled || !!field?.disabled.value);
const isRequired = computed(() => props.required || !!field?.required.value);
const isInvalid = computed(() => field?.status.value === 'error' || undefined);

const showCount = computed(() => props.maxlength !== undefined);
const length = computed(() => Array.from(props.modelValue).length);

const describedBy = computed(() => {
  const ids = [attrs['aria-describedby'] as string | undefined, field?.describedBy.value];
  if (showCount.value) ids.push(countId.value);
  const joined = ids.filter(Boolean).join(' ');
  return joined || undefined;
});

const textareaRef = ref<HTMLTextAreaElement | null>(null);

const onInput = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value);
};

defineExpose({
  /** 실제 textarea 요소 */
  textarea: textareaRef,
  focus: () => textareaRef.value?.focus(),
});
</script>

<template>
  <div class="textarea-wrap">
    <textarea
      :id="id"
      ref="textareaRef"
      v-bind="attrs"
      class="krds-input"
      :name="name"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="isDisabled"
      :readonly="readonly"
      :required="isRequired"
      :maxlength="maxlength"
      :aria-required="isRequired || undefined"
      :aria-invalid="isInvalid"
      :aria-describedby="describedBy"
      @input="onInput"
    />
    <p v-if="showCount" :id="countId" class="textarea-count">
      <span class="count-now">{{ length }}</span><span class="count-total">/{{ maxlength }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
/**
 * Input — KRDS `input.krds-input` 래퍼
 *
 * v-model · 크기 · 비밀번호 보기/내용 삭제 버튼을 담당한다.
 * FormField 안에 있으면 id·aria-describedby·aria-invalid·required·disabled를 자동으로 잇는다.
 * 기준: reference/krds-uiux/html/code/text_input*.html, resources/scss/component/_input.scss
 */
import { computed, onBeforeUnmount, ref, useAttrs, watchEffect } from 'vue';
import { useFormField } from '../../composables/useFormField';

export type InputSize = 'small' | 'medium' | 'large' | 'xlarge';
export type InputType = 'text' | 'password' | 'email' | 'tel' | 'url' | 'search' | 'number';

export interface InputProps {
  modelValue?: string;
  type?: InputType;
  /** KRDS 크기. 기본 large (KRDS 기본값) */
  size?: InputSize;
  id?: string;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  /** 값이 있을 때 내용 삭제 버튼 표시 (FormField 안에서만 KRDS 위치 스타일이 적용된다) */
  clearable?: boolean;
  /** type=password일 때 비밀번호 보기/가리기 버튼 표시 */
  passwordToggle?: boolean;
}

const props = withDefaults(defineProps<InputProps>(), {
  modelValue: '',
  type: 'text',
  size: 'large',
  id: undefined,
  name: undefined,
  placeholder: undefined,
  disabled: false,
  readonly: false,
  required: false,
  clearable: false,
  passwordToggle: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  clear: [];
}>();

defineOptions({ inheritAttrs: false });
const attrs = useAttrs();

const field = useFormField();

const id = computed(() => props.id ?? field?.id.value);
const isDisabled = computed(() => props.disabled || !!field?.disabled.value);
const isRequired = computed(() => props.required || !!field?.required.value);
const describedBy = computed(
  () => (attrs['aria-describedby'] as string | undefined) ?? field?.describedBy.value
);
const isInvalid = computed(() => field?.status.value === 'error' || undefined);

const classes = computed(() => ['krds-input', props.size]);

// ---- 비밀번호 보기 ----
const revealed = ref(false);
const showPasswordToggle = computed(() => props.type === 'password' && props.passwordToggle);
const inputType = computed(() =>
  showPasswordToggle.value && revealed.value ? 'text' : props.type
);

// ---- 내용 삭제 ----
const inputRef = ref<HTMLInputElement | null>(null);
const showClear = computed(
  () => props.clearable && !isDisabled.value && !props.readonly && props.modelValue !== ''
);
const clear = () => {
  emit('update:modelValue', '');
  emit('clear');
  inputRef.value?.focus();
};

const hasIconButtons = computed(() => props.clearable || showPasswordToggle.value);

// FormField의 .form-conts에 .btn-ico-wrap / data-delete를 붙이게 한다
watchEffect(() => {
  field?.setIconWrap(hasIconButtons.value, { deletable: props.clearable });
});
onBeforeUnmount(() => field?.setIconWrap(false));

const onInput = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
};

defineExpose({
  /** 실제 input 요소 */
  input: inputRef,
  focus: () => inputRef.value?.focus(),
});
</script>

<template>
  <input
    :id="id"
    ref="inputRef"
    v-bind="attrs"
    :class="classes"
    :type="inputType"
    :name="name"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="isDisabled"
    :readonly="readonly"
    :required="isRequired"
    :aria-required="isRequired || undefined"
    :aria-invalid="isInvalid"
    :aria-describedby="describedBy"
    @input="onInput"
  />
  <template v-if="hasIconButtons">
    <!-- 버튼이 둘이면 KRDS처럼 .btn-group으로 묶는다 -->
    <div v-if="clearable && showPasswordToggle" class="btn-group">
      <button
        v-show="showClear"
        type="button"
        class="krds-btn medium icon pure btn-delete-input"
        :disabled="isDisabled"
        @click="clear"
      >
        <span class="sr-only">내용 삭제</span>
        <i class="svg-icon ico-delete-fill" />
      </button>
      <button
        type="button"
        class="krds-btn medium icon"
        :aria-pressed="revealed"
        :disabled="isDisabled"
        @click="revealed = !revealed"
      >
        <span class="sr-only">{{ revealed ? '입력한 비밀번호 가리기' : '입력한 비밀번호 보기' }}</span>
        <i :class="['svg-icon', revealed ? 'ico-pw-visible-on' : 'ico-pw-visible']" />
      </button>
    </div>
    <button
      v-else-if="clearable"
      v-show="showClear"
      type="button"
      class="krds-btn medium icon pure btn-delete-input"
      :disabled="isDisabled"
      @click="clear"
    >
      <span class="sr-only">내용 삭제</span>
      <i class="svg-icon ico-delete-fill" />
    </button>
    <button
      v-else
      type="button"
      class="krds-btn medium icon"
      :aria-pressed="revealed"
      :disabled="isDisabled"
      @click="revealed = !revealed"
    >
      <span class="sr-only">{{ revealed ? '입력한 비밀번호 가리기' : '입력한 비밀번호 보기' }}</span>
      <i :class="['svg-icon', revealed ? 'ico-pw-visible-on' : 'ico-pw-visible']" />
    </button>
  </template>
</template>

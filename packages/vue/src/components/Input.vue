<script setup lang="ts">
import { computed, ref } from 'vue';
import { cva } from 'class-variance-authority';
import { Eye, EyeOff, X } from 'lucide-vue-next';
import { cn } from '@/lib/utils';

// 템플릿 루트가 래퍼 <div>라 기본 fallthrough면 소비자가 넘긴
// id·aria-label·name·required 등이 <input>이 아니라 래퍼에 붙는다.
// (그 결과 <Input aria-label="이름" />의 입력에 접근명이 생기지 않는다)
defineOptions({ inheritAttrs: false });

const inputVariants = cva(
  'flex w-full rounded-md font-bold transition-colors placeholder:text-krds-gray-50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-krds-gray-10 read-only:bg-krds-gray-5 read-only:cursor-default',
  {
    variants: {
      variant: {
        default:
          'border border-krds-gray-60 bg-krds-white focus-visible:border-2 focus-visible:border-krds-primary-base',
        filled:
          'border border-transparent bg-krds-gray-10 focus-visible:border-2 focus-visible:border-krds-primary-base',
      },
      size: {
        sm: 'h-10 px-4 text-[15px] rounded-md leading-[150%]',
        md: 'h-12 px-4 text-[17px] rounded-md leading-[150%]',
        lg: 'h-14 px-4 text-[19px] rounded-lg leading-[150%]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    type?: string;
    variant?: 'default' | 'filled';
    size?: 'sm' | 'md' | 'lg';
    status?: 'error' | 'success' | 'info';
    disabled?: boolean;
    readonly?: boolean;
    clearable?: boolean;
    placeholder?: string;
    class?: string;
  }>(),
  {
    type: 'text',
    variant: 'default',
    size: 'md',
    disabled: false,
    readonly: false,
    clearable: false,
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
  clear: [];
}>();

const showPassword = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);

const inputType = computed(() => {
  if (props.type === 'password' && showPassword.value) {
    return 'text';
  }
  return props.type;
});

const hasValue = computed(() => !!props.modelValue);

const hasError = computed(() => props.status === 'error');

const statusClasses = computed(() => {
  if (hasError.value) {
    return 'border-krds-danger-60 focus-visible:border-2 focus-visible:border-krds-danger-60';
  }
  return '';
});

const inputClasses = computed(() =>
  cn(
    inputVariants({ variant: props.variant, size: props.size }),
    statusClasses.value,
    ($slots.leftAddon || props.type === 'password' || props.clearable) && 'pr-10',
    $slots.leftAddon && 'pl-10'
  )
);

const wrapperClasses = computed(() => cn('relative flex items-center', props.class));

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};

const handleClear = () => {
  emit('update:modelValue', '');
  emit('clear');
  inputRef.value?.focus();
};

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

// $slots를 정의
const $slots = defineSlots<{
  leftAddon?: () => any;
  rightAddon?: () => any;
}>();

const hasLeftAddon = computed(() => !!$slots.leftAddon);
const hasRightAddon = computed(() => !!$slots.rightAddon || props.type === 'password' || (props.clearable && hasValue.value));
</script>

<template>
  <div :class="wrapperClasses">
    <div
      v-if="hasLeftAddon"
      class="pointer-events-none absolute left-3 flex items-center text-krds-gray-60"
    >
      <slot name="leftAddon" />
    </div>
    <input
      ref="inputRef"
      :type="inputType"
      :value="modelValue"
      :disabled="disabled"
      :readonly="readonly"
      :placeholder="placeholder"
      :class="inputClasses"
      :aria-invalid="hasError ? true : undefined"
      v-bind="$attrs"
      @input="handleInput"
    />
    <div
      v-if="hasRightAddon"
      class="absolute right-3 flex items-center gap-2 text-krds-gray-60"
    >
      <button
        v-if="clearable && hasValue"
        type="button"
        class="cursor-pointer hover:text-krds-primary-60 transition-colors"
        aria-label="입력 지우기"
        tabindex="-1"
        @click="handleClear"
      >
        <X :size="16" />
      </button>
      <button
        v-if="type === 'password'"
        type="button"
        class="cursor-pointer hover:text-krds-primary-60 transition-colors"
        :aria-label="showPassword ? '비밀번호 숨기기' : '비밀번호 보기'"
        tabindex="-1"
        @click="togglePassword"
      >
        <EyeOff v-if="showPassword" :size="20" />
        <Eye v-else :size="20" />
      </button>
      <slot name="rightAddon" />
    </div>
  </div>
</template>

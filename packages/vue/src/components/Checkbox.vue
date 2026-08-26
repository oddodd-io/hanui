<script setup lang="ts">
import { computed, useId } from 'vue';
import { cva } from 'class-variance-authority';
import { Check } from 'lucide-vue-next';
import { cn } from '@/lib/utils';

const checkboxVariants = cva(
  'peer shrink-0 rounded-md border border-krds-gray-60 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-krds-primary-base focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 transition-colors',
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const props = withDefaults(
  defineProps<{
    modelValue?: boolean;
    size?: 'sm' | 'md' | 'lg';
    status?: 'error' | 'success' | 'info';
    disabled?: boolean;
    label?: string;
    labelPosition?: 'right' | 'left';
    class?: string;
    ariaLabel?: string;
    id?: string;
  }>(),
  {
    modelValue: false,
    size: 'md',
    disabled: false,
    labelPosition: 'right',
  }
);

const generatedCheckboxId = useId();
const checkboxId = computed(() => props.id || `checkbox-${generatedCheckboxId}`);

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const hasError = computed(() => props.status === 'error');

const checkboxClasses = computed(() => {
  const base = checkboxVariants({ size: props.size });
  const checkedClasses = props.modelValue
    ? 'bg-krds-primary-base border-krds-primary-base text-krds-white'
    : 'bg-white';
  const errorClasses = hasError.value
    ? 'border-krds-danger-60 data-[state=checked]:bg-krds-danger-60 data-[state=checked]:border-krds-danger-60'
    : '';
  return cn(base, checkedClasses, errorClasses, props.class);
});

const iconSize = computed(() => {
  switch (props.size) {
    case 'sm':
      return 12;
    case 'lg':
      return 16;
    default:
      return 14;
  }
});

const wrapperClasses = computed(() =>
  cn('flex items-center gap-2', props.labelPosition === 'left' && 'flex-row-reverse')
);

const labelClasses = computed(() =>
  cn(
    'text-krds-body-md text-krds-gray-90 cursor-pointer select-none',
    props.disabled && 'cursor-not-allowed opacity-60'
  )
);

const handleClick = () => {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue);
  }
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault();
    handleClick();
  }
};
</script>

<template>
  <div v-if="label" :class="wrapperClasses">
    <button
      :id="checkboxId"
      type="button"
      role="checkbox"
      :aria-checked="modelValue"
      :aria-labelledby="`${checkboxId}-label`"
      :aria-invalid="hasError ? true : undefined"
      :disabled="disabled"
      :class="checkboxClasses"
      :data-state="modelValue ? 'checked' : 'unchecked'"
      @click="handleClick"
      @keydown="handleKeyDown"
    >
      <span v-if="modelValue" class="flex items-center justify-center text-current">
        <Check :size="iconSize" :stroke-width="3" aria-hidden="true" />
      </span>
    </button>
    <span :id="`${checkboxId}-label`" :class="labelClasses" @click="handleClick">{{ label }}</span>
  </div>
  <button
    v-else
    :id="checkboxId"
    type="button"
    role="checkbox"
    :aria-checked="modelValue"
    :aria-label="ariaLabel"
    :aria-invalid="hasError ? true : undefined"
    :disabled="disabled"
    :class="checkboxClasses"
    :data-state="modelValue ? 'checked' : 'unchecked'"
    @click="handleClick"
    @keydown="handleKeyDown"
  >
    <span v-if="modelValue" class="flex items-center justify-center text-current">
      <Check :size="iconSize" :stroke-width="3" aria-hidden="true" />
    </span>
  </button>
</template>

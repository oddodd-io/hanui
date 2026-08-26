<script setup lang="ts">
import { computed, useId } from 'vue';
import { cva } from 'class-variance-authority';
import { Check, X } from 'lucide-vue-next';
import { cn } from '@/lib/utils';

const switchVariants = cva(
  'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-krds-primary-base focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60',
  {
    variants: {
      size: {
        sm: 'h-5 w-9',
        md: 'h-6 w-10',
        lg: 'h-7 w-12',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const thumbVariants = cva(
  'pointer-events-none flex items-center justify-center rounded-full bg-white shadow-lg ring-0 transition-transform',
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

const iconSizeMap = {
  sm: 10,
  md: 12,
  lg: 14,
};

const translateMap = {
  sm: 'translate-x-4',
  md: 'translate-x-4',
  lg: 'translate-x-5',
};

const props = withDefaults(
  defineProps<{
    modelValue?: boolean;
    size?: 'sm' | 'md' | 'lg';
    status?: 'error' | 'success' | 'info';
    disabled?: boolean;
    label?: string;
    labelPosition?: 'left' | 'right';
    ariaLabel?: string;
    id?: string;
    class?: string;
  }>(),
  {
    modelValue: false,
    size: 'md',
    disabled: false,
    labelPosition: 'right',
  }
);

const generatedSwitchId = useId();
const switchId = computed(() => props.id || `switch-${generatedSwitchId}`);

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const hasError = computed(() => props.status === 'error');

const switchClasses = computed(() => {
  const base = switchVariants({ size: props.size });
  const stateClasses = props.modelValue ? 'bg-krds-primary-base' : 'bg-krds-gray-50';
  const errorClasses = hasError.value ? 'data-[state=checked]:bg-krds-danger-50' : '';
  return cn(base, stateClasses, errorClasses, props.class);
});

const thumbClasses = computed(() => {
  const base = thumbVariants({ size: props.size });
  const translateClass = props.modelValue ? translateMap[props.size] : 'translate-x-0';
  return cn(base, translateClass);
});

const iconSize = computed(() => iconSizeMap[props.size]);

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
  <div v-if="label" class="flex items-center gap-2">
    <span
      v-if="labelPosition === 'left'"
      :id="`${switchId}-label`"
      :class="labelClasses"
      @click="handleClick"
    >
      {{ label }}
    </span>
    <button
      :id="switchId"
      type="button"
      role="switch"
      :aria-checked="modelValue"
      :aria-labelledby="`${switchId}-label`"
      :disabled="disabled"
      :class="switchClasses"
      :data-state="modelValue ? 'checked' : 'unchecked'"
      @click="handleClick"
      @keydown="handleKeyDown"
    >
      <span :class="thumbClasses">
        <Check
          v-if="modelValue"
          :size="iconSize"
          :stroke-width="3"
          class="text-krds-primary-base"
          aria-hidden="true"
        />
        <X
          v-else
          :size="iconSize"
          :stroke-width="3"
          class="text-krds-gray-40"
          aria-hidden="true"
        />
      </span>
    </button>
    <span
      v-if="labelPosition === 'right'"
      :id="`${switchId}-label`"
      :class="labelClasses"
      @click="handleClick"
    >
      {{ label }}
    </span>
  </div>
  <button
    v-else
    :id="switchId"
    type="button"
    role="switch"
    :aria-checked="modelValue"
    :aria-label="ariaLabel"
    :disabled="disabled"
    :class="switchClasses"
    :data-state="modelValue ? 'checked' : 'unchecked'"
    @click="handleClick"
    @keydown="handleKeyDown"
  >
    <span :class="thumbClasses">
      <Check
        v-if="modelValue"
        :size="iconSize"
        :stroke-width="3"
        class="text-krds-primary-base"
        aria-hidden="true"
      />
      <X
        v-else
        :size="iconSize"
        :stroke-width="3"
        class="text-krds-gray-40"
        aria-hidden="true"
      />
    </span>
  </button>
</template>

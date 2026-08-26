<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const progressVariants = cva(
  'relative w-full overflow-hidden rounded-full bg-krds-gray-10',
  {
    variants: {
      size: {
        sm: 'h-1',
        md: 'h-2',
        lg: 'h-3',
        xl: 'h-4',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const indicatorVariants = cva(
  'h-full rounded-full transition-all duration-300 ease-in-out',
  {
    variants: {
      variant: {
        default: 'bg-krds-gray-60',
        primary: 'bg-krds-primary-base',
        success: 'bg-krds-success-base',
        warning: 'bg-krds-warning-base',
        error: 'bg-krds-danger-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  }
);

const props = withDefaults(
  defineProps<{
    value?: number | null;
    max?: number;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
    label?: string;
    /** 보이는 label 없이 접근명만 줄 때 사용 (Button.vue와 동일 관례) */
    ariaLabel?: string;
    showValue?: boolean;
    class?: string;
  }>(),
  {
    max: 100,
    size: 'md',
    variant: 'primary',
    showValue: false,
  }
);

const isIndeterminate = computed(
  () => props.value === null || props.value === undefined
);

const normalizedValue = computed(() =>
  isIndeterminate.value ? 0 : Math.min(Math.max(props.value!, 0), props.max)
);

const percentage = computed(() => (normalizedValue.value / props.max) * 100);

const progressClasses = computed(() =>
  cn(progressVariants({ size: props.size }), props.class)
);

const indicatorClasses = computed(() =>
  cn(
    indicatorVariants({ variant: props.variant }),
    isIndeterminate.value && 'w-1/3'
  )
);

const indicatorStyle = computed(() =>
  isIndeterminate.value
    ? { animation: 'progress-indeterminate 1.5s ease-in-out infinite' }
    : { width: `${percentage.value}%` }
);

const formatValue = (value: number, max: number) =>
  `${Math.round((value / max) * 100)}%`;

// Inject animation styles
onMounted(() => {
  if (typeof document === 'undefined') return;
  const styleId = 'hanui-progress-animation';
  if (document.getElementById(styleId)) return;

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    @keyframes progress-indeterminate {
      0% { transform: translateX(-100%); }
      50% { transform: translateX(100%); }
      100% { transform: translateX(300%); }
    }
  `;
  document.head.appendChild(style);
});
</script>

<template>
  <div class="w-full">
    <div v-if="label || showValue" class="flex justify-between mb-1.5 text-sm">
      <span v-if="label" class="text-krds-gray-70">{{ label }}</span>
      <span
        v-if="showValue && !isIndeterminate"
        class="text-krds-gray-60 tabular-nums"
      >
        {{ formatValue(normalizedValue, max) }}
      </span>
    </div>
    <div
      role="progressbar"
      :aria-valuenow="isIndeterminate ? undefined : normalizedValue"
      :aria-valuemin="0"
      :aria-valuemax="max"
      :aria-label="label || ariaLabel || '진행률'"
      :aria-busy="isIndeterminate"
      :class="progressClasses"
    >
      <div :class="indicatorClasses" :style="indicatorStyle" />
    </div>
  </div>
</template>

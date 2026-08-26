<script setup lang="ts">
import { computed } from 'vue';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center justify-center font-medium transition-colors',
  {
    variants: {
      variant: {
        gray: 'bg-krds-gray-5 text-krds-gray-90',
        primary: 'bg-krds-primary-5 text-krds-primary-base',
        secondary: 'bg-krds-gray-10 text-krds-gray-80',
        success: 'bg-krds-success-5 text-krds-success-base',
        warning: 'bg-krds-warning-5 text-krds-warning-60',
        error: 'bg-krds-danger-5 text-krds-danger-base',
        info: 'bg-krds-info-5 text-krds-info-base',
        'outline-gray': 'border border-krds-gray-30 bg-transparent text-krds-gray-90',
        'outline-primary': 'border border-krds-primary-base bg-transparent text-krds-primary-base',
        'outline-secondary': 'border border-krds-gray-50 bg-transparent text-krds-gray-90',
        'outline-success': 'border border-krds-success-base bg-transparent text-krds-success-base',
        'outline-warning': 'border border-krds-warning-base bg-transparent text-krds-warning-base',
        'outline-error': 'border border-krds-danger-base bg-transparent text-krds-danger-base',
        'outline-info': 'border border-krds-info-base bg-transparent text-krds-info-base',
        'solid-gray': 'bg-krds-gray-60 text-white',
        'solid-primary': 'bg-krds-primary-base text-white',
        'solid-secondary': 'bg-krds-gray-50 text-white',
        'solid-success': 'bg-krds-success-base text-white',
        'solid-warning': 'bg-krds-warning-base text-krds-gray-90',
        'solid-error': 'bg-krds-danger-base text-white',
        'solid-info': 'bg-krds-info-base text-white',
      },
      size: {
        md: 'text-[15px] h-6 px-2 rounded-[4px]',
        lg: 'text-[17px] h-8 px-2.5 rounded-[4px]',
      },
      shape: {
        rounded: '',
        pill: 'rounded-full',
        square: 'rounded-none',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      shape: 'rounded',
    },
  }
);

type BadgeVariant =
  | 'gray'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'outline-gray'
  | 'outline-primary'
  | 'outline-secondary'
  | 'outline-success'
  | 'outline-warning'
  | 'outline-error'
  | 'outline-info'
  | 'solid-gray'
  | 'solid-primary'
  | 'solid-secondary'
  | 'solid-success'
  | 'solid-warning'
  | 'solid-error'
  | 'solid-info';

const props = withDefaults(
  defineProps<{
    variant?: BadgeVariant;
    size?: 'md' | 'lg';
    shape?: 'rounded' | 'pill' | 'square';
    class?: string;
  }>(),
  {
    variant: 'primary',
    size: 'md',
    shape: 'rounded',
  }
);

const classes = computed(() =>
  cn(badgeVariants({ variant: props.variant, size: props.size, shape: props.shape }), props.class)
);
</script>

<template>
  <span :class="classes">
    <span v-if="$slots.iconLeft" class="mr-1 -ml-0.5" aria-hidden="true">
      <slot name="iconLeft" />
    </span>
    <slot />
    <span v-if="$slots.iconRight" class="ml-1 -mr-0.5" aria-hidden="true">
      <slot name="iconRight" />
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { cva } from 'class-variance-authority';
import { SquareArrowOutUpRight } from 'lucide-vue-next';
import { cn } from '@/lib/utils';

const linkVariants = cva(
  'inline-flex items-center gap-1 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          '[color:var(--krds-color-light-gray-90)] hover:[color:var(--krds-color-light-primary-50)] active:text-krds-primary-60 focus-visible:ring-krds-gray-90',
        primary:
          '[color:var(--krds-color-light-primary-50)] hover:[color:var(--krds-color-light-primary-60)] active:text-krds-primary-70 focus-visible:ring-krds-primary-60',
      },
      size: {
        sm: '[font-size:var(--krds-size-body-sm)]',
        md: '[font-size:var(--krds-size-body-md)]',
        lg: '[font-size:var(--krds-size-body-lg)]',
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
    href?: string;
    variant?: 'default' | 'primary';
    size?: 'sm' | 'md' | 'lg';
    underline?: boolean;
    external?: boolean;
    class?: string;
  }>(),
  {
    variant: 'default',
    size: 'md',
    underline: false,
    external: false,
  }
);

const classes = computed(() =>
  cn(
    linkVariants({ variant: props.variant, size: props.size }),
    props.underline && 'underline underline-offset-4',
    props.class
  )
);

const externalAttrs = computed(() =>
  props.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
);
</script>

<template>
  <a :href="href" :class="classes" v-bind="externalAttrs">
    <slot />
    <template v-if="external">
      <SquareArrowOutUpRight
        class="inline-block ml-1"
        :size="16"
        aria-hidden="true"
      />
      <span class="sr-only"> (새 창 열림)</span>
    </template>
  </a>
</template>

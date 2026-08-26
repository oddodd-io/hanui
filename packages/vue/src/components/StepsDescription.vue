<script setup lang="ts">
/**
 * StepsDescription 컴포넌트
 * Steps 내부의 설명
 */
import { computed, inject } from 'vue';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import {
  StepsContextKey,
  StepsItemContextKey,
  type StepsContextValue,
  type StepsItemContextValue,
} from '../composables/stepsContext';

// ============================================================================
// Props
// ============================================================================

const props = defineProps<{
  /** 추가 className */
  class?: string;
}>();

// ============================================================================
// Variants
// ============================================================================

const stepsDescriptionVariants = cva('transition-colors', {
  variants: {
    status: {
      completed: 'text-krds-gray-50',
      current: 'text-krds-gray-70',
      upcoming: 'text-krds-gray-60',
    },
    size: {
      sm: 'text-krds-body-xs',
      md: 'text-krds-body-xs',
      lg: 'text-krds-body-sm',
    },
  },
  defaultVariants: {
    status: 'upcoming',
    size: 'md',
  },
});

// ============================================================================
// Inject Context
// ============================================================================

const stepsContext = inject<StepsContextValue>(StepsContextKey);
const itemContext = inject<StepsItemContextValue>(StepsItemContextKey);

if (!stepsContext || !itemContext) {
  throw new Error('StepsDescription은 StepsItem 컴포넌트 내부에서 사용해야 합니다.');
}

// ============================================================================
// Computed
// ============================================================================

const descriptionClasses = computed(() =>
  cn(
    stepsDescriptionVariants({
      status: itemContext.status.value,
      size: stepsContext.size.value,
    }),
    props.class
  )
);
</script>

<template>
  <p :class="descriptionClasses">
    <slot />
  </p>
</template>

<script setup lang="ts">
/**
 * StepsIndicatorItem 컴포넌트
 * Steps 내부의 인디케이터 (숫자 또는 체크 아이콘)
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
import { Check } from 'lucide-vue-next';

// ============================================================================
// Props
// ============================================================================

const props = withDefaults(
  defineProps<{
    /** 체크 아이콘 표시 여부 (완료 시) */
    showCheckIcon?: boolean;
    /** 추가 className */
    class?: string;
  }>(),
  {
    showCheckIcon: true,
  }
);

// ============================================================================
// Variants
// ============================================================================

const stepsIndicatorVariants = cva(
  'flex items-center justify-center rounded-full font-medium transition-colors shrink-0 border-[3px]',
  {
    variants: {
      status: {
        completed: 'bg-krds-gray-50 border-krds-gray-50 text-white',
        current:
          'bg-white border-krds-primary-base text-krds-primary-base ring-4 ring-krds-primary-20',
        upcoming: 'bg-krds-gray-10 border-krds-gray-20 text-krds-gray-70',
      },
      size: {
        sm: 'w-6 h-6 text-krds-body-xs',
        md: 'w-8 h-8 text-krds-body-sm',
        lg: 'w-10 h-10 text-krds-body-md',
      },
    },
    defaultVariants: {
      status: 'upcoming',
      size: 'md',
    },
  }
);

// ============================================================================
// Inject Context
// ============================================================================

const stepsContext = inject<StepsContextValue>(StepsContextKey);
const itemContext = inject<StepsItemContextValue>(StepsItemContextKey);

if (!stepsContext || !itemContext) {
  throw new Error('StepsIndicatorItem은 StepsItem 컴포넌트 내부에서 사용해야 합니다.');
}

// ============================================================================
// Computed
// ============================================================================

const indicatorClasses = computed(() =>
  cn(
    stepsIndicatorVariants({
      status: itemContext.status.value,
      size: stepsContext.size.value,
    }),
    props.class
  )
);

const showCheck = computed(() =>
  itemContext.status.value === 'completed' && props.showCheckIcon
);
</script>

<template>
  <span
    :class="indicatorClasses"
    aria-hidden="true"
  >
    <slot>
      <Check v-if="showCheck" class="w-4 h-4" />
      <span v-else>{{ itemContext.index + 1 }}</span>
    </slot>
  </span>
</template>

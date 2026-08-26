<script setup lang="ts">
import { inject, computed, ref, onMounted, onUnmounted } from 'vue';
import { cva } from 'class-variance-authority';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { cn } from '@/lib/utils';

const tabsListVariants = cva('flex', {
  variants: {
    variant: {
      default: 'border-b border-krds-gray-20',
      pills:
        'overflow-hidden w-full rounded-lg bg-krds-white border border-krds-gray-20',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'pills';
    scrollable?: boolean;
    class?: string;
  }>(),
  {
    scrollable: false,
  }
);

const tabsContext = inject<{
  variant: 'default' | 'pills';
}>('tabsContext');

const variant = computed(
  () => props.variant || tabsContext?.variant || 'default'
);

const scrollContainerRef = ref<HTMLDivElement | null>(null);
const canScrollLeft = ref(false);
const canScrollRight = ref(false);

const updateScrollState = () => {
  const container = scrollContainerRef.value;
  if (!container) return;

  const { scrollLeft, scrollWidth, clientWidth } = container;
  canScrollLeft.value = scrollLeft > 0;
  canScrollRight.value = scrollLeft < scrollWidth - clientWidth - 1;
};

const scroll = (direction: 'left' | 'right') => {
  const container = scrollContainerRef.value;
  if (!container) return;

  const scrollAmount = container.clientWidth * 0.5;
  container.scrollBy({
    left: direction === 'left' ? -scrollAmount : scrollAmount,
    behavior: 'smooth',
  });
};

const handleKeyDown = (event: KeyboardEvent) => {
  const container = scrollContainerRef.value;
  if (!container) return;

  const tabs = Array.from(
    container.querySelectorAll<HTMLButtonElement>(
      '[role="tab"]:not([disabled])'
    )
  );
  const currentIndex = tabs.findIndex((tab) => tab === event.target);

  if (currentIndex === -1) return;

  let nextIndex = currentIndex;

  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault();
      nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
      break;
    case 'ArrowRight':
      event.preventDefault();
      nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
      break;
    case 'Home':
      event.preventDefault();
      nextIndex = 0;
      break;
    case 'End':
      event.preventDefault();
      nextIndex = tabs.length - 1;
      break;
    default:
      return;
  }

  const nextTab = tabs[nextIndex];
  nextTab?.focus();
  nextTab?.click();

  if (props.scrollable && nextTab) {
    nextTab.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    });
  }
};

onMounted(() => {
  if (props.scrollable) {
    updateScrollState();
    scrollContainerRef.value?.addEventListener('scroll', updateScrollState);
    window.addEventListener('resize', updateScrollState);
  }
});

onUnmounted(() => {
  if (props.scrollable) {
    scrollContainerRef.value?.removeEventListener('scroll', updateScrollState);
    window.removeEventListener('resize', updateScrollState);
  }
});

const classes = computed(() =>
  cn(tabsListVariants({ variant: variant.value }), props.class)
);
</script>

<template>
  <!-- Scrollable tabs -->
  <div v-if="scrollable" :class="cn('relative flex items-center', props.class)">
    <button
      type="button"
      @click="scroll('left')"
      :disabled="!canScrollLeft"
      aria-label="이전 탭 보기"
      :class="
        cn(
          'absolute left-0 top-1/2 -translate-y-1/2',
          'flex-shrink-0 flex items-center justify-center',
          'w-10 h-10 rounded-full',
          'bg-krds-gray-90 text-white',
          'hover:bg-krds-gray-80',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-krds-func-info',
          'disabled:opacity-0 disabled:pointer-events-none',
          'transition-opacity'
        )
      "
    >
      <ChevronLeft class="w-5 h-5" aria-hidden="true" />
    </button>

    <!-- tablist 자체는 포커스 대상이 아니다. 포커스는 내부의 각 탭이 받는다 -->
    <!-- eslint-disable-next-line vuejs-accessibility/interactive-supports-focus -->
    <div
      ref="scrollContainerRef"
      role="tablist"
      :tabindex="-1"
      @keydown="handleKeyDown"
      :class="
        cn(
          'flex-1 overflow-x-auto scrollbar-hide',
          tabsListVariants({ variant: variant })
        )
      "
      :style="{ scrollbarWidth: 'none', msOverflowStyle: 'none' }"
    >
      <slot />
    </div>

    <button
      type="button"
      @click="scroll('right')"
      :disabled="!canScrollRight"
      aria-label="다음 탭 보기"
      :class="
        cn(
          'absolute right-0 top-1/2 -translate-y-1/2',
          'flex-shrink-0 flex items-center justify-center',
          'w-10 h-10 rounded-full',
          'bg-krds-gray-90 text-white',
          'hover:bg-krds-gray-80',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-krds-func-info',
          'disabled:opacity-0 disabled:pointer-events-none',
          'transition-opacity'
        )
      "
    >
      <ChevronRight class="w-5 h-5" aria-hidden="true" />
    </button>
  </div>

  <!-- Normal tabs -->
  <!-- tablist 자체는 포커스 대상이 아니다. 포커스는 내부의 각 탭이 받는다 -->
  <!-- eslint-disable-next-line vuejs-accessibility/interactive-supports-focus -->
  <div
    v-else
    role="tablist"
    :tabindex="-1"
    :class="classes"
    @keydown="handleKeyDown"
  >
    <slot />
  </div>
</template>

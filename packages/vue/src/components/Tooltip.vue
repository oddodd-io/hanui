<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, useId } from 'vue';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const tooltipVariants = cva(
  'absolute z-50 px-3 py-1 text-sm rounded-md shadow-lg pointer-events-none w-max max-w-xs break-words animate-in fade-in-0 zoom-in-95',
  {
    variants: {
      variant: {
        default: 'bg-krds-gray-90 text-white',
        light: 'bg-white text-krds-gray-90 border border-krds-gray-20',
      },
      position: {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2 before:content-[""] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-[6px] before:border-transparent',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2 before:content-[""] before:absolute before:bottom-full before:left-1/2 before:-translate-x-1/2 before:border-[6px] before:border-transparent',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2 before:content-[""] before:absolute before:left-full before:top-1/2 before:-translate-y-1/2 before:border-[6px] before:border-transparent',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2 before:content-[""] before:absolute before:right-full before:top-1/2 before:-translate-y-1/2 before:border-[6px] before:border-transparent',
      },
    },
    compoundVariants: [
      { variant: 'default', position: 'top', class: 'before:border-t-krds-gray-90' },
      { variant: 'default', position: 'bottom', class: 'before:border-b-krds-gray-90' },
      { variant: 'default', position: 'left', class: 'before:border-l-krds-gray-90' },
      { variant: 'default', position: 'right', class: 'before:border-r-krds-gray-90' },
      { variant: 'light', position: 'top', class: 'before:border-t-white' },
      { variant: 'light', position: 'bottom', class: 'before:border-b-white' },
      { variant: 'light', position: 'left', class: 'before:border-l-white' },
      { variant: 'light', position: 'right', class: 'before:border-r-white' },
    ],
    defaultVariants: {
      variant: 'default',
      position: 'right',
    },
  }
);

const props = withDefaults(
  defineProps<{
    content: string;
    variant?: 'default' | 'light';
    position?: 'top' | 'bottom' | 'left' | 'right';
    delay?: number;
    disabled?: boolean;
    autoPosition?: boolean;
    class?: string;
    wrapperClass?: string;
  }>(),
  {
    variant: 'default',
    position: 'right',
    delay: 200,
    disabled: false,
    autoPosition: true,
  }
);

const isVisible = ref(false);
const autoPos = ref<'left' | 'right'>('right');
const wrapperRef = ref<HTMLDivElement | null>(null);
const tooltipId = `tooltip-${useId()}`;
let timeoutId: ReturnType<typeof setTimeout> | null = null;

const calculatePosition = () => {
  if (!wrapperRef.value || !props.autoPosition) return;

  const rect = wrapperRef.value.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const elementCenter = rect.left + rect.width / 2;

  if (elementCenter > viewportWidth / 2) {
    autoPos.value = 'left';
  } else {
    autoPos.value = 'right';
  }
};

const handleShow = () => {
  if (props.disabled) return;

  calculatePosition();

  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  timeoutId = setTimeout(() => {
    isVisible.value = true;
  }, props.delay);
};

const handleHide = () => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  isVisible.value = false;
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isVisible.value) {
    handleHide();
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown);
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
});

const finalPosition = computed(() =>
  props.position || (props.autoPosition ? autoPos.value : 'right')
);

const tooltipClasses = computed(() =>
  cn(
    tooltipVariants({ variant: props.variant, position: finalPosition.value }),
    props.class
  )
);
</script>

<template>
  <div
    ref="wrapperRef"
    :class="cn('relative inline-block', wrapperClass)"
    @mouseenter="handleShow"
    @mouseleave="handleHide"
    @focus="handleShow"
    @blur="handleHide"
  >
    <slot />

    <div
      v-if="isVisible && !disabled"
      :id="tooltipId"
      role="tooltip"
      :class="tooltipClasses"
    >
      {{ content }}
    </div>
  </div>
</template>

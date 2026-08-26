<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const sliderVariants = cva(
  'relative flex w-full touch-none select-none items-center',
  {
    variants: {
      size: {
        sm: '',
        md: '',
        lg: '',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const trackSizes = {
  sm: 'h-1',
  md: 'h-1.5',
  lg: 'h-2',
};

const thumbSizes = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

const colorClasses = {
  primary: {
    range: 'bg-krds-primary-base',
    thumb: 'border-krds-primary-base focus-visible:ring-krds-primary-base',
  },
  secondary: {
    range: 'bg-krds-gray-60',
    thumb: 'border-krds-gray-60 focus-visible:ring-krds-gray-60',
  },
  success: {
    range: 'bg-krds-func-success-base',
    thumb:
      'border-krds-func-success-base focus-visible:ring-krds-func-success-base',
  },
  danger: {
    range: 'bg-krds-danger-base',
    thumb: 'border-krds-danger-base focus-visible:ring-krds-danger-base',
  },
};

type SliderColor = 'primary' | 'secondary' | 'success' | 'danger';

const props = withDefaults(
  defineProps<{
    modelValue?: number | number[];
    min?: number;
    max?: number;
    step?: number;
    size?: 'sm' | 'md' | 'lg';
    color?: SliderColor;
    showValue?: boolean;
    formatValue?: (value: number) => string;
    disabled?: boolean;
    label?: string;
    labelId?: string;
    class?: string;
  }>(),
  {
    min: 0,
    max: 100,
    step: 1,
    size: 'md',
    color: 'primary',
    showValue: false,
    formatValue: (v: number) => String(v),
    disabled: false,
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: number | number[]];
}>();

const internalValue = ref<number[]>(
  Array.isArray(props.modelValue)
    ? props.modelValue
    : [props.modelValue ?? props.min]
);

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== undefined) {
      internalValue.value = Array.isArray(newValue) ? newValue : [newValue];
    }
  }
);

const isRange = computed(() => internalValue.value.length > 1);

const percentage = computed(() => {
  const range = props.max - props.min;
  if (isRange.value) {
    const start = ((internalValue.value[0] - props.min) / range) * 100;
    const end = ((internalValue.value[1] - props.min) / range) * 100;
    return { start, end };
  }
  return {
    start: 0,
    end: ((internalValue.value[0] - props.min) / range) * 100,
  };
});

const rangeStyle = computed(() => ({
  left: `${percentage.value.start}%`,
  width: `${percentage.value.end - percentage.value.start}%`,
}));

const thumbPosition = computed(() => {
  const range = props.max - props.min;
  return internalValue.value.map((v) => ((v - props.min) / range) * 100);
});

const handleThumbDrag = (index: number, event: MouseEvent | TouchEvent) => {
  if (props.disabled) return;

  const track = (event.currentTarget as HTMLElement).parentElement;
  if (!track) return;

  const rect = track.getBoundingClientRect();

  const updateValue = (clientX: number) => {
    const percent = Math.max(
      0,
      Math.min(1, (clientX - rect.left) / rect.width)
    );
    const value =
      Math.round((percent * (props.max - props.min) + props.min) / props.step) *
      props.step;

    const newValues = [...internalValue.value];
    newValues[index] = Math.max(props.min, Math.min(props.max, value));

    // 범위 슬라이더: 값 정렬
    if (isRange.value) {
      if (index === 0 && newValues[0] > newValues[1]) {
        newValues[0] = newValues[1];
      } else if (index === 1 && newValues[1] < newValues[0]) {
        newValues[1] = newValues[0];
      }
    }

    internalValue.value = newValues;
    emit('update:modelValue', isRange.value ? newValues : newValues[0]);
  };

  const handleMove = (e: MouseEvent | TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    updateValue(clientX);
  };

  const handleEnd = () => {
    document.removeEventListener('mousemove', handleMove);
    document.removeEventListener('mouseup', handleEnd);
    document.removeEventListener('touchmove', handleMove);
    document.removeEventListener('touchend', handleEnd);
  };

  document.addEventListener('mousemove', handleMove);
  document.addEventListener('mouseup', handleEnd);
  document.addEventListener('touchmove', handleMove);
  document.addEventListener('touchend', handleEnd);
};

/** index번 thumb을 value로 옮긴다 (범위·경계 클램프 포함) */
const commitValue = (index: number, value: number) => {
  const stepped =
    Math.round((value - props.min) / props.step) * props.step + props.min;
  let next = Math.max(props.min, Math.min(props.max, stepped));

  // 범위 슬라이더에서 두 thumb이 서로를 지나치지 않게 한다
  if (isRange.value) {
    if (index === 0) next = Math.min(next, internalValue.value[1]);
    else next = Math.max(next, internalValue.value[0]);
  }

  const newValues = [...internalValue.value];
  newValues[index] = next;
  internalValue.value = newValues;
  emit('update:modelValue', isRange.value ? newValues : newValues[0]);
};

/**
 * role="slider"는 키보드로 값을 바꿀 수 있어야 한다 (WCAG 2.1.1).
 * WAI-ARIA Slider 패턴: 화살표 ±step, PageUp/Down ±10step, Home/End 양끝.
 */
const handleThumbKeyDown = (index: number, e: KeyboardEvent) => {
  if (props.disabled) return;
  const current = internalValue.value[index];
  const big = props.step * 10;
  let next: number | null = null;

  switch (e.key) {
    case 'ArrowRight':
    case 'ArrowUp':
      next = current + props.step;
      break;
    case 'ArrowLeft':
    case 'ArrowDown':
      next = current - props.step;
      break;
    case 'PageUp':
      next = current + big;
      break;
    case 'PageDown':
      next = current - big;
      break;
    case 'Home':
      next = props.min;
      break;
    case 'End':
      next = props.max;
      break;
    default:
      return;
  }

  e.preventDefault();
  commitValue(index, next);
};

/** 범위 슬라이더에서 각 thumb이 움직일 수 있는 한계 */
const thumbMin = (index: number) =>
  isRange.value && index === 1 ? internalValue.value[0] : props.min;
const thumbMax = (index: number) =>
  isRange.value && index === 0 ? internalValue.value[1] : props.max;

const thumbLabel = (index: number) => {
  if (!isRange.value) return props.label;
  return index === 0 ? '최솟값' : '최댓값';
};

const handleTrackClick = (event: MouseEvent) => {
  if (props.disabled) return;

  const track = event.currentTarget as HTMLElement;
  const rect = track.getBoundingClientRect();
  const percent = (event.clientX - rect.left) / rect.width;
  const value =
    Math.round((percent * (props.max - props.min) + props.min) / props.step) *
    props.step;
  const clampedValue = Math.max(props.min, Math.min(props.max, value));

  if (isRange.value) {
    // 가장 가까운 thumb으로 이동
    const distToFirst = Math.abs(clampedValue - internalValue.value[0]);
    const distToSecond = Math.abs(clampedValue - internalValue.value[1]);
    const newValues = [...internalValue.value];
    if (distToFirst < distToSecond) {
      newValues[0] = clampedValue;
    } else {
      newValues[1] = clampedValue;
    }
    internalValue.value = newValues;
    emit('update:modelValue', newValues);
  } else {
    internalValue.value = [clampedValue];
    emit('update:modelValue', clampedValue);
  }
};

const classes = computed(() =>
  cn(sliderVariants({ size: props.size }), props.class)
);
</script>

<template>
  <div class="w-full">
    <!-- Label and value display -->
    <div
      v-if="label || showValue"
      class="mb-2 flex items-center justify-between"
    >
      <label
        v-if="label"
        :id="labelId"
        class="text-sm font-medium text-krds-gray-70"
      >
        {{ label }}
      </label>
      <span v-if="showValue" class="text-sm text-krds-gray-50">
        <template v-if="isRange">
          {{ formatValue(internalValue[0]) }} -
          {{ formatValue(internalValue[internalValue.length - 1]) }}
        </template>
        <template v-else>
          {{ formatValue(internalValue[0]) }}
        </template>
      </span>
    </div>

    <!-- Slider -->
    <div
      :class="classes"
      role="group"
      :aria-disabled="disabled"
      :aria-labelledby="labelId"
      :aria-label="labelId ? undefined : label"
    >
      <!-- Track -->
      <div
        :class="
          cn(
            'relative grow overflow-hidden rounded-full bg-krds-gray-20',
            trackSizes[size]
          )
        "
        @click="handleTrackClick"
      >
        <!-- Range -->
        <div
          :class="cn('absolute h-full', colorClasses[color].range)"
          :style="rangeStyle"
        />
      </div>

      <!-- Thumbs -->
      <!-- tabindex를 바인딩으로 주고 있어 규칙이 정적으로 판별하지 못한다 -->
      <!-- eslint-disable-next-line vuejs-accessibility/interactive-supports-focus -->
      <div
        v-for="(_, index) in internalValue"
        :key="index"
        :class="
          cn(
            'absolute block rounded-full border-2 bg-white shadow-md transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            'cursor-pointer',
            disabled && 'pointer-events-none opacity-50',
            thumbSizes[size],
            colorClasses[color].thumb
          )
        "
        :style="{
          left: `calc(${thumbPosition[index]}% - ${size === 'sm' ? '6px' : size === 'lg' ? '10px' : '8px'})`,
        }"
        :tabindex="disabled ? -1 : 0"
        role="slider"
        :aria-valuemin="thumbMin(index)"
        :aria-valuemax="thumbMax(index)"
        :aria-valuenow="internalValue[index]"
        :aria-valuetext="formatValue(internalValue[index])"
        aria-orientation="horizontal"
        :aria-disabled="disabled"
        :aria-label="thumbLabel(index)"
        :aria-labelledby="!isRange && labelId ? labelId : undefined"
        @mousedown="handleThumbDrag(index, $event)"
        @touchstart="handleThumbDrag(index, $event)"
        @keydown="handleThumbKeyDown(index, $event)"
      />
    </div>
  </div>
</template>

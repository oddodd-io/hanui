<script setup lang="ts">
/**
 * StepIndicator 컴포넌트
 * KRDS 단계 표시기 - 사용자가 거쳐야 하는 일련의 단계를 시각화
 */
import { computed } from 'vue';
import { cn } from '@/lib/utils';

// Step 상태 타입
export type StepStatus = 'completed' | 'current' | 'upcoming';
export type StepOrientation = 'horizontal' | 'vertical';
export type StepSize = 'sm' | 'md' | 'lg';

// 개별 Step 데이터 타입
export interface StepItem {
  label: string;
  description?: string;
  optional?: boolean;
}

const props = withDefaults(
  defineProps<{
    /** 단계 목록 */
    steps: StepItem[];
    /** 현재 단계 인덱스 (0부터 시작) */
    currentStep: number;
    /** 레이아웃 방향 */
    orientation?: StepOrientation;
    /** 크기 */
    size?: StepSize;
    /** 클릭 가능 여부 */
    clickable?: boolean;
    /** 완료 아이콘 표시 여부 */
    showCheckIcon?: boolean;
    /** 추가 클래스 */
    class?: string;
  }>(),
  {
    orientation: 'horizontal',
    size: 'md',
    clickable: false,
    showCheckIcon: true,
  }
);

const emit = defineEmits<{
  (e: 'stepClick', stepIndex: number): void;
}>();

// 단계 상태 결정
function getStepStatus(index: number): StepStatus {
  if (index < props.currentStep) return 'completed';
  if (index === props.currentStep) return 'current';
  return 'upcoming';
}

// 원형 인디케이터 스타일
const circleStatusStyles: Record<StepStatus, string> = {
  completed: 'bg-krds-gray-50 border-krds-gray-50 text-white',
  current: 'bg-white border-krds-primary-base text-krds-primary-base ring-4 ring-krds-primary-20',
  upcoming: 'bg-krds-gray-10 border-krds-gray-20 text-krds-gray-70',
};

const circleSizeStyles: Record<StepSize, string> = {
  sm: 'w-6 h-6 text-krds-body-xs',
  md: 'w-8 h-8 text-krds-body-sm',
  lg: 'w-10 h-10 text-krds-body-md',
};

// 레이블 스타일
const labelStatusStyles: Record<StepStatus, string> = {
  completed: 'text-krds-gray-70',
  current: 'text-krds-gray-95',
  upcoming: 'text-krds-gray-50',
};

const labelSizeStyles: Record<StepSize, string> = {
  sm: 'text-krds-body-xs',
  md: 'text-krds-body-sm',
  lg: 'text-krds-body-md',
};

// 설명 스타일
const descStatusStyles: Record<StepStatus, string> = {
  completed: 'text-krds-gray-50',
  current: 'text-krds-gray-70',
  upcoming: 'text-krds-gray-60',
};

const descSizeStyles: Record<StepSize, string> = {
  sm: 'text-krds-body-xs',
  md: 'text-krds-body-xs',
  lg: 'text-krds-body-sm',
};

// 연결선 스타일
const connectorStatusStyles: Record<StepStatus, string> = {
  completed: 'bg-krds-gray-50',
  current: 'bg-krds-gray-20',
  upcoming: 'bg-krds-gray-20',
};

// 컨테이너 스타일
const containerClasses = computed(() =>
  cn(
    props.orientation === 'horizontal' ? 'flex flex-row items-start' : 'flex flex-col',
    props.class
  )
);

function handleStepClick(index: number) {
  if (!props.clickable) return;
  if (index < props.currentStep) {
    emit('stepClick', index);
  }
}
</script>

<template>
  <ol :class="containerClasses" aria-label="진행 단계">
    <li
      v-for="(step, index) in steps"
      :key="index"
      :class="cn(
        'relative flex',
        orientation === 'horizontal' ? 'flex-1 flex-col' : 'flex-row gap-3 pb-8 last:pb-0'
      )"
      :aria-current="getStepStatus(index) === 'current' ? 'step' : undefined"
    >
      <!-- 수평 방향 -->
      <template v-if="orientation === 'horizontal'">
        <div class="flex items-center w-full">
          <!-- Step 원 -->
          <button
            v-if="clickable && getStepStatus(index) === 'completed'"
            type="button"
            :class="cn(
              'flex items-center justify-center rounded-full font-medium transition-colors shrink-0 border-[3px]',
              circleStatusStyles[getStepStatus(index)],
              circleSizeStyles[size],
              'cursor-pointer hover:ring-4 hover:ring-krds-primary-20'
            )"
            :aria-label="`${index + 1}단계 (완료): ${step.label}`"
            @click="handleStepClick(index)"
          >
            <svg
              v-if="getStepStatus(index) === 'completed' && showCheckIcon"
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span v-else>{{ index + 1 }}</span>
          </button>
          <span
            v-else
            :class="cn(
              'flex items-center justify-center rounded-full font-medium transition-colors shrink-0 border-[3px]',
              circleStatusStyles[getStepStatus(index)],
              circleSizeStyles[size]
            )"
            aria-hidden="true"
          >
            <svg
              v-if="getStepStatus(index) === 'completed' && showCheckIcon"
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span v-else>{{ index + 1 }}</span>
          </span>

          <!-- 연결선 -->
          <div
            v-if="index !== steps.length - 1"
            :class="cn(
              'h-[3px] flex-1 mx-2 transition-colors',
              connectorStatusStyles[index < currentStep ? 'completed' : 'upcoming']
            )"
            aria-hidden="true"
          />
        </div>

        <!-- 레이블과 설명 -->
        <div class="mt-4">
          <span v-if="getStepStatus(index) === 'current'" class="sr-only">현재단계</span>
          <span class="text-krds-gray-50 text-krds-body-xs hidden md:block">
            {{ index + 1 }}단계
          </span>
          <span :class="cn('font-bold transition-colors hidden md:block', labelStatusStyles[getStepStatus(index)], labelSizeStyles[size])">
            {{ step.label }}
            <span v-if="step.optional" class="text-krds-gray-50 ml-1">(선택)</span>
          </span>
          <p
            v-if="step.description"
            :class="cn('mt-1 transition-colors hidden md:block', descStatusStyles[getStepStatus(index)], descSizeStyles[size])"
          >
            {{ step.description }}
          </p>
        </div>
      </template>

      <!-- 수직 방향 -->
      <template v-else>
        <!-- Step 원 -->
        <button
          v-if="clickable && getStepStatus(index) === 'completed'"
          type="button"
          :class="cn(
            'flex items-center justify-center rounded-full font-medium transition-colors shrink-0 border-[3px]',
            circleStatusStyles[getStepStatus(index)],
            circleSizeStyles[size],
            'cursor-pointer hover:ring-4 hover:ring-krds-primary-20'
          )"
          :aria-label="`${index + 1}단계 (완료): ${step.label}`"
          @click="handleStepClick(index)"
        >
          <svg
            v-if="getStepStatus(index) === 'completed' && showCheckIcon"
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2.5"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span v-else>{{ index + 1 }}</span>
        </button>
        <span
          v-else
          :class="cn(
            'flex items-center justify-center rounded-full font-medium transition-colors shrink-0 border-[3px]',
            circleStatusStyles[getStepStatus(index)],
            circleSizeStyles[size]
          )"
          aria-hidden="true"
        >
          <svg
            v-if="getStepStatus(index) === 'completed' && showCheckIcon"
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2.5"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span v-else>{{ index + 1 }}</span>
        </span>

        <!-- 연결선 -->
        <div
          v-if="index !== steps.length - 1"
          :class="cn(
            'w-[3px] absolute left-4 top-10 bottom-2 transition-colors',
            connectorStatusStyles[index < currentStep ? 'completed' : 'upcoming']
          )"
          aria-hidden="true"
        />

        <!-- 레이블과 설명 -->
        <div class="flex flex-col">
          <span v-if="getStepStatus(index) === 'current'" class="sr-only">현재단계</span>
          <span class="text-krds-gray-50 text-krds-body-xs">{{ index + 1 }}단계</span>
          <span :class="cn('font-bold transition-colors', labelStatusStyles[getStepStatus(index)], labelSizeStyles[size])">
            {{ step.label }}
            <span v-if="step.optional" class="text-krds-gray-50 ml-1">(선택)</span>
          </span>
          <p
            v-if="step.description"
            :class="cn('mt-0.5 transition-colors', descStatusStyles[getStepStatus(index)], descSizeStyles[size])"
          >
            {{ step.description }}
          </p>
        </div>
      </template>
    </li>
  </ol>
</template>

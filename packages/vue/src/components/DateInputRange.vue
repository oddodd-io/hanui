<script setup lang="ts">
/**
 * DateInputRange 컴포넌트
 * KRDS 날짜 입력 필드 - 기간(범위) 입력
 */
import { computed, useId } from 'vue';
import { cn } from '@/lib/utils';

const props = withDefaults(
  defineProps<{
    /** 시작일 값 */
    startDate?: string;
    /** 종료일 값 */
    endDate?: string;
    /** 라벨 텍스트 */
    label?: string;
    /** 도움말 텍스트 */
    helperText?: string;
    /** 에러 메시지 */
    errorMessage?: string;
    /** 필수 입력 여부 */
    required?: boolean;
    /** 에러 상태 */
    hasError?: boolean;
    /** 비활성화 상태 */
    disabled?: boolean;
    /** 시작일 플레이스홀더 */
    startPlaceholder?: string;
    /** 종료일 플레이스홀더 */
    endPlaceholder?: string;
    /** 달력 버튼 표시 */
    showCalendarButton?: boolean;
    /** 추가 클래스 */
    class?: string;
  }>(),
  {
    required: false,
    hasError: false,
    disabled: false,
    startPlaceholder: 'YYYY-MM-DD',
    endPlaceholder: 'YYYY-MM-DD',
    showCalendarButton: false,
  }
);

const emit = defineEmits<{
  (e: 'update:startDate', value: string): void;
  (e: 'update:endDate', value: string): void;
  (e: 'startCalendarClick'): void;
  (e: 'endCalendarClick'): void;
}>();

const uniqueId = useId();
const labelId = `date-range-${uniqueId}-label`;

const fieldClasses = computed(() =>
  cn(
    'w-full h-14 rounded-lg border bg-white pl-4',
    'text-krds-body-md text-krds-gray-90 placeholder:text-krds-gray-50',
    'transition-colors focus:outline-none focus:ring-2 focus:ring-krds-primary-base focus:border-krds-primary-base',
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-krds-gray-10',
    props.hasError
      ? 'border-krds-functional-error focus:ring-krds-functional-error focus:border-krds-functional-error'
      : 'border-krds-gray-60',
    props.showCalendarButton ? 'pr-12' : 'pr-4'
  )
);

function handleStartDateInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update:startDate', target.value);
}

function handleEndDateInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update:endDate', target.value);
}
</script>

<template>
  <div :class="cn('form-group', props.class)">
    <!-- 라벨 -->
    <label
      v-if="label"
      :id="labelId"
      class="form-tit block text-krds-body-sm font-medium text-krds-gray-90 mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-krds-functional-error ml-0.5">*</span>
    </label>

    <!-- 도움말 -->
    <p
      v-if="helperText"
      :id="`${labelId}-helper`"
      class="form-hint text-krds-body-sm text-krds-gray-60 mb-2"
    >
      {{ helperText }}
    </p>

    <!-- 입력 필드 그룹 -->
    <div
      role="group"
      :aria-labelledby="label ? labelId : undefined"
      class="flex items-center gap-2"
    >
      <!-- 시작일 -->
      <div class="relative flex-1">
        <input
          type="text"
          inputmode="numeric"
          :value="startDate"
          :placeholder="startPlaceholder"
          :disabled="disabled"
          :aria-invalid="hasError ? 'true' : undefined"
          :class="fieldClasses"
          aria-label="시작일"
          @input="handleStartDateInput"
        />
        <button
          v-if="showCalendarButton"
          type="button"
          class="form-btn-datepicker absolute right-3 top-1/2 -translate-y-1/2 text-krds-gray-50 hover:text-krds-gray-70 transition-colors disabled:opacity-50"
          :disabled="disabled"
          aria-label="시작일 달력 열기"
          @click="emit('startCalendarClick')"
        >
          <svg
            class="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
          </svg>
        </button>
      </div>

      <!-- 구분자 -->
      <span class="text-krds-body-sm text-krds-gray-70 shrink-0">~</span>

      <!-- 종료일 -->
      <div class="relative flex-1">
        <input
          type="text"
          inputmode="numeric"
          :value="endDate"
          :placeholder="endPlaceholder"
          :disabled="disabled"
          :aria-invalid="hasError ? 'true' : undefined"
          :class="fieldClasses"
          aria-label="종료일"
          @input="handleEndDateInput"
        />
        <button
          v-if="showCalendarButton"
          type="button"
          class="form-btn-datepicker absolute right-3 top-1/2 -translate-y-1/2 text-krds-gray-50 hover:text-krds-gray-70 transition-colors disabled:opacity-50"
          :disabled="disabled"
          aria-label="종료일 달력 열기"
          @click="emit('endCalendarClick')"
        >
          <svg
            class="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 에러 메시지 -->
    <p
      v-if="hasError && errorMessage"
      class="form-hint flex items-center gap-1 text-krds-body-sm text-krds-danger mt-2"
    >
      <svg
        class="w-4 h-4 flex-shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="m15 9-6 6" />
        <path d="m9 9 6 6" />
      </svg>
      {{ errorMessage }}
    </p>
  </div>
</template>

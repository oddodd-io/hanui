<script setup lang="ts">
/**
 * DateInputMultiple 컴포넌트
 * KRDS 날짜 입력 필드 - 년/월/일 분리 입력
 */
import { computed, useId } from 'vue';
import { cn } from '@/lib/utils';

const props = withDefaults(
  defineProps<{
    /** 년도 값 */
    year?: string;
    /** 월 값 */
    month?: string;
    /** 일 값 */
    day?: string;
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
    /** 년도 필드 숨김 */
    hideYear?: boolean;
    /** 일 필드 숨김 */
    hideDay?: boolean;
    /** 추가 클래스 */
    class?: string;
  }>(),
  {
    required: false,
    hasError: false,
    disabled: false,
    hideYear: false,
    hideDay: false,
  }
);

const emit = defineEmits<{
  (e: 'update:year', value: string): void;
  (e: 'update:month', value: string): void;
  (e: 'update:day', value: string): void;
}>();

const uniqueId = useId();
const labelId = `date-multiple-${uniqueId}-label`;

const fieldClasses = computed(() =>
  cn(
    'h-14 rounded-lg border bg-white text-center',
    'text-krds-body-md text-krds-gray-90 placeholder:text-krds-gray-50',
    'transition-colors focus:outline-none focus:ring-2 focus:ring-krds-primary-base focus:border-krds-primary-base',
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-krds-gray-10',
    props.hasError
      ? 'border-krds-functional-error focus:ring-krds-functional-error focus:border-krds-functional-error'
      : 'border-krds-gray-60'
  )
);

function handleYearChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const value = target.value.replace(/\D/g, '').slice(0, 4);
  emit('update:year', value);
}

function handleMonthChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const value = target.value.replace(/\D/g, '').slice(0, 2);
  const numValue = parseInt(value, 10);
  if (value === '' || (numValue >= 0 && numValue <= 12)) {
    emit('update:month', value);
  }
}

function handleDayChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const value = target.value.replace(/\D/g, '').slice(0, 2);
  const numValue = parseInt(value, 10);
  if (value === '' || (numValue >= 0 && numValue <= 31)) {
    emit('update:day', value);
  }
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
      <!-- 년도 -->
      <div v-if="!hideYear" class="flex items-center gap-1">
        <input
          type="text"
          inputmode="numeric"
          :value="year"
          placeholder="YYYY"
          :disabled="disabled"
          :aria-invalid="hasError ? 'true' : undefined"
          :class="cn(fieldClasses, 'w-20')"
          aria-label="년도"
          maxlength="4"
          @input="handleYearChange"
        />
        <span class="text-krds-body-sm text-krds-gray-70">년</span>
      </div>

      <!-- 월 -->
      <div class="flex items-center gap-1">
        <input
          type="text"
          inputmode="numeric"
          :value="month"
          placeholder="MM"
          :disabled="disabled"
          :aria-invalid="hasError ? 'true' : undefined"
          :class="cn(fieldClasses, 'w-16')"
          aria-label="월"
          maxlength="2"
          @input="handleMonthChange"
        />
        <span class="text-krds-body-sm text-krds-gray-70">월</span>
      </div>

      <!-- 일 -->
      <div v-if="!hideDay" class="flex items-center gap-1">
        <input
          type="text"
          inputmode="numeric"
          :value="day"
          placeholder="DD"
          :disabled="disabled"
          :aria-invalid="hasError ? 'true' : undefined"
          :class="cn(fieldClasses, 'w-14')"
          aria-label="일"
          maxlength="2"
          @input="handleDayChange"
        />
        <span class="text-krds-body-sm text-krds-gray-70">일</span>
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

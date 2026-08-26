<script setup lang="ts">
/**
 * DateInput 컴포넌트
 * KRDS 날짜 입력 필드 - 특정 날짜 입력
 */
import { computed, ref, useId } from 'vue';
import { cn } from '@/lib/utils';

const props = withDefaults(
  defineProps<{
    /** 값 (v-model) */
    modelValue?: string;
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
    /** 달력 버튼 표시 */
    showCalendarButton?: boolean;
    /** 플레이스홀더 */
    placeholder?: string;
    /** 비활성화 */
    disabled?: boolean;
    /** 추가 클래스 */
    class?: string;
  }>(),
  {
    placeholder: 'YYYY-MM-DD',
    required: false,
    hasError: false,
    showCalendarButton: false,
    disabled: false,
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'calendarClick'): void;
}>();

const uniqueId = useId();
const inputId = `date-input-${uniqueId}`;

const inputClasses = computed(() =>
  cn(
    'calendar-input flex-1 h-14 rounded-lg border bg-white pl-4',
    'text-krds-body-md text-krds-gray-90 placeholder:text-krds-gray-50',
    'transition-colors focus:outline-none focus:ring-2 focus:ring-krds-primary-base focus:border-krds-primary-base',
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-krds-gray-10',
    props.hasError
      ? 'border-krds-functional-error focus:ring-krds-functional-error focus:border-krds-functional-error'
      : 'border-krds-gray-60',
    props.showCalendarButton ? 'pr-12' : 'pr-4'
  )
);

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
}
</script>

<template>
  <div :class="cn('form-group', props.class)">
    <!-- 라벨 -->
    <label
      v-if="label"
      :for="inputId"
      class="form-tit block font-medium text-krds-gray-70 mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-krds-functional-error ml-0.5">*</span>
    </label>

    <!-- 도움말 -->
    <p
      v-if="helperText"
      :id="`${inputId}-helper`"
      class="form-hint text-krds-body-sm text-krds-gray-60 mb-2"
    >
      {{ helperText }}
    </p>

    <!-- 입력 필드 -->
    <div class="relative flex items-center">
      <input
        :id="inputId"
        type="text"
        inputmode="numeric"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="inputClasses"
        :aria-describedby="helperText ? `${inputId}-helper` : undefined"
        :aria-invalid="hasError ? 'true' : undefined"
        :aria-required="required ? 'true' : undefined"
        @input="handleInput"
      />

      <!-- 달력 아이콘 버튼 -->
      <button
        v-if="showCalendarButton"
        type="button"
        class="form-btn-datepicker absolute right-3 text-krds-gray-50 hover:text-krds-gray-70 transition-colors disabled:opacity-50"
        :disabled="disabled"
        aria-label="달력 열기"
        @click="emit('calendarClick')"
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

    <!-- 에러 메시지 -->
    <p
      v-if="hasError && errorMessage"
      :id="`${inputId}-error`"
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

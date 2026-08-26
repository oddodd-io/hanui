<script setup lang="ts">
/**
 * Disclosure 컴포넌트
 * KRDS 디스클로저 - 부가적인 정보를 표시하거나 숨기는 컴포넌트
 * Accordion과 달리 단독으로 사용되며, 여러 개를 동시에 열 수 있음
 */
import { ref, computed, watch, useId } from 'vue';
import { cn } from '@/lib/utils';

const props = withDefaults(
  defineProps<{
    /** 기본 열림 상태 */
    defaultOpen?: boolean;
    /** 제어 모드에서의 열림 상태 */
    open?: boolean;
    /** 추가 클래스 */
    class?: string;
  }>(),
  {
    defaultOpen: false,
  }
);

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
}>();

// 내부 상태 (비제어 모드)
const internalOpen = ref(props.defaultOpen);

// 제어/비제어 모드 판단
const isControlled = computed(() => props.open !== undefined);
const isOpen = computed(() => isControlled.value ? props.open : internalOpen.value);

// 제어 모드에서 외부 값 변경 시 동기화
watch(() => props.open, (newVal) => {
  if (newVal !== undefined) {
    internalOpen.value = newVal;
  }
});

// 토글 핸들러
function handleToggle() {
  const newState = !isOpen.value;

  if (!isControlled.value) {
    internalOpen.value = newState;
  }

  emit('update:open', newState);
}

// 고유 ID 생성
const id = useId();
const triggerId = `disclosure-trigger-${id}`;
const contentId = `disclosure-content-${id}`;
</script>

<template>
  <div :class="props.class">
    <!-- 트리거 버튼 -->
    <button
      :id="triggerId"
      type="button"
      :class="cn(
        'inline-flex items-center gap-2 text-krds-gray-95 hover:text-krds-gray-90',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-krds-primary-base focus-visible:ring-offset-2 rounded'
      )"
      :aria-expanded="isOpen"
      :aria-controls="contentId"
      @click="handleToggle"
    >
      <svg
        :class="cn(
          'w-4 h-4 transition-transform duration-200',
          isOpen ? 'rotate-90' : 'rotate-0'
        )"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 8 16 12 12 16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
      <span><slot name="trigger" /></span>
    </button>

    <!-- 콘텐츠 영역 - CSS Grid 애니메이션 -->
    <div
      :id="contentId"
      role="region"
      :aria-labelledby="triggerId"
      :aria-hidden="!isOpen"
      :class="cn(
        'grid transition-[grid-template-rows] duration-200 ease-out',
        isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
      )"
    >
      <div
        class="overflow-hidden"
        :inert="!isOpen ? true : undefined"
      >
        <div class="mt-1 p-4 rounded text-krds-gray-70 bg-krds-gray-5">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

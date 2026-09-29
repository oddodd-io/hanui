<script setup lang="ts">
/**
 * Badge — KRDS `span.krds-badge` 래퍼
 *
 * KRDS 배지는 JS 동작이 없는 순수 마크업이다. 이 컴포넌트는 스타일·색상·크기 클래스 조합,
 * 숫자형(`.number`, max 초과 시 "999+"), 점형(`.dot`)과
 * 색·숫자만으로 전달되지 않는 의미를 위한 sr-only label만 담당한다.
 * 기준: reference/krds-uiux/html/code/badge*.html, resources/scss/component/_badge.scss
 */
import { computed, useSlots } from 'vue';

export type BadgeVariant = 'outline' | 'bg' | 'bg-light';
export type BadgeColor =
  | 'primary'
  | 'secondary'
  | 'gray'
  | 'point'
  | 'danger'
  | 'warning'
  | 'success'
  | 'information'
  | 'disabled';
export type BadgeSize = 'small' | 'medium' | 'large';

export interface BadgeProps {
  /** outline: 테두리 / bg: 진한 배경 / bg-light: 연한 배경 */
  variant?: BadgeVariant;
  color?: BadgeColor;
  /** KRDS CSS는 large만 크기를 바꾼다. small·medium은 원본 예제처럼 클래스만 붙는다 */
  size?: BadgeSize;
  /** 숫자형 배지(`.number`). 주면 슬롯 대신 숫자를 표시한다 */
  count?: number;
  /** count가 이 값을 넘으면 "{max}+"로 표시한다 */
  max?: number;
  /** 점형 배지(`.dot`). 내용이 없으므로 label이 필요하다 */
  dot?: boolean;
  /** 스크린리더용 설명 (sr-only). 예: count와 함께 "읽지 않은 알림", dot과 함께 "새 글" */
  label?: string;
}

const props = withDefaults(defineProps<BadgeProps>(), {
  variant: 'bg',
  color: 'primary',
  size: undefined,
  count: undefined,
  max: 999,
  dot: false,
  label: undefined,
});

const slots = useSlots();

if (import.meta.env.DEV && props.dot && !props.label) {
  console.warn(
    '[hanui] Badge: dot 배지는 내용이 없어 스크린리더가 읽을 수 없습니다. label을 넣어주세요.'
  );
}

const isNumber = computed(() => props.count !== undefined && !props.dot);

const countText = computed(() => {
  if (props.count === undefined) return '';
  const count = Math.max(0, Math.floor(props.count));
  return count > props.max ? `${props.max}+` : String(count);
});

const classes = computed(() => [
  'krds-badge',
  props.size,
  `${props.variant}-${props.color}`,
  { number: isNumber.value, dot: props.dot },
]);

// label은 내용 앞에 읽힌다 ("읽지 않은 알림 5"). 내용이 있으면 사이에 공백을 둔다
const hasContent = computed(
  () => !props.dot && (isNumber.value || !!slots.default)
);
</script>

<template>
  <span :class="classes">
    <span v-if="label" class="sr-only">{{
      hasContent ? `${label} ` : label
    }}</span>
    <template v-if="!dot">
      <template v-if="isNumber">{{ countText }}</template>
      <slot v-else />
    </template>
  </span>
</template>

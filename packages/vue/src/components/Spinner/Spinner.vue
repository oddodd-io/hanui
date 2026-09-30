<script setup lang="ts">
/**
 * Spinner — KRDS `.krds-spinner[role="status"]` 로딩 표시
 *
 * JS 동작이 없는 순수 마크업이다 (회전 원은 CSS ::before).
 * 원본은 화면 문구("Loading data..")와 sr-only "로딩 중"을 함께 넣어 스크린리더가 두 번 읽으므로,
 * 화면 문구(default 슬롯)가 있으면 sr-only 문구를 생략한다.
 * 입력창 안 스피너는 `<div class="form-spinner"><Input /><Spinner /></div>`로 조합한다 (KRDS 구조).
 * 기준: reference/krds-uiux/html/code/spinner.html, resources/scss/component/_spinner.scss
 */
export interface SpinnerProps {
  /** 스크린리더 문구 (화면 문구가 없을 때) */
  label?: string;
}

withDefaults(defineProps<SpinnerProps>(), {
  label: '로딩 중',
});

defineSlots<{
  /** 화면에 보이는 문구 (예: "데이터를 불러오는 중입니다") */
  default?: () => unknown;
}>();
</script>

<template>
  <div class="krds-spinner" role="status">
    <slot>
      <span class="sr-only">{{ label }}</span>
    </slot>
  </div>
</template>

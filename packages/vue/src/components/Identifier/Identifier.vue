<script setup lang="ts">
/**
 * Identifier — KRDS `.krds-identifier` 운영기관 식별자 ("이 누리집은 ○○부 누리집입니다.")
 *
 * JS 동작이 없는 순수 마크업이다. 로고는 KRDS CSS 배경 이미지이며, logoSrc로 기관 로고를 넣으면 배경을 끈다.
 * 기준: reference/krds-uiux/html/code/identifier.html, resources/scss/component/_identifier.scss
 */
export interface IdentifierProps {
  /** 식별 문구 */
  text: string;
  /** 로고 대체 텍스트 (기관명) */
  logoText?: string;
  /** 기관 로고 이미지. 없으면 KRDS CSS 기본 로고 */
  logoSrc?: string;
}

withDefaults(defineProps<IdentifierProps>(), {
  logoText: 'KRDS - Korea Design System',
  logoSrc: undefined,
});
</script>

<template>
  <div class="krds-identifier">
    <span
      class="logo"
      :style="logoSrc ? { backgroundImage: 'none' } : undefined"
    >
      <img
        v-if="logoSrc"
        :src="logoSrc"
        :alt="logoText"
        style="display: block; width: 100%; height: 100%; object-fit: contain"
      />
      <span v-else class="sr-only">{{ logoText }}</span>
    </span>
    <span class="ban-txt">{{ text }}</span>
  </div>
</template>

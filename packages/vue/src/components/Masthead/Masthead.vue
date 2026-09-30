<script setup lang="ts">
/**
 * Masthead — KRDS `#krds-masthead` 공식 누리집 표시 배너
 *
 * KRDS 마스트헤드는 JS 동작이 없는 순수 마크업이다 (국기 아이콘은 CSS ::before).
 * KRDS CSS가 id 선택자이므로 레이아웃에 하나만 두고, SkipLink 다음·Header 앞에 둔다.
 * 기준: reference/krds-uiux/html/code/masthead.html, resources/scss/component/_masthead.scss
 */
export interface MastheadProps {
  /** 표시 문구 */
  text?: string;
}

withDefaults(defineProps<MastheadProps>(), {
  text: '이 누리집은 대한민국 공식 전자정부 누리집입니다.',
});
</script>

<template>
  <div id="krds-masthead">
    <div class="toggle-wrap">
      <div class="toggle-head">
        <div class="inner">
          <span class="nuri-txt">{{ text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

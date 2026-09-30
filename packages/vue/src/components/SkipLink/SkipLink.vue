<script setup lang="ts">
/**
 * SkipLink — KRDS `#krds-skip-link` 건너뛰기 링크
 *
 * KRDS CSS가 id 선택자(#krds-skip-link)이므로 페이지(레이아웃)에 하나만 둔다.
 * 원본은 `<a href="#대상">`만 있어 해시 라우터에서는 라우트가 바뀌고, 초점을 받지 못하는 대상(main 등)으로는
 * 초점이 옮겨지지 않는 브라우저가 있다 → 클릭 시 대상에 직접 초점을 준다 (필요하면 tabindex="-1").
 * 기준: reference/krds-uiux/html/code/skip_link.html, resources/scss/component/_skip_link.scss
 */
export interface SkipLinkItem {
  /** 이동할 요소의 id (# 없이) */
  target: string;
  label: string;
}

export interface SkipLinkProps {
  links?: SkipLinkItem[];
}

withDefaults(defineProps<SkipLinkProps>(), {
  links: () => [{ target: 'main-content', label: '본문 바로가기' }],
});

const FOCUSABLE = 'a[href], button, input, select, textarea, [tabindex]';

const onClick = (event: MouseEvent, target: string) => {
  const el = document.getElementById(target);
  if (!el) {
    if (import.meta.env.DEV) {
      console.warn(`[hanui] SkipLink: id="${target}" 요소가 없습니다.`);
    }
    return;
  }
  event.preventDefault();
  if (!el.matches(FOCUSABLE)) el.setAttribute('tabindex', '-1');
  el.focus();
  el.scrollIntoView?.({ block: 'start' });
};
</script>

<template>
  <div id="krds-skip-link">
    <a
      v-for="link in links"
      :key="link.target"
      :href="`#${link.target}`"
      @click="onClick($event, link.target)"
    >
      {{ link.label }}
    </a>
  </div>
</template>

<script setup lang="ts">
/**
 * Header — KRDS `header#krds-header` 뼈대
 *
 * 구조: .header-in > .header-container > .inner > (.header-utility · .header-branding(.logo + .header-actions)),
 * 그 뒤 주메뉴(menu 슬롯, .header-in 안), 모바일 전체메뉴(mobile 슬롯, .header-in 밖).
 * 스크롤 동작(내리면 숨고 올리면 나타남)은 KRDS scrollManager처럼 `#wrap`에 scroll-down / scroll-up 클래스를 붙인다.
 * KRDS 페이지 구조(#wrap > … #container)가 있을 때만 동작하며, 없으면 sticky 헤더로만 남는다.
 * 기준: reference/krds-uiux/html/code/header.html, resources/scss/component/_header.scss,
 *       resources/js/component/ui-script.js (scrollManager)
 */
import { onBeforeUnmount, onMounted } from 'vue';

export interface HeaderProps {
  /** 로고 링크 */
  logoHref?: string;
  /** 로고 대체 텍스트 (기관명). sr-only로 읽힌다 */
  logoText?: string;
  /** 기관 로고 이미지. 없으면 KRDS CSS 기본 로고(배경 이미지) */
  logoSrc?: string;
  /** 로고 제목 태그 (KRDS 원본은 h2) */
  logoTag?: 'h1' | 'h2' | 'div';
  /** 스크롤 방향에 따라 헤더 숨김/표시 (#wrap 필요) */
  scrollBehavior?: boolean;
}

const props = withDefaults(defineProps<HeaderProps>(), {
  logoHref: '/',
  logoText: 'KRDS - Korea Design System',
  logoSrc: undefined,
  logoTag: 'h2',
  scrollBehavior: true,
});

defineSlots<{
  /** 상단 기타 메뉴 (.header-utility > ul.utility-list 안의 li들) */
  utility?: () => unknown;
  /** 로고 오른쪽 버튼 (.header-actions: 통합검색·로그인·전체메뉴 등 .btn-navi) */
  actions?: () => unknown;
  /** 주메뉴(PC) — .header-in 안 */
  menu?: () => unknown;
  /** 모바일 전체메뉴 — .header-in 밖 */
  mobile?: () => unknown;
}>();

// KRDS scrollManager.handleScrollDirection
let lastScrollY = 0;
const onScroll = () => {
  const wrap = document.getElementById('wrap');
  const container = document.getElementById('container');
  if (!wrap || !container) return;
  const y = window.scrollY;
  const threshold = container.offsetTop + 50;
  if (y > threshold && y > lastScrollY) {
    wrap.classList.add('scroll-down');
    wrap.classList.remove('scroll-up');
  } else if (y > threshold && y < lastScrollY) {
    wrap.classList.add('scroll-up');
    wrap.classList.remove('scroll-down');
  } else if (y <= threshold) {
    wrap.classList.remove('scroll-down', 'scroll-up');
  }
  lastScrollY = y;
};

onMounted(() => {
  if (!props.scrollBehavior) return;
  lastScrollY = window.scrollY;
  window.addEventListener('scroll', onScroll, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
  document.getElementById('wrap')?.classList.remove('scroll-down', 'scroll-up');
});
</script>

<template>
  <header id="krds-header">
    <div class="header-in">
      <div class="header-container">
        <div class="inner">
          <div v-if="$slots.utility" class="header-utility">
            <ul class="utility-list">
              <slot name="utility" />
            </ul>
          </div>
          <div class="header-branding">
            <component :is="logoTag" class="logo">
              <a
                :href="logoHref"
                :style="logoSrc ? { backgroundImage: 'none' } : undefined"
              >
                <img
                  v-if="logoSrc"
                  :src="logoSrc"
                  :alt="logoText"
                  style="
                    display: block;
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                  "
                />
                <span v-else class="sr-only">{{ logoText }}</span>
              </a>
            </component>
            <div v-if="$slots.actions" class="header-actions">
              <slot name="actions" />
            </div>
          </div>
        </div>
      </div>
      <slot name="menu" />
    </div>
    <slot name="mobile" />
  </header>
</template>

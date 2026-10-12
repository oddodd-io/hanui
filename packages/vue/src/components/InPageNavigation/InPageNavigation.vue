<script setup lang="ts">
/**
 * InPageNavigation — KRDS `.krds-in-page-navigation-area` 본문 내 탐색(이 페이지의 구성)
 *
 * 마크업·클래스는 KRDS in_page_navigation.html 그대로이며 동작은 ui-script.js krds_inPageNavigation을 따른다:
 * 항목을 누르면 헤더 높이만큼 띄워 부드럽게 스크롤 · 스크롤 위치에 따라 현재 항목 `.active`
 * (화면 위 20% 지점 기준, 페이지 끝이면 마지막 항목).
 * KRDS CSS는 상위에 `.krds-in-page-navigation-type`이 있어야 걸린다 — 배치(고정·sticky)는 쓰는 쪽 레이아웃이 정한다.
 * 원본과 다른 점:
 * - 현재 항목에 `aria-current="location"`을 붙인다.
 * - nav 이름을 머리말(`.quick-caption`)로 연결한다.
 * - 이동한 제목에 마우스·키보드 모두 초점을 옮긴다(원본은 키보드만). 다음 Tab이 그 구역에서 이어진다.
 * - prefers-reduced-motion이면 부드러운 스크롤을 끈다.
 * 기준: reference/krds-uiux/html/code/in_page_navigation.html, resources/scss/component/_in_page_navigation.scss
 */
import { onBeforeUnmount, onMounted, ref, useId, watch } from 'vue';

export interface InPageNavItem {
  label: string;
  /** 본문 구역 앵커 (`#section_01`) */
  href: string;
}

export interface InPageNavigationProps {
  /** 제목 (`.quick-title`, 보통 페이지 제목) */
  title: string;
  /** 구역 목록 */
  items: InPageNavItem[];
  /** 머리말 (`.quick-caption`, nav 이름) */
  caption?: string;
}

const props = withDefaults(defineProps<InPageNavigationProps>(), {
  caption: '이 페이지의 구성',
});

defineSlots<{
  /** `.in-page-navigation-action` 내용 (신청 버튼·안내 등). 없으면 영역을 그리지 않는다 */
  action?: () => unknown;
}>();

const captionId = `in-page-nav-${useId()}`;
const active = ref<string | undefined>(props.items[0]?.href);

const targetOf = (href: string) =>
  href.startsWith('#')
    ? document.getElementById(decodeURIComponent(href.slice(1)))
    : null;

/** KRDS calculateHeaderHeight — 마스트헤드 + 헤더 */
const headerHeight = () =>
  (document.querySelector('#krds-masthead')?.clientHeight ?? 0) +
  (document.querySelector('#krds-header .header-in')?.clientHeight ?? 0);

const updateActive = () => {
  const sections = props.items
    .map((item) => ({ href: item.href, el: targetOf(item.href) }))
    .filter((s): s is { href: string; el: HTMLElement } => !!s.el);
  if (!sections.length) return;

  const scrollBottom = window.scrollY + window.innerHeight;
  if (scrollBottom >= document.documentElement.scrollHeight - 1) {
    active.value = sections[sections.length - 1]!.href;
    return;
  }
  const line = window.innerHeight / 5;
  let current = sections[0]!.href;
  for (const s of sections) {
    if (s.el.getBoundingClientRect().top - line <= 0) current = s.href;
  }
  active.value = current;
};

let frame = 0;
const onScroll = () => {
  if (frame) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    updateActive();
  });
};

const onClick = (event: MouseEvent, item: InPageNavItem) => {
  const target = targetOf(item.href);
  if (!target) return;
  event.preventDefault();
  const reduce = window.matchMedia?.(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  window.scrollTo({
    left: 0,
    top: target.getBoundingClientRect().top + window.scrollY - headerHeight(),
    behavior: reduce ? 'auto' : 'smooth',
  });
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
  active.value = item.href;
};

onMounted(() => {
  updateActive();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
});
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', onScroll);
  if (frame) cancelAnimationFrame(frame);
});
watch(
  () => props.items,
  () => {
    active.value = props.items[0]?.href;
    if (typeof window !== 'undefined') updateActive();
  }
);
</script>

<template>
  <div class="krds-in-page-navigation-area">
    <div class="in-page-navigation-header">
      <p :id="captionId" class="quick-caption">{{ caption }}</p>
      <p class="quick-title">{{ title }}</p>
    </div>
    <nav class="in-page-navigation-list" :aria-labelledby="captionId">
      <ul>
        <li v-for="item in items" :key="item.href">
          <a
            :href="item.href"
            :class="{ active: active === item.href }"
            :aria-current="active === item.href ? 'location' : undefined"
            @click="onClick($event, item)"
          >
            {{ item.label }}
          </a>
        </li>
      </ul>
    </nav>
    <div v-if="$slots.action" class="in-page-navigation-action">
      <slot name="action" />
    </div>
  </div>
</template>

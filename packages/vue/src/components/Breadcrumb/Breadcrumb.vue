<script setup lang="ts">
/**
 * Breadcrumb — KRDS `nav.krds-breadcrumb-wrap > ol.breadcrumb` 래퍼
 *
 * KRDS 브레드크럼은 JS 동작이 없는 순수 마크업이다(모바일에서 홈·현재 위치만 보이는 것도 CSS).
 * 첫 항목에 `.home`(홈 아이콘)을 붙이고, 원본에 없는 `aria-current="page"`를 마지막 항목에 보탠다.
 * 기준: reference/krds-uiux/html/code/breadcrumb.html, resources/scss/component/_breadcrumb.scss
 */
export interface BreadcrumbItem {
  label: string;
  /** 없으면 링크가 아닌 텍스트(`span.txt`)로 렌더한다 */
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /** nav 랜드마크 이름 */
  label?: string;
  /** 첫 항목에 홈 아이콘(`.home`)을 붙인다 */
  home?: boolean;
  id?: string;
}

const props = withDefaults(defineProps<BreadcrumbProps>(), {
  label: '현재 경로',
  home: true,
  id: undefined,
});

defineSlots<{
  /** 항목 내용 직접 렌더 (RouterLink 등). class="txt"와 aria-current를 그대로 넘긴다 */
  item?: (scope: {
    item: BreadcrumbItem;
    index: number;
    isCurrent: boolean;
    attrs: { class: 'txt'; 'aria-current': 'page' | undefined };
  }) => unknown;
}>();

/** KRDS `.txt` 클래스 + 마지막 항목의 aria-current */
const attrsOf = (index: number) => ({
  class: 'txt' as const,
  'aria-current':
    index === props.items.length - 1 ? ('page' as const) : undefined,
});
</script>

<template>
  <nav :id="id" class="krds-breadcrumb-wrap" :aria-label="label">
    <ol class="breadcrumb">
      <li
        v-for="(item, index) in items"
        :key="`${index}-${item.label}`"
        :class="{ home: home && index === 0 }"
      >
        <slot
          name="item"
          :item="item"
          :index="index"
          :is-current="index === items.length - 1"
          :attrs="attrsOf(index)"
        >
          <a v-if="item.href" :href="item.href" v-bind="attrsOf(index)">
            {{ item.label }}
          </a>
          <span v-else v-bind="attrsOf(index)">{{ item.label }}</span>
        </slot>
      </li>
    </ol>
  </nav>
</template>

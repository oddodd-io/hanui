<script setup lang="ts">
/**
 * Pagination — KRDS `.krds-pagination` 래퍼
 *
 * KRDS 페이지네이션은 JS 동작이 없는 순수 마크업이다. 이 컴포넌트는 페이지 범위 계산,
 * 링크(getHref) / 버튼(v-model) 분기, 비활성 이전·다음을 `<span>`으로 바꾸는 원본 규칙,
 * 그리고 이전·다음이 사라질 때의 초점 이동만 담당한다.
 * 현재 페이지는 KRDS 원본대로 sr-only "현재페이지" 텍스트로 알린다.
 * 기준: reference/krds-uiux/html/code/pagination.html, resources/scss/component/_pagination.scss
 */
import { computed, nextTick, ref } from 'vue';

export interface PaginationProps {
  /** 현재 페이지 (1부터) */
  modelValue?: number;
  /** 전체 페이지 수. 1 미만이면 아무것도 렌더하지 않는다 */
  totalPages: number;
  /** 현재 페이지 양옆에 보여줄 페이지 수. 첫·마지막 페이지는 항상 보인다 */
  siblingCount?: number;
  /** 주면 각 페이지를 `<a href>` 링크로 렌더한다 (서버 라우팅·SEO). 없으면 `<button>` + v-model */
  getHref?: (page: number) => string;
  /** nav 랜드마크 이름 */
  label?: string;
  prevText?: string;
  nextText?: string;
}

const props = withDefaults(defineProps<PaginationProps>(), {
  modelValue: 1,
  siblingCount: 2,
  getHref: undefined,
  label: '페이지 네비게이션',
  prevText: '이전',
  nextText: '다음',
});

const emit = defineEmits<{
  'update:modelValue': [page: number];
}>();

type PageItem = { type: 'page'; page: number } | { type: 'dot'; key: string };

const total = computed(() =>
  Number.isFinite(props.totalPages)
    ? Math.max(0, Math.floor(props.totalPages))
    : 0
);

const current = computed(() => {
  const page = Number.isFinite(props.modelValue)
    ? Math.floor(props.modelValue)
    : 1;
  return Math.min(Math.max(page, 1), Math.max(total.value, 1));
});

const items = computed<PageItem[]>(() => {
  const last = total.value;
  const siblings = Math.max(0, Math.floor(props.siblingCount));
  const start = Math.max(1, current.value - siblings);
  const end = Math.min(last, current.value + siblings);

  const pages = new Set<number>([1, last]);
  for (let p = start; p <= end; p++) pages.add(p);

  const sorted = [...pages]
    .filter((p) => p >= 1 && p <= last)
    .sort((a, b) => a - b);
  const result: PageItem[] = [];
  sorted.forEach((page, i) => {
    const prev = sorted[i - 1];
    if (prev !== undefined && page - prev === 2) {
      // 한 페이지만 빠지면 생략 기호 대신 그 페이지를 보여준다
      result.push({ type: 'page', page: prev + 1 });
    } else if (prev !== undefined && page - prev > 2) {
      result.push({ type: 'dot', key: `dot-${prev}` });
    }
    result.push({ type: 'page', page });
  });
  return result;
});

const hasPrev = computed(() => current.value > 1);
const hasNext = computed(() => current.value < total.value);
const isLink = computed(() => !!props.getHref);

const rootRef = ref<HTMLElement | null>(null);

const focusCurrent = () => {
  rootRef.value?.querySelector<HTMLElement>('.page-link.active')?.focus();
};

const go = async (page: number, event?: Event) => {
  if (page < 1 || page > total.value) return;
  if (page === current.value) return;
  emit('update:modelValue', page);

  if (isLink.value) return;
  // 이전·다음을 눌러 끝 페이지에 닿으면 그 버튼이 비활성 span으로 바뀌어 초점을 잃는다
  const target = event?.currentTarget as HTMLElement | null;
  await nextTick();
  if (target && !target.isConnected) focusCurrent();
};

const linkAttrs = (page: number) =>
  isLink.value ? { href: props.getHref!(page) } : { type: 'button' as const };
</script>

<template>
  <nav
    v-if="total >= 1"
    ref="rootRef"
    class="krds-pagination"
    :aria-label="label"
  >
    <component
      :is="isLink ? 'a' : 'button'"
      v-if="hasPrev"
      class="page-navi prev"
      v-bind="linkAttrs(current - 1)"
      @click="go(current - 1, $event)"
    >
      {{ prevText }}
    </component>
    <span v-else class="page-navi prev disabled">{{ prevText }}</span>

    <div class="page-links">
      <template
        v-for="item in items"
        :key="item.type === 'page' ? item.page : item.key"
      >
        <component
          :is="isLink ? 'a' : 'button'"
          v-if="item.type === 'page'"
          :class="['page-link', { active: item.page === current }]"
          v-bind="linkAttrs(item.page)"
          @click="go(item.page, $event)"
        >
          <span v-if="item.page === current" class="sr-only">현재페이지</span>
          {{ item.page }}
        </component>
        <span v-else class="page-link link-dot" aria-hidden="true"></span>
      </template>
    </div>

    <component
      :is="isLink ? 'a' : 'button'"
      v-if="hasNext"
      class="page-navi next"
      v-bind="linkAttrs(current + 1)"
      @click="go(current + 1, $event)"
    >
      {{ nextText }}
    </component>
    <span v-else class="page-navi next disabled">{{ nextText }}</span>
  </nav>
</template>

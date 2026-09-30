<script setup lang="ts">
/**
 * DropMenu — KRDS `.krds-drop-wrap` 드롭다운 (헤더 유틸 메뉴 · 나의 GOV · 페이지 타이틀 메뉴)
 *
 * 동작은 KRDS ui-script.js krds_dropEvent를 따른다:
 * 버튼 토글(aria-expanded, .active) · 한 번에 하나만 열림 · Esc로 닫고 버튼에 초점 · 바깥 클릭/초점 이탈 시 닫기 ·
 * 화면 밖으로 넘치면 .drop-left / .drop-right · 항목 선택 시 닫고 버튼에 초점 · 선택 항목 .active + sr-only "선택됨".
 * 원본은 링크에 aria-selected를 붙이지만 link 역할에 허용되지 않는 속성이라 쓰지 않는다.
 * 기준: reference/krds-uiux/html/code/header.html, resources/scss/common/_dropdown.scss
 */
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useId,
} from 'vue';
import { claimOpen, releaseOpen } from './drop-menu-state';

export interface DropMenuItem {
  label: string;
  /** 있으면 링크, 없으면 버튼 */
  href?: string;
  /** 새 창 링크 (KRDS: target="_blank" title="새 창 열림" + .ico-go) */
  external?: boolean;
  /** 선택 항목 (.active + sr-only "선택됨") */
  active?: boolean;
  /** 항목 추가 클래스 (KRDS 글자 크기 메뉴의 sm · md 등) */
  class?: string;
}

export interface DropMenuProps {
  /** 버튼 텍스트 */
  label: string;
  items?: DropMenuItem[];
  /** 버튼 클래스. 기본은 헤더 유틸 메뉴의 `krds-btn small text` */
  buttonClass?: string;
  /** 버튼 뒤 토글 아이콘(ico-toggle) */
  toggleIcon?: boolean;
  /** 래퍼 추가 클래스 (my-drop, krds-resize 등) */
  wrapClass?: string;
}

const props = withDefaults(defineProps<DropMenuProps>(), {
  items: () => [],
  buttonClass: 'krds-btn small text',
  toggleIcon: true,
  wrapClass: undefined,
});

const emit = defineEmits<{
  select: [item: DropMenuItem, index: number];
}>();

defineSlots<{
  /** 버튼 내용 (label 대신) */
  button?: () => unknown;
  /** 목록 위 (.drop-top) */
  top?: (scope: { close: () => void }) => unknown;
  /** 목록 아래 (.drop-bottom) */
  bottom?: (scope: { close: () => void }) => unknown;
}>();

const menuId = `drop-menu-${useId()}`;
const wrapRef = ref<HTMLElement | null>(null);
const buttonRef = ref<HTMLButtonElement | null>(null);
const menuRef = ref<HTMLElement | null>(null);
const open = ref(false);
// 초점 받은 항목을 위로 올려 포커스 링이 다음 항목에 가리지 않게 한다 (KRDS setupMenuItems focus)
const focusedIndex = ref<number | null>(null);
const itemStyle = (index: number) => ({
  position: 'relative' as const,
  zIndex: focusedIndex.value === index ? 1 : 0,
});
const align = ref<'left' | 'right' | null>(null);

const close = () => {
  if (!open.value) return;
  open.value = false;
  releaseOpen(close);
};

const show = async () => {
  claimOpen(close);
  open.value = true;
  align.value = null;
  await nextTick();
  // 여백에 따라 위치 조정 (KRDS openDropdown)
  const rect = menuRef.value?.getBoundingClientRect();
  if (!rect) return;
  if (rect.left < 0) align.value = 'left';
  else if (window.innerWidth < rect.left + rect.width) align.value = 'right';
};

const toggle = () => (open.value ? close() : show());

const closeAndFocus = () => {
  close();
  buttonRef.value?.focus();
};

const onSelect = (item: DropMenuItem, index: number) => {
  emit('select', item, index);
  closeAndFocus();
};

const onKeydown = (event: KeyboardEvent) => {
  if ((event.key === 'Escape' || event.key === 'Esc') && open.value) {
    event.stopPropagation();
    closeAndFocus();
  }
};

// 드롭다운 밖으로 초점이 나가면 닫는다 (KRDS focusout)
const onFocusout = (event: FocusEvent) => {
  const next = event.relatedTarget as Node | null;
  if (next && wrapRef.value?.contains(next)) return;
  close();
};

const onDocumentClick = (event: MouseEvent) => {
  if (!wrapRef.value?.contains(event.target as Node)) close();
};

onMounted(() => document.addEventListener('click', onDocumentClick));
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick);
  releaseOpen(close);
});

const wrapClasses = computed(() => [
  'krds-drop-wrap',
  props.wrapClass,
  align.value && `drop-${align.value}`,
]);

defineExpose({ open, close, show });
</script>

<template>
  <div
    ref="wrapRef"
    :class="wrapClasses"
    @keydown="onKeydown"
    @focusout="onFocusout"
  >
    <button
      ref="buttonRef"
      type="button"
      :class="[buttonClass, 'drop-btn', { active: open }]"
      :aria-expanded="open ? 'true' : 'false'"
      :aria-controls="menuId"
      @click="toggle"
    >
      <slot name="button">
        {{ label }}
        <i v-if="toggleIcon" class="svg-icon ico-toggle" aria-hidden="true"></i>
      </slot>
    </button>
    <div
      :id="menuId"
      ref="menuRef"
      class="drop-menu"
      :style="{ display: open ? 'block' : 'none' }"
    >
      <div class="drop-in">
        <div v-if="$slots.top" class="drop-top">
          <slot name="top" :close="close" />
        </div>
        <ul v-if="items.length" class="drop-list">
          <li v-for="(item, index) in items" :key="`${index}-${item.label}`">
            <a
              v-if="item.href"
              :href="item.href"
              :class="[
                'item-link',
                item.class,
                { 'ico-go': item.external, active: item.active },
              ]"
              :target="item.external ? '_blank' : undefined"
              :title="item.external ? '새 창 열림' : undefined"
              :rel="item.external ? 'noopener noreferrer' : undefined"
              :style="itemStyle(index)"
              @focus="focusedIndex = index"
              @click="onSelect(item, index)"
            >
              {{ item.label
              }}<span v-if="item.active" class="sr-only"> 선택됨</span>
            </a>
            <button
              v-else
              type="button"
              :class="['item-link', item.class, { active: item.active }]"
              :style="itemStyle(index)"
              @focus="focusedIndex = index"
              @click="onSelect(item, index)"
            >
              {{ item.label
              }}<span v-if="item.active" class="sr-only"> 선택됨</span>
            </button>
          </li>
        </ul>
        <div v-if="$slots.bottom" class="drop-bottom">
          <slot name="bottom" :close="close" />
        </div>
      </div>
    </div>
  </div>
</template>

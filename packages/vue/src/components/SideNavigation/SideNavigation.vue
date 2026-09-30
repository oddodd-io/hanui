<script setup lang="ts">
/**
 * SideNavigation — KRDS `nav.krds-side-navigation` 사이드 메뉴(LNB)
 *
 * 마크업·클래스는 KRDS side_navigation.html 그대로이며 동작은 ui-script.js krds_sideNavigation을 따른다:
 * 2depth 펼치기(li.active + aria-expanded, 여러 개 동시 가능) · 3depth 팝업(.lnb-submenu-lv2.active, 제목 버튼에 초점) ·
 * 팝업 밖으로 초점이 나가면 닫기 · 제목 버튼으로 닫고 여는 버튼에 초점 · 현재 페이지 .selected + aria-current.
 * 원본과 다른 점:
 * - menubar/menu/menuitem 역할을 쓰지 않는다. 방향키 동작 없이 menu 역할을 쓰면 스크린리더 사용자가 기대한 조작이
 *   동작하지 않으므로, 사이트 내비게이션 권고(APG disclosure navigation)대로 목록 + aria-expanded 버튼으로 둔다.
 * - 팝업 밖으로 Tab 이동 시 초점을 여는 버튼으로 끌고 가지 않는다 (Esc·제목 버튼으로 닫을 때만 되돌린다).
 * - nav 이름을 제목(h2.lnb-tit)으로 연결한다.
 * 기준: reference/krds-uiux/html/code/side_navigation.html, resources/scss/component/_side_navigation.scss
 */
import { reactive, ref, useId } from 'vue';
import { focusWhenReady } from '../../composables/focusWhenReady';

export interface SideNavNode {
  label: string;
  href?: string;
  external?: boolean;
  /** 현재 페이지 (.selected + aria-current, 상위는 펼친 채 시작) */
  selected?: boolean;
  children?: SideNavNode[];
}

export interface SideNavigationProps {
  /** 제목 (h2.lnb-tit, 보통 1depth 메뉴명) */
  title: string;
  /** 2depth 목록 */
  items: SideNavNode[];
}

const props = defineProps<SideNavigationProps>();

const baseId = useId();
const titleId = `lnb-tit-${baseId}`;
const submenuId = (i: number) => `lnbmenu-${baseId}-${i}`;
/** 3depth 팝업 id — key는 `${i}-${j}` */
const popupId = (key: string) => `lnbpopup-${baseId}-${key}`;

const containsSelected = (node: SideNavNode): boolean =>
  !!node.selected || !!node.children?.some(containsSelected);

/** 펼친 2depth (KRDS: 여러 개 동시에 펼칠 수 있다) */
const expanded = reactive<Record<number, boolean>>({});
props.items.forEach((item, i) => {
  if (item.children?.length && containsSelected(item)) expanded[i] = true;
});

/** 열린 3depth 팝업 key `${i}-${j}` */
const openPopup = ref<string | null>(null);
const popupTriggers: Record<string, HTMLElement | null> = {};

const toggle = (i: number) => {
  expanded[i] = !expanded[i];
};

const showPopup = async (key: string) => {
  openPopup.value = key;
  await focusWhenReady(
    () =>
      document
        .getElementById(popupId(key))
        ?.querySelector<HTMLElement>('.lnb-btn-tit'),
    () => openPopup.value === key
  );
};

const closePopup = (returnFocus: boolean) => {
  const key = openPopup.value;
  if (!key) return;
  openPopup.value = null;
  if (returnFocus) popupTriggers[key]?.focus();
};

// 팝업 밖으로 초점이 나가면 닫는다 (KRDS focusout). 초점은 사용자가 옮긴 곳에 둔다.
const onPopupFocusout = (event: FocusEvent, key: string) => {
  const popup = event.currentTarget as HTMLElement;
  const next = event.relatedTarget as Node | null;
  if (next && popup.contains(next)) return;
  if (openPopup.value === key) closePopup(false);
};

const onPopupKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' || event.key === 'Esc') {
    event.stopPropagation();
    closePopup(true);
  }
};

const linkAttrs = (node: SideNavNode) => ({
  href: node.href,
  target: node.external ? '_blank' : undefined,
  title: node.external ? '새 창 열림' : undefined,
  rel: node.external ? 'noopener noreferrer' : undefined,
  'aria-current': node.selected ? ('page' as const) : undefined,
});
</script>

<template>
  <nav class="krds-side-navigation" :aria-labelledby="titleId">
    <h2 :id="titleId" class="lnb-tit">{{ title }}</h2>
    <ul class="lnb-list">
      <li
        v-for="(item, i) in items"
        :key="`${i}-${item.label}`"
        :class="[
          'lnb-item',
          { active: expanded[i] || (!item.children?.length && item.selected) },
        ]"
      >
        <template v-if="item.children?.length">
          <button
            type="button"
            :class="['lnb-btn', 'lnb-toggle', { active: expanded[i] }]"
            :aria-controls="submenuId(i)"
            :aria-expanded="expanded[i] ? 'true' : 'false'"
            @click="toggle(i)"
          >
            {{ item.label }}
          </button>
          <div class="lnb-submenu">
            <ul :id="submenuId(i)">
              <li
                v-for="(sub, j) in item.children"
                :key="`${j}-${sub.label}`"
                :class="['lnb-subitem', { active: sub.selected }]"
              >
                <template v-if="sub.children?.length">
                  <button
                    :ref="
                      (el) =>
                        (popupTriggers[`${i}-${j}`] = el as HTMLElement | null)
                    "
                    type="button"
                    class="lnb-btn lnb-toggle-popup"
                    :aria-controls="popupId(`${i}-${j}`)"
                    :aria-expanded="
                      openPopup === `${i}-${j}` ? 'true' : 'false'
                    "
                    aria-haspopup="true"
                    @click="showPopup(`${i}-${j}`)"
                  >
                    {{ sub.label }}
                  </button>
                  <div
                    :id="popupId(`${i}-${j}`)"
                    :class="[
                      'lnb-submenu-lv2',
                      { active: openPopup === `${i}-${j}` },
                    ]"
                    @focusout="onPopupFocusout($event, `${i}-${j}`)"
                    @keydown="onPopupKeydown"
                  >
                    <button
                      type="button"
                      class="lnb-btn-tit"
                      @click="closePopup(true)"
                    >
                      {{ sub.label }}<span class="sr-only"> 닫기</span>
                    </button>
                    <ul>
                      <li v-for="d4 in sub.children" :key="d4.label">
                        <a
                          v-bind="linkAttrs(d4)"
                          :class="['lnb-btn', { selected: d4.selected }]"
                        >
                          {{ d4.label }}
                        </a>
                      </li>
                    </ul>
                  </div>
                </template>
                <a
                  v-else
                  v-bind="linkAttrs(sub)"
                  :class="['lnb-btn', 'lnb-link', { selected: sub.selected }]"
                >
                  {{ sub.label }}
                </a>
              </li>
            </ul>
          </div>
        </template>
        <a
          v-else
          v-bind="linkAttrs(item)"
          :class="[
            'lnb-btn',
            { active: item.selected, selected: item.selected },
          ]"
        >
          {{ item.label }}
        </a>
      </li>
    </ul>
  </nav>
</template>

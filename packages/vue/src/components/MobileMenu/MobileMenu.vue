<script setup lang="ts">
/**
 * MobileMenu — KRDS `.krds-main-menu-mobile` 모바일 전체메뉴 (기본형: 왼쪽 1depth 탭 + 오른쪽 목록)
 *
 * 마크업·클래스는 KRDS main_menu_mobile.html 그대로이며 동작은 ui-script.js krds_mainMenuMobile을 따른다:
 * display → is-backdrop·is-open(슬라이드) · body.is-gnb-mobile · 1depth 탭 클릭 시 목록으로 스크롤 · 스크롤 위치로 탭 활성 ·
 * 활성 목록으로 열린 채 시작 · 3depth 펼치기(.has-depth3 → .depth3-wrap.is-open) · 4depth 패널(.depth4-wrap.is-open) ·
 * 배경 클릭 시 메뉴 영역으로 초점 · PC 폭(1024px~)이 되면 닫기 · 닫으면 여는 버튼으로 초점 복귀.
 * 원본 결함 보완: 대화상자 역할(role="dialog" aria-modal) · Esc로 닫기(4depth 패널 먼저) · 바깥 inert를 고정 id가 아닌
 * 전체에 적용(원본은 #footer를 찾지만 KRDS 푸터 id는 krds-footer) · Tab마다 초점 대상 재계산 · 탭 방향키/Home/End와 roving tabindex ·
 * 펼침 요소를 a[href="#"] 대신 button으로 · 4depth "전체메뉴 닫기"가 실제로 전체메뉴를 닫음 · ul 안 h4(HTML 위반) 대신 div.
 * 기준: reference/krds-uiux/html/code/main_menu_mobile.html, resources/scss/component/_main_menu.scss
 */
import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  useId,
  watch,
} from 'vue';
import { popModal, pushModal } from '../Modal/modal-stack';
import { focusWhenReady } from '../../composables/focusWhenReady';

/** 1~4depth 공통 노드. children이 다음 depth */
export interface MobileMenuNode {
  label: string;
  href?: string;
  external?: boolean;
  /** 현재 위치 (.selected + aria-current, 상위 depth는 펼친 채 시작) */
  selected?: boolean;
  children?: MobileMenuNode[];
}

export interface MobileMenuProps {
  /** 열림 (v-model:open) */
  open?: boolean;
  /** 1depth 목록 */
  items: MobileMenuNode[];
  /** 루트 id — 여는 버튼의 aria-controls와 맞춘다 */
  id?: string;
  /** 대화상자 이름 */
  label?: string;
  closeLabel?: string;
}

const props = withDefaults(defineProps<MobileMenuProps>(), {
  open: false,
  id: 'mobile-nav',
  label: '전체메뉴',
  closeLabel: '전체메뉴 닫기',
});

const emit = defineEmits<{
  'update:open': [open: boolean];
}>();

defineSlots<{
  /** 상단 유틸 (.gnb-utils > ul.utility-list 안의 li들) */
  utils?: () => unknown;
  /** 로그인 영역 (.gnb-login) */
  login?: () => unknown;
  /** 서비스 바로가기 (.gnb-service-menu, a.link) */
  service?: () => unknown;
  /** 메뉴 검색 (.sch-input) */
  search?: () => unknown;
  /** 하단 링크 (.gnb-bottom) */
  bottom?: () => unknown;
}>();

const baseId = useId();
const panelId = (i: number) => `mGnb-${baseId}-${i}`;
const tabId = (i: number) => `mGnb-tab-${baseId}-${i}`;

const rootRef = ref<HTMLElement | null>(null);
const wrapRef = ref<HTMLElement | null>(null);
const bodyRef = ref<HTMLElement | null>(null);
const tabRefs = ref<HTMLElement[]>([]);

const displayed = ref(false);
const isOpen = ref(false);

const containsSelected = (node: MobileMenuNode): boolean =>
  !!node.selected || !!node.children?.some(containsSelected);

const initialTab = Math.max(0, props.items.findIndex(containsSelected));
const activeTab = ref(initialTab);

/** 펼친 3depth: key = `${i}-${j}` */
const openDepth3 = reactive<Record<string, boolean>>({});
props.items.forEach((item, i) =>
  item.children?.forEach((sub, j) => {
    if (sub.children?.length && containsSelected(sub))
      openDepth3[`${i}-${j}`] = true;
  })
);

/** 열린 4depth 패널 key `${i}-${j}-${k}` */
const openDepth4 = ref<string | null>(null);
const depth4Displayed = ref<string | null>(null);
let depth4Trigger: HTMLElement | null = null;

let returnFocusTo: HTMLElement | null = null;
let closeTimer: ReturnType<typeof setTimeout> | undefined;
let registered = false;

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]';

const focusables = (container: HTMLElement | null) =>
  Array.from(container?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).filter(
    // 접힌 3depth(.depth3-wrap:not(.is-open))는 visibility:hidden이라 초점을 받지 않는다
    (el) => !el.closest('[inert], .depth3-wrap:not(.is-open)')
  );

// ---------- 열기 · 닫기 ----------
const scrollToTab = (i: number, smooth = true) => {
  const body = bodyRef.value;
  const panel = document.getElementById(panelId(i));
  if (!body || !panel) return;
  if (typeof body.scrollTo === 'function') {
    body.scrollTo({
      top: panel.offsetTop,
      left: 0,
      behavior: smooth ? 'smooth' : 'auto',
    });
  } else {
    body.scrollTop = panel.offsetTop;
  }
};

const show = async () => {
  clearTimeout(closeTimer);
  const active = document.activeElement;
  returnFocusTo =
    active instanceof HTMLElement && active !== document.body ? active : null;

  displayed.value = true;
  await nextTick();
  // 활성 목록 위치에서 시작 (KRDS openMainMenu)
  scrollToTab(activeTab.value, false);
  const root = rootRef.value;
  if (!root) return;
  void root.offsetWidth;
  isOpen.value = true;
  document.body.classList.add('is-gnb-mobile');
  pushModal(root);
  registered = true;
  await nextTick();
  await focusWhenReady(
    () => wrapRef.value,
    () => isOpen.value
  );
};

const hide = () => {
  if (!displayed.value) return;
  isOpen.value = false;
  closeDepth4(false);
  if (registered && rootRef.value) popModal(rootRef.value);
  registered = false;
  const target = returnFocusTo;
  returnFocusTo = null;
  if (target?.isConnected) target.focus();
  clearTimeout(closeTimer);
  closeTimer = setTimeout(() => {
    displayed.value = false;
    document.body.classList.remove('is-gnb-mobile');
  }, 400);
};

const close = () => emit('update:open', false);

watch(
  () => props.open,
  (open) => (open ? show() : hide())
);

// ---------- 1depth 탭 ----------
const selectTab = (i: number, focus = false) => {
  activeTab.value = i;
  // 초점 이동이 진행 중인 부드러운 스크롤을 끊지 않도록 먼저 초점(스크롤 없이) → 스크롤
  if (focus) tabRefs.value[i]?.focus({ preventScroll: true });
  scrollToTab(i);
};

const onTabKeydown = (event: KeyboardEvent, i: number) => {
  const last = props.items.length - 1;
  const map: Record<string, number> = {
    ArrowDown: Math.min(i + 1, last),
    ArrowUp: Math.max(i - 1, 0),
    Home: 0,
    End: last,
  };
  if (!(event.key in map)) return;
  event.preventDefault();
  selectTab(map[event.key], true);
};

// 스크롤 위치로 활성 탭 갱신 (KRDS setupAnchorScroll)
const onBodyScroll = () => {
  const body = bodyRef.value;
  if (!body) return;
  const atBottom = body.clientHeight + body.scrollTop >= body.scrollHeight - 1;
  let current = 0;
  props.items.forEach((_, i) => {
    const panel = document.getElementById(panelId(i));
    if (panel && body.scrollTop >= panel.offsetTop - 1) current = i;
  });
  activeTab.value = atBottom ? props.items.length - 1 : current;
};

// ---------- 3depth · 4depth ----------
const toggleDepth3 = (key: string) => {
  openDepth3[key] = !openDepth3[key];
};

const openDepth4Panel = async (key: string, event: MouseEvent) => {
  depth4Trigger = event.currentTarget as HTMLElement;
  depth4Displayed.value = key;
  await nextTick();
  openDepth4.value = key;
  await nextTick();
  await focusWhenReady(
    () =>
      document
        .getElementById(`${key}-${baseId}-d4`)
        ?.querySelector<HTMLElement>('.trigger-prev'),
    () => openDepth4.value === key
  );
};

function closeDepth4(restoreFocus = true) {
  if (!depth4Displayed.value) return;
  openDepth4.value = null;
  const trigger = depth4Trigger;
  depth4Trigger = null;
  if (restoreFocus) trigger?.focus();
  setTimeout(() => {
    if (!openDepth4.value) depth4Displayed.value = null;
  }, 400);
}

// ---------- 키보드 · 초점 ----------
const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' || event.key === 'Esc') {
    event.stopPropagation();
    if (openDepth4.value) closeDepth4();
    else close();
    return;
  }
  if (event.key !== 'Tab') return;
  // 4depth 패널이 열려 있으면 그 안에, 아니면 메뉴 영역 안에 초점을 가둔다
  const container = openDepth4.value
    ? document.getElementById(`${openDepth4.value}-${baseId}-d4`)
    : wrapRef.value;
  const list = focusables(container);
  if (!list.length) return;
  const first = list[0];
  const last = list[list.length - 1];
  const active = document.activeElement;
  if (event.shiftKey && (active === first || active === container)) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
};

// 배경 클릭 시 메뉴 영역으로 초점 (KRDS)
const onRootClick = (event: MouseEvent) => {
  if (!(event.target as HTMLElement).closest('.gnb-wrap'))
    wrapRef.value?.focus();
};

// PC 폭이 되면 닫는다 (KRDS resize)
const onResize = () => {
  if (props.open && window.innerWidth >= 1024) close();
};

onMounted(() => {
  window.addEventListener('resize', onResize);
  if (props.open) show();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize);
  clearTimeout(closeTimer);
  if (registered && rootRef.value) popModal(rootRef.value);
  document.body.classList.remove('is-gnb-mobile');
});

const linkAttrs = (node: MobileMenuNode) => ({
  href: node.href,
  target: node.external ? '_blank' : undefined,
  title: node.external ? '새 창 열림' : undefined,
  rel: node.external ? 'noopener noreferrer' : undefined,
  'aria-current': node.selected ? ('page' as const) : undefined,
});

// KRDS 펼침 요소는 a 태그라 블록으로 늘어난다. button은 기본 폭이 내용 크기이므로 맞춘다.
const blockButton = { width: '100%', textAlign: 'left' as const };

defineExpose({ close });
</script>

<template>
  <div
    :id="id"
    ref="rootRef"
    :class="[
      'krds-main-menu-mobile',
      { 'is-open': isOpen, 'is-backdrop': isOpen },
    ]"
    :style="{ display: displayed ? 'block' : 'none' }"
    @click="onRootClick"
    @keydown="onKeydown"
  >
    <div
      ref="wrapRef"
      class="gnb-wrap"
      role="dialog"
      aria-modal="true"
      :aria-label="label"
      tabindex="-1"
    >
      <div class="gnb-header">
        <div v-if="$slots.utils" class="gnb-utils">
          <ul class="utility-list">
            <slot name="utils" />
          </ul>
        </div>
        <div v-if="$slots.login" class="gnb-login">
          <slot name="login" />
        </div>
        <div v-if="$slots.service" class="gnb-service-menu">
          <slot name="service" />
        </div>
        <div v-if="$slots.search" class="sch-input">
          <slot name="search" />
        </div>
      </div>

      <div ref="bodyRef" class="gnb-body" @scroll="onBodyScroll">
        <div class="gnb-menu">
          <div class="menu-wrap">
            <ul role="tablist" aria-orientation="vertical" :aria-label="label">
              <li
                v-for="(item, i) in items"
                :key="`${i}-${item.label}`"
                role="none"
              >
                <a
                  :id="tabId(i)"
                  :ref="(el) => (tabRefs[i] = el as HTMLElement)"
                  :href="`#${panelId(i)}`"
                  :class="['gnb-main-trigger', { active: activeTab === i }]"
                  role="tab"
                  :aria-selected="activeTab === i ? 'true' : 'false'"
                  :aria-controls="panelId(i)"
                  :tabindex="activeTab === i ? 0 : -1"
                  @click.prevent="selectTab(i)"
                  @keydown="onTabKeydown($event, i)"
                >
                  {{ item.label }}
                </a>
              </li>
            </ul>
          </div>
          <div class="submenu-wrap">
            <div
              v-for="(item, i) in items"
              :id="panelId(i)"
              :key="`${i}-${item.label}`"
              class="gnb-sub-list"
              role="tabpanel"
              :aria-labelledby="tabId(i)"
            >
              <h2 class="sub-title">{{ item.label }}</h2>
              <ul>
                <li
                  v-for="(sub, j) in item.children"
                  :key="`${j}-${sub.label}`"
                >
                  <template v-if="sub.children?.length">
                    <button
                      type="button"
                      :class="[
                        'gnb-sub-trigger',
                        'has-depth3',
                        { active: openDepth3[`${i}-${j}`] },
                      ]"
                      :style="blockButton"
                      :aria-expanded="
                        openDepth3[`${i}-${j}`] ? 'true' : 'false'
                      "
                      @click="toggleDepth3(`${i}-${j}`)"
                    >
                      {{ sub.label }}
                    </button>
                    <div
                      :class="[
                        'depth3-wrap',
                        { 'is-open': openDepth3[`${i}-${j}`] },
                      ]"
                    >
                      <ul>
                        <li
                          v-for="(d3, k) in sub.children"
                          :key="`${k}-${d3.label}`"
                        >
                          <template v-if="d3.children?.length">
                            <button
                              type="button"
                              :class="['depth3-trigger', 'has-depth4']"
                              :style="blockButton"
                              aria-haspopup="dialog"
                              @click="openDepth4Panel(`${i}-${j}-${k}`, $event)"
                            >
                              {{ d3.label }}
                            </button>
                            <div
                              v-if="depth4Displayed === `${i}-${j}-${k}`"
                              :id="`${i}-${j}-${k}-${baseId}-d4`"
                              :class="[
                                'depth4-wrap',
                                { 'is-open': openDepth4 === `${i}-${j}-${k}` },
                              ]"
                              style="display: block"
                              role="dialog"
                              aria-modal="true"
                              :aria-label="d3.label"
                            >
                              <div class="depth4-head">
                                <button
                                  type="button"
                                  class="krds-btn icon trigger-prev"
                                  @click="closeDepth4()"
                                >
                                  <span class="sr-only">이전화면</span>
                                  <i
                                    class="svg-icon ico-angle left"
                                    aria-hidden="true"
                                  ></i>
                                </button>
                                <button
                                  type="button"
                                  class="krds-btn icon trigger-close"
                                  @click="close"
                                >
                                  <span class="sr-only">{{ closeLabel }}</span>
                                  <i
                                    class="svg-icon ico-popup-close"
                                    aria-hidden="true"
                                  ></i>
                                </button>
                              </div>
                              <div class="depth4-body">
                                <h4 class="sub-title">{{ d3.label }}</h4>
                                <ul class="depth4-ul">
                                  <li v-for="d4 in d3.children" :key="d4.label">
                                    <a
                                      v-bind="linkAttrs(d4)"
                                      :class="{ selected: d4.selected }"
                                    >
                                      {{ d4.label }}
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </template>
                          <a
                            v-else
                            v-bind="linkAttrs(d3)"
                            :class="[
                              'depth3-trigger',
                              { selected: d3.selected },
                            ]"
                          >
                            {{ d3.label }}
                          </a>
                        </li>
                      </ul>
                    </div>
                  </template>
                  <a
                    v-else
                    v-bind="linkAttrs(sub)"
                    :class="['gnb-sub-trigger', { selected: sub.selected }]"
                  >
                    {{ sub.label }}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div v-if="$slots.bottom" class="gnb-bottom">
          <slot name="bottom" />
        </div>
      </div>

      <button
        id="close-nav"
        type="button"
        class="krds-btn medium icon"
        @click="close"
      >
        <span class="sr-only">{{ closeLabel }}</span>
        <i class="svg-icon ico-popup-close" aria-hidden="true"></i>
      </button>
    </div>
  </div>
</template>

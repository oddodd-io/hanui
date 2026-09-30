<script setup lang="ts">
/**
 * MainMenu — KRDS `nav.krds-main-menu` PC 주메뉴 (메가메뉴)
 *
 * 마크업·클래스는 KRDS main_menu_pc.html / header.html 그대로다.
 * 동작은 KRDS ui-script.js krds_mainMenuPC를 따른다:
 * 1depth 토글(aria-expanded/controls/haspopup, .active, .gnb-toggle-wrap.is-open) · 배경(.gnb-backdrop.active) ·
 * body.is-gnb-web(스크롤 잠금)·hasScrollY(스크롤바 보정) · 2depth 첫 항목 기본 선택 · 활성 목록 높이로 min-height 조정 ·
 * 바깥 클릭 / Esc / 초점이 메뉴 밖으로 나가면 닫기 · 방향키로 형제 메뉴 이동.
 * 원본과 다른 점: Home/End는 같은 단계 안에서 이동, Esc로 닫으면 1depth 버튼에 초점을 돌려준다,
 * "메인 메뉴" 이름을 ul이 아닌 nav 랜드마크에 붙인다.
 * 기준: reference/krds-uiux/html/code/main_menu_pc.html, resources/scss/component/_main_menu.scss
 */
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  useId,
} from 'vue';

export interface MainMenuLink {
  label: string;
  href: string;
  /** 새 창 (target="_blank" title="새 창 열림") */
  external?: boolean;
  /** 현재 페이지 (.active + aria-current) */
  active?: boolean;
}

export interface MainMenuDescription {
  title: string;
  href: string;
  text: string;
  external?: boolean;
}

/** 2depth — items/descriptions가 있으면 오른쪽 목록을 여는 버튼, 없으면 바로가기 링크(.is-link) */
export interface MainMenuSub {
  label: string;
  /** 링크형이면 이동 주소, 목록형이면 제목 옆 "바로가기" 주소 */
  href?: string;
  external?: boolean;
  items?: MainMenuLink[];
  /** 설명형 목록 (.type-description) */
  descriptions?: MainMenuDescription[];
  /** between: 배너를 오른쪽에 둔다 */
  layout?: 'default' | 'between';
}

/** 1depth */
export interface MainMenuItem {
  label: string;
  /** 하위 메뉴 없이 바로 이동 (.is-link) */
  href?: string;
  /** 현재 대분류 강조 (.selected) */
  selected?: boolean;
  /** 왼쪽 2depth 목록 + 오른쪽 3depth (data-has-submenu) */
  children?: MainMenuSub[];
  /** 왼쪽 목록 없이 한 목록만 (.single-list) */
  list?: MainMenuSub;
}

export interface MainMenuProps {
  items: MainMenuItem[];
  /** nav 랜드마크 이름 */
  label?: string;
}

const props = withDefaults(defineProps<MainMenuProps>(), {
  label: '메인 메뉴',
});

defineSlots<{
  /** 하위 목록 배너 (.gnb-sub-banner). 주면 모든 목록에 렌더한다 */
  banner?: (scope: { item: MainMenuItem; sub: MainMenuSub }) => unknown;
}>();

const baseId = useId();
const navRef = ref<HTMLElement | null>(null);
const openIndex = ref<number | null>(null);
/** 1depth별 선택된 2depth (KRDS: 첫 항목 기본 선택) */
const activeSub = reactive<Record<number, number>>({});
const mainListRefs = ref<Record<number, HTMLElement | null>>({});
const mainListMinHeight = reactive<Record<number, string>>({});

const toggleId = (i: number) => `gnb-main-menu-${baseId}-${i}`;
const subId = (i: number, j: number) => `gnb-sub-menu-${baseId}-${i}-${j}`;

const hasDropdown = (item: MainMenuItem) =>
  !!(item.children?.length || item.list);
const isGroup = (sub: MainMenuSub) =>
  !!(sub.items?.length || sub.descriptions?.length);

props.items.forEach((item, i) => {
  const first = item.children?.findIndex(isGroup) ?? -1;
  if (first === 0) activeSub[i] = 0;
});

const setBodyState = (open: boolean) => {
  document.body.classList.toggle('is-gnb-web', open);
  const needsScroll = document.body.scrollHeight > window.innerHeight;
  document.body.classList.toggle('hasScrollY', open && needsScroll);
};

// 활성 하위 목록 높이에 맞춰 min-height 조정 (KRDS adjustSubMenuHeight)
const adjustHeight = async (i: number) => {
  await nextTick();
  const list = mainListRefs.value[i];
  const active = list?.querySelector<HTMLElement>('.gnb-sub-list.active');
  mainListMinHeight[i] = `${active?.scrollHeight ?? 0}px`;
};

const openMenu = (i: number) => {
  openIndex.value = i;
  setBodyState(true);
  adjustHeight(i);
};

const closeMenu = () => {
  if (openIndex.value === null) return;
  openIndex.value = null;
  setBodyState(false);
};

const toggleMain = (i: number) => {
  if (openIndex.value === i) closeMenu();
  else openMenu(i);
};

const selectSub = (i: number, j: number) => {
  activeSub[i] = j;
  adjustHeight(i);
};

const onDocumentClick = (event: MouseEvent) => {
  if (!navRef.value?.contains(event.target as Node)) closeMenu();
};

// Esc로 닫거나, Tab 등으로 초점이 메뉴 밖으로 나가면 닫는다 (KRDS keyup)
const onDocumentKeyup = (event: KeyboardEvent) => {
  if (openIndex.value === null) return;
  const insideMenu = navRef.value?.contains(event.target as Node);
  if (event.key === 'Escape' || event.key === 'Esc') {
    const index = openIndex.value;
    closeMenu();
    if (insideMenu) {
      navRef.value
        ?.querySelectorAll<HTMLElement>('.gnb-menu > li > .gnb-main-trigger')
        [index]?.focus();
    }
  } else if (!insideMenu) {
    closeMenu();
  }
};

// 방향키 · Home · End (data-trigger 요소)
const onKeydown = (event: KeyboardEvent) => {
  const target = event.target as HTMLElement;
  if (!target.hasAttribute('data-trigger')) return;
  const li = target.closest('li');
  const list = li?.parentElement;
  if (!li || !list) return;
  const triggers = Array.from(list.children)
    .map((child) => child.querySelector<HTMLElement>(':scope > [data-trigger]'))
    .filter((el): el is HTMLElement => !!el);
  const index = triggers.indexOf(target);
  let next: HTMLElement | undefined;
  switch (event.key) {
    case 'Home':
      next = triggers[0];
      break;
    case 'End':
      next = triggers[triggers.length - 1];
      break;
    case 'ArrowRight':
    case 'ArrowDown':
      next = triggers[index + 1];
      break;
    case 'ArrowLeft':
    case 'ArrowUp':
      next = triggers[index - 1];
      break;
    default:
      return;
  }
  event.preventDefault();
  next?.focus();
};

onMounted(() => {
  document.addEventListener('click', onDocumentClick);
  document.addEventListener('keyup', onDocumentKeyup);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick);
  document.removeEventListener('keyup', onDocumentKeyup);
  if (openIndex.value !== null) setBodyState(false);
});

const backdropActive = computed(() => openIndex.value !== null);

const linkAttrs = (link: { href?: string; external?: boolean }) => ({
  href: link.href,
  target: link.external ? '_blank' : undefined,
  title: link.external ? '새 창 열림' : undefined,
  rel: link.external ? 'noopener noreferrer' : undefined,
});

defineExpose({ close: closeMenu, open: openMenu });
</script>

<template>
  <nav
    ref="navRef"
    class="krds-main-menu"
    :aria-label="label"
    @keydown="onKeydown"
  >
    <div class="inner">
      <ul class="gnb-menu">
        <li v-for="(item, i) in items" :key="`${i}-${item.label}`">
          <!-- 1depth: 바로 이동 -->
          <a
            v-if="!hasDropdown(item)"
            :href="item.href"
            :class="[
              'gnb-main-trigger',
              'is-link',
              { selected: item.selected },
            ]"
            :aria-current="item.selected ? 'page' : undefined"
            data-trigger="gnb"
          >
            {{ item.label }}
          </a>
          <template v-else>
            <button
              type="button"
              :class="[
                'gnb-main-trigger',
                { active: openIndex === i, selected: item.selected },
              ]"
              :aria-controls="toggleId(i)"
              :aria-expanded="openIndex === i ? 'true' : 'false'"
              aria-haspopup="true"
              data-trigger="gnb"
              @click="toggleMain(i)"
            >
              {{ item.label }}
            </button>
            <div
              :id="toggleId(i)"
              :class="['gnb-toggle-wrap', { 'is-open': openIndex === i }]"
            >
              <!-- 왼쪽 2depth 목록 + 오른쪽 3depth -->
              <div
                v-if="item.children?.length"
                :ref="(el) => (mainListRefs[i] = el as HTMLElement | null)"
                class="gnb-main-list"
                data-has-submenu="true"
                :style="
                  mainListMinHeight[i]
                    ? { minHeight: mainListMinHeight[i] }
                    : undefined
                "
              >
                <ul>
                  <li
                    v-for="(sub, j) in item.children"
                    :key="`${j}-${sub.label}`"
                  >
                    <template v-if="isGroup(sub)">
                      <button
                        type="button"
                        :class="[
                          'gnb-sub-trigger',
                          { active: activeSub[i] === j },
                        ]"
                        :aria-controls="subId(i, j)"
                        :aria-expanded="activeSub[i] === j ? 'true' : 'false'"
                        aria-haspopup="true"
                        data-trigger="gnb"
                        @click="selectSub(i, j)"
                      >
                        {{ sub.label }}
                      </button>
                      <div
                        :id="subId(i, j)"
                        :class="[
                          'gnb-sub-list',
                          {
                            between: sub.layout === 'between',
                            active: activeSub[i] === j,
                          },
                        ]"
                      >
                        <div class="gnb-sub-content">
                          <h2 class="sub-title">
                            <template v-if="sub.href">
                              {{ sub.label }}
                              <a
                                v-bind="linkAttrs(sub)"
                                class="krds-btn link basic small"
                              >
                                <span class="underline">바로가기</span>
                                <span class="sr-only"> {{ sub.label }}</span>
                                <i
                                  class="svg-icon ico-angle right"
                                  aria-hidden="true"
                                ></i>
                              </a>
                            </template>
                            <span v-else>{{ sub.label }}</span>
                          </h2>
                          <ul
                            v-if="sub.descriptions?.length"
                            class="type-description"
                          >
                            <li
                              v-for="desc in sub.descriptions"
                              :key="desc.title"
                            >
                              <h3 class="tit">
                                <a v-bind="linkAttrs(desc)">
                                  {{ desc.title }}
                                  <i
                                    v-if="desc.external"
                                    class="svg-icon ico-go"
                                    aria-hidden="true"
                                  ></i>
                                </a>
                              </h3>
                              <p class="txt">{{ desc.text }}</p>
                            </li>
                          </ul>
                          <ul v-else>
                            <li v-for="link in sub.items" :key="link.label">
                              <a
                                v-bind="linkAttrs(link)"
                                :class="{ active: link.active }"
                                :aria-current="link.active ? 'page' : undefined"
                              >
                                {{ link.label }}
                              </a>
                            </li>
                          </ul>
                        </div>
                        <div v-if="$slots.banner" class="gnb-sub-banner">
                          <slot name="banner" :item="item" :sub="sub" />
                        </div>
                      </div>
                    </template>
                    <a
                      v-else
                      v-bind="linkAttrs(sub)"
                      :class="[
                        'gnb-sub-trigger',
                        'is-link',
                        { 'external-link': sub.external },
                      ]"
                      data-trigger="gnb"
                    >
                      {{ sub.label }}
                    </a>
                  </li>
                </ul>
              </div>
              <!-- 왼쪽 목록 없는 단일 목록 -->
              <div v-else-if="item.list" class="gnb-main-list">
                <div
                  :class="[
                    'gnb-sub-list',
                    'single-list',
                    { between: item.list.layout === 'between' },
                  ]"
                >
                  <div class="gnb-sub-content">
                    <h2 class="sub-title">
                      <span>{{ item.list.label }}</span>
                    </h2>
                    <ul>
                      <li v-for="link in item.list.items" :key="link.label">
                        <a
                          v-bind="linkAttrs(link)"
                          :class="{ active: link.active }"
                          :aria-current="link.active ? 'page' : undefined"
                        >
                          {{ link.label }}
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div v-if="$slots.banner" class="gnb-sub-banner">
                    <slot name="banner" :item="item" :sub="item.list" />
                  </div>
                </div>
              </div>
            </div>
          </template>
        </li>
      </ul>
    </div>
    <Teleport to="body">
      <div :class="['gnb-backdrop', { active: backdropActive }]"></div>
    </Teleport>
  </nav>
</template>

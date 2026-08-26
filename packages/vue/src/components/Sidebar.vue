<script setup lang="ts">
import { ref, computed, type Component } from 'vue';
import { PanelLeftClose, PanelLeftOpen, ChevronDown } from 'lucide-vue-next';
import { cn } from '@/lib/utils';

/** 사이드바 메뉴 아이템 */
export interface SidebarMenuItem {
  /** 메뉴 라벨 */
  label: string;
  /** 링크 URL */
  href?: string;
  /** 아이콘 컴포넌트 (lucide-vue-next 등) */
  icon?: Component;
  /** 활성화 상태 */
  active?: boolean;
  /** 하위 메뉴 */
  children?: SidebarMenuItem[];
}

interface Props {
  /** 사이드바 메뉴 아이템 */
  menuItems: SidebarMenuItem[];
  /** 사이트 타이틀 */
  siteTitle?: string;
  /** 사이드바 초기 접힘 상태 */
  defaultCollapsed?: boolean;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  siteTitle: '관리자',
  defaultCollapsed: false,
});

const emit = defineEmits<{
  /** 메뉴 클릭 (href가 있을 때만) */
  menuClick: [href: string];
  /** 접힘 상태 변경 — 메인 영역 여백(ml-16 / ml-64) 동기화용 */
  collapsedChange: [collapsed: boolean];
}>();

const collapsed = ref(props.defaultCollapsed);

// 활성 항목이 있는 메뉴는 처음부터 펼쳐 둔다
const openMenus = ref<Set<number>>(
  new Set(
    props.menuItems.reduce<number[]>((acc, item, index) => {
      if (item.active || item.children?.some((c) => c.active)) acc.push(index);
      return acc;
    }, [])
  )
);

const toggleCollapsed = () => {
  collapsed.value = !collapsed.value;
  emit('collapsedChange', collapsed.value);
};

const toggleMenu = (index: number) => {
  const next = new Set(openMenus.value);
  if (next.has(index)) next.delete(index);
  else next.add(index);
  openMenus.value = next;
};

const handleMenuClick = (e: MouseEvent, href?: string) => {
  if (!href) return;
  e.preventDefault();
  emit('menuClick', href);
};

const isItemActive = (item: SidebarMenuItem) =>
  item.active || item.children?.some((c) => c.active);

const asideClasses = computed(() =>
  cn(
    'fixed top-0 left-0 h-screen bg-krds-white border-r border-krds-gray-20 transition-all duration-300 z-40 flex flex-col',
    collapsed.value ? 'w-16' : 'w-64',
    props.class
  )
);
</script>

<template>
  <aside :class="asideClasses" aria-label="사이드바 메뉴">
    <!-- 헤더: 로고/타이틀 + 접기 버튼 -->
    <div class="flex items-center h-16 px-4 flex-shrink-0">
      <div v-if="!collapsed" class="flex items-center gap-2 flex-1 min-w-0">
        <div v-if="$slots.logo" class="flex-shrink-0">
          <slot name="logo" />
        </div>
        <span class="text-krds-body-md font-bold text-krds-gray-90 truncate">
          {{ siteTitle }}
        </span>
      </div>
      <button
        type="button"
        :class="
          cn(
            'p-2 rounded-md text-krds-gray-60 hover:bg-krds-gray-10 hover:text-krds-gray-90',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-krds-blue-60',
            'transition-colors cursor-pointer',
            collapsed && 'mx-auto'
          )
        "
        :aria-label="collapsed ? '사이드바 펼치기' : '사이드바 접기'"
        @click="toggleCollapsed"
      >
        <PanelLeftOpen v-if="collapsed" class="w-5 h-5" aria-hidden="true" />
        <PanelLeftClose v-else class="w-5 h-5" aria-hidden="true" />
      </button>
    </div>

    <!-- 메뉴 -->
    <nav class="flex-1 overflow-y-auto py-2">
      <ul class="list-none p-0 m-0">
        <li v-for="(item, index) in menuItems" :key="index">
          <!-- 하위 메뉴가 있고 펼쳐진 상태 -->
          <template
            v-if="item.children && item.children.length > 0 && !collapsed"
          >
            <button
              type="button"
              :class="
                cn(
                  'flex items-center w-full px-4 py-3 gap-3',
                  'text-krds-body-md text-krds-gray-70 text-left',
                  'hover:bg-krds-primary-5 hover:text-krds-gray-90',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-krds-blue-60 focus-visible:outline-offset-[-2px]',
                  'transition-colors cursor-pointer border-0 bg-transparent',
                  isItemActive(item) && 'text-krds-primary-base font-bold'
                )
              "
              :aria-expanded="openMenus.has(index)"
              @click="toggleMenu(index)"
            >
              <span
                v-if="item.icon"
                class="flex-shrink-0 w-5 h-5"
                aria-hidden="true"
              >
                <component :is="item.icon" />
              </span>
              <span class="flex-1 truncate">{{ item.label }}</span>
              <ChevronDown
                :class="
                  cn(
                    'w-4 h-4 flex-shrink-0 transition-transform duration-200',
                    openMenus.has(index) && 'rotate-180'
                  )
                "
                aria-hidden="true"
              />
            </button>
            <ul v-if="openMenus.has(index)" class="list-none p-0 m-0">
              <li
                v-for="(child, childIndex) in item.children"
                :key="childIndex"
              >
                <a
                  :href="child.href"
                  :class="
                    cn(
                      'flex items-center w-full py-2 pl-12 pr-4 gap-3',
                      'text-[14px] text-krds-gray-60 no-underline',
                      'hover:bg-krds-primary-5 hover:text-krds-gray-90',
                      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-krds-blue-60 focus-visible:outline-offset-[-2px]',
                      'transition-colors',
                      child.active &&
                        'text-krds-primary-base font-bold bg-krds-primary-5'
                    )
                  "
                  :aria-current="child.active ? 'page' : undefined"
                  @click="handleMenuClick($event, child.href)"
                >
                  <span
                    v-if="child.icon"
                    class="flex-shrink-0 w-4 h-4"
                    aria-hidden="true"
                  >
                    <component :is="child.icon" />
                  </span>
                  <span class="truncate">{{ child.label }}</span>
                </a>
              </li>
            </ul>
          </template>

          <!-- 단일 항목 (또는 접힌 상태) -->
          <!--
            href가 없으면 <a>는 링크가 아니라서 aria-label을 쓸 수 없다
            (axe aria-prohibited-attr). 그런 항목은 button으로 렌더한다.
          -->
          <component
            :is="item.href ? 'a' : 'button'"
            v-else
            :href="item.href"
            :type="item.href ? undefined : 'button'"
            :class="
              cn(
                'flex items-center w-full px-4 py-3 gap-3',
                'text-krds-body-md text-krds-gray-70 no-underline text-left',
                'hover:bg-krds-primary-5 hover:text-krds-gray-90',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-krds-blue-60 focus-visible:outline-offset-[-2px]',
                'transition-colors cursor-pointer border-0 bg-transparent',
                collapsed && 'justify-center px-0',
                isItemActive(item) &&
                  'text-krds-primary-base font-bold bg-krds-primary-5'
              )
            "
            :aria-current="item.active ? 'page' : undefined"
            :aria-label="collapsed ? item.label : undefined"
            :title="collapsed ? item.label : undefined"
            @click="handleMenuClick($event, item.href)"
          >
            <span
              v-if="item.icon"
              class="flex-shrink-0 w-5 h-5"
              aria-hidden="true"
            >
              <component :is="item.icon" />
            </span>
            <span v-if="!collapsed" class="flex-1 truncate">
              {{ item.label }}
            </span>
          </component>
        </li>
      </ul>
    </nav>

    <!-- 푸터 -->
    <div
      v-if="$slots.footer && !collapsed"
      class="flex-shrink-0 border-t border-krds-gray-20 p-4"
    >
      <slot name="footer" />
    </div>
  </aside>
</template>

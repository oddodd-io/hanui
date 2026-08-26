<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { ChevronDown, Search, Menu, X } from 'lucide-vue-next';
import { cn } from '@/lib/utils';
import Container from './Container.vue';

export interface UtilityLink {
  label: string;
  href: string;
}

export interface HeaderNavigationLink {
  label: string;
  href: string;
  active?: boolean;
  description?: string;
}

export interface HeaderNavigationItem {
  label: string;
  href?: string;
  active?: boolean;
  children?: HeaderNavigationLink[];
}

const props = withDefaults(
  defineProps<{
    navigationItems?: HeaderNavigationItem[];
    utilityLinks?: UtilityLink[];
    relatedSites?: UtilityLink[];
    logo?: string;
    logoAlt?: string;
    logoHref?: string;
    class?: string;
  }>(),
  {
    logo: 'https://www.krds.go.kr/resources/img/pattern/layout/head_logo.svg',
    logoAlt: '대한민국정부',
    logoHref: '/',
    utilityLinks: () => [
      { label: '로그인', href: '#' },
      { label: '회원가입', href: '#' },
      { label: 'ENGLISH', href: '#' },
    ],
    relatedSites: () => [
      { label: '건강iN', href: '#' },
      { label: 'The건강보험', href: '#' },
      { label: '요양기관업무포털', href: '#' },
    ],
  }
);

const emit = defineEmits<{
  search: [query: string];
}>();

const isMobileMenuOpen = ref(false);
const isUtilityDropdownOpen = ref(false);
const isSearchOpen = ref(false);
const searchQuery = ref('');
const openNavIndex = ref<number | null>(null);

const handleSearch = () => {
  emit('search', searchQuery.value);
  isSearchOpen.value = false;
  searchQuery.value = '';
};

const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (!target.closest('.utility-dropdown')) {
    isUtilityDropdownOpen.value = false;
  }
  if (!target.closest('.nav-item')) {
    openNavIndex.value = null;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <header :class="cn('krds-header relative z-50 bg-white', props.class)">
    <!-- Utility Bar -->
    <div
      v-if="utilityLinks && utilityLinks.length > 0"
      class="border-b border-krds-gray-10 bg-krds-gray-5"
    >
      <Container class="flex justify-end">
        <ul class="flex items-center gap-4 text-sm">
          <li v-for="link in utilityLinks" :key="link.label">
            <a
              :href="link.href"
              class="text-krds-gray-70 hover:text-krds-gray-90 hover:underline py-2 inline-block"
            >
              {{ link.label }}
            </a>
          </li>
          <li v-if="relatedSites && relatedSites.length > 0" class="relative utility-dropdown">
            <button
              type="button"
              class="flex items-center gap-1 text-krds-gray-70 hover:text-krds-gray-90 py-2"
              aria-label="관련사이트 메뉴"
              :aria-expanded="isUtilityDropdownOpen"
              @click="isUtilityDropdownOpen = !isUtilityDropdownOpen"
            >
              관련사이트
              <ChevronDown
                :class="
                  cn(
                    'h-4 w-4 transition-transform',
                    isUtilityDropdownOpen && 'rotate-180'
                  )
                "
                aria-hidden="true"
              />
            </button>
            <div
              v-if="isUtilityDropdownOpen"
              class="absolute right-0 top-full mt-1 z-50 min-w-[160px] rounded-md border border-krds-gray-20 bg-white shadow-lg"
            >
              <a
                v-for="site in relatedSites"
                :key="site.label"
                :href="site.href"
                target="_blank"
                rel="noopener noreferrer"
                class="block px-4 py-2 text-sm text-krds-gray-90 hover:bg-krds-gray-5"
              >
                {{ site.label }}
                <span class="sr-only"> (새 창 열기)</span>
              </a>
            </div>
          </li>
        </ul>
      </Container>
    </div>

    <!-- Branding + Actions -->
    <div class="border-b border-krds-gray-10">
      <Container class="flex items-center justify-between py-4">
        <div class="flex items-center gap-4">
          <a
            :href="logoHref"
            class="block"
            :aria-label="`${logoAlt} 홈으로 이동`"
          >
            <img :src="logo" :alt="logoAlt" class="h-10" />
          </a>
          <slot name="slogan" />
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="p-2 rounded-md hover:bg-krds-gray-5 focus:outline-none focus:ring-2 focus:ring-krds-primary-60"
            aria-label="검색"
            @click="isSearchOpen = true"
          >
            <Search class="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            class="p-2 rounded-md hover:bg-krds-gray-5 focus:outline-none focus:ring-2 focus:ring-krds-primary-60 lg:hidden"
            :aria-label="isMobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'"
            :aria-expanded="isMobileMenuOpen"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
          >
            <X v-if="isMobileMenuOpen" class="h-5 w-5" aria-hidden="true" />
            <Menu v-else class="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </Container>
    </div>

    <!-- Navigation -->
    <nav
      v-if="navigationItems && navigationItems.length > 0"
      id="gnb"
      :class="
        cn(
          'bg-white border-b border-krds-gray-10',
          'lg:block',
          isMobileMenuOpen ? 'block' : 'hidden'
        )
      "
      aria-label="주 메뉴"
    >
      <Container>
        <ul class="flex flex-col lg:flex-row lg:items-center lg:gap-2">
          <li
            v-for="(item, index) in navigationItems"
            :key="index"
            class="relative nav-item"
            @mouseenter="item.children && (openNavIndex = index)"
            @mouseleave="openNavIndex = null"
          >
            <!-- Has Children -->
            <template v-if="item.children && item.children.length > 0">
              <button
                type="button"
                :class="
                  cn(
                    'flex items-center gap-1 w-full lg:w-auto px-4 py-3 font-medium',
                    'hover:bg-krds-gray-5 rounded-md',
                    'focus:outline-none focus:ring-2 focus:ring-krds-primary-60',
                    item.active && 'text-krds-primary-60'
                  )
                "
                :aria-expanded="openNavIndex === index"
                @click="openNavIndex = openNavIndex === index ? null : index"
              >
                {{ item.label }}
                <ChevronDown
                  :class="
                    cn(
                      'h-4 w-4 transition-transform',
                      openNavIndex === index && 'rotate-180'
                    )
                  "
                  aria-hidden="true"
                />
              </button>
              <div
                v-if="openNavIndex === index"
                class="lg:absolute lg:top-full lg:left-0 lg:mt-1 lg:min-w-[200px] lg:rounded-md lg:border lg:border-krds-gray-20 lg:bg-white lg:shadow-lg bg-krds-gray-5 lg:bg-white"
              >
                <a
                  v-for="child in item.children"
                  :key="child.label"
                  :href="child.href"
                  :class="
                    cn(
                      'block px-4 py-2 text-sm',
                      'hover:bg-krds-gray-5',
                      'focus:outline-none focus:ring-2 focus:ring-krds-primary-60',
                      child.active && 'text-krds-primary-60 font-medium'
                    )
                  "
                  :aria-current="child.active ? 'page' : undefined"
                >
                  {{ child.label }}
                </a>
              </div>
            </template>

            <!-- Simple Link -->
            <a
              v-else
              :href="item.href"
              :class="
                cn(
                  'block px-4 py-3 font-medium',
                  'hover:bg-krds-gray-5 rounded-md',
                  'focus:outline-none focus:ring-2 focus:ring-krds-primary-60',
                  item.active && 'text-krds-primary-60'
                )
              "
              :aria-current="item.active ? 'page' : undefined"
            >
              {{ item.label }}
            </a>
          </li>
        </ul>
      </Container>
    </nav>

    <!-- Search Dialog -->
    <Teleport to="body">
      <div
        v-if="isSearchOpen"
        class="fixed inset-0 z-[100] bg-black/50"
        @click="isSearchOpen = false"
      />
      <div
        v-if="isSearchOpen"
        class="fixed top-0 left-0 right-0 z-[101] bg-white shadow-lg p-6"
      >
        <Container class="relative">
          <h2 class="text-lg font-bold mb-4">검색</h2>
          <div class="flex items-center gap-2">
            <Search class="h-5 w-5 text-krds-gray-40" aria-hidden="true" />
            <input
              v-model="searchQuery"
              type="search"
              aria-label="검색어"
              placeholder="검색어를 입력하세요"
              class="flex-1 border-b border-krds-gray-30 py-2 text-lg focus:outline-none focus:border-krds-primary-60"
              @keydown.enter="handleSearch"
            />
          </div>
          <button
            type="button"
            class="absolute top-0 right-0 p-2 rounded-md hover:bg-krds-gray-5"
            aria-label="닫기"
            @click="isSearchOpen = false"
          >
            <X class="h-5 w-5" aria-hidden="true" />
          </button>
        </Container>
      </div>
    </Teleport>
  </header>
</template>

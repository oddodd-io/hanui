<script setup lang="ts">
import { ref } from 'vue';
import { cn } from '@/lib/utils';

export interface TabBarItem {
  label: string;
  href: string;
  badge?: number;
  active?: boolean;
}

const props = withDefaults(
  defineProps<{
    items: TabBarItem[];
    variant?: 'default' | 'border';
    class?: string;
  }>(),
  {
    variant: 'default',
  }
);

const emit = defineEmits<{
  itemClick: [item: TabBarItem, index: number];
}>();

const activeIndex = ref(props.items.findIndex((item) => item.active) || 0);

const handleClick = (item: TabBarItem, index: number, e: MouseEvent) => {
  e.preventDefault();
  activeIndex.value = index;
  emit('itemClick', item, index);
};

// KRDS recommends max 5 items
if (props.items.length > 5) {
  console.warn('TabBars: KRDS recommends maximum 5 menu items');
}
</script>

<template>
  <nav
    role="navigation"
    aria-label="Main navigation"
    :class="
      cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'bg-white border-t border-krds-gray-20',
        'shadow-[0_-2px_8px_0_rgba(0,0,0,0.08)]',
        'pb-safe',
        props.class
      )
    "
  >
    <div class="flex items-center justify-around h-16 max-w-screen-xl mx-auto">
      <a
        v-for="(item, index) in items"
        :key="item.href"
        :href="item.href"
        :aria-current="index === activeIndex ? 'page' : undefined"
        :class="
          cn(
            'relative flex flex-col items-center justify-center',
            'min-w-[64px] h-full px-2',
            'transition-colors duration-200',
            'min-h-[44px]',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-krds-primary-base focus-visible:ring-offset-2',
            index === activeIndex && 'text-krds-gray-95',
            index !== activeIndex && 'text-krds-gray-60 hover:text-krds-gray-90'
          )
        "
        @click="(e) => handleClick(item, index, e)"
      >
        <!-- Icon Slot -->
        <div class="relative flex items-center justify-center w-6 h-6 mb-1">
          <slot
            :name="`icon-${index}`"
            :active="index === activeIndex"
            :variant="variant"
          >
            <!-- Default icon placeholder -->
            <div class="w-6 h-6 rounded bg-krds-gray-30" />
          </slot>

          <!-- Badge -->
          <span
            v-if="item.badge !== undefined && item.badge > 0"
            :class="
              cn(
                'absolute -top-1 -right-1',
                'flex items-center justify-center',
                'min-w-[16px] h-4 px-1',
                'text-[10px] font-bold text-white',
                'bg-krds-red-base rounded-full',
                'leading-none'
              )
            "
          >
            {{ item.badge > 99 ? '99+' : item.badge }}
            <span class="sr-only">개 알림</span>
          </span>
        </div>

        <!-- Label -->
        <span
          :class="
            cn(
              'text-xs font-medium leading-tight text-center',
              'max-w-full truncate',
              index === activeIndex && 'font-bold'
            )
          "
        >
          {{ item.label }}
        </span>

        <!-- Active indicator (border variant) -->
        <span
          v-if="variant === 'border' && index === activeIndex"
          class="absolute top-0 left-0 right-0 h-[2px] bg-krds-gray-95"
          aria-hidden="true"
        />
      </a>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils';

const props = withDefaults(
  defineProps<{
    sideOffset?: number;
    class?: string;
  }>(),
  {
    sideOffset: 4,
  }
);
</script>

<template>
  <!--
    이전에는 <Transition>으로 감싸고 있었으나 내부에 v-if/v-show 토글이 없어
    전환이 한 번도 실행되지 않았다 (열고 닫는 주체는 부모다). 죽은 래퍼라 제거했다.
  -->
  <div
    :class="
      cn(
        'absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-krds-gray-20 bg-white p-1 text-krds-gray-95 shadow-md',
        'top-full left-0',
        props.class
      )
    "
    :style="{ marginTop: `${sideOffset}px` }"
    role="menu"
  >
    <slot />
  </div>
</template>

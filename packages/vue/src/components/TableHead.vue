<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';

const alignmentClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

const props = withDefaults(
  defineProps<{
    align?: 'left' | 'center' | 'right';
    sortable?: boolean;
    sortDirection?: 'asc' | 'desc' | null;
    /** 헤더 셀의 적용 범위 (WCAG 1.3.1) */
    scope?: 'col' | 'row' | 'colgroup' | 'rowgroup';
    class?: string;
  }>(),
  {
    align: 'left',
    sortable: false,
    scope: 'col',
  }
);

// aria-sort로 현재 정렬 상태를 보조기기에 전달한다 (WCAG 1.3.1)
const ariaSort = computed(() => {
  if (!props.sortable) return undefined;
  if (props.sortDirection === 'asc') return 'ascending';
  if (props.sortDirection === 'desc') return 'descending';
  return 'none';
});

const emit = defineEmits<{
  sort: [];
}>();

const handleClick = () => {
  if (props.sortable) {
    emit('sort');
  }
};

const classes = computed(() =>
  cn(
    'align-middle text-[15px] font-bold text-krds-gray-95',
    props.sortable ? 'p-0' : 'px-4 py-2',
    alignmentClasses[props.align],
    '[&:has([role=checkbox])]:pr-0',
    props.class
  )
);
</script>

<template>
  <th :class="classes" :scope="scope" :aria-sort="ariaSort">
    <!--
      th에 @click만 두면 키보드로 정렬할 수 없다 (WCAG 2.1.1).
      실제 조작은 네이티브 button이 담당한다.
    -->
    <button
      v-if="sortable"
      type="button"
      :class="
        cn(
          'flex w-full items-center px-4 py-2 select-none',
          'cursor-pointer hover:bg-krds-primary-5',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-krds-primary-60 focus-visible:ring-inset',
          align === 'center' && 'justify-center',
          align === 'right' && 'justify-end'
        )
      "
      @click="handleClick"
    >
      <span><slot /></span>
      <span class="ml-2 inline-flex flex-col">
        <svg
          :class="cn(
            'h-3 w-3 -mb-1',
            sortDirection === 'asc' ? 'text-krds-gray-90' : 'text-krds-gray-40'
          )"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" />
        </svg>
        <svg
          :class="cn(
            'h-3 w-3 -mt-1',
            sortDirection === 'desc' ? 'text-krds-gray-90' : 'text-krds-gray-40'
          )"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" />
        </svg>
      </span>
    </button>
    <slot v-else />
  </th>
</template>

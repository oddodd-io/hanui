<script setup lang="ts" generic="T">
import { ref, computed, watch } from 'vue';
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-vue-next';
import { cn } from '@/lib/utils';
import Button from './Button.vue';
import Checkbox from './Checkbox.vue';
import Input from './Input.vue';

export interface DataTableColumn<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string | number;
}

const props = withDefaults(
  defineProps<{
    columns: DataTableColumn<T>[];
    data: T[];
    enableRowSelection?: boolean;
    enableGlobalFilter?: boolean;
    enablePagination?: boolean;
    pageSizeOptions?: number[];
    defaultPageSize?: number;
    emptyMessage?: string;
    filterPlaceholder?: string;
    loading?: boolean;
    caption?: string;
    class?: string;
  }>(),
  {
    enableRowSelection: false,
    enableGlobalFilter: false,
    enablePagination: false,
    pageSizeOptions: () => [10, 20, 30, 50],
    defaultPageSize: 10,
    emptyMessage: '데이터가 없습니다.',
    filterPlaceholder: '검색...',
    loading: false,
  }
);

const emit = defineEmits<{
  rowSelectionChange: [selectedRows: T[]];
}>();

// State
const sortColumn = ref<string | null>(null);
const sortDirection = ref<'asc' | 'desc'>('asc');
const globalFilter = ref('');
const selectedRows = ref<Set<number>>(new Set());
const pageIndex = ref(0);
const pageSize = ref(props.defaultPageSize);

// Computed: Filtered data
const filteredData = computed(() => {
  if (!globalFilter.value) return props.data;

  const search = globalFilter.value.toLowerCase();
  return props.data.filter((row) => {
    return props.columns.some((col) => {
      const value = getNestedValue(row, col.key as string);
      return String(value).toLowerCase().includes(search);
    });
  });
});

// Computed: Sorted data
const sortedData = computed(() => {
  if (!sortColumn.value) return filteredData.value;

  return [...filteredData.value].sort((a, b) => {
    const aVal = getNestedValue(a, sortColumn.value as string);
    const bVal = getNestedValue(b, sortColumn.value as string);

    if (aVal === bVal) return 0;
    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;

    const comparison = aVal < bVal ? -1 : 1;
    return sortDirection.value === 'asc' ? comparison : -comparison;
  });
});

// Computed: Paginated data
const paginatedData = computed(() => {
  if (!props.enablePagination) return sortedData.value;

  const start = pageIndex.value * pageSize.value;
  const end = start + pageSize.value;
  return sortedData.value.slice(start, end);
});

// Computed: Page count
const pageCount = computed(() => {
  return Math.ceil(sortedData.value.length / pageSize.value) || 1;
});

// Computed: Selection state
const isAllSelected = computed(() => {
  if (paginatedData.value.length === 0) return false;
  return paginatedData.value.every((_, index) => {
    const globalIndex = props.enablePagination
      ? pageIndex.value * pageSize.value + index
      : index;
    return selectedRows.value.has(globalIndex);
  });
});

const isSomeSelected = computed(() => {
  return paginatedData.value.some((_, index) => {
    const globalIndex = props.enablePagination
      ? pageIndex.value * pageSize.value + index
      : index;
    return selectedRows.value.has(globalIndex);
  });
});

// Helper: Get nested value
function getNestedValue(obj: unknown, path: string): unknown {
  return path.split('.').reduce((o, p) => (o as Record<string, unknown>)?.[p], obj);
}

// Handlers
const handleSort = (column: DataTableColumn<T>) => {
  if (!column.sortable) return;

  const key = column.key as string;
  if (sortColumn.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn.value = key;
    sortDirection.value = 'asc';
  }
};

const handleSelectAll = (checked: boolean | 'indeterminate') => {
  if (checked === true) {
    paginatedData.value.forEach((_, index) => {
      const globalIndex = props.enablePagination
        ? pageIndex.value * pageSize.value + index
        : index;
      selectedRows.value.add(globalIndex);
    });
  } else {
    paginatedData.value.forEach((_, index) => {
      const globalIndex = props.enablePagination
        ? pageIndex.value * pageSize.value + index
        : index;
      selectedRows.value.delete(globalIndex);
    });
  }
  selectedRows.value = new Set(selectedRows.value);
};

const handleSelectRow = (index: number, checked: boolean | 'indeterminate') => {
  const globalIndex = props.enablePagination
    ? pageIndex.value * pageSize.value + index
    : index;

  if (checked === true) {
    selectedRows.value.add(globalIndex);
  } else {
    selectedRows.value.delete(globalIndex);
  }
  selectedRows.value = new Set(selectedRows.value);
};

const isRowSelected = (index: number) => {
  const globalIndex = props.enablePagination
    ? pageIndex.value * pageSize.value + index
    : index;
  return selectedRows.value.has(globalIndex);
};

// Watch selection changes
watch(
  selectedRows,
  () => {
    const selected = props.data.filter((_, index) => selectedRows.value.has(index));
    emit('rowSelectionChange', selected);
  },
  { deep: true }
);

// Pagination handlers
const goToPage = (page: number) => {
  pageIndex.value = Math.max(0, Math.min(page, pageCount.value - 1));
};

const canPreviousPage = computed(() => pageIndex.value > 0);
const canNextPage = computed(() => pageIndex.value < pageCount.value - 1);
</script>

<template>
  <div :class="cn('space-y-4', props.class)">
    <!-- Global Filter -->
    <div v-if="enableGlobalFilter" class="flex items-center gap-4">
      <Input
        v-model="globalFilter"
        :placeholder="filterPlaceholder"
        class="max-w-sm"
        aria-label="테이블 검색"
      />
      <span
        v-if="enableRowSelection && selectedRows.size > 0"
        class="text-sm text-krds-gray-60"
      >
        {{ selectedRows.size }}개 선택됨
      </span>
    </div>

    <!-- Table -->
    <div class="rounded-lg border border-krds-gray-20 overflow-hidden">
      <table class="w-full caption-bottom text-sm">
        <caption v-if="caption" class="sr-only">{{ caption }}</caption>
        <thead class="bg-krds-gray-5 border-b border-krds-gray-20">
          <tr>
            <!-- Selection Header -->
            <th
              v-if="enableRowSelection"
              scope="col"
              class="h-12 px-4 text-left align-middle font-medium text-krds-gray-70 w-[50px]"
            >
              <Checkbox
                :checked="isAllSelected || (isSomeSelected && 'indeterminate')"
                aria-label="전체 선택"
                @update:checked="handleSelectAll"
              />
            </th>

            <!-- Column Headers -->
            <th
              v-for="column in columns"
              :key="String(column.key)"
              scope="col"
              :class="
                cn(
                  'h-12 px-4 align-middle font-medium text-krds-gray-70',
                  column.align === 'center' && 'text-center',
                  column.align === 'right' && 'text-right',
                  column.align !== 'center' && column.align !== 'right' && 'text-left'
                )
              "
              :style="column.width ? { width: typeof column.width === 'number' ? `${column.width}px` : column.width } : undefined"
            >
              <button
                v-if="column.sortable"
                type="button"
                :class="
                  cn(
                    'flex items-center gap-1 -ml-2 px-2 py-1 rounded',
                    'hover:bg-krds-primary-5 transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-krds-func-info'
                  )
                "
                @click="handleSort(column)"
              >
                <span>{{ column.header }}</span>
                <ChevronUp
                  v-if="sortColumn === column.key && sortDirection === 'asc'"
                  class="h-4 w-4"
                />
                <ChevronDown
                  v-else-if="sortColumn === column.key && sortDirection === 'desc'"
                  class="h-4 w-4"
                />
                <ChevronsUpDown v-else class="h-4 w-4 text-krds-gray-40" />
              </button>
              <span v-else>{{ column.header }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- Loading State -->
          <tr v-if="loading">
            <td
              :colspan="enableRowSelection ? columns.length + 1 : columns.length"
              class="h-24 text-center"
            >
              <div class="flex items-center justify-center gap-2">
                <div
                  class="h-4 w-4 animate-spin rounded-full border-2 border-krds-primary-base border-t-transparent"
                />
                <span class="text-krds-gray-60">로딩 중...</span>
              </div>
            </td>
          </tr>

          <!-- Data Rows -->
          <template v-else-if="paginatedData.length > 0">
            <tr
              v-for="(row, rowIndex) in paginatedData"
              :key="rowIndex"
              :class="
                cn(
                  'border-b border-krds-gray-20 transition-colors',
                  'hover:bg-krds-gray-5',
                  isRowSelected(rowIndex) && 'bg-krds-primary-5'
                )
              "
            >
              <!-- Selection Cell -->
              <td v-if="enableRowSelection" class="px-4 py-3 align-middle">
                <Checkbox
                  :checked="isRowSelected(rowIndex)"
                  aria-label="행 선택"
                  @update:checked="(checked: boolean | 'indeterminate') => handleSelectRow(rowIndex, checked)"
                />
              </td>

              <!-- Data Cells -->
              <td
                v-for="column in columns"
                :key="String(column.key)"
                :class="
                  cn(
                    'px-4 py-3 align-middle',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right'
                  )
                "
              >
                <slot
                  :name="`cell-${String(column.key)}`"
                  :row="row"
                  :value="getNestedValue(row, String(column.key))"
                  :index="rowIndex"
                >
                  {{ getNestedValue(row, String(column.key)) }}
                </slot>
              </td>
            </tr>
          </template>

          <!-- Empty State -->
          <tr v-else>
            <td
              :colspan="enableRowSelection ? columns.length + 1 : columns.length"
              class="h-24 text-center text-krds-gray-60"
            >
              {{ emptyMessage }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="enablePagination" class="flex items-center justify-between">
      <div class="flex items-center gap-2 text-sm text-krds-gray-60">
        <span>페이지당</span>
        <select
          v-model.number="pageSize"
          class="h-8 rounded border border-krds-gray-20 bg-white px-2 text-sm focus:outline-none focus:ring-2 focus:ring-krds-func-info"
          aria-label="페이지당 행 수"
          @change="pageIndex = 0"
        >
          <option v-for="size in pageSizeOptions" :key="size" :value="size">
            {{ size }}
          </option>
        </select>
        <span>행</span>
        <span class="ml-4">
          총 {{ sortedData.length }}개 중
          {{ pageIndex * pageSize + 1 }}-{{
            Math.min((pageIndex + 1) * pageSize, sortedData.length)
          }}
        </span>
      </div>
      <div class="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          :disabled="!canPreviousPage"
          aria-label="첫 페이지"
          @click="goToPage(0)"
        >
          <ChevronsLeft class="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          :disabled="!canPreviousPage"
          aria-label="이전 페이지"
          @click="goToPage(pageIndex - 1)"
        >
          <ChevronLeft class="h-4 w-4" />
        </Button>
        <span class="px-2 text-sm">
          {{ pageIndex + 1 }} / {{ pageCount }}
        </span>
        <Button
          variant="ghost"
          size="sm"
          :disabled="!canNextPage"
          aria-label="다음 페이지"
          @click="goToPage(pageIndex + 1)"
        >
          <ChevronRight class="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          :disabled="!canNextPage"
          aria-label="마지막 페이지"
          @click="goToPage(pageCount - 1)"
        >
          <ChevronsRight class="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
</template>

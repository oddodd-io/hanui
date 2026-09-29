<script setup lang="ts">
/**
 * Table — KRDS `.krds-table-wrap > table.tbl.col.data` 래퍼
 *
 * KRDS 표는 JS 동작이 없는 순수 마크업이다. 이 컴포넌트는 columns/rows 데이터로
 * caption · colgroup · thead(th scope="col") · tbody(th scope="row" / td)를 렌더하고,
 * 가로 스크롤 영역의 키보드 접근(role="region" + tabindex)만 보탠다.
 * caption은 KRDS reset에서 sr-only로 숨겨지지만 표의 이름이므로 반드시 넣는다.
 * columns 없이 default 슬롯에 colgroup/thead/tbody를 직접 넣어도 된다.
 * 기준: reference/krds-uiux/html/code/table.html, resources/scss/component/_table.scss
 */
import { computed, useId } from 'vue';

export interface TableColumn {
  /** rows 객체의 키. `#cell-{key}` / `#head-{key}` 슬롯 이름에도 쓰인다 */
  key: string;
  /** 열 제목 (thead th) */
  label: string;
  /** colgroup의 col 너비 (예: '30%', '12rem') */
  width?: string;
  /** true면 이 열의 셀을 `<th scope="row">`로 렌더한다 (행 제목) */
  rowHeader?: boolean;
}

export type TableRow = Record<string, unknown>;

export interface TableProps {
  /** 표 요약 (caption). 화면에는 숨겨지고 스크린리더가 읽는다. caption 슬롯으로 대신할 수 있다 */
  caption?: string;
  columns?: TableColumn[];
  rows?: TableRow[];
  /** 행 key로 쓸 필드 이름 또는 함수. 없으면 index */
  rowKey?: string | ((row: TableRow, index: number) => string | number);
  /** rows가 비었을 때 표시할 문구 */
  emptyText?: string;
  /** `.scroll` — PC에서도 가로 스크롤 */
  scroll?: boolean;
  /** `.mob-scroll` — 모바일에서 셀 줄바꿈 없이 가로 스크롤 */
  mobScroll?: boolean;
}

const props = withDefaults(defineProps<TableProps>(), {
  caption: undefined,
  columns: undefined,
  rows: () => [],
  rowKey: undefined,
  emptyText: '데이터가 없습니다.',
  scroll: false,
  mobScroll: false,
});

const slots = defineSlots<
  {
    /** caption 내용 (caption prop 대신) */
    caption?: () => unknown;
    /** columns 없이 colgroup/thead/tbody를 직접 넣을 때 */
    default?: () => unknown;
    /** rows가 비었을 때 */
    empty?: () => unknown;
  } & {
    [key: `head-${string}`]:
      | ((scope: { column: TableColumn }) => unknown)
      | undefined;
  } & {
    [key: `cell-${string}`]:
      | ((scope: {
          row: TableRow;
          value: unknown;
          column: TableColumn;
          index: number;
        }) => unknown)
      | undefined;
  }
>();

const captionId = useId();

if (import.meta.env.DEV && !props.caption && !slots.caption) {
  console.warn(
    '[hanui] Table: caption이 없습니다. 표의 제목·구성을 설명하는 caption을 넣어주세요 (KRDS·웹접근성).'
  );
}

// 스크롤 가능한 영역은 키보드로 포커스해 방향키로 스크롤할 수 있어야 한다 (axe scrollable-region-focusable)
const isScrollable = computed(() => props.scroll || props.mobScroll);

const wrapClasses = computed(() => [
  'krds-table-wrap',
  { scroll: props.scroll, 'mob-scroll': props.mobScroll },
]);

const hasWidths = computed(() => !!props.columns?.some((c) => c.width));

const getRowKey = (row: TableRow, index: number): string | number => {
  if (typeof props.rowKey === 'function') return props.rowKey(row, index);
  if (props.rowKey) return row[props.rowKey] as string | number;
  return index;
};

const cellText = (value: unknown) => (value == null ? '' : String(value));
</script>

<template>
  <div
    :class="wrapClasses"
    :role="isScrollable ? 'region' : undefined"
    :tabindex="isScrollable ? 0 : undefined"
    :aria-labelledby="isScrollable ? captionId : undefined"
  >
    <table class="tbl col data">
      <caption :id="captionId">
        <slot name="caption">{{ caption }}</slot>
      </caption>
      <template v-if="columns">
        <colgroup v-if="hasWidths">
          <col
            v-for="column in columns"
            :key="column.key"
            :style="column.width ? { width: column.width } : undefined"
          />
        </colgroup>
        <thead>
          <tr>
            <th v-for="column in columns" :key="column.key" scope="col">
              <slot :name="`head-${column.key}`" :column="column">
                {{ column.label }}
              </slot>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-if="rows.length">
            <tr v-for="(row, index) in rows" :key="getRowKey(row, index)">
              <component
                :is="column.rowHeader ? 'th' : 'td'"
                v-for="column in columns"
                :key="column.key"
                :scope="column.rowHeader ? 'row' : undefined"
              >
                <slot
                  :name="`cell-${column.key}`"
                  :row="row"
                  :value="row[column.key]"
                  :column="column"
                  :index="index"
                >
                  {{ cellText(row[column.key]) }}
                </slot>
              </component>
            </tr>
          </template>
          <tr v-else>
            <td :colspan="columns.length">
              <slot name="empty">{{ emptyText }}</slot>
            </td>
          </tr>
        </tbody>
      </template>
      <slot v-else />
    </table>
  </div>
</template>

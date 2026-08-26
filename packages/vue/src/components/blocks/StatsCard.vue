<script lang="ts">
import type { Component } from 'vue';

// defineProps는 setup 밖으로 호이스팅되므로
// 기본값으로 쓸 상수는 별도 <script> 블록에 둔다.
export interface StatItem {
  /** 통계 라벨 */
  label: string;
  /** 통계 값 */
  value: string | number;
  /** 변화율 (%) */
  change?: number;
  /** 아이콘 컴포넌트 */
  icon?: Component;
}

const DEFAULT_ITEMS: StatItem[] = [
  { label: '총 사용자', value: '12,345', change: 12.5 },
  { label: '활성 사용자', value: '8,901', change: 3.2 },
  { label: '신규 가입', value: '234', change: -2.1 },
  { label: '페이지뷰', value: '1.2M', change: 8.7 },
];
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';
import Card from '../Card.vue';
import CardBody from '../CardBody.vue';
import Badge from '../Badge.vue';
import Body from '../Body.vue';

interface Props {
  /** 통계 항목 목록 */
  items?: StatItem[];
  /** 칼럼 수 */
  columns?: 1 | 2 | 3 | 4;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  items: () => DEFAULT_ITEMS,
  columns: 4,
});

const GRID_COLS = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
} as const;

const classes = computed(() =>
  cn('grid gap-4', GRID_COLS[props.columns], props.class)
);

/** 화살표는 장식이므로 변화 방향은 텍스트로도 전달한다 (WCAG 1.4.1) */
const changeText = (change: number) =>
  `${change >= 0 ? '증가' : '감소'} ${Math.abs(change).toFixed(1)}%`;
</script>

<template>
  <div :class="classes">
    <Card v-for="(item, index) in items" :key="index" variant="outlined">
      <CardBody class="space-y-2">
        <div class="flex items-center justify-between">
          <Body size="sm" class="text-krds-gray-60">{{ item.label }}</Body>
          <span v-if="item.icon" class="text-krds-gray-60" aria-hidden="true">
            <component :is="item.icon" />
          </span>
        </div>

        <div class="flex items-end gap-2">
          <Body as="span" weight="bold" class="text-2xl text-krds-gray-95">
            {{ item.value }}
          </Body>
          <Badge
            v-if="item.change !== undefined"
            :variant="item.change >= 0 ? 'success' : 'error'"
            size="md"
          >
            <span aria-hidden="true">
              {{ item.change >= 0 ? '↑' : '↓' }}
              {{ Math.abs(item.change).toFixed(1) }}%
            </span>
            <span class="sr-only">{{ changeText(item.change) }}</span>
          </Badge>
        </div>
      </CardBody>
    </Card>
  </div>
</template>

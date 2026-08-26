<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';
import Card from '../Card.vue';
import CardBody from '../CardBody.vue';
import Button from '../Button.vue';
import Body from '../Body.vue';

interface Props {
  /** 제목 */
  title?: string;
  /** 설명 */
  description?: string;
  /** CTA 버튼 텍스트 */
  actionLabel?: string;
  /** 보조 CTA 텍스트 */
  secondaryActionLabel?: string;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: '데이터가 없습니다',
  description: '아직 등록된 데이터가 없습니다. 새로 추가해보세요.',
});

const emit = defineEmits<{
  /** CTA 클릭 */
  action: [];
  /** 보조 CTA 클릭 */
  secondaryAction: [];
}>();

const hasActions = computed(
  () => !!props.actionLabel || !!props.secondaryActionLabel
);
</script>

<template>
  <Card variant="outlined" :class="cn('w-full', props.class)">
    <CardBody class="flex flex-col items-center text-center py-16 space-y-4">
      <div class="text-krds-gray-50">
        <slot name="icon">
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect
              x="8"
              y="12"
              width="48"
              height="40"
              rx="4"
              stroke="currentColor"
              stroke-width="2"
              stroke-dasharray="4 4"
            />
            <path
              d="M24 32h16M32 24v16"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </slot>
      </div>

      <div class="space-y-2">
        <h3 class="text-lg font-bold text-krds-gray-80">{{ title }}</h3>
        <Body size="md" class="text-krds-gray-50 max-w-sm">
          {{ description }}
        </Body>
      </div>

      <div v-if="hasActions" class="flex items-center gap-3 pt-2">
        <Button v-if="actionLabel" variant="primary" @click="emit('action')">
          {{ actionLabel }}
        </Button>
        <Button
          v-if="secondaryActionLabel"
          variant="outline"
          @click="emit('secondaryAction')"
        >
          {{ secondaryActionLabel }}
        </Button>
      </div>
    </CardBody>
  </Card>
</template>

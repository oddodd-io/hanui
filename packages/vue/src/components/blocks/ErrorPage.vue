<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';
import Button from '../Button.vue';
import Body from '../Body.vue';
import Display from '../Display.vue';

interface Props {
  /** 에러 코드 */
  code?: '404' | '500' | '403' | (string & {});
  /** 에러 제목 (미지정 시 code에 맞는 기본 문구) */
  title?: string;
  /** 에러 설명 (미지정 시 code에 맞는 기본 문구) */
  description?: string;
  /** 홈으로 돌아가기 버튼 텍스트 */
  homeLabel?: string;
  /** 뒤로가기 버튼 텍스트 */
  backLabel?: string;
  /** 홈으로 돌아가기 버튼 표시 */
  showHome?: boolean;
  /** 뒤로가기 버튼 표시 */
  showBack?: boolean;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  code: '404',
  homeLabel: '홈으로 돌아가기',
  backLabel: '이전 페이지',
  showHome: true,
  showBack: true,
});

const emit = defineEmits<{
  goHome: [];
  goBack: [];
}>();

const ERROR_DEFAULTS: Record<string, { title: string; description: string }> = {
  '404': {
    title: '페이지를 찾을 수 없습니다',
    description: '요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.',
  },
  '500': {
    title: '서버 오류가 발생했습니다',
    description: '일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
  },
  '403': {
    title: '접근 권한이 없습니다',
    description: '이 페이지에 접근할 수 있는 권한이 없습니다.',
  },
};

const defaults = computed(
  () => ERROR_DEFAULTS[props.code] ?? ERROR_DEFAULTS['404']
);
const finalTitle = computed(() => props.title || defaults.value.title);
const finalDescription = computed(
  () => props.description || defaults.value.description
);
</script>

<template>
  <div
    :class="
      cn(
        'flex flex-col items-center justify-center text-center py-20 space-y-6',
        props.class
      )
    "
  >
    <!-- 에러 코드는 페이지 제목이 아니다. h1은 아래 title 하나만 둔다 -->
    <Display as="div" size="lg" class="text-krds-gray-40">{{ code }}</Display>

    <div class="space-y-2">
      <h1 class="text-2xl font-bold text-krds-gray-90">{{ finalTitle }}</h1>
      <Body size="md" class="text-krds-gray-50 max-w-md">
        {{ finalDescription }}
      </Body>
    </div>

    <div class="flex items-center gap-3">
      <Button v-if="showHome" variant="primary" @click="emit('goHome')">
        {{ homeLabel }}
      </Button>
      <Button v-if="showBack" variant="outline" @click="emit('goBack')">
        {{ backLabel }}
      </Button>
    </div>
  </div>
</template>

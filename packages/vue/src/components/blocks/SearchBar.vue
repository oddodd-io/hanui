<script lang="ts">
// defineProps는 setup 밖으로 호이스팅되므로
// 기본값으로 쓸 상수는 별도 <script> 블록에 둔다.
export interface SearchCategory {
  label: string;
  value: string;
}

const DEFAULT_CATEGORIES: SearchCategory[] = [
  { label: '전체', value: 'all' },
  { label: '제목', value: 'title' },
  { label: '내용', value: 'content' },
  { label: '작성자', value: 'author' },
];
</script>

<script setup lang="ts">
import { ref } from 'vue';
import { cn } from '@/lib/utils';
import Input from '../Input.vue';
import Button from '../Button.vue';
import Select from '../Select.vue';

interface Props {
  /** 카테고리 옵션 */
  categories?: SearchCategory[];
  /** 검색어 입력 placeholder */
  placeholder?: string;
  /** 카테고리 선택 표시 */
  showCategory?: boolean;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  categories: () => DEFAULT_CATEGORIES,
  placeholder: '검색어를 입력하세요',
  showCategory: true,
});

const emit = defineEmits<{
  search: [payload: { query: string; category: string }];
}>();

const query = ref('');
const category = ref(props.categories[0]?.value ?? 'all');

const handleSubmit = () => {
  emit('search', { query: query.value, category: category.value });
};
</script>

<template>
  <form
    :class="cn('flex items-end gap-3', props.class)"
    role="search"
    @submit.prevent="handleSubmit"
  >
    <div v-if="showCategory" class="w-32 flex-shrink-0">
      <Select
        v-model="category"
        :options="categories"
        size="md"
        aria-label="검색 범위"
      />
    </div>

    <div class="flex-1">
      <!-- placeholder는 레이블이 아니므로 접근명을 따로 준다 -->
      <Input
        v-model="query"
        type="text"
        :placeholder="placeholder"
        aria-label="검색어"
        clearable
      />
    </div>

    <Button type="submit" variant="primary" class="flex-shrink-0">
      검색
    </Button>
  </form>
</template>

<script setup lang="ts">
import { computed, ref, onUnmounted } from 'vue';
import { Copy, Check } from 'lucide-vue-next';
import { cn } from '@/lib/utils';
import Button from './Button.vue';

interface Props {
  /**
   * 클립보드에 복사할 문자열.
   *
   * @security 비밀번호, API 키 등 민감 데이터를 복사하면 클립보드에
   * 데이터가 남아 다른 앱에서 접근할 수 있습니다.
   */
  value: string;
  /** 복사 성공 후 원래 상태로 돌아가는 시간 (ms) */
  resetDelay?: number;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  disabled?: boolean;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  resetDelay: 2000,
  variant: 'ghost',
  size: 'sm',
  disabled: false,
});

const emit = defineEmits<{
  /** 복사 성공 */
  copy: [value: string];
  /** 복사 실패 */
  error: [error: Error];
}>();

const copied = ref(false);
let timer: ReturnType<typeof setTimeout> | null = null;

onUnmounted(() => {
  if (timer) clearTimeout(timer);
});

const isDisabled = computed(() => props.disabled || !props.value);

const handleCopy = async () => {
  if (!props.value) return;

  if (!navigator?.clipboard?.writeText) {
    emit(
      'error',
      new Error(
        'Clipboard API를 사용할 수 없습니다. HTTPS 환경 또는 Permissions Policy를 확인하세요.'
      )
    );
    return;
  }

  try {
    await navigator.clipboard.writeText(props.value);
    copied.value = true;
    emit('copy', props.value);

    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      copied.value = false;
    }, props.resetDelay);
  } catch (err) {
    emit('error', err instanceof Error ? err : new Error('클립보드 복사 실패'));
  }
};
</script>

<template>
  <Button
    :variant="variant"
    :size="size"
    :class="cn('inline-flex items-center gap-1.5', props.class)"
    :disabled="isDisabled"
    :aria-label="copied ? '복사됨' : '복사'"
    @click="handleCopy"
  >
    <slot v-if="copied" name="copiedIcon">
      <Check class="h-4 w-4 text-krds-success-60" aria-hidden="true" />
    </slot>
    <slot v-else name="icon">
      <Copy class="h-4 w-4" aria-hidden="true" />
    </slot>
  </Button>
</template>

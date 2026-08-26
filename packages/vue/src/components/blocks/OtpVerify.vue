<script setup lang="ts">
import { ref, computed, watch, onUnmounted, nextTick, useId } from 'vue';
import { cn } from '@/lib/utils';
import Card from '../Card.vue';
import CardHeader from '../CardHeader.vue';
import CardTitle from '../CardTitle.vue';
import CardDescription from '../CardDescription.vue';
import CardBody from '../CardBody.vue';
import CardFooter from '../CardFooter.vue';
import Input from '../Input.vue';
import Button from '../Button.vue';
import Body from '../Body.vue';

interface Props {
  /** 카드 제목 */
  title?: string;
  /** 카드 설명 */
  description?: string;
  /** 인증번호 자릿수 */
  codeLength?: number;
  /** 재전송 버튼 표시 */
  showResend?: boolean;
  /** 타이머 초기값 (초) */
  timerSeconds?: number;
  /** 타이머 표시 여부 */
  showTimer?: boolean;
  /** 에러 메시지 */
  error?: string;
  /** 로딩 상태 */
  loading?: boolean;
  /** 다 입력하면 자동 제출 */
  autoSubmit?: boolean;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: '인증번호 입력',
  description: '이메일로 전송된 인증번호를 입력해주세요.',
  codeLength: 6,
  showResend: true,
  timerSeconds: 180,
  showTimer: true,
  loading: false,
  autoSubmit: false,
});

const emit = defineEmits<{
  submit: [values: { code: string }];
  resend: [];
}>();

const uid = useId();
const titleId = `${uid}-title`;

const codes = ref<string[]>(Array(props.codeLength).fill(''));
const remainingTime = ref(props.timerSeconds);
const expired = ref(false);
const inputs = ref<HTMLInputElement[]>([]);
let timer: ReturnType<typeof setInterval> | null = null;
let autoSubmitted = false;

const isComplete = computed(() => codes.value.every((c) => c !== ''));
const isDisabled = computed(
  () => !isComplete.value || props.loading || expired.value
);

const formatTime = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;

const stopTimer = () => {
  if (timer) clearInterval(timer);
  timer = null;
};

const startTimer = () => {
  stopTimer();
  if (!props.showTimer) return;
  remainingTime.value = props.timerSeconds;
  expired.value = false;
  timer = setInterval(() => {
    if (remainingTime.value <= 1) {
      remainingTime.value = 0;
      expired.value = true;
      stopTimer();
    } else {
      remainingTime.value -= 1;
    }
  }, 1000);
};

watch(() => [props.timerSeconds, props.showTimer], startTimer, {
  immediate: true,
});
onUnmounted(stopTimer);

// 다 채워지면 자동 제출 (한 번만)
watch(isComplete, (complete) => {
  if (!complete) {
    autoSubmitted = false;
    return;
  }
  if (props.autoSubmit && !expired.value && !props.loading && !autoSubmitted) {
    autoSubmitted = true;
    emit('submit', { code: codes.value.join('') });
  }
});

const focusInput = async (index: number) => {
  await nextTick();
  inputs.value[index]?.focus();
};

const handleInput = (index: number, e: Event) => {
  const value = (e.target as HTMLInputElement).value;
  if (!/^\d*$/.test(value)) {
    // 숫자가 아니면 되돌린다
    (e.target as HTMLInputElement).value = codes.value[index];
    return;
  }
  const next = [...codes.value];
  next[index] = value.slice(-1);
  codes.value = next;
  if (value && index < props.codeLength - 1) focusInput(index + 1);
};

const handleKeyDown = (index: number, e: KeyboardEvent) => {
  if (e.key === 'Backspace' && !codes.value[index] && index > 0) {
    focusInput(index - 1);
  }
};

const handlePaste = (e: ClipboardEvent) => {
  e.preventDefault();
  const digits = (e.clipboardData?.getData('text') ?? '').replace(/\D/g, '');
  const next = [...codes.value];
  for (let i = 0; i < Math.min(digits.length, props.codeLength); i++) {
    next[i] = digits[i];
  }
  codes.value = next;
  focusInput(Math.min(digits.length, props.codeLength - 1));
};

const handleSubmit = () => {
  if (isDisabled.value) return;
  emit('submit', { code: codes.value.join('') });
};

const handleResend = () => {
  codes.value = Array(props.codeLength).fill('');
  autoSubmitted = false;
  startTimer();
  focusInput(0);
  emit('resend');
};
</script>

<template>
  <Card variant="outlined" :class="cn('w-full max-w-md', props.class)">
    <CardHeader class="text-center">
      <CardTitle :id="titleId">{{ title }}</CardTitle>
      <CardDescription>{{ description }}</CardDescription>
    </CardHeader>

    <CardBody>
      <form class="space-y-6" @submit.prevent="handleSubmit">
        <div
          role="group"
          :aria-labelledby="titleId"
          class="flex justify-center gap-3"
          @paste="handlePaste"
        >
          <Input
            v-for="(code, index) in codes"
            :key="index"
            :ref="(el: any) => (inputs[index] = el?.$el ?? el)"
            :model-value="code"
            type="text"
            inputmode="numeric"
            :autocomplete="index === 0 ? 'one-time-code' : 'off'"
            :maxlength="1"
            :class="
              cn(
                'w-12 h-14 text-center text-xl font-bold',
                error && 'border-krds-danger-base',
                expired && 'opacity-50'
              )
            "
            :disabled="expired || loading"
            :aria-label="`인증번호 ${index + 1}번째 자리`"
            :aria-invalid="!!error"
            @input="handleInput(index, $event)"
            @keydown="handleKeyDown(index, $event)"
          />
        </div>

        <!-- 타이머 -->
        <div v-if="showTimer" class="text-center">
          <Body
            size="sm"
            :class="
              cn(
                'tabular-nums',
                expired
                  ? 'text-krds-danger-base'
                  : remainingTime <= 30
                    ? 'text-krds-warning-60'
                    : 'text-krds-gray-60'
              )
            "
            aria-live="polite"
          >
            {{
              expired
                ? '인증번호가 만료되었습니다.'
                : `남은 시간 ${formatTime(remainingTime)}`
            }}
          </Body>
        </div>

        <Body
          v-if="error"
          size="sm"
          class="text-krds-danger-base text-center"
          role="alert"
        >
          {{ error }}
        </Body>

        <Button
          type="submit"
          variant="primary"
          class="w-full"
          :disabled="isDisabled"
          :loading="loading"
        >
          인증하기
        </Button>
      </form>
    </CardBody>

    <CardFooter v-if="showResend" class="justify-center text-sm">
      <Body as="span" size="sm" class="text-krds-gray-60">
        인증번호를 받지 못하셨나요?
      </Body>
      <Button
        type="button"
        variant="ghost"
        size="xs"
        class="ml-1"
        @click="handleResend"
      >
        재전송
      </Button>
    </CardFooter>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';
import Input from '../Input.vue';
import Label from '../Label.vue';
import Progress from '../Progress.vue';

interface Props {
  password: string;
  passwordConfirm: string;
  /** label↔input 연결용 id 접두사 */
  idPrefix: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:password': [value: string];
  'update:passwordConfirm': [value: string];
}>();

/** 길이·문자 종류로 0~4단계 강도를 매긴다 */
const strength = computed(() => {
  const pw = props.password;
  if (!pw) return { score: 0, label: '', variant: 'error' as const };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score: 1, label: '약함', variant: 'error' as const };
  if (score <= 2)
    return { score: 2, label: '보통', variant: 'warning' as const };
  if (score <= 3)
    return { score: 3, label: '강함', variant: 'success' as const };
  return { score: 4, label: '매우 강함', variant: 'success' as const };
});

const mismatch = computed(
  () =>
    props.passwordConfirm.length > 0 && props.password !== props.passwordConfirm
);
</script>

<template>
  <div class="space-y-2">
    <Label :for="`${idPrefix}-password`">비밀번호</Label>
    <Input
      :id="`${idPrefix}-password`"
      :model-value="password"
      type="password"
      placeholder="비밀번호를 입력하세요"
      autocomplete="new-password"
      required
      :minlength="8"
      clearable
      @update:model-value="emit('update:password', $event)"
    />
    <div v-if="password" class="space-y-1">
      <Progress
        :value="(strength.score / 4) * 100"
        size="sm"
        :variant="strength.variant"
        aria-label="비밀번호 강도"
      />
      <span
        :class="
          cn(
            'text-krds-body-xs leading-[150%]',
            strength.variant === 'error' && 'text-krds-danger-60',
            strength.variant === 'warning' && 'text-krds-warning-60',
            strength.variant === 'success' && 'text-krds-success-60'
          )
        "
      >
        {{ strength.label }}
      </span>
    </div>
  </div>

  <div class="space-y-2">
    <Label :for="`${idPrefix}-password-confirm`">비밀번호 확인</Label>
    <Input
      :id="`${idPrefix}-password-confirm`"
      :model-value="passwordConfirm"
      type="password"
      placeholder="비밀번호를 다시 입력하세요"
      autocomplete="new-password"
      required
      :minlength="8"
      :status="mismatch ? 'error' : undefined"
      clearable
      @update:model-value="emit('update:passwordConfirm', $event)"
    />
    <!-- 불일치는 즉시 알려야 한다 -->
    <p
      v-if="mismatch"
      class="text-krds-body-xs leading-[150%] text-krds-danger-60"
      role="alert"
    >
      비밀번호가 일치하지 않습니다
    </p>
  </div>
</template>

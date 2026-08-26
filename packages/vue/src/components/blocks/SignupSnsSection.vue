<script lang="ts">
export type SnsProvider = 'kakao' | 'naver' | 'google' | 'apple';

interface SnsConfig {
  label: string;
  bg: string;
  text: string;
}

export const SNS_CONFIG: Record<SnsProvider, SnsConfig> = {
  kakao: {
    label: '카카오',
    bg: 'bg-[#FEE500] hover:bg-[#FDD835]',
    text: 'text-[#191919]',
  },
  naver: {
    label: '네이버',
    bg: 'bg-[#03C75A] hover:bg-[#02B04E]',
    text: 'text-white',
  },
  google: {
    label: 'Google',
    bg: 'bg-white hover:bg-gray-50 border border-krds-gray-30',
    text: 'text-krds-gray-80',
  },
  apple: {
    label: 'Apple',
    bg: 'bg-black hover:bg-gray-900',
    text: 'text-white',
  },
};
</script>

<script setup lang="ts">
import { cn } from '@/lib/utils';

interface Props {
  providers: SnsProvider[];
}

defineProps<Props>();

const emit = defineEmits<{ snsLogin: [provider: SnsProvider] }>();
</script>

<template>
  <div class="space-y-3">
    <button
      v-for="provider in providers"
      :key="provider"
      type="button"
      :class="
        cn(
          'flex w-full items-center justify-center gap-2 h-12 rounded-md font-bold transition-colors cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-krds-primary-60 focus-visible:ring-offset-2',
          SNS_CONFIG[provider].bg,
          SNS_CONFIG[provider].text
        )
      "
      @click="emit('snsLogin', provider)"
    >
      <!-- 브랜드 마크는 장식이다. 이름은 아래 텍스트가 전달한다 -->
      <svg
        v-if="provider === 'kakao'"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M9 1C4.58 1 1 3.79 1 7.21c0 2.17 1.45 4.08 3.64 5.18l-.93 3.44c-.08.3.26.54.52.37l4.1-2.72c.22.02.44.03.67.03 4.42 0 8-2.79 8-6.21S13.42 1 9 1z"
          fill="#191919"
        />
      </svg>
      <svg
        v-else-if="provider === 'naver'"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M12.13 9.59L5.59 1H1v16h4.87V9.41L12.41 18H17V1h-4.87v8.59z"
          fill="white"
        />
      </svg>
      <svg
        v-else-if="provider === 'google'"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 01-1.8 2.72v2.26h2.92A8.78 8.78 0 0017.64 9.2z"
          fill="#4285F4"
        />
        <path
          d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.33-1.58-5.04-3.71H.96v2.33A9 9 0 009 18z"
          fill="#34A853"
        />
        <path
          d="M3.96 10.71A5.41 5.41 0 013.68 9c0-.6.1-1.18.28-1.71V4.96H.96A9 9 0 000 9c0 1.45.35 2.83.96 4.04l3-2.33z"
          fill="#FBBC05"
        />
        <path
          d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59C13.46.89 11.43 0 9 0A9 9 0 00.96 4.96l3 2.33C4.67 5.16 6.66 3.58 9 3.58z"
          fill="#EA4335"
        />
      </svg>
      <svg
        v-else
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M14.94 14.46c-.38.87-.56 1.26-1.05 2.04-.68 1.09-1.64 2.44-2.83 2.45-1.06.01-1.33-.69-2.77-.68-1.44.01-1.74.7-2.8.68-1.19-.01-2.1-1.22-2.78-2.31C1.2 14.15.6 11.17 1.76 9.14c.82-1.43 2.27-2.34 3.82-2.36 1.19-.02 2.31.8 3.04.8.72 0 2.08-.99 3.5-.85.6.02 2.27.24 3.34 1.81-.09.05-2 1.16-1.97 3.47.03 2.76 2.42 3.68 2.45 3.69-.03.1-.38 1.33-1.27 2.63l.27.13zM11.18 1c.55.67.97 1.62.82 2.58-.89.06-1.93.6-2.54 1.3-.55.63-1.01 1.59-.83 2.52.97.03 1.97-.52 2.55-1.4.34-.52.59-1.19.69-1.84.07-.46.05-.9-.06-1.28A3.3 3.3 0 0011.18 1z"
          fill="white"
        />
      </svg>
      <span>{{ SNS_CONFIG[provider].label }}로 시작하기</span>
    </button>
  </div>

  <!-- 구분선 -->
  <div class="relative my-6">
    <div class="absolute inset-0 flex items-center" aria-hidden="true">
      <div class="w-full border-t border-krds-gray-20" />
    </div>
    <div class="relative flex justify-center text-sm">
      <span
        class="text-krds-body-sm leading-[150%] bg-krds-white px-4 text-krds-gray-60"
      >
        또는 이메일로 가입
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, useId } from 'vue';
import { cn } from '@/lib/utils';
import Card from '../Card.vue';
import CardHeader from '../CardHeader.vue';
import CardTitle from '../CardTitle.vue';
import CardDescription from '../CardDescription.vue';
import CardBody from '../CardBody.vue';
import CardFooter from '../CardFooter.vue';
import Input from '../Input.vue';
import Button from '../Button.vue';
import Checkbox from '../Checkbox.vue';
import Label from '../Label.vue';
import Link from '../Link.vue';

export interface LoginFormValues {
  username: string;
  password: string;
  rememberMe: boolean;
  autoLogin: boolean;
}

interface Props {
  /** 카드 제목 */
  title?: string;
  /** 카드 설명 */
  description?: string;
  /** 비밀번호 찾기 링크 표시 */
  showForgotPassword?: boolean;
  /** 회원가입 링크 표시 */
  showSignupLink?: boolean;
  /** 비밀번호 찾기 href */
  forgotPasswordHref?: string;
  /** 회원가입 href */
  signupHref?: string;
  /** 아이디 초기값 */
  defaultUsername?: string;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: '로그인',
  description: '계정에 로그인하여 서비스를 이용하세요.',
  showForgotPassword: true,
  showSignupLink: true,
  forgotPasswordHref: '/forgot-password',
  signupHref: '/signup',
  defaultUsername: '',
});

const emit = defineEmits<{ submit: [values: LoginFormValues] }>();

// 한 페이지에 폼이 여러 개여도 label↔input 연결이 깨지지 않도록 한다
const uid = useId();
const usernameId = `${uid}-username`;
const passwordId = `${uid}-password`;

const username = ref(props.defaultUsername);
const password = ref('');
const rememberMe = ref(false);
const autoLogin = ref(false);

const canSubmit = computed(() => !!username.value && !!password.value);
const hasFooter = computed(
  () => props.showForgotPassword || props.showSignupLink
);

const handleSubmit = () => {
  emit('submit', {
    username: username.value,
    password: password.value,
    rememberMe: rememberMe.value,
    autoLogin: autoLogin.value,
  });
};
</script>

<template>
  <Card variant="outlined" :class="cn('w-full max-w-md', props.class)">
    <CardHeader>
      <CardTitle>{{ title }}</CardTitle>
      <CardDescription>{{ description }}</CardDescription>
    </CardHeader>

    <CardBody>
      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div class="space-y-2">
          <Label :for="usernameId">아이디</Label>
          <Input
            :id="usernameId"
            v-model="username"
            type="text"
            placeholder="아이디를 입력하세요"
            autocomplete="username"
            clearable
          />
        </div>

        <div class="space-y-2">
          <Label :for="passwordId">비밀번호</Label>
          <Input
            :id="passwordId"
            v-model="password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            autocomplete="current-password"
            clearable
          />
        </div>

        <div class="flex items-center gap-6">
          <Checkbox v-model="rememberMe" label="아이디 저장" size="sm" />
          <Checkbox v-model="autoLogin" label="자동 로그인" size="sm" />
        </div>

        <Button
          type="submit"
          variant="primary"
          class="w-full"
          :disabled="!canSubmit"
        >
          로그인
        </Button>
      </form>
    </CardBody>

    <CardFooter v-if="hasFooter" class="justify-center gap-4 text-sm">
      <Link
        v-if="showForgotPassword"
        :href="forgotPasswordHref"
        variant="primary"
        size="sm"
      >
        비밀번호 찾기
      </Link>
      <!-- 구분자는 장식이다 -->
      <span
        v-if="showForgotPassword && showSignupLink"
        class="text-krds-gray-60"
        aria-hidden="true"
      >
        |
      </span>
      <Link
        v-if="showSignupLink"
        :href="signupHref"
        variant="primary"
        size="sm"
      >
        회원가입
      </Link>
    </CardFooter>
  </Card>
</template>

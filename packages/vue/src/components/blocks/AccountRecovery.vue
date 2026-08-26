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
import Label from '../Label.vue';
import Link from '../Link.vue';
import Tabs from '../Tabs.vue';
import TabsList from '../TabsList.vue';
import TabsTrigger from '../TabsTrigger.vue';
import TabsContent from '../TabsContent.vue';

interface Props {
  /** 카드 제목 */
  title?: string;
  /** 기본 탭 */
  defaultTab?: 'find-id' | 'reset-password';
  /** 로그인으로 돌아가기 링크 표시 */
  showBackToLogin?: boolean;
  /** 로그인 href */
  loginHref?: string;
  /** 회원가입 링크 표시 */
  showSignupLink?: boolean;
  /** 회원가입 href */
  signupHref?: string;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: '계정 찾기',
  defaultTab: 'find-id',
  showBackToLogin: true,
  loginHref: '/login',
  showSignupLink: true,
  signupHref: '/signup',
});

const emit = defineEmits<{
  findId: [values: { name: string; phone: string }];
  resetPassword: [values: { email: string }];
}>();

const uid = useId();
const nameId = `${uid}-name`;
const phoneId = `${uid}-phone`;
const emailId = `${uid}-email`;

const name = ref('');
const phone = ref('');
const email = ref('');

/** 숫자만 남기고 하이픈을 자동으로 넣는다 */
const handlePhoneInput = (e: Event) => {
  const digits = (e.target as HTMLInputElement).value
    .replace(/\D/g, '')
    .slice(0, 11);
  if (digits.length > 7) {
    phone.value = `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  } else if (digits.length > 3) {
    phone.value = `${digits.slice(0, 3)}-${digits.slice(3)}`;
  } else {
    phone.value = digits;
  }
};

const canFindId = computed(() => !!name.value && phone.value.length >= 13);
const hasFooter = computed(() => props.showBackToLogin || props.showSignupLink);
</script>

<template>
  <Card variant="outlined" :class="cn('w-full max-w-md', props.class)">
    <CardHeader>
      <CardTitle>{{ title }}</CardTitle>
      <CardDescription
        >아이디 또는 비밀번호를 찾을 수 있습니다.</CardDescription
      >
    </CardHeader>

    <CardBody>
      <Tabs :default-value="defaultTab">
        <TabsList class="w-full mb-6">
          <TabsTrigger value="find-id" class="flex-1">아이디 찾기</TabsTrigger>
          <TabsTrigger value="reset-password" class="flex-1">
            비밀번호 찾기
          </TabsTrigger>
        </TabsList>

        <!-- 아이디 찾기 -->
        <TabsContent value="find-id">
          <form
            class="space-y-4"
            @submit.prevent="emit('findId', { name, phone })"
          >
            <div class="space-y-2">
              <Label :for="nameId">이름</Label>
              <Input
                :id="nameId"
                v-model="name"
                type="text"
                placeholder="이름을 입력하세요"
                autocomplete="name"
                required
                clearable
              />
            </div>

            <div class="space-y-2">
              <Label :for="phoneId">휴대폰 번호</Label>
              <Input
                :id="phoneId"
                :model-value="phone"
                type="tel"
                placeholder="010-0000-0000"
                autocomplete="tel"
                required
                clearable
                @input="handlePhoneInput"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              class="w-full"
              :disabled="!canFindId"
            >
              아이디 찾기
            </Button>
          </form>
        </TabsContent>

        <!-- 비밀번호 찾기 -->
        <TabsContent value="reset-password">
          <form
            class="space-y-4"
            @submit.prevent="emit('resetPassword', { email })"
          >
            <div class="space-y-2">
              <Label :for="emailId">이메일 (아이디)</Label>
              <Input
                :id="emailId"
                v-model="email"
                type="email"
                placeholder="가입한 이메일을 입력하세요"
                autocomplete="email"
                required
                clearable
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              class="w-full"
              :disabled="!email"
            >
              재설정 링크 보내기
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </CardBody>

    <CardFooter v-if="hasFooter" class="justify-center text-sm gap-3">
      <Link
        v-if="showBackToLogin"
        :href="loginHref"
        variant="primary"
        size="sm"
      >
        로그인으로 돌아가기
      </Link>
      <span
        v-if="showBackToLogin && showSignupLink"
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

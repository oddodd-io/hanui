<script lang="ts">
// defineProps는 setup 밖으로 호이스팅되므로
// 기본값으로 쓸 상수는 별도 <script> 블록에 둔다.
import type { StepItem } from '../StepIndicator.vue';
import type { SnsProvider } from './SignupSnsSection.vue';

export type { SnsProvider };

export interface SignupFormValues {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  agreeTerms: boolean;
  agreePrivacy: boolean;
}

const DEFAULT_SNS: SnsProvider[] = ['kakao', 'naver', 'google'];

const SIGNUP_STEPS: StepItem[] = [
  { label: '기본 정보' },
  { label: '비밀번호' },
  { label: '약관 동의' },
];
</script>

<script setup lang="ts">
import { ref, computed, useId } from 'vue';
import { cn } from '@/lib/utils';
import { useSteps } from '@/composables/useSteps';
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
import StepIndicator from '../StepIndicator.vue';
import SignupPasswordFields from './SignupPasswordFields.vue';
import SignupAgreements from './SignupAgreements.vue';
import SignupSnsSection from './SignupSnsSection.vue';

interface Props {
  /** 카드 제목 */
  title?: string;
  /** 카드 설명 */
  description?: string;
  /** 로그인 링크 표시 */
  showLoginLink?: boolean;
  /** 로그인 href */
  loginHref?: string;
  /** 이용약관 href */
  termsHref?: string;
  /** 개인정보처리방침 href */
  privacyHref?: string;
  /** SNS 가입 섹션 표시 */
  showSnsLogin?: boolean;
  /** SNS 제공자 목록 */
  snsProviders?: SnsProvider[];
  /** 폼 변형 (default: 한 페이지, stepped: 단계 방식) */
  variant?: 'default' | 'stepped';
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: '회원가입',
  description: '새 계정을 만들어 서비스를 이용하세요.',
  showLoginLink: true,
  loginHref: '/login',
  termsHref: '/terms',
  privacyHref: '/privacy',
  showSnsLogin: false,
  snsProviders: () => DEFAULT_SNS,
  variant: 'default',
});

const emit = defineEmits<{
  submit: [values: SignupFormValues];
  snsLogin: [provider: SnsProvider];
}>();

const uid = useId();
const nameId = `${uid}-name`;
const emailId = `${uid}-email`;

const name = ref('');
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');
const agreeTerms = ref(false);
const agreePrivacy = ref(false);

const stepper = useSteps({ count: 3 });

const passwordsMatch = computed(
  () => !!password.value && password.value === passwordConfirm.value
);
const canSubmit = computed(
  () =>
    !!name.value &&
    !!email.value &&
    passwordsMatch.value &&
    agreeTerms.value &&
    agreePrivacy.value
);

const values = (): SignupFormValues => ({
  name: name.value,
  email: email.value,
  password: password.value,
  passwordConfirm: passwordConfirm.value,
  agreeTerms: agreeTerms.value,
  agreePrivacy: agreePrivacy.value,
});

const handleSubmit = () => {
  if (password.value !== passwordConfirm.value) return;
  emit('submit', values());
};

const handleStepPassword = () => {
  if (!passwordsMatch.value) return;
  stepper.next();
};
</script>

<template>
  <Card variant="outlined" :class="cn('w-full max-w-md', props.class)">
    <CardHeader>
      <CardTitle>{{ title }}</CardTitle>
      <CardDescription>{{ description }}</CardDescription>
    </CardHeader>

    <CardBody>
      <SignupSnsSection
        v-if="showSnsLogin && snsProviders.length > 0"
        :providers="snsProviders"
        @sns-login="emit('snsLogin', $event)"
      />

      <!-- 한 페이지 방식 -->
      <form
        v-if="variant === 'default'"
        class="space-y-4"
        @submit.prevent="handleSubmit"
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
          <Label :for="emailId">이메일</Label>
          <Input
            :id="emailId"
            v-model="email"
            type="email"
            placeholder="이메일을 입력하세요"
            autocomplete="email"
            required
            clearable
          />
        </div>

        <SignupPasswordFields
          v-model:password="password"
          v-model:password-confirm="passwordConfirm"
          :id-prefix="uid"
        />

        <SignupAgreements
          v-model:agree-terms="agreeTerms"
          v-model:agree-privacy="agreePrivacy"
          :terms-href="termsHref"
          :privacy-href="privacyHref"
        />

        <Button
          type="submit"
          variant="primary"
          class="w-full"
          :disabled="!canSubmit"
        >
          회원가입
        </Button>
      </form>

      <!-- 단계 방식 -->
      <div v-else class="space-y-6">
        <StepIndicator
          :steps="SIGNUP_STEPS"
          :current-step="stepper.currentStep.value"
          size="sm"
        />

        <!-- 1단계: 기본 정보 -->
        <form
          v-if="stepper.currentStep.value === 0"
          class="space-y-4"
          @submit.prevent="stepper.next()"
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
            <Label :for="emailId">이메일</Label>
            <Input
              :id="emailId"
              v-model="email"
              type="email"
              placeholder="이메일을 입력하세요"
              autocomplete="email"
              required
              clearable
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            class="w-full"
            :disabled="!name || !email"
          >
            다음
          </Button>
        </form>

        <!-- 2단계: 비밀번호 -->
        <form
          v-else-if="stepper.currentStep.value === 1"
          class="space-y-4"
          @submit.prevent="handleStepPassword"
        >
          <SignupPasswordFields
            v-model:password="password"
            v-model:password-confirm="passwordConfirm"
            :id-prefix="uid"
          />
          <div class="flex gap-3">
            <Button
              type="button"
              variant="outline"
              class="flex-1"
              @click="stepper.prev()"
            >
              이전
            </Button>
            <Button
              type="submit"
              variant="primary"
              class="flex-1"
              :disabled="!passwordsMatch"
            >
              다음
            </Button>
          </div>
        </form>

        <!-- 3단계: 약관 동의 -->
        <form
          v-else
          class="space-y-4"
          @submit.prevent="emit('submit', values())"
        >
          <SignupAgreements
            v-model:agree-terms="agreeTerms"
            v-model:agree-privacy="agreePrivacy"
            :terms-href="termsHref"
            :privacy-href="privacyHref"
          />
          <div class="flex gap-3">
            <Button
              type="button"
              variant="outline"
              class="flex-1"
              @click="stepper.prev()"
            >
              이전
            </Button>
            <Button
              type="submit"
              variant="primary"
              class="flex-1"
              :disabled="!agreeTerms || !agreePrivacy"
            >
              회원가입
            </Button>
          </div>
        </form>
      </div>
    </CardBody>

    <CardFooter v-if="showLoginLink" class="justify-center text-sm">
      <span class="text-krds-body-sm leading-[150%] text-krds-gray-60">
        이미 계정이 있으신가요?
      </span>
      <Link :href="loginHref" variant="primary" size="sm" class="ml-1">
        로그인
      </Link>
    </CardFooter>
  </Card>
</template>

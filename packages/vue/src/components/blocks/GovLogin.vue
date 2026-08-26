<script lang="ts">
// defineProps는 setup 밖으로 호이스팅되므로
// 기본값으로 쓸 상수는 별도 <script> 블록에 둔다.
export interface SimpleAuthMethod {
  id: string;
  label: string;
}

const DEFAULT_SIMPLE_AUTH: SimpleAuthMethod[] = [
  { id: 'kakao', label: '카카오톡' },
  { id: 'naver', label: '네이버' },
  { id: 'pass', label: 'PASS' },
  { id: 'payco', label: 'PAYCO' },
  { id: 'samsung', label: '삼성패스' },
  { id: 'kb', label: 'KB모바일' },
];
</script>

<script setup lang="ts">
import { ref, computed, useId } from 'vue';
import { cn } from '@/lib/utils';
import Card from '../Card.vue';
import CardHeader from '../CardHeader.vue';
import CardTitle from '../CardTitle.vue';
import CardDescription from '../CardDescription.vue';
import CardBody from '../CardBody.vue';
import Input from '../Input.vue';
import Button from '../Button.vue';
import Label from '../Label.vue';
import Checkbox from '../Checkbox.vue';
import Body from '../Body.vue';
import Tabs from '../Tabs.vue';
import TabsList from '../TabsList.vue';
import TabsTrigger from '../TabsTrigger.vue';
import TabsContent from '../TabsContent.vue';

export interface GovLoginValues {
  username: string;
  password: string;
  rememberMe: boolean;
}

interface Props {
  /** 카드 제목 */
  title?: string;
  /** 카드 설명 */
  description?: string;
  /** 간편인증 방법 목록 */
  simpleAuthMethods?: SimpleAuthMethod[];
  class?: string;
}

withDefaults(defineProps<Props>(), {
  title: '로그인',
  description: '본인 확인 후 서비스를 이용하실 수 있습니다.',
  simpleAuthMethods: () => DEFAULT_SIMPLE_AUTH,
});

const emit = defineEmits<{
  login: [values: GovLoginValues];
  simpleAuth: [methodId: string];
  certAuth: [];
}>();

const uid = useId();
const usernameId = `${uid}-username`;
const passwordId = `${uid}-password`;

const username = ref('');
const password = ref('');
const rememberMe = ref(false);

const canSubmit = computed(() => !!username.value && !!password.value);

const handleLogin = () => {
  emit('login', {
    username: username.value,
    password: password.value,
    rememberMe: rememberMe.value,
  });
};
</script>

<template>
  <Card variant="outlined" :class="cn('w-full max-w-md', $props.class)">
    <CardHeader class="text-center">
      <CardTitle>{{ title }}</CardTitle>
      <CardDescription>{{ description }}</CardDescription>
    </CardHeader>

    <CardBody>
      <Tabs default-value="id-pw">
        <TabsList class="w-full">
          <TabsTrigger value="id-pw" class="flex-1">아이디 로그인</TabsTrigger>
          <TabsTrigger value="simple" class="flex-1">간편인증</TabsTrigger>
          <TabsTrigger value="cert" class="flex-1">공동인증서</TabsTrigger>
        </TabsList>

        <!-- 아이디/비밀번호 로그인 -->
        <TabsContent value="id-pw">
          <form class="space-y-4 pt-4" @submit.prevent="handleLogin">
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
              />
            </div>

            <Checkbox v-model="rememberMe" size="sm" label="아이디 저장" />

            <Button
              type="submit"
              variant="primary"
              class="w-full"
              :disabled="!canSubmit"
            >
              로그인
            </Button>
          </form>
        </TabsContent>

        <!-- 간편인증 -->
        <TabsContent value="simple">
          <div class="grid grid-cols-2 gap-3 pt-4">
            <Button
              v-for="method in simpleAuthMethods"
              :key="method.id"
              variant="outline"
              class="h-14"
              @click="emit('simpleAuth', method.id)"
            >
              {{ method.label }}
            </Button>
          </div>
        </TabsContent>

        <!-- 공동인증서 -->
        <TabsContent value="cert">
          <div
            class="flex flex-col items-center text-center space-y-4 pt-6 pb-2"
          >
            <div
              class="w-16 h-16 rounded-full bg-krds-gray-10 flex items-center justify-center"
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="text-krds-gray-60"
                aria-hidden="true"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <Body size="sm" class="text-krds-gray-60">
              공동인증서(구 공인인증서)를 이용하여
              <br />
              본인 확인 후 로그인합니다.
            </Body>
            <Button variant="primary" class="w-full" @click="emit('certAuth')">
              공동인증서 로그인
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </CardBody>
  </Card>
</template>

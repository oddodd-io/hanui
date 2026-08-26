<script setup lang="ts">
import { ref, computed, useId } from 'vue';
import { cn } from '@/lib/utils';
import Card from '../Card.vue';
import CardHeader from '../CardHeader.vue';
import CardTitle from '../CardTitle.vue';
import CardDescription from '../CardDescription.vue';
import CardBody from '../CardBody.vue';
import Input from '../Input.vue';
import Textarea from '../Textarea.vue';
import Button from '../Button.vue';
import Label from '../Label.vue';

export interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface Props {
  /** 카드 제목 */
  title?: string;
  /** 카드 설명 */
  description?: string;
  class?: string;
}

withDefaults(defineProps<Props>(), {
  title: '문의하기',
  description: '궁금한 점이 있으시면 아래 양식을 작성해주세요.',
});

const emit = defineEmits<{ submit: [values: ContactFormValues] }>();

const uid = useId();
const nameId = `${uid}-name`;
const emailId = `${uid}-email`;
const subjectId = `${uid}-subject`;
const messageId = `${uid}-message`;

const name = ref('');
const email = ref('');
const subject = ref('');
const message = ref('');

const canSubmit = computed(
  () => !!name.value && !!email.value && !!subject.value && !!message.value
);

const handleSubmit = () => {
  emit('submit', {
    name: name.value,
    email: email.value,
    subject: subject.value,
    message: message.value,
  });
};
</script>

<template>
  <Card variant="outlined" :class="cn('w-full max-w-lg', $props.class)">
    <CardHeader>
      <CardTitle>{{ title }}</CardTitle>
      <CardDescription>{{ description }}</CardDescription>
    </CardHeader>

    <CardBody>
      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div class="flex gap-4">
          <div class="flex-1 space-y-2">
            <Label :for="nameId">이름</Label>
            <Input
              :id="nameId"
              v-model="name"
              type="text"
              placeholder="이름"
              autocomplete="name"
              clearable
            />
          </div>
          <div class="flex-1 space-y-2">
            <Label :for="emailId">이메일</Label>
            <Input
              :id="emailId"
              v-model="email"
              type="email"
              placeholder="이메일"
              autocomplete="email"
              clearable
            />
          </div>
        </div>

        <div class="space-y-2">
          <Label :for="subjectId">제목</Label>
          <Input
            :id="subjectId"
            v-model="subject"
            type="text"
            placeholder="문의 제목을 입력하세요"
            clearable
          />
        </div>

        <div class="space-y-2">
          <Label :for="messageId">내용</Label>
          <Textarea
            :id="messageId"
            v-model="message"
            placeholder="문의 내용을 입력하세요"
            :rows="5"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          class="w-full"
          :disabled="!canSubmit"
        >
          문의 보내기
        </Button>
      </form>
    </CardBody>
  </Card>
</template>

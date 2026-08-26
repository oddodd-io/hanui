<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';
import Card from '../Card.vue';
import CardBody from '../CardBody.vue';
import Badge from '../Badge.vue';
import Button from '../Button.vue';
import Body from '../Body.vue';

interface Props {
  /** 이름 */
  name: string;
  /** 역할/직책 */
  role?: string;
  /** 이메일 */
  email?: string;
  /** 전화번호 */
  phone?: string;
  /** 소속/부서 */
  department?: string;
  /** 아바타 이미지 URL */
  avatarUrl?: string;
  /** 아바타 이니셜 (이미지 없을 때) */
  avatarInitials?: string;
  /** 뱃지 텍스트 */
  badgeText?: string;
  /** 뱃지 variant */
  badgeVariant?: 'gray' | 'primary' | 'success' | 'warning' | 'error';
  /** 프로필 편집 버튼 표시 */
  editable?: boolean;
  /** 편집 버튼 텍스트 */
  editLabel?: string;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  badgeVariant: 'primary',
  editable: false,
  editLabel: '프로필 편집',
});

const emit = defineEmits<{ edit: [] }>();

const initials = computed(
  () => props.avatarInitials || props.name.slice(0, 2).toUpperCase()
);
const hasContact = computed(() => !!props.email || !!props.phone);
</script>

<template>
  <Card variant="outlined" :class="cn('w-full max-w-sm', props.class)">
    <CardBody class="flex flex-col items-center text-center space-y-4">
      <!-- 아바타 -->
      <div
        class="w-20 h-20 rounded-full overflow-hidden bg-krds-primary-10 flex items-center justify-center"
      >
        <img
          v-if="avatarUrl"
          :src="avatarUrl"
          :alt="`${name} 프로필 이미지`"
          class="w-full h-full object-cover"
        />
        <span
          v-else
          class="text-2xl font-bold text-krds-primary-base"
          aria-hidden="true"
        >
          {{ initials }}
        </span>
      </div>

      <!-- 이름 / 역할 -->
      <div class="space-y-1">
        <div class="flex items-center justify-center gap-2">
          <h3 class="text-lg font-bold text-krds-gray-95">{{ name }}</h3>
          <Badge v-if="badgeText" :variant="badgeVariant" size="md">
            {{ badgeText }}
          </Badge>
        </div>
        <Body v-if="role" size="md" class="text-krds-gray-60">{{ role }}</Body>
        <Body v-if="department" size="sm" class="text-krds-gray-60">
          {{ department }}
        </Body>
      </div>

      <!-- 연락처 -->
      <dl
        v-if="hasContact"
        class="w-full border-t border-krds-gray-10 pt-4 space-y-2 m-0"
      >
        <div v-if="email" class="flex justify-between">
          <dt class="text-krds-body-sm text-krds-gray-60">이메일</dt>
          <dd class="text-krds-body-sm text-krds-gray-80 m-0">{{ email }}</dd>
        </div>
        <div v-if="phone" class="flex justify-between">
          <dt class="text-krds-body-sm text-krds-gray-60">연락처</dt>
          <dd class="text-krds-body-sm text-krds-gray-80 m-0">{{ phone }}</dd>
        </div>
      </dl>

      <Button
        v-if="editable"
        variant="outline"
        size="sm"
        class="w-full"
        @click="emit('edit')"
      >
        {{ editLabel }}
      </Button>
    </CardBody>
  </Card>
</template>

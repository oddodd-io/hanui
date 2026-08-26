<script setup lang="ts">
import { computed } from 'vue';
import Checkbox from '../Checkbox.vue';
import Body from '../Body.vue';
import Link from '../Link.vue';

interface Props {
  agreeTerms: boolean;
  agreePrivacy: boolean;
  termsHref: string;
  privacyHref: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:agreeTerms': [value: boolean];
  'update:agreePrivacy': [value: boolean];
}>();

const allChecked = computed(() => props.agreeTerms && props.agreePrivacy);

const handleAgreeAll = (checked: boolean) => {
  emit('update:agreeTerms', checked);
  emit('update:agreePrivacy', checked);
};
</script>

<template>
  <div class="space-y-3 pt-6">
    <Checkbox
      :model-value="allChecked"
      size="sm"
      @update:model-value="handleAgreeAll"
    >
      <template #label>
        <Body as="span" size="sm" weight="bold">모두 동의합니다</Body>
      </template>
    </Checkbox>

    <div class="border-t border-krds-gray-10" />

    <div class="space-y-3">
      <Checkbox
        :model-value="agreeTerms"
        size="sm"
        @update:model-value="emit('update:agreeTerms', $event)"
      >
        <template #label>
          <Body as="span" size="sm">
            <Link :href="termsHref" variant="primary" size="sm">이용약관</Link>
            에 동의합니다
            <span class="text-krds-body-xs text-krds-danger-60">(필수)</span>
          </Body>
        </template>
      </Checkbox>

      <Checkbox
        :model-value="agreePrivacy"
        size="sm"
        @update:model-value="emit('update:agreePrivacy', $event)"
      >
        <template #label>
          <Body as="span" size="sm">
            <Link :href="privacyHref" variant="primary" size="sm">
              개인정보처리방침
            </Link>
            에 동의합니다
            <span class="text-krds-body-xs text-krds-danger-60">(필수)</span>
          </Body>
        </template>
      </Checkbox>
    </div>
  </div>
</template>

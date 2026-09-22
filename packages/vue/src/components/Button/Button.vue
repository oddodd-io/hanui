<script setup lang="ts">
/**
 * Button — KRDS `.krds-btn` 래퍼
 *
 * 스타일은 vendor/krds-uiux의 _button.scss를 그대로 사용하고,
 * 이 컴포넌트는 클래스 조립 · 링크/버튼 분기 · disabled 동작 · 접근성만 담당한다.
 * 기준: reference/krds-uiux/html/code/button*.html, docs/project-notes/krds-button-baseline.md
 */
import { computed, useAttrs, useSlots, onMounted } from 'vue';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'text' | 'link';
export type ButtonSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

export interface ButtonProps {
  /** KRDS 계층. 기본 primary */
  variant?: ButtonVariant;
  /** KRDS 크기. 기본 large (KRDS 기본값) */
  size?: ButtonSize;
  /** 아이콘 전용 버튼 (`.icon`). `label`로 접근성 이름을 반드시 제공한다 */
  icon?: boolean;
  /** 아이콘 전용 버튼의 테두리형 (`.icon.border`) */
  border?: boolean;
  /** 아이콘 전용 버튼의 접근성 이름. `sr-only`로 렌더된다 */
  label?: string;
  /** link 계층: hover/visited 색 변화 없음 (`.pure`) */
  pure?: boolean;
  /** link 계층: 본문 텍스트 색 (`.basic`) */
  basic?: boolean;
  /** 비활성. `<button>`은 native disabled, `<a>`는 href 제거 + aria-disabled */
  disabled?: boolean;
  /** `<button>` type. 기본 button (폼 안 submit 오작동 방지) */
  type?: 'button' | 'submit' | 'reset';
  /** 지정 시 `<a>`로 렌더 */
  href?: string;
  target?: string;
  rel?: string;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  size: 'large',
  icon: false,
  border: false,
  label: undefined,
  pure: false,
  basic: false,
  disabled: false,
  type: 'button',
  href: undefined,
  target: undefined,
  rel: undefined,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

defineOptions({ inheritAttrs: false });

const attrs = useAttrs();
const slots = useSlots();

const isLink = computed(() => !!props.href);
const isInactive = computed(() => props.disabled);

const classes = computed(() => [
  'krds-btn',
  // 아이콘 전용은 KRDS 원본처럼 계층 클래스를 붙이지 않는다 (.icon이 배경·테두리를 재정의)
  props.icon ? null : props.variant,
  props.size,
  {
    icon: props.icon,
    border: props.icon && props.border,
    pure: props.variant === 'link' && props.pure,
    basic: props.variant === 'link' && props.basic,
    disabled: isLink.value && isInactive.value,
  },
]);

// target="_blank" 링크는 rel 기본값을 보강한다
const linkRel = computed(() => {
  if (!isLink.value) return undefined;
  if (props.rel) return props.rel;
  return props.target === '_blank' ? 'noopener noreferrer' : undefined;
});

const onClick = (event: MouseEvent) => {
  if (isInactive.value) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }
  emit('click', event);
};

onMounted(() => {
  if (!import.meta.env.DEV) return;
  const hasName = !!props.label || !!attrs['aria-label'] || !!attrs['aria-labelledby'];
  if (props.icon && !hasName) {
    console.warn(
      '[hanui Button] 아이콘 전용 버튼은 label prop 또는 aria-label이 필요합니다.\n' +
        '예: <Button icon label="검색"><i class="svg-icon ico-sch" /></Button>'
    );
  }
  if (!props.icon && !slots.default && !hasName) {
    console.warn('[hanui Button] 버튼에 텍스트 또는 접근성 이름이 없습니다.');
  }
});
</script>

<template>
  <a
    v-if="isLink"
    v-bind="attrs"
    :class="classes"
    :href="isInactive ? undefined : href"
    :target="target"
    :rel="linkRel"
    :aria-disabled="isInactive ? 'true' : undefined"
    :tabindex="isInactive ? -1 : undefined"
    @click="onClick"
  >
    <span v-if="label" class="sr-only">{{ label }}</span>
    <slot />
  </a>
  <button
    v-else
    v-bind="attrs"
    :class="classes"
    :type="type"
    :disabled="isInactive"
    @click="onClick"
  >
    <span v-if="label" class="sr-only">{{ label }}</span>
    <slot />
  </button>
</template>

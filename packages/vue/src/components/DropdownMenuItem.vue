<script setup lang="ts">
import { cn } from '@/lib/utils';

const props = withDefaults(
  defineProps<{
    icon?: boolean;
    shortcut?: string;
    inset?: boolean;
    destructive?: boolean;
    selected?: boolean;
    disabled?: boolean;
    class?: string;
  }>(),
  {
    icon: false,
    inset: false,
    destructive: false,
    selected: false,
    disabled: false,
  }
);

const emit = defineEmits<{
  select: [];
}>();

const handleClick = () => {
  if (!props.disabled) {
    emit('select');
  }
};
</script>

<template>
  <div
    :class="
      cn(
        'relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-[17px] transition-colors',
        'outline-none focus-visible:ring-2 focus-visible:ring-krds-primary-base focus-visible:ring-inset',
        'hover:bg-krds-primary-5 hover:text-krds-primary-95',
        disabled && 'pointer-events-none opacity-50',
        destructive &&
          'text-krds-danger-base hover:bg-krds-danger-10 hover:text-krds-danger-base',
        selected && 'font-bold bg-krds-primary-5',
        inset && 'pl-8',
        props.class
      )
    "
    role="menuitem"
    :aria-selected="selected"
    :aria-disabled="disabled"
    tabindex="0"
    @click="handleClick"
    @keydown.enter.prevent="handleClick"
    @keydown.space.prevent="handleClick"
  >
    <span v-if="$slots.icon" class="mr-2 h-4 w-4" aria-hidden="true">
      <slot name="icon" />
    </span>
    <slot />
    <span
      v-if="shortcut"
      class="ml-auto text-[15px] tracking-widest text-krds-gray-60"
      aria-hidden="true"
    >
      {{ shortcut }}
    </span>
  </div>
</template>

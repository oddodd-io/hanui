<script setup lang="ts">
import { computed, ref, useId, watch, nextTick } from 'vue';
import { ChevronDown, Check } from 'lucide-vue-next';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

const props = withDefaults(
  defineProps<{
    options: SelectOption[];
    modelValue?: string;
    placeholder?: string;
    disabled?: boolean;
    status?: 'error' | 'success' | 'info';
    size?: 'lg' | 'md' | 'sm';
    label?: string;
    /** 보이는 label 없이 접근명만 줄 때 사용 (Button.vue와 동일 관례) */
    ariaLabel?: string;
    class?: string;
  }>(),
  {
    placeholder: '선택하세요',
    disabled: false,
    size: 'lg',
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const isOpen = ref(false);

// ARIA listbox 패턴에 필요한 id들 (label↔trigger↔listbox↔option 연결)
const selectId = useId();
const triggerId = `${selectId}-trigger`;
const labelId = `${selectId}-label`;
const listboxId = `${selectId}-listbox`;
const optionId = (index: number) => `${selectId}-option-${index}`;

/** 키보드로 이동 중인 옵션 (aria-activedescendant 대상) */
const activeIndex = ref(-1);
const listboxRef = ref<HTMLElement | null>(null);

const isSelectable = (i: number) =>
  !!props.options[i] && !props.options[i].disabled;

/** from에서 step 방향으로 선택 가능한 다음 옵션을 찾는다 (양끝에서 순환) */
const findNext = (from: number, step: number) => {
  const n = props.options.length;
  if (n === 0) return -1;
  for (let k = 1; k <= n; k++) {
    const i = (((from + step * k) % n) + n) % n;
    if (isSelectable(i)) return i;
  }
  return -1;
};

const findEdge = (step: 1 | -1) =>
  step === 1 ? findNext(-1, 1) : findNext(props.options.length, -1);

/** 열 때는 현재 선택값에서, 없으면 첫 선택 가능 옵션에서 시작한다 */
const openList = (startAt?: number) => {
  if (props.disabled) return;
  isOpen.value = true;
  const selected = props.options.findIndex((o) => o.value === props.modelValue);
  activeIndex.value =
    startAt !== undefined
      ? startAt
      : selected >= 0 && isSelectable(selected)
        ? selected
        : findEdge(1);
};

const closeList = () => {
  isOpen.value = false;
  activeIndex.value = -1;
};

// 활성 옵션이 화면 밖이면 스크롤해서 보이게 한다
watch(activeIndex, async (i) => {
  if (i < 0 || !isOpen.value) return;
  await nextTick();
  // CSS.escape는 환경에 따라 없을 수 있다. id 조회에는 이스케이프가 필요 없다.
  document.getElementById(optionId(i))?.scrollIntoView({ block: 'nearest' });
});

const sizeClasses = {
  lg: 'h-14',
  md: 'h-12',
  sm: 'h-10',
} as const;

const selectedOption = computed(() =>
  props.options.find((opt) => opt.value === props.modelValue)
);

const hasError = computed(() => props.status === 'error');

const triggerClasses = computed(() =>
  cn(
    'flex w-full items-center justify-between rounded-md border bg-krds-white pl-4 pr-12 py-2 text-krds-body-lg leading-[150%] shadow-sm transition-colors relative',
    sizeClasses[props.size],
    'focus:outline-none focus:ring-2 focus:ring-krds-primary-60 focus:ring-offset-2',
    hasError.value
      ? 'border-krds-danger-60 focus:ring-krds-danger-60'
      : 'border-krds-gray-60 hover:border-krds-gray-40',
    props.disabled && 'cursor-not-allowed bg-krds-gray-5 text-krds-gray-40'
  )
);

const dropdownClasses = computed(() =>
  cn(
    'absolute z-50 max-h-96 min-w-[8rem] w-full overflow-hidden rounded-md border bg-krds-white text-krds-body-md leading-[150%] shadow-md mt-1',
    'animate-in fade-in-0 zoom-in-95'
  )
);

const handleSelect = (option: SelectOption) => {
  if (option.disabled) return;
  emit('update:modelValue', option.value);
  closeList();
};

// WAI-ARIA Listbox 패턴: 마우스 없이도 목록을 열고 이동하고 선택할 수 있어야 한다
const handleKeyDown = (e: KeyboardEvent) => {
  if (props.disabled) return;

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      if (!isOpen.value) openList();
      else activeIndex.value = findNext(activeIndex.value, 1);
      break;
    case 'ArrowUp':
      e.preventDefault();
      if (!isOpen.value) openList();
      else activeIndex.value = findNext(activeIndex.value, -1);
      break;
    case 'Home':
      if (!isOpen.value) return;
      e.preventDefault();
      activeIndex.value = findEdge(1);
      break;
    case 'End':
      if (!isOpen.value) return;
      e.preventDefault();
      activeIndex.value = findEdge(-1);
      break;
    case 'Enter':
    case ' ':
      e.preventDefault();
      if (!isOpen.value) openList();
      else if (activeIndex.value >= 0)
        handleSelect(props.options[activeIndex.value]);
      else closeList();
      break;
    case 'Escape':
      if (!isOpen.value) return;
      e.preventDefault();
      closeList();
      break;
    case 'Tab':
      // 포커스가 떠나므로 목록을 닫는다 (Tab 자체는 막지 않는다)
      closeList();
      break;
  }
};

const handleClickOutside = () => {
  closeList();
};
</script>

<template>
  <div
    :class="cn('relative', props.class)"
    v-click-outside="handleClickOutside"
  >
    <!-- Label -->
    <label
      v-if="label"
      :id="labelId"
      :for="triggerId"
      class="block text-krds-body-sm leading-[150%] font-medium text-krds-gray-70 mb-1"
    >
      {{ label }}
    </label>

    <!-- Trigger Button -->
    <button
      :id="triggerId"
      type="button"
      :class="triggerClasses"
      :disabled="disabled"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      :aria-controls="isOpen ? listboxId : undefined"
      :aria-activedescendant="
        isOpen && activeIndex >= 0 ? optionId(activeIndex) : undefined
      "
      :aria-labelledby="label ? labelId : undefined"
      :aria-label="label ? undefined : ariaLabel"
      @click="isOpen ? closeList() : openList()"
      @keydown="handleKeyDown"
    >
      <span :class="!selectedOption && 'text-krds-gray-50'">
        {{ selectedOption?.label || placeholder }}
      </span>
      <ChevronDown
        class="h-6 w-6 absolute right-4 top-1/2 -translate-y-1/2 transition-transform"
        :class="isOpen && 'rotate-180'"
        aria-hidden="true"
      />
    </button>

    <!-- Dropdown -->
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        :id="listboxId"
        ref="listboxRef"
        :class="dropdownClasses"
        role="listbox"
        :aria-labelledby="label ? labelId : undefined"
        :aria-label="label ? undefined : ariaLabel"
      >
        <div class="p-1">
          <!--
            aria-activedescendant 패턴에서는 포커스가 트리거에 머무르고
            옵션은 포커스를 받지 않는다. 키보드 조작은 트리거의 keydown이 담당한다.
          -->
          <!-- eslint-disable-next-line vuejs-accessibility/interactive-supports-focus -->
          <div
            v-for="(option, index) in options"
            :id="optionId(index)"
            :key="option.value"
            :class="
              cn(
                'relative flex cursor-pointer select-none items-center rounded-sm py-2 pl-8 pr-2 outline-none',
                'hover:bg-krds-primary-60 hover:text-krds-white',
                option.disabled && 'pointer-events-none opacity-50',
                option.value === modelValue && 'bg-krds-primary-5',
                index === activeIndex && 'bg-krds-primary-60 text-krds-white'
              )
            "
            role="option"
            :aria-selected="option.value === modelValue"
            :aria-disabled="option.disabled"
            @click="handleSelect(option)"
            @mousemove="activeIndex = index"
          >
            <!-- Check Icon -->
            <span
              v-if="option.value === modelValue"
              class="absolute left-2 flex w-4 items-center justify-center"
            >
              <Check class="h-4 w-4" />
            </span>
            {{ option.label }}
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

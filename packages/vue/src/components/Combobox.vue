<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, useId } from 'vue';
import { cva, type VariantProps } from 'class-variance-authority';
import { Check, ChevronsUpDown, Search, X, Loader2 } from 'lucide-vue-next';
import { cn } from '@/lib/utils';

const listboxId = `${useId()}-listbox`;

const comboboxTriggerVariants = cva(
  'flex h-10 w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-krds-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border-krds-gray-30 focus:ring-krds-primary-base focus:border-krds-primary-base',
        error:
          'border-krds-danger-base focus:ring-krds-danger-base focus:border-krds-danger-base',
      },
      size: {
        sm: 'h-8 text-xs px-2',
        md: 'h-10 text-sm px-3',
        lg: 'h-12 text-base px-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
  description?: string;
}

type ComboboxVariants = VariantProps<typeof comboboxTriggerVariants>;

const props = withDefaults(
  defineProps<{
    options: ComboboxOption[];
    modelValue?: string;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    disabled?: boolean;
    clearable?: boolean;
    variant?: ComboboxVariants['variant'];
    size?: ComboboxVariants['size'];
    maxHeight?: number;
    loading?: boolean;
    class?: string;
  }>(),
  {
    placeholder: '선택해주세요',
    searchPlaceholder: '검색...',
    emptyMessage: '결과가 없습니다.',
    disabled: false,
    clearable: false,
    variant: 'default',
    size: 'md',
    maxHeight: 300,
    loading: false,
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
  search: [value: string];
}>();

const isOpen = ref(false);
const search = ref('');
const triggerRef = ref<HTMLButtonElement | null>(null);
const dropdownRef = ref<HTMLDivElement | null>(null);
const highlightedIndex = ref(-1);

const selectedOption = computed(() =>
  props.options.find((opt) => opt.value === props.modelValue)
);

const filteredOptions = computed(() => {
  if (!search.value) return props.options;
  const searchLower = search.value.toLowerCase();
  return props.options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(searchLower) ||
      opt.description?.toLowerCase().includes(searchLower)
  );
});

const groupedOptions = computed(() => {
  const groups = new Map<string, ComboboxOption[]>();
  const ungrouped: ComboboxOption[] = [];

  filteredOptions.value.forEach((option) => {
    if (option.group) {
      const group = groups.get(option.group) || [];
      group.push(option);
      groups.set(option.group, group);
    } else {
      ungrouped.push(option);
    }
  });

  return { groups, ungrouped };
});

const handleSelect = (value: string) => {
  const newValue = value === props.modelValue ? '' : value;
  emit('update:modelValue', newValue);
  isOpen.value = false;
  search.value = '';
  highlightedIndex.value = -1;
};

const handleClear = (e: MouseEvent) => {
  e.stopPropagation();
  emit('update:modelValue', '');
  search.value = '';
};

const handleSearchChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  search.value = target.value;
  emit('search', target.value);
  highlightedIndex.value = 0;
};

const handleKeyDown = (e: KeyboardEvent) => {
  const options = filteredOptions.value.filter((opt) => !opt.disabled);

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      if (!isOpen.value) {
        isOpen.value = true;
      } else {
        highlightedIndex.value = Math.min(
          highlightedIndex.value + 1,
          options.length - 1
        );
      }
      break;
    case 'ArrowUp':
      e.preventDefault();
      highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0);
      break;
    case 'Enter':
      e.preventDefault();
      if (isOpen.value && highlightedIndex.value >= 0) {
        const option = options[highlightedIndex.value];
        if (option) handleSelect(option.value);
      } else {
        isOpen.value = true;
      }
      break;
    case 'Escape':
      e.preventDefault();
      isOpen.value = false;
      highlightedIndex.value = -1;
      break;
  }
};

const handleClickOutside = (e: MouseEvent) => {
  if (
    triggerRef.value &&
    !triggerRef.value.contains(e.target as Node) &&
    dropdownRef.value &&
    !dropdownRef.value.contains(e.target as Node)
  ) {
    isOpen.value = false;
    highlightedIndex.value = -1;
  }
};

watch(isOpen, (newVal) => {
  if (newVal) {
    highlightedIndex.value = props.modelValue
      ? filteredOptions.value.findIndex((opt) => opt.value === props.modelValue)
      : 0;
  }
});

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="relative">
    <!-- Trigger Button -->
    <button
      ref="triggerRef"
      type="button"
      role="combobox"
      :aria-expanded="isOpen"
      :aria-controls="isOpen ? listboxId : undefined"
      aria-haspopup="listbox"
      :disabled="disabled"
      :class="cn(comboboxTriggerVariants({ variant, size }), props.class)"
      @click="isOpen = !isOpen"
      @keydown="handleKeyDown"
    >
      <span
        :class="
          cn(
            'flex-1 truncate text-left',
            !selectedOption && 'text-krds-gray-50'
          )
        "
      >
        {{ selectedOption ? selectedOption.label : placeholder }}
      </span>
      <div class="flex items-center gap-1">
        <button
          v-if="clearable && selectedOption && !disabled"
          type="button"
          tabindex="-1"
          class="rounded-full p-0.5 hover:bg-krds-gray-20"
          aria-label="선택 해제"
          @click="handleClear"
        >
          <X class="h-3.5 w-3.5 text-krds-gray-50" />
        </button>
        <ChevronsUpDown
          class="h-4 w-4 shrink-0 text-krds-gray-40"
          aria-hidden="true"
        />
      </div>
    </button>

    <!-- Dropdown -->
    <div
      v-if="isOpen"
      ref="dropdownRef"
      :class="
        cn(
          'absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-krds-gray-20 bg-white shadow-md',
          'animate-in fade-in-0 zoom-in-95'
        )
      "
    >
      <!-- Search Input -->
      <div class="flex items-center border-b border-krds-gray-20 px-3">
        <Search
          class="mr-2 h-4 w-4 shrink-0 text-krds-gray-40"
          aria-hidden="true"
        />
        <input
          type="text"
          :value="search"
          :aria-label="searchPlaceholder"
          :placeholder="searchPlaceholder"
          class="flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-krds-gray-50"
          @input="handleSearchChange"
          @keydown="handleKeyDown"
        />
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-6">
        <Loader2 class="h-5 w-5 animate-spin text-krds-primary-base" />
      </div>

      <!-- Options List -->
      <div
        v-else
        :id="listboxId"
        role="listbox"
        class="overflow-auto p-2"
        :style="{ maxHeight: `${maxHeight}px` }"
      >
        <!-- Empty State -->
        <div
          v-if="filteredOptions.length === 0"
          class="py-6 text-center text-sm text-krds-gray-50"
        >
          {{ emptyMessage }}
        </div>

        <!-- Ungrouped Options -->
        <template
          v-for="(option, index) in groupedOptions.ungrouped"
          :key="option.value"
        >
          <button
            type="button"
            role="option"
            :aria-selected="modelValue === option.value"
            :disabled="option.disabled"
            :class="
              cn(
                'relative flex w-full cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none',
                'hover:bg-krds-gray-5',
                highlightedIndex === index && 'bg-krds-gray-10',
                option.disabled && 'pointer-events-none opacity-50'
              )
            "
            @click="handleSelect(option.value)"
            @focus="highlightedIndex = index"
            @mouseenter="highlightedIndex = index"
          >
            <span
              :class="
                cn(
                  'mr-2 flex h-4 w-4 items-center justify-center',
                  modelValue === option.value ? 'opacity-100' : 'opacity-0'
                )
              "
            >
              <Check class="h-4 w-4 text-krds-primary-base" />
            </span>
            <div class="flex flex-col">
              <span>{{ option.label }}</span>
              <span v-if="option.description" class="text-xs text-krds-gray-50">
                {{ option.description }}
              </span>
            </div>
          </button>
        </template>

        <!-- Grouped Options -->
        <template
          v-for="[groupName, groupOptions] in groupedOptions.groups"
          :key="groupName"
        >
          <div class="px-2 py-1.5">
            <div class="mb-1 text-xs font-medium text-krds-gray-50">
              {{ groupName }}
            </div>
            <button
              v-for="option in groupOptions"
              :key="option.value"
              type="button"
              role="option"
              :aria-selected="modelValue === option.value"
              :disabled="option.disabled"
              :class="
                cn(
                  'relative flex w-full cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none',
                  'hover:bg-krds-gray-5',
                  option.disabled && 'pointer-events-none opacity-50'
                )
              "
              @click="handleSelect(option.value)"
            >
              <span
                :class="
                  cn(
                    'mr-2 flex h-4 w-4 items-center justify-center',
                    modelValue === option.value ? 'opacity-100' : 'opacity-0'
                  )
                "
              >
                <Check class="h-4 w-4 text-krds-primary-base" />
              </span>
              <div class="flex flex-col">
                <span>{{ option.label }}</span>
                <span
                  v-if="option.description"
                  class="text-xs text-krds-gray-50"
                >
                  {{ option.description }}
                </span>
              </div>
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

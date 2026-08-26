<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { File, Copy, Check } from 'lucide-vue-next';
import { cn } from '@/lib/utils';

const sizeStyles = {
  sm: 'text-krds-body-xs px-1 py-0.5',
  default: 'text-krds-body-sm px-1.5 py-0.5',
  lg: 'text-krds-body-md px-2 py-1',
} as const;

const props = withDefaults(
  defineProps<{
    variant?: 'inline' | 'block';
    size?: 'sm' | 'default' | 'lg';
    language?: string;
    showLineNumbers?: boolean;
    fileName?: string;
    theme?: string;
    code?: string;
    class?: string;
  }>(),
  {
    variant: 'inline',
    size: 'default',
    showLineNumbers: true,
    theme: 'github-dark',
  }
);

const copied = ref(false);
const html = ref('');
const loading = ref(false);

const handleCopy = async () => {
  const codeToCopy = props.code || '';
  await navigator.clipboard.writeText(codeToCopy);
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2000);
};

const highlightCode = async () => {
  if (props.variant === 'block' && props.language && props.code) {
    loading.value = true;
    try {
      const { codeToHtml } = await import('shiki');
      const highlighted = await codeToHtml(props.code, {
        lang: props.language,
        theme: props.theme,
      });
      html.value = highlighted;
    } catch {
      html.value = '';
    } finally {
      loading.value = false;
    }
  }
};

watch(
  () => [props.code, props.language, props.theme, props.variant],
  () => {
    highlightCode();
  },
  { immediate: true }
);

const inlineClasses = computed(() =>
  cn(
    'font-mono bg-krds-primary-5 text-krds-primary-70 rounded border border-krds-primary-20',
    sizeStyles[props.size],
    props.class
  )
);

const blockClasses = computed(() =>
  cn(
    'font-mono bg-krds-primary-5 rounded-lg p-4 overflow-x-auto',
    'text-krds-primary-70 border border-krds-primary-20',
    props.class
  )
);
</script>

<template>
  <!-- Block variant with syntax highlighting -->
  <div v-if="variant === 'block' && language" :class="cn('relative group', props.class)">
    <!-- Loading state -->
    <div v-if="loading" class="overflow-x-auto rounded-lg bg-krds-gray-90 p-5">
      <div class="animate-pulse">
        <div class="h-4 bg-krds-gray-70 rounded w-3/4 mb-2"></div>
        <div class="h-4 bg-krds-gray-70 rounded w-1/2"></div>
      </div>
    </div>

    <!-- Highlighted code -->
    <template v-else>
      <div
        v-if="fileName"
        class="flex items-center gap-2 px-4 py-2 bg-krds-gray-90 border-b border-krds-gray-70 rounded-t-lg"
      >
        <File class="w-3.5 h-3.5 text-krds-gray-40" />
        <span class="text-xs text-krds-gray-60 font-mono">{{ fileName }}</span>
      </div>
      <div class="relative">
        <button
          type="button"
          @click="handleCopy"
          :class="cn(
            'absolute top-3 right-3 p-2 rounded-md transition-all z-10',
            'bg-krds-gray-70 hover:bg-krds-gray-60',
            'text-krds-gray-10 opacity-0 group-hover:opacity-100'
          )"
          aria-label="Copy code"
        >
          <Check v-if="copied" class="w-4 h-4" />
          <Copy v-else class="w-4 h-4" />
        </button>
        <div
          :class="cn(
            'overflow-x-auto',
            fileName ? 'rounded-b-lg' : 'rounded-lg',
            showLineNumbers ? 'code-with-line-numbers' : ''
          )"
          v-html="html"
        />
      </div>
    </template>
  </div>

  <!-- Block variant without syntax highlighting -->
  <div v-else-if="variant === 'block'" class="relative group">
    <pre :class="blockClasses"><code><slot>{{ code }}</slot></code></pre>
    <button
      type="button"
      @click="handleCopy"
      :class="cn(
        'absolute top-3 right-3 p-2 rounded-md transition-all z-10',
        'bg-krds-primary-10 hover:bg-krds-primary-20 border border-krds-primary-30',
        'text-krds-primary-70 opacity-0 group-hover:opacity-100'
      )"
      aria-label="Copy code"
    >
      <Check v-if="copied" class="w-4 h-4" />
      <Copy v-else class="w-4 h-4" />
    </button>
  </div>

  <!-- Inline variant -->
  <code v-else :class="inlineClasses">
    <slot>{{ code }}</slot>
  </code>
</template>

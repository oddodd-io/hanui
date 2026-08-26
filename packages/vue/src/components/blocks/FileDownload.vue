<script lang="ts">
// defineProps는 setup 밖으로 호이스팅되므로
// 기본값으로 쓸 상수는 별도 <script> 블록에 둔다.
export interface FileItem {
  /** 파일명 */
  name: string;
  /** 파일 크기 (표시용, 예: "2.3MB") */
  size: string;
  /** 파일 확장자 */
  extension: string;
  /** 다운로드 URL */
  href: string;
}

const DEFAULT_FILES: FileItem[] = [
  {
    name: '2026년 상반기 사업계획서',
    size: '2.3MB',
    extension: 'hwp',
    href: '#',
  },
  {
    name: '개인정보 수집·이용 동의서',
    size: '150KB',
    extension: 'pdf',
    href: '#',
  },
  { name: '민원 접수 양식', size: '45KB', extension: 'docx', href: '#' },
];
</script>

<script setup lang="ts">
import { cn } from '@/lib/utils';
import Button from '../Button.vue';
import Badge from '../Badge.vue';
import Body from '../Body.vue';

type BadgeVariant =
  | 'gray'
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

interface Props {
  /** 제목 */
  title?: string;
  /** 파일 목록 */
  files?: FileItem[];
  /** true면 href로 이동하지 않고 download 이벤트만 emit한다 */
  handleDownload?: boolean;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: '첨부파일',
  files: () => DEFAULT_FILES,
  handleDownload: false,
});

const emit = defineEmits<{ download: [file: FileItem] }>();

const EXTENSION_VARIANTS: Record<string, BadgeVariant> = {
  hwp: 'primary',
  pdf: 'error',
  doc: 'info',
  docx: 'info',
  xls: 'success',
  xlsx: 'success',
  ppt: 'warning',
  pptx: 'warning',
  zip: 'gray',
};

const variantOf = (ext: string): BadgeVariant =>
  EXTENSION_VARIANTS[ext.toLowerCase()] ?? 'gray';
</script>

<template>
  <section
    v-if="files.length > 0"
    :class="cn('border border-krds-gray-20 rounded-lg p-4', props.class)"
    :aria-label="title"
  >
    <h4 class="text-sm font-semibold text-krds-gray-70 mb-3">
      {{ title }} ({{ files.length }})
    </h4>

    <!-- Tailwind가 list-style을 초기화하면 Safari가 목록 의미를 잃는다 -->
    <ul class="space-y-2" role="list">
      <li
        v-for="file in files"
        :key="file.href + file.name"
        class="flex items-center justify-between gap-3 py-2 px-3 rounded hover:bg-krds-gray-5 transition-colors"
      >
        <div class="flex items-center gap-2 min-w-0">
          <Badge :variant="variantOf(file.extension)" size="md">
            {{ file.extension.toUpperCase() }}
          </Badge>
          <span class="text-sm text-krds-gray-80 truncate">{{
            file.name
          }}</span>
          <Body size="xs" class="text-krds-gray-60 shrink-0">
            ({{ file.size }})
          </Body>
        </div>
        <Button
          variant="ghost"
          size="sm"
          :href="handleDownload ? undefined : file.href"
          :aria-label="`${file.name} 다운로드`"
          @click="emit('download', file)"
        >
          다운로드
        </Button>
      </li>
    </ul>
  </section>
</template>

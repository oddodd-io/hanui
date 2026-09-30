<script setup lang="ts">
/**
 * FileUpload — KRDS `.krds-file-upload` 래퍼
 *
 * 마크업·클래스(file-head / file-upload(.active) / file-list / upload-list / is-error / file-hint-invalid)는 KRDS 그대로다.
 * KRDS ui-script.js krds_fileUpload는 "drag 임시"로 드롭해도 아무것도 하지 않으므로 동작은 여기서 채운다.
 * - 선택·드롭한 파일을 목록(v-model)에 추가, 크기·형식 오류는 KRDS처럼 목록에 is-error + 안내 문구로 표시
 * - 개수 초과는 추가하지 않고 알린다 (reject 이벤트)
 * - 삭제 후 다음 항목(없으면 파일 선택 버튼)으로 초점 이동, 추가·삭제·오류를 스크린리더에 알림
 * - 실제 업로드는 앱이 담당한다: add 이벤트를 받아 항목의 status를 uploading → done/error로 바꾼다
 * KRDS 원본의 `<label for><button>` 중첩(레이블 안에 다른 컨트롤)은 HTML 규칙 위반이라 쓰지 않고,
 * 원본 JS처럼 버튼 클릭으로 input을 연다.
 * 기준: reference/krds-uiux/html/code/file_upload.html, resources/scss/component/_file_upload.scss
 */
import { computed, nextTick, ref, useId } from 'vue';
import { formatFileSize } from './file-size';

export type FileUploadStatus = 'idle' | 'uploading' | 'done' | 'error';

export interface FileUploadItem {
  id: string;
  name: string;
  /** 바이트 */
  size: number;
  status?: FileUploadStatus;
  /** status가 error일 때 표시할 안내 (줄바꿈 \n 가능) */
  error?: string;
  /** 새로 선택한 파일. 서버에 이미 있는 첨부는 없다 */
  file?: File;
}

export type FileUploadRejectReason = 'max-files';

export interface FileUploadProps {
  modelValue?: FileUploadItem[];
  /** 상단 제목 (.file-head .tit) */
  title?: string;
  /** 제목 태그 수준 */
  titleTag?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  /** 드롭 영역 안내 문구 */
  guideText?: string;
  buttonText?: string;
  /** input accept (예: '.hwp,.pdf,image/*') */
  accept?: string;
  multiple?: boolean;
  /** 최대 파일 수. 표시(3개 / 10개)와 초과 방지에 쓴다 */
  maxFiles?: number;
  /** 파일 하나의 최대 크기 (바이트) */
  maxSize?: number;
  name?: string;
  disabled?: boolean;
  /** `.line` 테두리형 */
  line?: boolean;
}

const props = withDefaults(defineProps<FileUploadProps>(), {
  modelValue: () => [],
  title: undefined,
  titleTag: 'h3',
  guideText:
    '첨부할 파일을 여기에 끌어다 놓거나, 파일 선택 버튼을 눌러 파일을 직접 선택해주세요.',
  buttonText: '파일선택',
  accept: undefined,
  multiple: true,
  maxFiles: undefined,
  maxSize: undefined,
  name: undefined,
  disabled: false,
  line: true,
});

const emit = defineEmits<{
  'update:modelValue': [items: FileUploadItem[]];
  /** 새로 추가된 정상 파일 (업로드 시작 지점) */
  add: [items: FileUploadItem[]];
  remove: [item: FileUploadItem];
  /** 추가하지 못한 파일 */
  reject: [files: File[], reason: FileUploadRejectReason];
}>();

defineSlots<{
  /** 제목 아래 설명 (.file-head) */
  default?: () => unknown;
  /** 항목별 버튼 영역 (다운로드·바로보기 등). 기본 삭제 버튼을 대신한다 */
  actions?: (scope: { item: FileUploadItem; remove: () => void }) => unknown;
}>();

const inputId = `file-upload-${useId()}`;
const inputRef = ref<HTMLInputElement | null>(null);
const selectButtonRef = ref<HTMLButtonElement | null>(null);
const listRef = ref<HTMLUListElement | null>(null);
const dragging = ref(false);
const announcement = ref('');
let dragDepth = 0;
let idSeq = 0;

const items = computed(() => props.modelValue);
const isFull = computed(
  () => props.maxFiles !== undefined && items.value.length >= props.maxFiles
);

const extOf = (name: string) => {
  const dot = name.lastIndexOf('.');
  return dot > 0 ? name.slice(dot + 1).toLowerCase() : '';
};

/** 파일명 + [확장자, 크기] — KRDS 예제 표기 "위임장 [hwp, 17KB]" */
const displayName = (item: FileUploadItem) => {
  const ext = extOf(item.name);
  const base = ext ? item.name.slice(0, -(ext.length + 1)) : item.name;
  const meta = [ext, formatFileSize(item.size)].filter(Boolean).join(', ');
  return `${base} [${meta}]`;
};

const matchesAccept = (file: File) => {
  if (!props.accept) return true;
  const ext = `.${extOf(file.name)}`;
  const type = file.type.toLowerCase();
  return props.accept
    .split(',')
    .map((rule) => rule.trim().toLowerCase())
    .filter(Boolean)
    .some((rule) => {
      if (rule.startsWith('.')) return ext === rule;
      if (rule.endsWith('/*')) return type.startsWith(rule.slice(0, -1));
      return type === rule;
    });
};

const toItem = (file: File): FileUploadItem => {
  const item: FileUploadItem = {
    id: `file-${Date.now().toString(36)}-${idSeq++}`,
    name: file.name,
    size: file.size,
    status: 'idle',
    file,
  };
  if (!matchesAccept(file)) {
    item.status = 'error';
    item.error = `등록할 수 없는 파일 형식입니다.\n${props.accept} 형식만 등록할 수 있습니다.`;
  } else if (props.maxSize !== undefined && file.size > props.maxSize) {
    item.status = 'error';
    item.error = `등록 가능한 파일 용량을 초과하였습니다.\n${formatFileSize(props.maxSize)} 이하의 파일만 등록할 수 있습니다.`;
  }
  return item;
};

const announce = async (message: string) => {
  // 같은 문구가 연달아 와도 다시 읽히도록 비웠다가 넣는다
  announcement.value = '';
  await nextTick();
  announcement.value = message;
};

const addFiles = (fileList: FileList | File[] | null | undefined) => {
  if (props.disabled || !fileList) return;
  let files = Array.from(fileList);
  if (!files.length) return;
  if (!props.multiple) files = files.slice(0, 1);

  const messages: string[] = [];
  let accepted = files;
  if (props.maxFiles !== undefined) {
    const room = Math.max(0, props.maxFiles - items.value.length);
    const rejected = files.slice(room);
    accepted = files.slice(0, room);
    if (rejected.length) {
      emit('reject', rejected, 'max-files');
      messages.push(
        `최대 ${props.maxFiles}개까지 등록할 수 있어 ${rejected.length}개 파일은 추가하지 않았습니다.`
      );
    }
  }

  const newItems = accepted.map(toItem);
  if (newItems.length) {
    const nextItems = props.multiple ? [...items.value, ...newItems] : newItems;
    emit('update:modelValue', nextItems);
    const ok = newItems.filter((item) => item.status !== 'error');
    const failed = newItems.length - ok.length;
    if (ok.length) emit('add', ok);
    messages.unshift(
      `파일 ${newItems.length}개를 추가했습니다.${failed ? ` 이 중 ${failed}개는 오류가 있습니다.` : ''}`
    );
  }
  if (messages.length) announce(messages.join(' '));
};

const openPicker = () => {
  if (props.disabled || isFull.value) return;
  inputRef.value?.click();
};

const onInputChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  addFiles(input.files);
  // 같은 파일을 다시 고를 수 있게 비운다
  input.value = '';
};

const onDragEnter = (event: DragEvent) => {
  if (props.disabled) return;
  event.preventDefault();
  dragDepth++;
  dragging.value = true;
};
const onDragOver = (event: DragEvent) => {
  if (props.disabled) return;
  event.preventDefault();
  dragging.value = true;
};
const onDragLeave = (event: DragEvent) => {
  event.preventDefault();
  // 자식 요소 사이를 지날 때 깜빡이지 않도록 깊이로 판단한다
  dragDepth = Math.max(0, dragDepth - 1);
  if (dragDepth === 0) dragging.value = false;
};
const onDrop = (event: DragEvent) => {
  event.preventDefault();
  dragDepth = 0;
  dragging.value = false;
  addFiles(event.dataTransfer?.files);
};

const focusAfterRemove = async (index: number) => {
  await nextTick();
  const buttons =
    listRef.value?.querySelectorAll<HTMLElement>('.btn-wrap button');
  const target = buttons?.[Math.min(index, buttons.length - 1)];
  (target ?? selectButtonRef.value)?.focus();
};

const remove = (item: FileUploadItem) => {
  const index = items.value.findIndex((it) => it.id === item.id);
  if (index === -1) return;
  emit(
    'update:modelValue',
    items.value.filter((it) => it.id !== item.id)
  );
  emit('remove', item);
  announce(`${item.name} 파일을 삭제했습니다.`);
  focusAfterRemove(index);
};

const removeAll = async () => {
  const removed = [...items.value];
  emit('update:modelValue', []);
  removed.forEach((item) => emit('remove', item));
  announce('첨부한 파일을 모두 삭제했습니다.');
  await nextTick();
  selectButtonRef.value?.focus();
};

const errorLines = (item: FileUploadItem) => (item.error ?? '').split('\n');

defineExpose({
  /** 파일을 코드로 추가 (붙여넣기 등) */
  addFiles,
  openPicker,
});
</script>

<template>
  <div :class="['krds-file-upload', { line }]">
    <div v-if="title || $slots.default" class="file-head">
      <component :is="titleTag" v-if="title" class="tit">{{ title }}</component>
      <div v-if="$slots.default">
        <slot />
      </div>
    </div>

    <div
      :class="['file-upload', { active: dragging }]"
      @dragenter="onDragEnter"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <p class="txt">{{ guideText }}</p>
      <div class="file-upload-btn-wrap">
        <input
          :id="inputId"
          ref="inputRef"
          type="file"
          :name="name"
          :accept="accept"
          :multiple="multiple"
          :disabled="disabled"
          hidden
          tabindex="-1"
          @change="onInputChange"
        />
        <button
          ref="selectButtonRef"
          type="button"
          class="krds-btn medium"
          :disabled="disabled || isFull"
          @click="openPicker"
        >
          <i class="svg-icon ico-upload" aria-hidden="true"></i>{{ buttonText }}
        </button>
      </div>
    </div>

    <div v-if="items.length || maxFiles !== undefined" class="file-list">
      <div class="total">
        <span class="current">{{ items.length }}개</span>
        {{ maxFiles !== undefined ? `/ ${maxFiles}개` : '' }}
      </div>
      <ul v-if="items.length" ref="listRef" class="upload-list">
        <li
          v-for="item in items"
          :key="item.id"
          :class="{ 'is-error': item.status === 'error' }"
        >
          <div :class="['file-info', { 'm-column': $slots.actions }]">
            <div class="file-name">{{ displayName(item) }}</div>
            <div class="btn-wrap">
              <span
                v-if="item.status === 'uploading'"
                class="krds-spinner"
                role="status"
              >
                <span class="sr-only">업로드 중</span>
              </span>
              <template v-else>
                <span
                  v-if="item.status === 'done'"
                  class="ico-invalid complete"
                >
                  <em class="sr-only">업로드 완료</em>
                </span>
                <slot name="actions" :item="item" :remove="() => remove(item)">
                  <button
                    type="button"
                    class="krds-btn medium text"
                    :disabled="disabled"
                    @click="remove(item)"
                  >
                    삭제<span class="sr-only"> {{ item.name }}</span>
                    <i class="svg-icon ico-delete-fill" aria-hidden="true"></i>
                  </button>
                </slot>
              </template>
            </div>
          </div>
          <p
            v-if="item.status === 'error' && item.error"
            class="file-hint-invalid"
          >
            <span>
              <template v-for="(text, i) in errorLines(item)" :key="i">
                <br v-if="i > 0" />{{ text }}
              </template>
            </span>
          </p>
        </li>
      </ul>
      <div v-if="items.length > 1" class="upload-delete-btn">
        <button
          type="button"
          class="krds-btn xsmall tertiary"
          :disabled="disabled"
          @click="removeAll"
        >
          전체 파일 삭제<i
            class="svg-icon ico-angle right"
            aria-hidden="true"
          ></i>
        </button>
      </div>
    </div>

    <p class="sr-only" aria-live="polite" aria-atomic="true">
      {{ announcement }}
    </p>
  </div>
</template>

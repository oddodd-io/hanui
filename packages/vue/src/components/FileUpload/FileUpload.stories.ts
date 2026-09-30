import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { FileUpload } from './index';
import type { FileUploadItem } from './index';

/** 업로드를 흉내 낸다: uploading → 1.5초 뒤 done */
const useFakeUpload = (initial: FileUploadItem[] = []) => {
  const items = ref<FileUploadItem[]>(initial);
  const onAdd = (added: FileUploadItem[]) => {
    const ids = new Set(added.map((item) => item.id));
    items.value = items.value.map((item) =>
      ids.has(item.id) ? { ...item, status: 'uploading' } : item
    );
    setTimeout(() => {
      items.value = items.value.map((item) =>
        ids.has(item.id) ? { ...item, status: 'done' } : item
      );
    }, 1500);
  };
  return { items, onAdd };
};

const krdsSample: FileUploadItem[] = [
  {
    id: 's1',
    name: '위임장(주민등록법 시행령 별지 제15호의2호서식).hwp',
    size: 17 * 1024,
    status: 'uploading',
  },
  {
    id: 's2',
    name: '위임장(주민등록법 시행령 별지 제15호의2호서식).hwp',
    size: 17 * 1024,
    status: 'done',
  },
  {
    id: 's3',
    name: '위임장(주민등록법 시행령 별지 제15호의2호서식).hwp',
    size: 17 * 1024,
  },
  {
    id: 's4',
    name: '전입재등록신고서 [주민등록법 시행령 : 별지서식 15, 15호의2호].hwp',
    size: 25 * 1024 * 1024,
    status: 'error',
    error:
      '등록 가능한 파일 용량을 초과하였습니다.\n20MB 미만의 파일만 등록할 수 있습니다.',
  },
];

/**
 * KRDS `.krds-file-upload` 래퍼. 원본 JS는 드롭해도 동작하지 않는 임시 구현이라 추가·검사·삭제·알림을 Vue가 채운다.
 * 실제 업로드는 앱이 `add` 이벤트에서 처리하고 항목의 status(uploading → done/error)를 바꾼다.
 * 원본 예제: reference/krds-uiux/html/code/file_upload.html
 */
const meta = {
  title: 'Components/FileUpload',
  component: FileUpload,
  tags: ['autodocs'],
  argTypes: {
    maxFiles: { control: 'number' },
    maxSize: { control: 'number' },
    accept: { control: 'text' },
    multiple: { control: 'boolean' },
    disabled: { control: 'boolean' },
    line: { control: 'boolean' },
  },
  args: { title: '첨부파일', maxFiles: 10, maxSize: 20 * 1024 * 1024 },
  render: (args) => ({
    components: { FileUpload },
    setup: () => ({ args, ...useFakeUpload() }),
    template: `
      <FileUpload v-bind="args" v-model="items" @add="onAdd">
        <p>hwp, pdf 파일을 최대 10개, 파일당 20MB까지 올릴 수 있습니다.</p>
      </FileUpload>
    `,
  }),
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 파일을 선택하거나 끌어다 놓으면 업로드 중 → 완료로 바뀐다 (20MB 초과는 오류) */
export const Default: Story = {};

/** file_upload.html — 업로드 중 · 완료 · 대기 · 용량 초과 오류 */
export const States: Story = {
  render: () => ({
    components: { FileUpload },
    setup: () => useFakeUpload(krdsSample),
    template: `
      <FileUpload v-model="items" title="타이틀영역" :max-files="10" @add="onAdd">
        <p>컨텐츠 영역</p>
      </FileUpload>
    `,
  }),
};

/** 형식 제한 — hwp·pdf만. 다른 형식은 목록에 오류로 표시 */
export const AcceptTypes: Story = {
  args: { accept: '.hwp,.pdf', title: '신청서 첨부' },
};

/** 한 개만 — 새로 고르면 교체 */
export const Single: Story = {
  args: {
    multiple: false,
    maxFiles: undefined,
    title: '대표 이미지',
    accept: 'image/*',
  },
};

/** 서버에 이미 있는 첨부 — #actions 슬롯으로 다운로드·바로보기 (.m-column) */
export const ExistingFiles: Story = {
  render: () => ({
    components: { FileUpload },
    setup: () => ({
      items: ref<FileUploadItem[]>([
        { id: 'e1', name: '2026년 하반기 민원 안내.pdf', size: 842 * 1024 },
        { id: 'e2', name: '신청서 양식.hwp', size: 17 * 1024 },
      ]),
    }),
    template: `
      <FileUpload v-model="items" title="첨부파일">
        <template #actions="{ item }">
          <a :href="'#download-' + item.id" class="krds-btn medium text">다운로드<span class="sr-only"> {{ item.name }}</span> <i class="svg-icon ico-down" aria-hidden="true"></i></a>
          <a :href="'#view-' + item.id" class="krds-btn medium text">바로보기<span class="sr-only"> {{ item.name }}</span> <i class="svg-icon ico-angle right" aria-hidden="true"></i></a>
        </template>
      </FileUpload>
    `,
  }),
};

/** KRDS 고대비 모드 */
export const HighContrast: Story = {
  globals: { krdsMode: 'high-contrast' },
  render: States.render,
};

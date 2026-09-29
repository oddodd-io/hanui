import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Table } from './index';
import { Button } from '../Button';

const noticeColumns = [
  { key: 'no', label: '번호', width: '8rem' },
  { key: 'title', label: '제목', rowHeader: true },
  { key: 'author', label: '작성자', width: '12rem' },
  { key: 'date', label: '등록일', width: '14rem' },
];

const noticeRows = [
  {
    no: 3,
    title: '2026년 하반기 민원 안내',
    author: '민원과',
    date: '2026-09-21',
  },
  {
    no: 2,
    title: '홈페이지 점검에 따른 서비스 일시 중단 안내',
    author: '정보화팀',
    date: '2026-09-10',
  },
  {
    no: 1,
    title: '개인정보 처리방침 개정 안내',
    author: '총무과',
    date: '2026-09-01',
  },
];

const noticeCaption =
  '공지사항 목록으로 번호, 제목, 작성자, 등록일로 구성되어 있다.';

/**
 * KRDS `.krds-table-wrap > table.tbl.col.data` 래퍼. JS 동작 없는 순수 마크업이며
 * caption은 화면에서 숨겨지고(sr-only) 스크린리더가 표 이름으로 읽는다.
 * 원본 예제: reference/krds-uiux/html/code/table.html
 */
const meta = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
  argTypes: {
    scroll: { control: 'boolean' },
    mobScroll: { control: 'boolean' },
    emptyText: { control: 'text' },
  },
  args: {
    caption: noticeCaption,
    columns: noticeColumns,
    rows: noticeRows,
    rowKey: 'no',
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 공지 목록 — 제목 열이 행 제목(th scope="row") */
export const Default: Story = {};

/** table.html 원본 그대로 — columns 없이 default 슬롯에 colgroup/thead/tbody를 직접 넣는다 */
export const RawMarkup: Story = {
  render: () => ({
    components: { Table },
    template: `
      <Table caption="000에 대한 표로 제목1,제목2에 대한 내용으로 구성되어 있으며 제목1은 제목1-1,제목1-2,제목1-3으로 구성되어있다.">
        <colgroup><col style="width: 30%;"><col></colgroup>
        <thead><tr><th scope="col">제목1</th><th scope="col">제목2</th></tr></thead>
        <tbody>
          <tr><th scope="row">제목1-1</th><td>내용이 들어갑니다. 내용이 들어갑니다. 내용이 들어갑니다. 내용이 들어갑니다. 내용이 들어갑니다.</td></tr>
          <tr><th scope="row">제목1-2</th><td>내용이 들어갑니다.</td></tr>
          <tr><th scope="row">제목1-3</th><td>내용이 들어갑니다. 내용이 들어갑니다.</td></tr>
        </tbody>
      </Table>
    `,
  }),
};

/** #cell-{key} 슬롯 — 제목을 상세 링크로, 관리 열에 버튼 */
export const CellSlots: Story = {
  render: () => ({
    components: { Table, Button },
    setup: () => ({
      caption:
        '공지사항 관리 목록으로 번호, 제목, 등록일, 관리로 구성되어 있다.',
      columns: [
        { key: 'no', label: '번호', width: '8rem' },
        { key: 'title', label: '제목', rowHeader: true },
        { key: 'date', label: '등록일', width: '14rem' },
        { key: 'actions', label: '관리', width: '12rem' },
      ],
      rows: noticeRows,
    }),
    template: `
      <Table :caption="caption" :columns="columns" :rows="rows" row-key="no">
        <template #cell-title="{ row, value }">
          <a :href="'#notice-' + row.no">{{ value }}</a>
        </template>
        <template #cell-actions="{ row }">
          <Button size="small" variant="secondary">수정<span class="sr-only"> ({{ row.title }})</span></Button>
        </template>
      </Table>
    `,
  }),
};

/** rows가 비었을 때 — 전체 열을 합친 한 칸에 안내 문구 */
export const Empty: Story = {
  args: { rows: [], emptyText: '등록된 공지사항이 없습니다.' },
};

/** .scroll — 열이 많아 PC에서도 가로 스크롤. 영역에 포커스 후 방향키로 스크롤 */
export const Scroll: Story = {
  render: () => ({
    components: { Table },
    setup: () => {
      const columns = Array.from({ length: 10 }, (_, i) => ({
        key: `c${i}`,
        label: `항목 ${i + 1}`,
        width: '16rem',
        rowHeader: i === 0,
      }));
      const rows = Array.from({ length: 3 }, (_, r) =>
        Object.fromEntries(
          columns.map((c, i) => [c.key, `${r + 1}행 ${i + 1}열`])
        )
      );
      return { columns, rows };
    },
    template: `
      <div style="max-width:720px">
        <Table caption="열이 많은 통계 표" :columns="columns" :rows="rows" scroll />
      </div>
    `,
  }),
};

/** KRDS 고대비 모드 (툴바 모드 스위치와 같은 data-krds-mode) */
export const HighContrast: Story = {
  globals: { krdsMode: 'high-contrast' },
};

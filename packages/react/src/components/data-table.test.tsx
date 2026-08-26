import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ColumnDef } from '@tanstack/react-table';
import { axe } from '../test/setup';
import { DataTable, SortableHeader } from './data-table';

type Row = { id: number; name: string; role: string };

const DATA: Row[] = [
  { id: 1, name: '김하나', role: '관리자' },
  { id: 2, name: '이두리', role: '편집자' },
  { id: 3, name: '박세찌', role: '뷰어' },
];

const COLUMNS: ColumnDef<Row, unknown>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <SortableHeader column={column}>이름</SortableHeader>
    ),
  },
  { accessorKey: 'role', header: '역할' },
];

describe('DataTable', () => {
  it('데이터가 행으로 렌더링되어야 합니다', () => {
    render(<DataTable columns={COLUMNS} data={DATA} caption="사용자 목록" />);
    expect(screen.getByText('김하나')).toBeInTheDocument();
    expect(screen.getByText('박세찌')).toBeInTheDocument();
  });

  it('caption이 표의 접근명이 되어야 합니다', () => {
    render(<DataTable columns={COLUMNS} data={DATA} caption="사용자 목록" />);
    expect(
      screen.getByRole('table', { name: '사용자 목록' })
    ).toBeInTheDocument();
  });

  it('헤더 셀에 scope="col"이 있어야 합니다', () => {
    render(<DataTable columns={COLUMNS} data={DATA} caption="사용자 목록" />);
    screen
      .getAllByRole('columnheader')
      .forEach((th) => expect(th).toHaveAttribute('scope', 'col'));
  });

  it('데이터가 없으면 빈 메시지를 보여줘야 합니다', () => {
    render(
      <DataTable
        columns={COLUMNS}
        data={[]}
        caption="사용자 목록"
        emptyMessage="사용자가 없습니다."
      />
    );
    expect(screen.getByText('사용자가 없습니다.')).toBeInTheDocument();
  });

  it('로딩 중에는 로딩 표시가 나와야 합니다', () => {
    render(
      <DataTable columns={COLUMNS} data={DATA} caption="사용자 목록" loading />
    );
    expect(screen.getByText('로딩 중...')).toBeInTheDocument();
  });

  it('정렬 상태가 aria-sort로 전달되어야 합니다', async () => {
    const user = userEvent.setup();
    render(<DataTable columns={COLUMNS} data={DATA} caption="사용자 목록" />);

    const nameHeader = screen.getByRole('columnheader', { name: /이름/ });
    // 정렬 가능한 컬럼은 정렬 전에도 aria-sort="none"이어야 한다
    expect(nameHeader).toHaveAttribute('aria-sort', 'none');

    await user.click(screen.getByRole('button', { name: '이름' }));
    expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');

    await user.click(screen.getByRole('button', { name: '이름' }));
    expect(nameHeader).toHaveAttribute('aria-sort', 'descending');
  });

  it('enableSorting: false 컬럼에는 aria-sort가 없어야 합니다', () => {
    // TanStack Table은 accessor 컬럼의 정렬을 기본 활성화한다.
    // 정렬 대상이 아님을 나타내는 계약은 enableSorting: false 이다.
    const cols: ColumnDef<Row, unknown>[] = [
      { accessorKey: 'name', header: '이름' },
      { accessorKey: 'role', header: '역할', enableSorting: false },
    ];
    render(<DataTable columns={cols} data={DATA} caption="사용자 목록" />);

    expect(screen.getByRole('columnheader', { name: '이름' })).toHaveAttribute(
      'aria-sort',
      'none'
    );
    expect(
      screen.getByRole('columnheader', { name: '역할' })
    ).not.toHaveAttribute('aria-sort');
  });

  it('정렬 아이콘은 보조기기에 노출되지 않아야 합니다', () => {
    const { container } = render(
      <DataTable columns={COLUMNS} data={DATA} caption="사용자 목록" />
    );
    container
      .querySelectorAll('th svg')
      .forEach((svg) => expect(svg).toHaveAttribute('aria-hidden', 'true'));
  });

  it('전역 검색으로 행을 걸러낼 수 있어야 합니다', async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        columns={COLUMNS}
        data={DATA}
        caption="사용자 목록"
        enableGlobalFilter
      />
    );

    await user.type(
      screen.getByRole('textbox', { name: '테이블 검색' }),
      '김하나'
    );
    expect(screen.getByText('김하나')).toBeInTheDocument();
    expect(screen.queryByText('박세찌')).toBeNull();
  });

  it('행 선택 체크박스에 접근명이 있어야 합니다', () => {
    render(
      <DataTable
        columns={COLUMNS}
        data={DATA}
        caption="사용자 목록"
        enableRowSelection
      />
    );
    expect(
      screen.getByRole('checkbox', { name: '전체 선택' })
    ).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox', { name: '행 선택' })).toHaveLength(
      3
    );
  });

  it('행을 선택하면 콜백이 호출되어야 합니다', async () => {
    const user = userEvent.setup();
    const onRowSelectionChange = vi.fn();
    render(
      <DataTable
        columns={COLUMNS}
        data={DATA}
        caption="사용자 목록"
        enableRowSelection
        onRowSelectionChange={onRowSelectionChange}
      />
    );

    await user.click(screen.getAllByRole('checkbox', { name: '행 선택' })[0]);
    expect(onRowSelectionChange).toHaveBeenCalledWith([DATA[0]]);
  });

  it('페이지네이션 버튼에 접근명이 있어야 합니다', () => {
    render(
      <DataTable
        columns={COLUMNS}
        data={DATA}
        caption="사용자 목록"
        enablePagination
      />
    );
    ['첫 페이지', '이전 페이지', '다음 페이지', '마지막 페이지'].forEach(
      (name) => expect(screen.getByRole('button', { name })).toBeInTheDocument()
    );
  });

  it('기본 상태에서 접근성 위반이 없어야 합니다', async () => {
    const { container } = render(
      <DataTable columns={COLUMNS} data={DATA} caption="사용자 목록" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('선택·검색·페이지네이션을 모두 켜도 접근성 위반이 없어야 합니다', async () => {
    const { container } = render(
      <DataTable
        columns={COLUMNS}
        data={DATA}
        caption="사용자 목록"
        enableRowSelection
        enableGlobalFilter
        enablePagination
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

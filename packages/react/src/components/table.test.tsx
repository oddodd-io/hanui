import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from '../test/setup';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from './table';

const BasicTable = () => (
  <Table>
    <TableCaption>최근 게시글 목록</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead>제목</TableHead>
        <TableHead>작성자</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>공지사항</TableCell>
        <TableCell>홍길동</TableCell>
      </TableRow>
    </TableBody>
  </Table>
);

describe('Table', () => {
  it('table role로 렌더링되어야 합니다', () => {
    render(<BasicTable />);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('caption이 표의 접근명이 되어야 합니다', () => {
    render(<BasicTable />);
    expect(
      screen.getByRole('table', { name: '최근 게시글 목록' })
    ).toBeInTheDocument();
  });

  it('셀 내용이 렌더링되어야 합니다', () => {
    render(<BasicTable />);
    expect(screen.getByText('공지사항')).toBeInTheDocument();
    expect(screen.getByText('홍길동')).toBeInTheDocument();
  });

  it('추가 className이 병합되어야 합니다', () => {
    render(
      <Table className="custom-table">
        <TableBody>
          <TableRow>
            <TableCell>셀</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(screen.getByRole('table')).toHaveClass('custom-table');
  });

  it('접근성 위반이 없어야 합니다', async () => {
    const { container } = render(<BasicTable />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('TableHead', () => {
  it('기본으로 scope="col"이 적용되어야 합니다', () => {
    render(<BasicTable />);
    // scope 없이는 어떤 셀에 적용되는 헤더인지 전달되지 않는다 (WCAG 1.3.1)
    screen
      .getAllByRole('columnheader')
      .forEach((th) => expect(th).toHaveAttribute('scope', 'col'));
  });

  it('scope를 직접 지정할 수 있어야 합니다', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableHead scope="row">행 제목</TableHead>
            <TableCell>값</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(screen.getByRole('rowheader')).toHaveAttribute('scope', 'row');
  });

  it('정렬 가능한 헤더는 키보드로 조작할 수 있어야 합니다', async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable onSort={onSort}>
              제목
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );

    // th의 onClick만으로는 키보드 사용자가 정렬할 수 없다 (WCAG 2.1.1)
    const button = screen.getByRole('button', { name: /제목/ });
    await user.tab();
    expect(button).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(onSort).toHaveBeenCalledTimes(1);

    await user.keyboard(' ');
    expect(onSort).toHaveBeenCalledTimes(2);
  });

  it('정렬 상태가 aria-sort로 전달되어야 합니다', () => {
    const { rerender } = render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable sortDirection={null}>
              제목
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
    expect(screen.getByRole('columnheader')).toHaveAttribute(
      'aria-sort',
      'none'
    );

    rerender(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable sortDirection="asc">
              제목
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
    expect(screen.getByRole('columnheader')).toHaveAttribute(
      'aria-sort',
      'ascending'
    );

    rerender(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable sortDirection="desc">
              제목
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
    expect(screen.getByRole('columnheader')).toHaveAttribute(
      'aria-sort',
      'descending'
    );
  });

  it('정렬 불가능한 헤더에는 aria-sort가 없어야 합니다', () => {
    render(<BasicTable />);
    screen
      .getAllByRole('columnheader')
      .forEach((th) => expect(th).not.toHaveAttribute('aria-sort'));
  });

  it('정렬 화살표는 보조기기에 노출되지 않아야 합니다', () => {
    const { container } = render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable sortDirection="asc">
              제목
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
    svgs.forEach((svg) =>
      expect(svg).toHaveAttribute('aria-hidden', 'true')
    );
  });

  it('정렬 버튼의 접근명은 헤더 텍스트여야 합니다', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable sortDirection="asc">
              작성일
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
    expect(
      screen.getByRole('button', { name: '작성일' })
    ).toBeInTheDocument();
  });

  it('정렬 가능한 표도 접근성 위반이 없어야 합니다', async () => {
    const { container } = render(
      <Table>
        <TableCaption>정렬 가능한 목록</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead sortable sortDirection="asc" onSort={() => {}}>
              제목
            </TableHead>
            <TableHead sortable sortDirection={null} onSort={() => {}}>
              작성일
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>공지사항</TableCell>
            <TableCell>2026-08-26</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

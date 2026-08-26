'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  RowSelectionState,
  PaginationState,
} from '@tanstack/react-table';
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';
import { Button } from './button';
import { Checkbox } from './checkbox';
import { Input } from './input';

// ============================================================================
// Types
// ============================================================================

export interface DataTableProps<TData, TValue> {
  /** Column definitions */
  columns: ColumnDef<TData, TValue>[];
  /** Data array */
  data: TData[];
  /** Enable row selection */
  enableRowSelection?: boolean;
  /** Enable global filter (search) */
  enableGlobalFilter?: boolean;
  /** Enable pagination */
  enablePagination?: boolean;
  /** Page size options */
  pageSizeOptions?: number[];
  /** Default page size */
  defaultPageSize?: number;
  /** Empty state message */
  emptyMessage?: string;
  /** Global filter placeholder */
  filterPlaceholder?: string;
  /** Additional className for table container */
  className?: string;
  /** Callback when row selection changes */
  onRowSelectionChange?: (selectedRows: TData[]) => void;
  /** Loading state */
  loading?: boolean;
  /** Table caption for accessibility */
  caption?: string;
}

// ============================================================================
// Sorting Header Helper
// ============================================================================

interface SortableHeaderProps {
  column: {
    getIsSorted: () => false | 'asc' | 'desc';
    toggleSorting: (desc?: boolean) => void;
  };
  children: React.ReactNode;
  className?: string;
}

/**
 * SortableHeader - 정렬 가능한 컬럼 헤더 헬퍼
 */
export function SortableHeader({
  column,
  children,
  className,
}: SortableHeaderProps) {
  const sorted = column.getIsSorted();

  return (
    <button
      type="button"
      className={cn(
        'flex items-center gap-1 -ml-2 px-2 py-1 rounded',
        'hover:bg-krds-primary-5 transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-krds-func-info',
        className
      )}
      onClick={() => column.toggleSorting(sorted === 'asc')}
    >
      <span>{children}</span>
      {sorted === 'asc' ? (
        <ChevronUp className="h-4 w-4" aria-hidden="true" />
      ) : sorted === 'desc' ? (
        <ChevronDown className="h-4 w-4" aria-hidden="true" />
      ) : (
        <ChevronsUpDown
          className="h-4 w-4 text-krds-gray-40"
          aria-hidden="true"
        />
      )}
    </button>
  );
}

// ============================================================================
// Selection Column Helper
// ============================================================================

/**
 * getSelectionColumn - 체크박스 선택 컬럼 생성 헬퍼
 */
export function getSelectionColumn<TData>(): ColumnDef<TData, unknown> {
  return {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="전체 선택"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="행 선택"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  };
}

// ============================================================================
// DataTable Component
// ============================================================================

/**
 * DataTable 컴포넌트
 *
 * TanStack Table 기반의 KRDS 스타일 데이터 테이블
 *
 * 기능:
 * - 컬럼별 정렬
 * - 전역 검색 필터
 * - 페이지네이션
 * - 행 선택 (체크박스)
 * - 반응형 지원
 *
 * @example
 * ```tsx
 * const columns: ColumnDef<User>[] = [
 *   {
 *     accessorKey: 'name',
 *     header: ({ column }) => <SortableHeader column={column}>이름</SortableHeader>,
 *   },
 *   {
 *     accessorKey: 'email',
 *     header: '이메일',
 *   },
 * ];
 *
 * <DataTable
 *   columns={columns}
 *   data={users}
 *   enablePagination
 *   enableGlobalFilter
 * />
 * ```
 */
export function DataTable<TData, TValue>({
  columns,
  data,
  enableRowSelection = false,
  enableGlobalFilter = false,
  enablePagination = false,
  pageSizeOptions = [10, 20, 30, 50],
  defaultPageSize = 10,
  emptyMessage = '데이터가 없습니다.',
  filterPlaceholder = '검색...',
  className,
  onRowSelectionChange,
  loading = false,
  caption,
}: DataTableProps<TData, TValue>) {
  // State
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });

  // Prepend selection column if enabled
  const tableColumns = React.useMemo(() => {
    if (enableRowSelection) {
      return [getSelectionColumn<TData>(), ...columns];
    }
    return columns;
  }, [columns, enableRowSelection]);

  // Table instance
  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: enablePagination
      ? getPaginationRowModel()
      : undefined,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      pagination,
    },
  });

  // Notify parent about selection changes
  React.useEffect(() => {
    if (onRowSelectionChange) {
      const selectedRows = table
        .getFilteredSelectedRowModel()
        .rows.map((row) => row.original);
      onRowSelectionChange(selectedRows);
    }
  }, [rowSelection, table, onRowSelectionChange]);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Global Filter */}
      {enableGlobalFilter && (
        <div className="flex items-center gap-4">
          <Input
            placeholder={filterPlaceholder}
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
            aria-label="테이블 검색"
          />
          {enableRowSelection && Object.keys(rowSelection).length > 0 && (
            <span className="text-sm text-krds-gray-60">
              {Object.keys(rowSelection).length}개 선택됨
            </span>
          )}
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border border-krds-gray-20 overflow-hidden">
        <Table>
          {caption && <caption className="sr-only">{caption}</caption>}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const align = (
                    header.column.columnDef.meta as
                      | { align?: 'left' | 'center' | 'right' }
                      | undefined
                  )?.align;
                  const sorted = header.column.getIsSorted();
                  return (
                    <TableHead
                      key={header.id}
                      align={align}
                      aria-sort={
                        header.column.getCanSort()
                          ? sorted === 'asc'
                            ? 'ascending'
                            : sorted === 'desc'
                              ? 'descending'
                              : 'none'
                          : undefined
                      }
                      style={{
                        width:
                          header.getSize() !== 150
                            ? header.getSize()
                            : undefined,
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={tableColumns.length}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-krds-primary-base border-t-transparent" />
                    <span className="text-krds-gray-60">로딩 중...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => {
                    const align = (
                      cell.column.columnDef.meta as
                        | { align?: 'left' | 'center' | 'right' }
                        | undefined
                    )?.align;
                    return (
                      <TableCell key={cell.id} align={align}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={tableColumns.length}
                  className="h-24 text-center text-krds-gray-60"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {enablePagination && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-krds-gray-60">
            <span>페이지당</span>
            <select
              value={pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              className="h-8 rounded border border-krds-gray-20 bg-white px-2 text-sm focus:outline-none focus:ring-2 focus:ring-krds-func-info"
              aria-label="페이지당 행 수"
            >
              {pageSizeOptions.map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
            <span>행</span>
            <span className="ml-4">
              총 {table.getFilteredRowModel().rows.length}개 중{' '}
              {pagination.pageIndex * pagination.pageSize + 1}-
              {Math.min(
                (pagination.pageIndex + 1) * pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              aria-label="첫 페이지"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="이전 페이지"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-2 text-sm">
              {pagination.pageIndex + 1} / {table.getPageCount() || 1}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label="다음 페이지"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              aria-label="마지막 페이지"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Re-export useful types
export type { ColumnDef, SortingState, ColumnFiltersState };

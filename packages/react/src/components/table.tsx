'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Table Props
 */
export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  className?: string;
  children: React.ReactNode;
  /**
   * Apply small text size to the table
   */
  small?: boolean;
}

/**
 * TableHeader Props
 */
export interface TableHeaderProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string;
  children: React.ReactNode;
}

/**
 * TableBody Props
 */
export interface TableBodyProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string;
  children: React.ReactNode;
}

/**
 * TableFooter Props
 */
export interface TableFooterProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string;
  children: React.ReactNode;
}

/**
 * TableRow Props
 */
export interface TableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement> {
  className?: string;
  children: React.ReactNode;
}

/**
 * TableHead Props
 */
export interface TableHeadProps
  extends React.ThHTMLAttributes<HTMLTableCellElement> {
  className?: string;
  children: React.ReactNode;
  /**
   * Text alignment
   * @default 'left'
   */
  align?: 'left' | 'center' | 'right';
  /**
   * Enable sortable functionality
   */
  sortable?: boolean;
  /**
   * Current sort direction
   */
  sortDirection?: 'asc' | 'desc' | null;
  /**
   * Sort click handler
   */
  onSort?: () => void;
  /**
   * 헤더 셀의 적용 범위 (WCAG 1.3.1)
   * @default 'col'
   */
  scope?: 'col' | 'row' | 'colgroup' | 'rowgroup';
}

/**
 * TableCell Props
 */
export interface TableCellProps
  extends React.TdHTMLAttributes<HTMLTableCellElement> {
  className?: string;
  children: React.ReactNode;
  /**
   * Text alignment
   * @default 'left'
   */
  align?: 'left' | 'center' | 'right';
  /**
   * Apply small text size to the cell
   */
  small?: boolean;
}

/**
 * TableCaption Props
 */
export interface TableCaptionProps
  extends React.HTMLAttributes<HTMLTableCaptionElement> {
  className?: string;
  children: React.ReactNode;
}

/**
 * Table Component
 *
 * KRDS-compliant table with semantic structure and accessibility
 *
 * @example
 * ```tsx
 * <Table>
 *   <TableCaption>A list of recent invoices</TableCaption>
 *   <TableHeader>
 *     <TableRow>
 *       <TableHead>Invoice</TableHead>
 *       <TableHead>Status</TableHead>
 *       <TableHead>Amount</TableHead>
 *     </TableRow>
 *   </TableHeader>
 *   <TableBody>
 *     <TableRow>
 *       <TableCell>INV001</TableCell>
 *       <TableCell>Paid</TableCell>
 *       <TableCell>$250.00</TableCell>
 *     </TableRow>
 *   </TableBody>
 * </Table>
 * ```
 */
export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, children, small, ...props }, ref) => {
    return (
      <div className="relative w-full overflow-auto">
        <table
          ref={ref}
          className={cn(
            'w-full caption-bottom border-collapse border-b border-krds-gray-20',
            small && 'text-sm',
            className
          )}
          {...props}
        >
          {children}
        </table>
      </div>
    );
  }
);

Table.displayName = 'Table';

/**
 * TableHeader 컴포넌트
 */
export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  TableHeaderProps
>(({ className, children, ...props }, ref) => {
  return (
    <thead
      ref={ref}
      className={cn(
        'bg-krds-primary-5',
        '[&_tr]:border-b [&_tr]:border-krds-gray-20',
        className
      )}
      {...props}
    >
      {children}
    </thead>
  );
});

TableHeader.displayName = 'TableHeader';

/**
 * TableBody 컴포넌트
 */
export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  TableBodyProps
>(({ className, children, ...props }, ref) => {
  return (
    <tbody
      ref={ref}
      className={cn(
        '[&_tr:last-child]:border-0',
        '[&_tr]:border-b [&_tr]:border-krds-gray-20',
        className
      )}
      {...props}
    >
      {children}
    </tbody>
  );
});

TableBody.displayName = 'TableBody';

/**
 * TableFooter 컴포넌트
 */
export const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  TableFooterProps
>(({ className, children, ...props }, ref) => {
  return (
    <tfoot
      ref={ref}
      className={cn(
        'bg-krds-primary-5',
        'border-t border-krds-gray-20',
        'font-medium',
        '[&>tr]:last:border-b-0',
        className
      )}
      {...props}
    >
      {children}
    </tfoot>
  );
});

TableFooter.displayName = 'TableFooter';

/**
 * TableRow 컴포넌트
 */
export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <tr
        ref={ref}
        className={cn(
          'transition-colors',
          'hover:bg-krds-primary-5',
          'data-[state=selected]:bg-krds-primary-5',
          className
        )}
        {...props}
      >
        {children}
      </tr>
    );
  }
);

TableRow.displayName = 'TableRow';

const alignmentClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

/**
 * TableHead 컴포넌트
 */
export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  (
    {
      className,
      children,
      align = 'left',
      sortable,
      sortDirection,
      onSort,
      scope = 'col',
      ...props
    },
    ref
  ) => {
    // aria-sort로 현재 정렬 상태를 보조기기에 전달한다 (WCAG 1.3.1)
    const ariaSort = sortable
      ? sortDirection === 'asc'
        ? 'ascending'
        : sortDirection === 'desc'
          ? 'descending'
          : 'none'
      : undefined;

    const content = (
      <>
        <span>{children}</span>
        {sortable && (
          <span className="ml-2 inline-flex flex-col">
            <svg
              className={cn(
                'h-3 w-3 -mb-1',
                sortDirection === 'asc'
                  ? 'text-krds-gray-90'
                  : 'text-krds-gray-40'
              )}
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" />
            </svg>
            <svg
              className={cn(
                'h-3 w-3 -mt-1',
                sortDirection === 'desc'
                  ? 'text-krds-gray-90'
                  : 'text-krds-gray-40'
              )}
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" />
            </svg>
          </span>
        )}
      </>
    );

    return (
      <th
        ref={ref}
        scope={scope}
        aria-sort={ariaSort}
        className={cn(
          'align-middle text-[15px] font-bold text-krds-gray-95',
          // 정렬 가능할 때는 내부 버튼이 패딩을 갖는다
          sortable ? 'p-0' : 'px-4 py-2',
          alignmentClasses[align],
          '[&:has([role=checkbox])]:pr-0',
          className
        )}
        {...props}
      >
        {sortable ? (
          // th에 onClick만 두면 키보드로 정렬할 수 없다 (WCAG 2.1.1).
          // 실제 조작은 네이티브 button이 담당한다.
          <button
            type="button"
            onClick={onSort}
            className={cn(
              'flex w-full items-center px-4 py-2 select-none',
              'cursor-pointer hover:bg-krds-primary-5',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-krds-primary-60 focus-visible:ring-inset',
              align === 'center' && 'justify-center',
              align === 'right' && 'justify-end'
            )}
          >
            {content}
          </button>
        ) : (
          children
        )}
      </th>
    );
  }
);

TableHead.displayName = 'TableHead';

/**
 * TableCell 컴포넌트
 */
export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, children, align = 'left', small, ...props }, ref) => {
    return (
      <td
        ref={ref}
        className={cn(
          'py-2 px-4 align-middle text-krds-gray-70',
          alignmentClasses[align],
          '[&:has([role=checkbox])]:pr-0',
          small && 'text-sm',
          className
        )}
        {...props}
      >
        {children}
      </td>
    );
  }
);

TableCell.displayName = 'TableCell';

/**
 * TableCaption 컴포넌트
 */
export const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  TableCaptionProps
>(({ className, children, ...props }, ref) => {
  return (
    <caption
      ref={ref}
      className={cn('mt-4 text-krds-gray-60', className)}
      {...props}
    >
      {children}
    </caption>
  );
});

TableCaption.displayName = 'TableCaption';

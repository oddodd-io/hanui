'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type GridAutoFlow = 'row' | 'column' | 'dense' | 'row dense' | 'column dense';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  templateColumns?: string;
  templateRows?: string;
  templateAreas?: string;
  gap?: string | number;
  rowGap?: string | number;
  columnGap?: string | number;
  autoFlow?: GridAutoFlow;
  autoRows?: string;
  autoColumns?: string;
  inline?: boolean;
  children: React.ReactNode;
  className?: string;
}

export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  colSpan?: number | 'auto';
  rowSpan?: number | 'auto';
  colStart?: number | 'auto';
  colEnd?: number | 'auto';
  rowStart?: number | 'auto';
  rowEnd?: number | 'auto';
  area?: string;
  children: React.ReactNode;
  className?: string;
}

const autoFlowMap: Record<GridAutoFlow, string> = {
  row: 'grid-flow-row',
  column: 'grid-flow-col',
  dense: 'grid-flow-dense',
  'row dense': 'grid-flow-row-dense',
  'column dense': 'grid-flow-col-dense',
};

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  (
    {
      templateColumns,
      templateRows,
      templateAreas,
      gap,
      rowGap,
      columnGap,
      autoFlow,
      autoRows,
      autoColumns,
      inline = false,
      children,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const baseClass = inline ? 'inline-grid' : 'grid';
    const autoFlowClass = autoFlow ? autoFlowMap[autoFlow] : '';

    const gapClass = gap
      ? typeof gap === 'number'
        ? `gap-[${gap}px]`
        : `gap-${gap}`
      : '';

    const rowGapClass = rowGap
      ? typeof rowGap === 'number'
        ? `gap-y-[${rowGap}px]`
        : `gap-y-${rowGap}`
      : '';

    const columnGapClass = columnGap
      ? typeof columnGap === 'number'
        ? `gap-x-[${columnGap}px]`
        : `gap-x-${columnGap}`
      : '';

    const gridStyle: React.CSSProperties = {
      ...style,
      ...(templateColumns && { gridTemplateColumns: templateColumns }),
      ...(templateRows && { gridTemplateRows: templateRows }),
      ...(templateAreas && { gridTemplateAreas: templateAreas }),
      ...(autoRows && { gridAutoRows: autoRows }),
      ...(autoColumns && { gridAutoColumns: autoColumns }),
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseClass,
          autoFlowClass,
          gapClass,
          rowGapClass,
          columnGapClass,
          className
        )}
        style={gridStyle}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Grid.displayName = 'Grid';

export const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  (
    {
      colSpan,
      rowSpan,
      colStart,
      colEnd,
      rowStart,
      rowEnd,
      area,
      children,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const colSpanClass =
      colSpan === 'auto' ? 'col-auto' : colSpan ? `col-span-${colSpan}` : '';

    const rowSpanClass =
      rowSpan === 'auto' ? 'row-auto' : rowSpan ? `row-span-${rowSpan}` : '';

    const gridItemStyle: React.CSSProperties = {
      ...style,
      ...(colStart && { gridColumnStart: colStart }),
      ...(colEnd && { gridColumnEnd: colEnd }),
      ...(rowStart && { gridRowStart: rowStart }),
      ...(rowEnd && { gridRowEnd: rowEnd }),
      ...(area && { gridArea: area }),
    };

    return (
      <div
        ref={ref}
        className={cn(colSpanClass, rowSpanClass, className)}
        style={gridItemStyle}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GridItem.displayName = 'GridItem';

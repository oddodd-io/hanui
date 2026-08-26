'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
type FlexAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
type FlexJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: FlexDirection;
  align?: FlexAlign;
  justify?: FlexJustify;
  wrap?: FlexWrap;
  gap?: string | number;
  inline?: boolean;
  children: React.ReactNode;
  className?: string;
}

const directionMap: Record<FlexDirection, string> = {
  row: 'flex-row',
  column: 'flex-col',
  'row-reverse': 'flex-row-reverse',
  'column-reverse': 'flex-col-reverse',
};

const alignMap: Record<FlexAlign, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
};

const justifyMap: Record<FlexJustify, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

const wrapMap: Record<FlexWrap, string> = {
  nowrap: 'flex-nowrap',
  wrap: 'flex-wrap',
  'wrap-reverse': 'flex-wrap-reverse',
};

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      direction = 'row',
      align,
      justify,
      wrap = 'nowrap',
      gap,
      inline = false,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const baseClass = inline ? 'inline-flex' : 'flex';
    const directionClass = directionMap[direction];
    const alignClass = align ? alignMap[align] : '';
    const justifyClass = justify ? justifyMap[justify] : '';
    const wrapClass = wrapMap[wrap];
    const gapClass = gap
      ? typeof gap === 'number'
        ? `gap-[${gap}px]`
        : `gap-${gap}`
      : '';

    return (
      <div
        ref={ref}
        className={cn(
          baseClass,
          directionClass,
          alignClass,
          justifyClass,
          wrapClass,
          gapClass,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Flex.displayName = 'Flex';

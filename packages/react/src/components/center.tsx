'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface CenterProps extends React.HTMLAttributes<HTMLDivElement> {
  inline?: boolean;
  children: React.ReactNode;
  className?: string;
}

export interface CircleProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: string | number;
  children?: React.ReactNode;
  className?: string;
}

export interface SquareProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: string | number;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Center - 자식 요소를 수평 및 수직 중앙에 배치하는 컴포넌트
 */
export const Center = React.forwardRef<HTMLDivElement, CenterProps>(
  ({ inline = false, children, className, ...props }, ref) => {
    const baseClass = inline ? 'inline-flex' : 'flex';

    return (
      <div
        ref={ref}
        className={cn(baseClass, 'items-center', 'justify-center', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Center.displayName = 'Center';

/**
 * Circle - 원형 컨테이너 컴포넌트 (중앙 정렬 포함)
 */
export const Circle = React.forwardRef<HTMLDivElement, CircleProps>(
  ({ size, children, className, style, ...props }, ref) => {
    const sizeValue = typeof size === 'number' ? `${size}px` : size;

    const circleStyle: React.CSSProperties = {
      ...style,
      ...(sizeValue && {
        width: sizeValue,
        height: sizeValue,
      }),
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          'items-center',
          'justify-center',
          'rounded-full',
          className
        )}
        style={circleStyle}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Circle.displayName = 'Circle';

/**
 * Square - 정사각형 컨테이너 컴포넌트 (중앙 정렬 포함)
 */
export const Square = React.forwardRef<HTMLDivElement, SquareProps>(
  ({ size, children, className, style, ...props }, ref) => {
    const sizeValue = typeof size === 'number' ? `${size}px` : size;

    const squareStyle: React.CSSProperties = {
      ...style,
      ...(sizeValue && {
        width: sizeValue,
        height: sizeValue,
      }),
    };

    return (
      <div
        ref={ref}
        className={cn('flex', 'items-center', 'justify-center', className)}
        style={squareStyle}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Square.displayName = 'Square';

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const maxWidthClasses = {
  // KRDS Breakpoints 기반 max-width 클래스 (CSS 변수 사용)
  xs: 'max-w-[var(--krds-container-xs,480px)]',
  sm: 'max-w-[var(--krds-container-sm,640px)]',
  md: 'max-w-[var(--krds-container-md,768px)]',
  lg: 'max-w-[var(--krds-container-lg,1024px)]',
  xl: 'max-w-[var(--krds-container-xl,1280px)]',
  '2xl': 'max-w-[var(--krds-container-2xl,1440px)]',
  full: 'max-w-full',
} as const;

export interface ContainerProps {
  // Container Props
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | false; // 최대 너비 (기본값: xl)
  disablePadding?: boolean; // 수평 패딩 제거 (기본값: false)
  as?: 'div' | 'section' | 'article' | 'main' | 'aside' | 'header' | 'footer'; // 렌더링할 HTML 요소 (기본값: div)
  children: React.ReactNode;
  className?: string;
}

export const Container = React.forwardRef<
  // KRDS 레이아웃 Container (반응형 max-width, 자동 센터링, 화면 여백)
  HTMLElement,
  ContainerProps & React.HTMLAttributes<HTMLElement>
>(
  (
    {
      maxWidth = 'xl',
      disablePadding = false,
      as: Component = 'div',
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <Component
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        className={cn(
          'mx-auto w-full', // 수평 센터링, 전체 너비
          maxWidth !== false && maxWidthClasses[maxWidth], // max-width 적용
          !disablePadding &&
            'px-[var(--krds-container-padding-mobile,1rem)] sm:px-[var(--krds-container-padding-tablet,1.5rem)] lg:px-[var(--krds-container-padding-desktop,2rem)]', // 화면 여백 (CSS 변수)
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Container.displayName = 'Container';

'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Section 변형 정의
 *
 * KRDS 패딩 레이아웃 의미론적 간격 (반응형 PC/Mobile)
 */
const sectionVariants = cva(['w-full'].join(' '), {
  variants: {
    /**
     * 패딩 - KRDS 기반 의미론적 패딩 값
     */
    padding: {
      // KRDS 카드 패딩 (반응형)
      'card-large': 'p-6 md:p-10', // 24px (모바일) / 40px (PC)
      'card-medium': 'p-6 md:p-8', // 24px (모바일) / 32px (PC)
      'card-small': 'p-5 md:p-6', // 20px (모바일) / 24px (PC)
      'card-xsmall': 'p-3 md:p-4', // 12px (모바일) / 16px (PC)

      // 페이지 섹션 (반응형)
      'page-section': 'px-4 py-10 md:px-6 md:py-16', // 16px/40px (모바일) / 24px/64px (PC)
      'content-area': 'px-4 py-8 md:px-6 md:py-12', // 16px/32px (모바일) / 24px/48px (PC)

      // 폼 섹션
      'form-section': 'p-6', // 24px
      'input-container': 'p-4', // 16px

      // 네비게이션/헤더 (반응형)
      header: 'px-4 py-4 md:px-6', // 16px (모바일) / 24px (PC)
      footer: 'px-4 py-10 md:px-6 md:py-16', // 16px/40px (모바일) / 24px/64px (PC)

      // 레거시 별칭 (하위 호환성)
      'card-sm': 'p-4', // 16px
      'card-md': 'p-6', // 24px
      'card-lg': 'p-8', // 32px

      // 일반 패딩 (폴백)
      xs: 'p-2', // 8px
      sm: 'p-3', // 12px
      md: 'p-4', // 16px
      lg: 'p-6', // 24px
      xl: 'p-8', // 32px
      '2xl': 'p-10', // 40px
      '3xl': 'p-16', // 64px

      // 패딩 없음
      none: 'p-0',
    },
    /**
     * 배경색 변형
     */
    background: {
      white: 'bg-krds-white',
      gray: 'bg-krds-gray-5',
      primary: 'bg-krds-primary-5',
      transparent: 'bg-transparent',
    },
  },
  defaultVariants: {
    padding: 'page-section',
    background: 'transparent',
  },
});

/**
 * Section Props 인터페이스
 */
export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  /**
   * 의미론적 패딩 프리셋 또는 일반 크기
   * @default "page-section"
   */
  padding?:
    | 'card-large'
    | 'card-medium'
    | 'card-small'
    | 'card-xsmall'
    | 'page-section'
    | 'content-area'
    | 'form-section'
    | 'input-container'
    | 'header'
    | 'footer'
    | 'card-sm'
    | 'card-md'
    | 'card-lg'
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | 'none';

  /**
   * 배경색 변형
   * @default "transparent"
   */
  background?: 'white' | 'gray' | 'primary' | 'transparent';

  /**
   * 렌더링할 HTML 요소
   * @default "section"
   */
  as?:
    | 'div'
    | 'section'
    | 'article'
    | 'main'
    | 'aside'
    | 'header'
    | 'footer'
    | 'nav';
}

/**
 * Section 컴포넌트
 *
 * KRDS 준수 패딩 컴포넌트 (의미론적 프리셋 제공)
 *
 * @example
 * ```tsx
 * // 페이지 섹션
 * <Section padding="page-section">
 *   <h1>페이지 제목</h1>
 *   <p>내용</p>
 * </Section>
 *
 * // 카드
 * <Section padding="card-md" background="white">
 *   <h3>카드 제목</h3>
 *   <p>카드 내용</p>
 * </Section>
 * ```
 */
export const Section = React.forwardRef<HTMLElement, SectionProps>(
  (
    {
      className,
      padding,
      background,
      as: Component = 'section',
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Component
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        className={cn(sectionVariants({ padding, background }), className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Section.displayName = 'Section';

/**
 * Export sectionVariants for extending
 */
export { sectionVariants };

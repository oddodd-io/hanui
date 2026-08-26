'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Label Variants Definition
 *
 * KRDS Typography - Label 스타일 (버튼/입력 필드 라벨)
 * - Large: 19px
 * - Medium: 17px
 * - Small: 15px
 * - Xsmall: 13px
 * - 가중치: Regular(400) 기본
 * - 줄 간격 150%
 * - 기본 색상: gray-90 (basic) - KRDS 명도 대비 4.5:1 준수
 */
const labelVariants = cva(
  // Base styles - KRDS 명도 대비 4.5:1 이상을 만족하는 기본 색상
  ['font-normal', 'text-krds-gray-90'].join(' '),
  {
    variants: {
      size: {
        lg: 'text-krds-body-lg',
        md: 'text-krds-body-md',
        sm: 'text-krds-body-sm',
        xs: 'text-krds-body-xs',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

/**
 * Label Component Props
 */
export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {
  /**
   * 라벨 크기
   * @default "md"
   */
  size?: 'lg' | 'md' | 'sm' | 'xs';

  /**
   * 연결할 input의 id
   */
  htmlFor?: string;

  /**
   * 텍스트 내용
   */
  children: React.ReactNode;
}

/**
 * Label Component
 *
 * KRDS 타이포그래피 - 폼 라벨
 * 입력 필드, 버튼, 체크박스 등의 라벨로 사용
 * htmlFor 속성으로 input과 연결하여 접근성 보장
 *
 * @example
 * ```tsx
 * <Label htmlFor="email">이메일</Label>
 * <input id="email" type="email" />
 *
 * <Label size="sm" htmlFor="agree">
 *   약관에 동의합니다
 * </Label>
 * ```
 */
export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, size = 'md', children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(labelVariants({ size }), className)}
        {...props}
      >
        {children}
      </label>
    );
  }
);

Label.displayName = 'Label';

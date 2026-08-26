'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { SquareArrowOutUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Link Variants 정의
 *
 * KRDS 색상 변수를 사용하여 일관된 테마 적용
 * - default: 검은색, hover: primary
 * - primary: Primary 파란색, hover: 더 진한 primary
 * - underline prop으로 밑줄 추가 가능
 */
const linkVariants = cva(
  [
    'inline-flex',
    'items-center',
    'gap-1',
    'font-medium',
    'transition-colors',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-offset-2',
    'disabled:pointer-events-none',
    'disabled:opacity-50',
  ].join(' '),
  {
    variants: {
      // 시각적 스타일
      variant: {
        default:
          '[color:var(--krds-color-light-gray-90)] hover:[color:var(--krds-color-light-primary-50)] active:text-krds-primary-60 focus-visible:ring-krds-gray-90',
        primary:
          '[color:var(--krds-color-light-primary-50)] hover:[color:var(--krds-color-light-primary-60)] active:text-krds-primary-70 focus-visible:ring-krds-primary-60',
      },
      // 크기 (폰트 사이즈)
      size: {
        sm: '[font-size:var(--krds-body-sm)]', // 13px
        md: '[font-size:var(--krds-body-md)]', // 15px
        lg: '[font-size:var(--krds-body-lg)]', // 17px
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

// Link Props 인터페이스
export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
  variant?: 'default' | 'primary'; // 시각적 스타일 (기본값: default)
  size?: 'sm' | 'md' | 'lg'; // 크기 (기본값: md)
  underline?: boolean; // 밑줄 표시 여부 (기본값: false)
  external?: boolean; // 외부 링크 여부 (true 시 새 탭 + 아이콘)
  className?: string; // 추가 CSS 클래스
}

/**
 * Link - KRDS 링크 컴포넌트
 *
 * @example
 * <Link href="/docs">기본 링크</Link>
 * <Link variant="primary" href="/about">Primary 링크</Link>
 * <Link underline href="/about">밑줄 링크</Link>
 * <Link href="https://example.com" external>외부 링크</Link>
 */
const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (
    { className, variant, size, underline, external, children, ...props },
    ref
  ) => {
    return (
      <a
        ref={ref}
        className={cn(
          linkVariants({ variant, size }),
          underline && 'underline underline-offset-4',
          className
        )}
        {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
        {...props}
      >
        {children}
        {external && (
          <>
            <SquareArrowOutUpRight
              className="inline-block ml-1"
              size={16}
              aria-hidden="true"
            />
            <span className="sr-only"> (새 창 열림)</span>
          </>
        )}
      </a>
    );
  }
);

Link.displayName = 'Link';

export { Link, linkVariants };

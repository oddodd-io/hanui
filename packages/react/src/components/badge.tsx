'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Badge 스타일 variants
 */
const badgeVariants = cva(
  'inline-flex items-center justify-center font-medium transition-colors',
  {
    variants: {
      variant: {
        gray: 'bg-krds-gray-5 text-krds-gray-90',
        primary: 'bg-krds-primary-5 text-krds-primary-70',
        secondary: 'bg-krds-gray-10 text-krds-gray-80',
        success: 'bg-krds-success-5 text-krds-success-base',
        warning: 'bg-krds-warning-5 text-krds-warning-60',
        error: 'bg-krds-danger-5 text-krds-danger-base',
        info: 'bg-krds-info-5 text-krds-info-base',
        'outline-gray':
          'border border-krds-gray-30 bg-transparent text-krds-gray-90',
        'outline-primary':
          'border border-krds-primary-base bg-transparent text-krds-primary-base',
        'outline-secondary':
          'border border-krds-gray-50 bg-transparent text-krds-gray-90',
        'outline-success':
          'border border-krds-success-base bg-transparent text-krds-success-base',
        'outline-warning':
          'border border-krds-warning-base bg-transparent text-krds-warning-base',
        'outline-error':
          'border border-krds-danger-base bg-transparent text-krds-danger-base',
        'outline-info':
          'border border-krds-info-base bg-transparent text-krds-info-base',
        // Solid variants
        'solid-gray': 'bg-krds-gray-60 text-white',
        'solid-primary': 'bg-krds-primary-base text-white',
        'solid-secondary': 'bg-krds-gray-50 text-white',
        'solid-success': 'bg-krds-success-base text-white',
        'solid-warning': 'bg-krds-warning-base text-krds-gray-90',
        'solid-error': 'bg-krds-danger-base text-white',
        'solid-info': 'bg-krds-info-base text-white',
      },
      size: {
        md: 'text-[15px] h-6 px-2 rounded-[4px]',
        lg: 'text-krds-body-md h-8 px-2.5 rounded-[4px]',
      },
      shape: {
        rounded: '',
        pill: 'rounded-full',
        square: 'rounded-none',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      shape: 'rounded',
    },
  }
);

/**
 * 숫자 뱃지 스타일
 */
const numberBadgeVariants = cva(
  'inline-flex items-center justify-center font-bold rounded-full min-w-[1.25rem] tabular-nums',
  {
    variants: {
      variant: {
        gray: 'bg-krds-gray-60 text-white',
        primary: 'bg-krds-primary-base text-white',
        secondary: 'bg-krds-gray-40 text-white',
        success: 'bg-krds-success-base text-white',
        warning: 'bg-krds-warning-base text-white',
        error: 'bg-krds-danger-base text-white',
        info: 'bg-krds-info-base text-white',
      },
      size: {
        md: 'text-[15px] h-5 px-2',
        lg: 'text-[15px] h-6 px-2',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

/**
 * 도트 뱃지 스타일
 */
const dotBadgeVariants = cva('rounded-full', {
  variants: {
    variant: {
      gray: 'bg-krds-gray-60',
      primary: 'bg-krds-primary-base',
      secondary: 'bg-krds-gray-40',
      success: 'bg-krds-success-base',
      warning: 'bg-krds-warning-base',
      error: 'bg-krds-danger-base',
      info: 'bg-krds-info-base',
    },
    size: {
      md: 'h-2 w-2',
      lg: 'h-2.5 w-2.5',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

// ============================================================================
// Badge
// ============================================================================

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** 아이콘 (왼쪽) */
  icon?: React.ReactNode;
  /** 아이콘 위치 */
  iconPosition?: 'left' | 'right';
}

/**
 * Badge 컴포넌트
 *
 * 상태, 카테고리, 라벨을 표시하는 작은 텍스트 컴포넌트입니다.
 *
 * @example
 * ```tsx
 * <Badge>기본</Badge>
 * <Badge variant="success">완료</Badge>
 * <Badge variant="error" shape="pill">오류</Badge>
 * ```
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant,
      size,
      shape,
      icon,
      iconPosition = 'left',
      children,
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size, shape }), className)}
        {...props}
      >
        {icon && iconPosition === 'left' && (
          <span className="mr-1 -ml-0.5" aria-hidden="true">
            {icon}
          </span>
        )}
        {children}
        {icon && iconPosition === 'right' && (
          <span className="ml-1 -mr-0.5" aria-hidden="true">
            {icon}
          </span>
        )}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

// ============================================================================
// NumberBadge
// ============================================================================

export interface NumberBadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'>,
    VariantProps<typeof numberBadgeVariants> {
  /** 표시할 숫자 */
  count: number;
  /** 최대 표시 숫자 (초과 시 max+ 표시) */
  max?: number;
  /** 0일 때도 표시할지 여부 */
  showZero?: boolean;
}

/**
 * NumberBadge 컴포넌트
 *
 * 알림 개수 등 숫자를 표시하는 뱃지입니다.
 *
 * @example
 * ```tsx
 * <NumberBadge count={5} />
 * <NumberBadge count={100} max={99} />
 * ```
 */
export const NumberBadge = React.forwardRef<HTMLSpanElement, NumberBadgeProps>(
  (
    { className, variant, size, count, max = 99, showZero = false, ...props },
    ref
  ) => {
    if (count === 0 && !showZero) {
      return null;
    }

    const displayValue = count > max ? `${max}+` : count.toString();

    return (
      <span
        ref={ref}
        className={cn(numberBadgeVariants({ variant, size }), className)}
        aria-label={`${count}개`}
        {...props}
      >
        {displayValue}
      </span>
    );
  }
);

NumberBadge.displayName = 'NumberBadge';

// ============================================================================
// DotBadge
// ============================================================================

export interface DotBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof dotBadgeVariants> {
  /** 표시 여부 */
  show?: boolean;
  /** 펄스 애니메이션 */
  pulse?: boolean;
}

/**
 * DotBadge 컴포넌트
 *
 * 새로운 알림이 있음을 표시하는 작은 점입니다.
 *
 * @example
 * ```tsx
 * <DotBadge />
 * <DotBadge variant="success" pulse />
 * ```
 */
export const DotBadge = React.forwardRef<HTMLSpanElement, DotBadgeProps>(
  ({ className, variant, size, show = true, pulse = false, ...props }, ref) => {
    if (!show) {
      return null;
    }

    return (
      <span
        ref={ref}
        className={cn(
          dotBadgeVariants({ variant, size }),
          pulse && 'animate-pulse',
          className
        )}
        aria-hidden="true"
        {...props}
      />
    );
  }
);

DotBadge.displayName = 'DotBadge';

// ============================================================================
// BadgeGroup (래퍼 컴포넌트)
// ============================================================================

export interface BadgeGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 아이콘이나 요소에 뱃지를 붙일 위치 */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const positionStyles = {
  'top-right': 'top-0 right-0 translate-x-1/2 -translate-y-1/2',
  'top-left': 'top-0 left-0 -translate-x-1/2 -translate-y-1/2',
  'bottom-right': 'bottom-0 right-0 translate-x-1/2 translate-y-1/2',
  'bottom-left': 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2',
};

/**
 * BadgeGroup 컴포넌트
 *
 * 아이콘이나 아바타에 뱃지를 오버레이할 때 사용합니다.
 *
 * @example
 * ```tsx
 * <BadgeGroup>
 *   <Avatar />
 *   <NumberBadge count={5} />
 * </BadgeGroup>
 * ```
 */
export const BadgeGroup = React.forwardRef<HTMLDivElement, BadgeGroupProps>(
  ({ className, position = 'top-right', children, ...props }, ref) => {
    const childArray = React.Children.toArray(children);
    const mainChild = childArray[0];
    const badgeChild = childArray[1];

    return (
      <div
        ref={ref}
        className={cn('relative inline-flex', className)}
        {...props}
      >
        {mainChild}
        {badgeChild && (
          <span className={cn('absolute z-10', positionStyles[position])}>
            {badgeChild}
          </span>
        )}
      </div>
    );
  }
);

BadgeGroup.displayName = 'BadgeGroup';

export { badgeVariants, numberBadgeVariants, dotBadgeVariants };

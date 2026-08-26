'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';
import { Check } from 'lucide-react';

// ============================================================================
// KRDS Tag 컴포넌트
// ============================================================================

/**
 * Tag 스타일 variants
 * KRDS 디자인 시스템 기반 - pill 형태
 */
const tagVariants = cva(
  [
    'inline-flex items-center justify-center gap-1',
    'rounded-full leading-none font-medium transition-colors',
  ],
  {
    variants: {
      variant: {
        // 기본 (filled)
        default: 'bg-krds-gray-10 text-krds-gray-90',
        primary: 'bg-krds-primary-5 text-krds-primary-60',
        secondary: 'bg-krds-gray-5 text-krds-gray-70',
        success: 'bg-krds-success-5 text-krds-success-base',
        warning: 'bg-krds-warning-5 text-krds-warning-60',
        error: 'bg-krds-danger-5 text-krds-danger-base',
        info: 'bg-krds-info-5 text-krds-info-base',
        // 아웃라인 (KRDS 기본 스타일)
        outline:
          'bg-white border border-krds-gray-20 text-krds-gray-90 hover:bg-krds-gray-5 hover:border-krds-gray-30',
        'outline-primary':
          'bg-white border border-krds-primary-30 text-krds-primary-60 hover:bg-krds-primary-5',
        'outline-secondary':
          'bg-white border border-krds-gray-30 text-krds-gray-70 hover:bg-krds-gray-5',
        'outline-success':
          'bg-white border border-krds-success-30 text-krds-success-base hover:bg-krds-success-5',
        'outline-warning':
          'bg-white border border-krds-warning-30 text-krds-warning-60 hover:bg-krds-warning-5',
        'outline-error':
          'bg-white border border-krds-danger-30 text-krds-danger-base hover:bg-krds-danger-5',
        'outline-info':
          'bg-white border border-krds-info-30 text-krds-info-base hover:bg-krds-info-5',
      },
      size: {
        sm: 'h-6 px-3 text-krds-label-xs',
        md: 'h-8 px-4 text-krds-label-sm',
        lg: 'h-10 px-5 text-krds-label-md',
      },
    },
    defaultVariants: {
      variant: 'outline',
      size: 'md',
    },
  }
);

// TagGroup variants
const tagGroupVariants = cva('flex flex-wrap', {
  variants: {
    size: {
      sm: 'gap-x-2 gap-y-3',
      md: 'gap-x-3 gap-y-3',
      lg: 'gap-x-3 gap-y-4',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

// 삭제 버튼 크기
const deleteButtonSizeMap = {
  sm: 'w-4 h-4',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

// ============================================================================
// Tag (기본 태그)
// ============================================================================

export interface TagProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {
  /** 아이콘 (왼쪽) */
  icon?: React.ReactNode;
}

/**
 * Tag 컴포넌트
 *
 * 콘텐츠 분류, 데이터 속성을 표시하는 기본 태그입니다.
 * 비대화형(non-interactive)으로 정보 표시에 사용됩니다.
 *
 * @example
 * ```tsx
 * <Tag>기본 태그</Tag>
 * <Tag variant="primary">Primary</Tag>
 * <Tag variant="outline" size="sm">작은 태그</Tag>
 * ```
 */
export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ className, variant, size, icon, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(tagVariants({ variant, size }), className)}
        {...props}
      >
        {icon && (
          <span className="flex-shrink-0" aria-hidden="true">
            {icon}
          </span>
        )}
        {children}
      </span>
    );
  }
);

Tag.displayName = 'Tag';

// ============================================================================
// SelectableTag (선택 가능한 태그)
// ============================================================================

export interface SelectableTagProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'>,
    VariantProps<typeof tagVariants> {
  /** 선택 상태 */
  selected?: boolean;
  /** 선택 상태 변경 핸들러 */
  onChange?: (selected: boolean) => void;
  /** 체크 아이콘 표시 여부 */
  showCheckIcon?: boolean;
}

/**
 * SelectableTag 컴포넌트
 *
 * 필터링/정렬 옵션으로 사용되는 선택 가능한 태그입니다.
 * 선택 시 체크 아이콘이 표시됩니다.
 *
 * @example
 * ```tsx
 * <SelectableTag selected={isSelected} onChange={setIsSelected}>
 *   선택 가능
 * </SelectableTag>
 * ```
 */
export const SelectableTag = React.forwardRef<
  HTMLButtonElement,
  SelectableTagProps
>(
  (
    {
      className,
      variant = 'outline',
      size,
      selected = false,
      onChange,
      showCheckIcon = true,
      children,
      ...props
    },
    ref
  ) => {
    const handleClick = () => {
      onChange?.(!selected);
    };

    return (
      <button
        ref={ref}
        type="button"
        role="checkbox"
        aria-checked={selected}
        onClick={handleClick}
        className={cn(
          tagVariants({ variant, size }),
          'cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-krds-primary-base focus-visible:ring-offset-1',
          selected &&
            'bg-krds-primary-5 border-krds-primary-base text-krds-primary-base',
          className
        )}
        {...props}
      >
        {showCheckIcon && selected && (
          <Check className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
        )}
        {children}
      </button>
    );
  }
);

SelectableTag.displayName = 'SelectableTag';

// ============================================================================
// RemovableTag (삭제 가능한 태그)
// ============================================================================

export interface RemovableTagProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'onRemove'>,
    VariantProps<typeof tagVariants> {
  /** 삭제 버튼 클릭 핸들러 */
  onRemove?: () => void;
  /** 삭제 버튼 aria-label */
  removeLabel?: string;
}

/**
 * RemovableTag 컴포넌트
 *
 * 삭제 버튼이 있는 태그입니다.
 * 필터링 옵션에서 선택된 조건을 삭제할 때 사용합니다.
 *
 * @example
 * ```tsx
 * <RemovableTag onRemove={() => handleRemove(id)}>
 *   삭제 가능한 태그
 * </RemovableTag>
 * ```
 */
export const RemovableTag = React.forwardRef<
  HTMLSpanElement,
  RemovableTagProps
>(
  (
    {
      className,
      variant = 'outline',
      size = 'md',
      onRemove,
      removeLabel = '삭제',
      children,
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={cn(tagVariants({ variant, size }), 'pr-2', className)}
        {...props}
      >
        <span className="truncate">{children}</span>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className={cn(
              'flex items-center justify-center shrink-0',
              'rounded-full transition-colors',
              'hover:bg-krds-gray-20',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-krds-primary-base focus-visible:ring-offset-1',
              deleteButtonSizeMap[size || 'md']
            )}
            aria-label={removeLabel}
          >
            <DeleteIcon className="w-3 h-3" />
          </button>
        )}
      </span>
    );
  }
);

RemovableTag.displayName = 'RemovableTag';

// ============================================================================
// TagLink (링크형 태그)
// ============================================================================

export interface TagLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof tagVariants> {}

/**
 * TagLink 컴포넌트
 *
 * 클릭 가능한 링크형 KRDS 태그입니다.
 * hover/active 시 밑줄이 표시됩니다.
 *
 * @example
 * ```tsx
 * <TagLink href="/category/react">React</TagLink>
 * <TagLink href="/category/vue" size="lg">Vue</TagLink>
 * ```
 */
export const TagLink = React.forwardRef<HTMLAnchorElement, TagLinkProps>(
  ({ className, variant = 'outline', size, children, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(
          tagVariants({ variant, size }),
          'cursor-pointer no-underline',
          'hover:underline active:underline',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-krds-primary-base focus-visible:ring-offset-1',
          className
        )}
        {...props}
      >
        {children}
      </a>
    );
  }
);

TagLink.displayName = 'TagLink';

// ============================================================================
// TagGroup (태그 그룹)
// ============================================================================

export interface TagGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tagGroupVariants> {
  /** 전체 삭제 버튼 표시 여부 */
  showClearAll?: boolean;
  /** 전체 삭제 버튼 텍스트 */
  clearAllText?: string;
  /** 전체 삭제 핸들러 */
  onClearAll?: () => void;
}

/**
 * TagGroup 컴포넌트
 *
 * 여러 태그를 그룹화하고 일괄 삭제 기능을 제공합니다.
 *
 * @example
 * ```tsx
 * <TagGroup onClearAll={handleClearAll} showClearAll>
 *   <RemovableTag onRemove={() => removeTag(1)}>태그1</RemovableTag>
 *   <RemovableTag onRemove={() => removeTag(2)}>태그2</RemovableTag>
 * </TagGroup>
 * ```
 */
export const TagGroup = React.forwardRef<HTMLDivElement, TagGroupProps>(
  (
    {
      className,
      size,
      showClearAll = false,
      clearAllText = '전체 삭제',
      onClearAll,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        role="group"
        className={cn(tagGroupVariants({ size }), className)}
        {...props}
      >
        {children}
        {showClearAll && onClearAll && (
          <button
            type="button"
            onClick={onClearAll}
            className={cn(
              'text-krds-label-sm text-krds-gray-60 underline',
              'hover:text-krds-gray-90 transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-krds-primary-base focus-visible:rounded'
            )}
          >
            {clearAllText}
          </button>
        )}
      </div>
    );
  }
);

TagGroup.displayName = 'TagGroup';

// ============================================================================
// DeleteIcon (X 아이콘)
// ============================================================================

const DeleteIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

// ============================================================================
// Export variants
// ============================================================================

export { tagVariants, tagGroupVariants };

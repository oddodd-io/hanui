'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle } from '@/components/card';

const quickActionsVariants = cva('', {
  variants: {
    layout: {
      grid: '',
      list: '',
      inline: '',
    },
    columns: {
      2: '',
      3: '',
      4: '',
    },
  },
  defaultVariants: {
    layout: 'grid',
    columns: 2,
  },
});

const actionButtonVariants = cva(
  'flex items-center gap-3 w-full text-left transition-all',
  {
    variants: {
      layout: {
        grid: 'flex-col p-4 rounded-lg border border-krds-gray-10 hover:border-krds-primary-30 hover:bg-krds-primary-5',
        list: 'p-3 rounded-lg hover:bg-krds-gray-5',
        inline: 'p-2',
      },
    },
    defaultVariants: {
      layout: 'grid',
    },
  }
);

export interface QuickAction {
  /** 고유 ID */
  id: string;
  /** 액션 이름 */
  label: string;
  /** 액션 설명 */
  description?: string;
  /** 아이콘 */
  icon?: React.ReactNode;
  /** 클릭 핸들러 */
  onClick?: () => void;
  /** 링크 URL */
  href?: string;
  /** 링크 target */
  target?: string;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 뱃지/알림 카운트 */
  badge?: number;
  /** 키보드 단축키 */
  shortcut?: string;
}

export interface QuickActionsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'onClick'>,
    VariantProps<typeof quickActionsVariants> {
  /** 섹션 제목 */
  title?: string;
  /** 액션 목록 */
  actions: QuickAction[];
  /** 카드 래퍼 사용 여부 */
  asCard?: boolean;
}

const ActionButton: React.FC<{
  action: QuickAction;
  layout: 'grid' | 'list' | 'inline';
}> = ({ action, layout }) => {
  const {
    label,
    description,
    icon,
    onClick,
    href,
    target,
    disabled,
    badge,
    shortcut,
  } = action;

  const content = (
    <>
      {icon && (
        <div
          className={cn(
            'flex-shrink-0 flex items-center justify-center',
            layout === 'grid'
              ? 'w-12 h-12 rounded-lg bg-krds-primary-5 text-krds-primary-base'
              : 'w-8 h-8 rounded-md bg-krds-gray-10 text-krds-gray-70'
          )}
          aria-hidden="true"
        >
          {icon}
        </div>
      )}
      <div
        className={cn(
          'flex-1 min-w-0',
          layout === 'grid' ? 'text-center' : 'text-left'
        )}
      >
        <span
          className={cn(
            'font-medium text-krds-gray-90',
            layout === 'grid' ? 'text-sm' : 'text-sm'
          )}
        >
          {label}
        </span>
        {description && layout !== 'inline' && (
          <p
            className={cn(
              'text-xs text-krds-gray-50 mt-0.5',
              layout === 'grid' ? 'line-clamp-2' : 'truncate'
            )}
          >
            {description}
          </p>
        )}
      </div>
      {badge !== undefined && badge > 0 && (
        <span
          className="flex-shrink-0 inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-bold text-white bg-krds-danger-base rounded-full"
        >
          {badge > 99 ? '99+' : badge}
          <span className="sr-only">개 알림</span>
        </span>
      )}
      {shortcut && layout !== 'grid' && (
        <kbd
          className="flex-shrink-0 hidden sm:inline-flex items-center px-1.5 py-0.5 text-xs font-mono text-krds-gray-70 bg-krds-gray-10 rounded"
        >
          <span className="sr-only">단축키 </span>
          {shortcut}
        </kbd>
      )}
    </>
  );

  const baseClassName = cn(
    actionButtonVariants({ layout }),
    disabled && 'opacity-50 pointer-events-none'
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        className={baseClassName}
        aria-disabled={disabled}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={baseClassName}
    >
      {content}
    </button>
  );
};

export const QuickActions = React.forwardRef<HTMLDivElement, QuickActionsProps>(
  (
    {
      className,
      layout = 'grid',
      columns = 2,
      title,
      actions,
      asCard = true,
      ...props
    },
    ref
  ) => {
    const gridClassName = cn(
      layout === 'grid' && [
        'grid gap-3',
        columns === 2 && 'grid-cols-2',
        columns === 3 && 'grid-cols-2 sm:grid-cols-3',
        columns === 4 && 'grid-cols-2 sm:grid-cols-4',
      ],
      layout === 'list' && 'flex flex-col gap-1',
      layout === 'inline' && 'flex flex-wrap gap-2'
    );

    const content = (
      <>
        {title && (
          <CardHeader className="pb-4">
            <CardTitle as="h3" className="text-lg">
              {title}
            </CardTitle>
          </CardHeader>
        )}
        <nav aria-label={title || '빠른 작업'}>
          <div className={gridClassName}>
            {actions.map((action) => (
              <ActionButton
                key={action.id}
                action={action}
                layout={layout || 'grid'}
              />
            ))}
          </div>
        </nav>
      </>
    );

    if (asCard) {
      return (
        <Card
          ref={ref}
          className={cn(quickActionsVariants({ layout, columns }), className)}
          variant="outlined"
          padding="md"
          {...props}
        >
          {content}
        </Card>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(quickActionsVariants({ layout, columns }), className)}
        {...props}
      >
        {content}
      </div>
    );
  }
);

QuickActions.displayName = 'QuickActions';

export { quickActionsVariants, actionButtonVariants };

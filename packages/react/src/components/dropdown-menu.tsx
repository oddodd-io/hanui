'use client';

import * as React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { cn } from '@/lib/utils';
import { Check, ChevronDown, ChevronRight, Circle } from 'lucide-react';

// ============================================================================
// DropdownMenu Root Components
// ============================================================================

const DropdownMenu = ({
  modal = false,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Root>) => (
  <DropdownMenuPrimitive.Root modal={modal} {...props} />
);
DropdownMenu.displayName = 'DropdownMenu';
const DropdownMenuGroup = DropdownMenuPrimitive.Group;

// ============================================================================
// DropdownMenuTrigger
// ============================================================================

export interface DropdownMenuTriggerProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Trigger> {
  /** 화살표 숨김 여부 (기본값: false) */
  hideArrow?: boolean;
}

const DropdownMenuTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Trigger>,
  DropdownMenuTriggerProps
>(({ className, children, hideArrow = false, asChild, ...props }, ref) => {
  const arrowIcon = (
    <ChevronDown className="h-4 w-4 shrink-0" aria-hidden="true" />
  );

  // children이 React 요소인 경우 asChild로 동작 (button 중첩 방지)
  const isChildElement = React.isValidElement(children);
  const shouldUseAsChild = asChild || isChildElement;

  if (shouldUseAsChild) {
    // 화살표 아이콘 추가가 필요한 경우
    if (isChildElement && !hideArrow) {
      const childProps = children.props as Record<string, unknown>;
      // iconRight가 없으면 추가
      if (!childProps.iconRight) {
        const clonedChild = React.cloneElement(
          children as React.ReactElement<Record<string, unknown>>,
          { iconRight: arrowIcon }
        );
        return (
          <DropdownMenuPrimitive.Trigger ref={ref} asChild {...props}>
            {clonedChild}
          </DropdownMenuPrimitive.Trigger>
        );
      }
    }
    return (
      <DropdownMenuPrimitive.Trigger ref={ref} asChild {...props}>
        {children}
      </DropdownMenuPrimitive.Trigger>
    );
  }

  // 텍스트만 있는 경우: 기본 버튼 스타일로 렌더링
  return (
    <DropdownMenuPrimitive.Trigger
      ref={ref}
      className={cn('inline-flex items-center gap-1', className)}
      {...props}
    >
      {children}
      {!hideArrow && arrowIcon}
    </DropdownMenuPrimitive.Trigger>
  );
});
DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

// ============================================================================
// DropdownMenuSubTrigger
// ============================================================================

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      'flex cursor-default select-none items-center rounded-sm px-2 py-2 text-krds-body-md outline-none',
      'focus:bg-krds-primary-5 data-[state=open]:bg-krds-primary-5',
      inset && 'pl-8',
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" aria-hidden="true" />
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName = 'DropdownMenuSubTrigger';

// ============================================================================
// DropdownMenuSubContent
// ============================================================================

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      'z-50 min-w-[8rem] overflow-hidden rounded-md border border-krds-gray-20 bg-white p-1 text-krds-gray-95 shadow-lg',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
      'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
      'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className
    )}
    {...props}
  />
));
DropdownMenuSubContent.displayName = 'DropdownMenuSubContent';

// ============================================================================
// DropdownMenuArrow
// ============================================================================

const DropdownMenuArrow = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Arrow>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Arrow>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Arrow
    ref={ref}
    className={cn(
      'fill-white',
      '[&>polygon]:stroke-krds-gray-20 [&>polygon]:stroke-[1.5]',
      className
    )}
    {...props}
  />
));
DropdownMenuArrow.displayName = 'DropdownMenuArrow';

// ============================================================================
// DropdownMenuContent
// ============================================================================

export interface DropdownMenuContentProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> {
  /** 화살표 표시 여부 */
  showArrow?: boolean;
  /** 화살표 너비 (기본값: 10) */
  arrowWidth?: number;
  /** 화살표 높이 (기본값: 5) */
  arrowHeight?: number;
  /** 키보드 순환 탐색 (기본값: true) */
  loop?: boolean;
}

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  DropdownMenuContentProps
>(
  (
    {
      className,
      sideOffset = 4,
      showArrow = false,
      arrowWidth = 10,
      arrowHeight = 5,
      loop = true,
      children,
      ...props
    },
    ref
  ) => (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        sideOffset={showArrow ? sideOffset + arrowHeight : sideOffset}
        loop={loop}
        className={cn(
          'z-50 min-w-[8rem] overflow-hidden rounded-md border border-krds-gray-20 bg-white p-1 text-krds-gray-95 shadow-md',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
          'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          className
        )}
        {...props}
      >
        {children}
        {showArrow && (
          <DropdownMenuArrow width={arrowWidth} height={arrowHeight} />
        )}
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  )
);
DropdownMenuContent.displayName = 'DropdownMenuContent';

// ============================================================================
// DropdownMenuItem
// ============================================================================

export interface DropdownMenuItemProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> {
  /** 아이콘 */
  icon?: React.ReactNode;
  /** 단축키 */
  shortcut?: string;
  /** 왼쪽 들여쓰기 (체크박스/라디오와 정렬용) */
  inset?: boolean;
  /** 위험 액션 스타일 */
  destructive?: boolean;
  /** 선택된 상태 */
  selected?: boolean;
}

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  DropdownMenuItemProps
>(
  (
    {
      className,
      icon,
      shortcut,
      inset,
      destructive,
      selected,
      children,
      ...props
    },
    ref
  ) => (
    <DropdownMenuPrimitive.Item
      ref={ref}
      className={cn(
        'relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-krds-body-md transition-colors',
        'outline-none focus-visible:ring-2 focus-visible:ring-krds-primary-base focus-visible:ring-inset',
        'focus:bg-krds-primary-5 focus:text-krds-primary-95',
        'data-[highlighted]:bg-krds-primary-5 data-[highlighted]:text-krds-primary-95 data-[highlighted]:ring-2 data-[highlighted]:ring-krds-primary-base data-[highlighted]:ring-inset',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        destructive &&
          'text-krds-danger-base focus:bg-krds-danger-10 focus:text-krds-danger-base data-[highlighted]:bg-krds-danger-10 data-[highlighted]:text-krds-danger-base data-[highlighted]:ring-krds-danger-base',
        selected && 'font-bold bg-krds-primary-5',
        inset && 'pl-8',
        className
      )}
      aria-selected={selected}
      {...props}
    >
      {icon && (
        <span className="mr-2 h-4 w-4" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
      {shortcut && (
        <span
          className="ml-auto text-[15px] tracking-widest text-krds-gray-60"
          aria-hidden="true"
        >
          {shortcut}
        </span>
      )}
    </DropdownMenuPrimitive.Item>
  )
);
DropdownMenuItem.displayName = 'DropdownMenuItem';

// ============================================================================
// DropdownMenuCheckboxItem
// ============================================================================

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors',
      'focus:bg-krds-gray-5 focus:text-krds-gray-95',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    checked={checked}
    {...props}
  >
    <span
      className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center"
      aria-hidden="true"
    >
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4 text-krds-primary-base" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = 'DropdownMenuCheckboxItem';

// ============================================================================
// DropdownMenuRadioItem
// ============================================================================

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors',
      'focus:bg-krds-gray-10 focus:text-krds-gray-95',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span
      className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center"
      aria-hidden="true"
    >
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-krds-primary-base text-krds-primary-base" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = 'DropdownMenuRadioItem';

// ============================================================================
// DropdownMenuLabel
// ============================================================================

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      'px-2 py-1.5 text-sm font-semibold text-krds-gray-70',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
));
DropdownMenuLabel.displayName = 'DropdownMenuLabel';

// ============================================================================
// DropdownMenuSeparator
// ============================================================================

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-krds-gray-20', className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';

// ============================================================================
// DropdownMenuShortcut (Display helper)
// ============================================================================

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        'ml-auto text-xs tracking-widest text-krds-gray-60',
        className
      )}
      aria-hidden="true"
      {...props}
    />
  );
};
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';

// ============================================================================
// Exports
// ============================================================================

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuArrow,
};

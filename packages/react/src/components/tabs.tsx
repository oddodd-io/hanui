'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Tabs Variants
 * KRDS 접근성 자동화를 포함한 탭 컴포넌트
 */
const tabsListVariants = cva('flex', {
  variants: {
    variant: {
      default: 'border-b border-krds-gray-20',
      pills:
        'overflow-hidden w-full rounded-lg bg-krds-white border border-krds-gray-20',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const tabsTriggerVariants = cva(
  [
    'inline-flex items-center justify-center',
    'transition-all whitespace-nowrap cursor-pointer',
    'focus-visible:outline-none focus-visible:ring-2',
    'focus-visible:ring-krds-func-info focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
  ].join(' '),
  {
    variants: {
      variant: {
        default: [
          'border-transparent -mb-px',
          'data-[state=active]:border-krds-secondary-80',
          'data-[state=active]:text-krds-secondary-80',
          'data-[state=active]:hover:bg-krds-primary-5',
          'data-[state=inactive]:text-krds-gray-70',
          'data-[state=inactive]:hover:bg-krds-primary-5',
        ].join(' '),
        pills: [
          'flex-1 border-r border-krds-gray-20 last:border-r-0',
          'data-[state=active]:bg-krds-secondary-80',
          'data-[state=active]:text-white',
          'data-[state=inactive]:bg-transparent',
          'data-[state=inactive]:text-krds-gray-70',
          'data-[state=inactive]:hover:bg-krds-gray-20',
        ].join(' '),
      },
      size: {
        sm: 'h-10 px-6 py-1.5 text-krds-body-md font-medium',
        default: 'h-14 px-10 py-2 text-krds-body-lg font-bold',
      },
    },
    compoundVariants: [
      // default variant에만 border-b 적용
      { variant: 'default', size: 'sm', className: 'border-b-2' },
      { variant: 'default', size: 'default', className: 'border-b-4' },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Tabs Root Props
 */
export interface TabsProps {
  /** 초기 활성 탭 (비제어 모드) */
  defaultValue?: string;
  /** 활성 탭 (제어 모드) */
  value?: string;
  /** 탭 변경 시 콜백 */
  onValueChange?: (value: string) => void;
  /** 스타일 변형 */
  variant?: 'default' | 'pills';
  /** 탭 크기 */
  size?: 'sm' | 'default';
  /** 추가 CSS 클래스 */
  className?: string;
  /** 자식 요소 */
  children: React.ReactNode;
}

/**
 * TabsList Props
 */
export interface TabsListProps extends VariantProps<typeof tabsListVariants> {
  children: React.ReactNode;
  className?: string;
  /** 탭이 많을 때 스크롤 가능하도록 설정 */
  scrollable?: boolean;
}

/**
 * TabsTrigger Props
 */
export interface TabsTriggerProps
  extends VariantProps<typeof tabsTriggerVariants> {
  /** 탭 식별자 (필수) */
  value: string;
  children: React.ReactNode;
  className?: string;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 탭 크기 (Tabs에서 상속됨) */
  size?: 'sm' | 'default';
}

/**
 * TabsContent Props
 */
export interface TabsContentProps {
  /** 연결된 탭 식별자 (필수) */
  value: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Tabs Context
 */
interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
  variant: 'default' | 'pills';
  size: 'sm' | 'default';
  /** Tabs 인스턴스별 고유 접두사 (id 충돌 방지) */
  baseId: string;
}

const TabsContext = React.createContext<TabsContextValue | undefined>(
  undefined
);

const useTabsContext = () => {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within Tabs');
  }
  return context;
};

/**
 * Tabs - KRDS 탭 네비게이션 컴포넌트
 *
 * ARIA 자동화, 키보드 네비게이션, 포커스 관리를 자동으로 처리합니다.
 *
 * 접근성 기능:
 * - role="tablist", "tab", "tabpanel" 자동 적용
 * - aria-selected, aria-controls 자동 관리
 * - Arrow, Home, End 키보드 네비게이션
 * - 색상 독립적 선택 상태 표시
 *
 * @example
 * <Tabs defaultValue="tab1">
 *   <TabsList>
 *     <TabsTrigger value="tab1">탭 1</TabsTrigger>
 *     <TabsTrigger value="tab2">탭 2</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="tab1">콘텐츠 1</TabsContent>
 *   <TabsContent value="tab2">콘텐츠 2</TabsContent>
 * </Tabs>
 */
export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      defaultValue,
      value: controlledValue,
      onValueChange,
      variant = 'default',
      size = 'default',
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(
      defaultValue || ''
    );
    // 한 페이지에 Tabs가 여러 개 있어도 tab/panel id가 겹치지 않도록 인스턴스별 접두사 생성
    const baseId = React.useId();

    const value =
      controlledValue !== undefined ? controlledValue : internalValue;

    const handleValueChange = React.useCallback(
      (newValue: string) => {
        if (controlledValue === undefined) {
          setInternalValue(newValue);
        }
        onValueChange?.(newValue);
      },
      [controlledValue, onValueChange]
    );

    return (
      <TabsContext.Provider
        value={{
          value,
          onValueChange: handleValueChange,
          variant,
          size,
          baseId,
        }}
      >
        <div ref={ref} className={cn('w-full mt-8', className)} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);

Tabs.displayName = 'Tabs';

/**
 * TabsList - 탭 버튼 컨테이너
 *
 * role="tablist"와 키보드 네비게이션을 자동으로 처리합니다.
 * scrollable prop으로 탭이 많을 때 스크롤 네비게이션을 활성화할 수 있습니다.
 */
export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  (
    { children, className, variant: variantProp, scrollable = false, ...props },
    ref
  ) => {
    const { variant: contextVariant } = useTabsContext();
    const variant = variantProp || contextVariant;
    const internalRef = React.useRef<HTMLDivElement>(null);
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);
    const tabsListRef = (ref as React.RefObject<HTMLDivElement>) || internalRef;

    // 스크롤 상태 관리
    const [canScrollLeft, setCanScrollLeft] = React.useState(false);
    const [canScrollRight, setCanScrollRight] = React.useState(false);

    // 스크롤 상태 업데이트
    const updateScrollState = React.useCallback(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }, []);

    // 스크롤 이벤트 리스너
    React.useEffect(() => {
      if (!scrollable) return;

      const container = scrollContainerRef.current;
      if (!container) return;

      updateScrollState();

      container.addEventListener('scroll', updateScrollState);
      window.addEventListener('resize', updateScrollState);

      return () => {
        container.removeEventListener('scroll', updateScrollState);
        window.removeEventListener('resize', updateScrollState);
      };
    }, [scrollable, updateScrollState]);

    // 스크롤 함수
    const scroll = (direction: 'left' | 'right') => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const scrollAmount = container.clientWidth * 0.5;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    };

    // 키보드 네비게이션: Arrow Left/Right, Home, End
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      const tabsList = scrollable
        ? scrollContainerRef.current
        : tabsListRef.current;
      if (!tabsList) return;

      const tabs = Array.from(
        tabsList.querySelectorAll<HTMLButtonElement>(
          '[role="tab"]:not([disabled])'
        )
      );
      const currentIndex = tabs.findIndex((tab) => tab === event.target);

      if (currentIndex === -1) return;

      let nextIndex = currentIndex;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
          break;
        case 'ArrowRight':
          event.preventDefault();
          nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
          break;
        case 'Home':
          event.preventDefault();
          nextIndex = 0;
          break;
        case 'End':
          event.preventDefault();
          nextIndex = tabs.length - 1;
          break;
        default:
          return;
      }

      const nextTab = tabs[nextIndex];
      nextTab?.focus();
      nextTab?.click();

      // 스크롤 가능한 경우, 포커스된 탭이 보이도록 스크롤
      if (scrollable && nextTab) {
        nextTab.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest',
        });
      }
    };

    // 스크롤 가능한 탭 렌더링
    if (scrollable) {
      return (
        <div
          ref={tabsListRef}
          className={cn('relative flex items-center', className)}
          {...props}
        >
          {/* 왼쪽 스크롤 버튼 */}
          <button
            type="button"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="이전 탭 보기"
            className={cn(
              'absolute left-0 top-1/2 -translate-y-1/2',
              'flex-shrink-0 flex items-center justify-center',
              'w-10 h-10 rounded-full',
              'bg-krds-gray-90 text-white',
              'hover:bg-krds-gray-80',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-krds-func-info',
              'disabled:opacity-0 disabled:pointer-events-none',
              'transition-opacity'
            )}
          >
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
          </button>

          {/* 스크롤 컨테이너 */}
          <div
            ref={scrollContainerRef}
            role="tablist"
            tabIndex={-1}
            onKeyDown={handleKeyDown}
            className={cn(
              'flex-1 overflow-x-auto scrollbar-hide',
              tabsListVariants({ variant })
            )}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {children}
          </div>

          {/* 오른쪽 스크롤 버튼 */}
          <button
            type="button"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label="다음 탭 보기"
            className={cn(
              'absolute right-0 top-1/2 -translate-y-1/2',
              'flex-shrink-0 flex items-center justify-center',
              'w-10 h-10 rounded-full',
              'bg-krds-gray-90 text-white',
              'hover:bg-krds-gray-80',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-krds-func-info',
              'disabled:opacity-0 disabled:pointer-events-none',
              'transition-opacity'
            )}
          >
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      );
    }

    // 기본 탭 렌더링
    return (
      <div
        ref={tabsListRef}
        role="tablist"
        tabIndex={-1}
        className={cn(tabsListVariants({ variant }), className)}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TabsList.displayName = 'TabsList';

/**
 * TabsTrigger - 개별 탭 버튼
 *
 * role="tab", aria-selected, aria-controls를 자동으로 관리합니다.
 */
export const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  TabsTriggerProps
>(
  (
    {
      value: triggerValue,
      children,
      className,
      variant: variantProp,
      size: sizeProp,
      disabled,
      ...props
    },
    ref
  ) => {
    const {
      value,
      onValueChange,
      variant: contextVariant,
      size: contextSize,
      baseId,
    } = useTabsContext();
    const variant = variantProp || contextVariant;
    const size = sizeProp || contextSize;
    const isActive = value === triggerValue;
    const tabId = `${baseId}-tab-${triggerValue}`;
    const panelId = `${baseId}-panel-${triggerValue}`;

    return (
      <button
        ref={ref}
        id={tabId}
        role="tab"
        type="button"
        aria-selected={isActive}
        // 비활성 패널은 언마운트되므로 활성일 때만 참조한다 (존재하지 않는 id 참조 방지)
        aria-controls={isActive ? panelId : undefined}
        data-state={isActive ? 'active' : 'inactive'}
        disabled={disabled}
        className={cn(tabsTriggerVariants({ variant, size }), className)}
        onClick={() => onValueChange(triggerValue)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

TabsTrigger.displayName = 'TabsTrigger';

/**
 * TabsContent - 탭 콘텐츠 패널
 *
 * role="tabpanel", aria-labelledby를 자동으로 관리합니다.
 */
export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ value: contentValue, children, className, ...props }, ref) => {
    const { value, baseId } = useTabsContext();
    const isActive = value === contentValue;
    const panelId = `${baseId}-panel-${contentValue}`;

    if (!isActive) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={panelId}
        aria-labelledby={`${baseId}-tab-${contentValue}`}
        className={cn('pt-10 focus-visible:outline-none', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TabsContent.displayName = 'TabsContent';

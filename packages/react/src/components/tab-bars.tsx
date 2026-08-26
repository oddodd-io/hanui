'use client';

import React, { useState } from 'react';
import { cn } from '../lib/utils';

export interface TabBarItem {
  /** 메뉴 라벨 (1-2 단어 권장) */
  label: string;
  /** 메뉴 아이콘 (React Node - filled/line 아이콘 제공 필요) */
  icon: React.ReactNode;
  /** 선택된 상태의 아이콘 (filled) */
  activeIcon?: React.ReactNode;
  /** 메뉴 href */
  href: string;
  /** Badge 숫자 (선택사항) */
  badge?: number;
  /** 초기 활성 상태 */
  active?: boolean;
}

export interface TabBarsProps extends React.HTMLAttributes<HTMLElement> {
  /** 탭 바 메뉴 아이템 배열 (최대 5개 권장) */
  items: TabBarItem[];
  /** 아이템 클릭 핸들러 */
  onItemClick?: (item: TabBarItem, index: number) => void;
  /**
   * 스타일 변형
   * - default: 활성화 시 filled 아이콘 + text-krds-gray-95 + font-bold
   * - border: 활성화 시 line 아이콘 유지 + text-krds-gray-95 + font-bold + border-top
   * @default 'default'
   */
  variant?: 'default' | 'border';
  /** 추가 className */
  className?: string;
}

/**
 * TabBars - KRDS 하단 고정 네비게이션 (모바일 전용)
 *
 * @description
 * 모바일 및 태블릿에서 주요 화면 간 빠른 이동을 위한 하단 고정 네비게이션 바입니다.
 * KRDS 가이드라인에 따라 최대 5개 메뉴, 아이콘+라벨 조합, 접근성을 준수합니다.
 *
 * @example
 * ```tsx
 * const items = [
 *   {
 *     label: '홈',
 *     icon: <HomeIcon />,
 *     activeIcon: <HomeFilledIcon />,
 *     href: '/',
 *     active: true
 *   },
 *   {
 *     label: '검색',
 *     icon: <SearchIcon />,
 *     activeIcon: <SearchFilledIcon />,
 *     href: '/search'
 *   },
 *   {
 *     label: '알림',
 *     icon: <BellIcon />,
 *     activeIcon: <BellFilledIcon />,
 *     href: '/notifications',
 *     badge: 3
 *   },
 * ];
 *
 * <TabBars items={items} onItemClick={(item) => console.log(item)} />
 * ```
 */
export function TabBars({
  items,
  onItemClick,
  variant = 'default',
  className,
  ...props
}: TabBarsProps) {
  const [activeIndex, setActiveIndex] = useState<number>(
    items.findIndex((item) => item.active) || 0
  );

  const handleClick = (item: TabBarItem, index: number) => {
    setActiveIndex(index);
    onItemClick?.(item, index);
  };

  // KRDS 권장사항: 최대 5개 메뉴
  if (items.length > 5) {
    console.warn('TabBars: KRDS recommends maximum 5 menu items');
  }

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className={cn(
        // Fixed bottom positioning
        'fixed bottom-0 left-0 right-0 z-50',
        // Container styles
        'bg-white border-t border-krds-gray-20',
        // Shadow for elevation
        'shadow-[0_-2px_8px_0_rgba(0,0,0,0.08)]',
        // Safe area for mobile devices
        'pb-safe',
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-around h-16 max-w-screen-xl mx-auto">
        {items.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <a
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              onClick={(e) => {
                e.preventDefault();
                handleClick(item, index);
              }}
              className={cn(
                // Base styles
                'relative flex flex-col items-center justify-center',
                'min-w-[64px] h-full px-2',
                'transition-colors duration-200',
                // Touch target (최소 44x44px)
                'min-h-[44px]',
                // Focus styles
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-krds-primary-base focus-visible:ring-offset-2',
                // Color styles
                isActive && 'text-krds-gray-95',
                !isActive && 'text-krds-gray-60 hover:text-krds-gray-90'
              )}
            >
              {/* Icon with badge */}
              <div className="relative flex items-center justify-center w-6 h-6 mb-1">
                {/* default variant: show filled icon when active, border variant: always show line icon */}
                {variant === 'default' && isActive && item.activeIcon
                  ? item.activeIcon
                  : item.icon}

                {/* Badge */}
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={cn(
                      'absolute -top-1 -right-1',
                      'flex items-center justify-center',
                      'min-w-[16px] h-4 px-1',
                      'text-[10px] font-bold text-white',
                      'bg-krds-red-base rounded-full',
                      'leading-none'
                    )}
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                    <span className="sr-only">개 알림</span>
                  </span>
                )}
              </div>

              {/* Label (1-2 단어) */}
              <span
                className={cn(
                  'text-krds-body-xs font-medium leading-tight text-center',
                  'max-w-full truncate',
                  isActive && 'font-bold'
                )}
              >
                {item.label}
              </span>

              {/* Active indicator line - only for border variant */}
              {variant === 'border' && isActive && (
                <span
                  className="absolute top-0 left-0 right-0 h-[2px] bg-krds-gray-95"
                  aria-hidden="true"
                />
              )}
            </a>
          );
        })}
      </div>
    </nav>
  );
}

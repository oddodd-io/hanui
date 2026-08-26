'use client';

import * as React from 'react';
import { PanelLeftClose, PanelLeftOpen, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

/** 사이드바 메뉴 아이템 */
export interface SidebarMenuItem {
  /** 메뉴 라벨 */
  label: string;
  /** 링크 URL */
  href?: string;
  /** 아이콘 */
  icon?: React.ReactNode;
  /** 활성화 상태 */
  active?: boolean;
  /** 하위 메뉴 */
  children?: SidebarMenuItem[];
}

/** Sidebar Props */
export interface SidebarProps {
  /** 사이드바 메뉴 아이템 */
  menuItems: SidebarMenuItem[];
  /** 메뉴 클릭 핸들러 */
  onMenuClick?: (href: string) => void;
  /** 로고 (이미지 또는 텍스트) */
  logo?: React.ReactNode;
  /** 사이트 타이틀 */
  siteTitle?: string;
  /** 사이드바 초기 접힘 상태 */
  defaultCollapsed?: boolean;
  /** 접힘 상태 변경 콜백 (메인 영역 여백 동기화용) */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** 사이드바 하단 콘텐츠 */
  footer?: React.ReactNode;
  /** 추가 className */
  className?: string;
}

// ============================================================================
// Sidebar
// ============================================================================

/**
 * 사이드바 컴포넌트
 *
 * 어드민/대시보드용 좌측 사이드바.
 * - 접기/펼치기 (w-16 / w-64)
 * - 2depth 메뉴 트리 + 활성 상태 자동 펼침
 * - 사이트 타이틀 헤더, 사용자 영역 푸터 슬롯
 * - WCAG 2.1 / KWCAG 2.2 준수 (skip-link, aria, focus ring)
 *
 * 페이지 레이아웃은 호출하는 쪽에서 직접 짭니다.
 * `onCollapsedChange`로 접힘 상태를 받아 메인 영역의 `ml-16` / `ml-64`를 토글하세요.
 */
export function Sidebar({
  menuItems,
  onMenuClick,
  logo,
  siteTitle = '관리자',
  defaultCollapsed = false,
  onCollapsedChange,
  footer,
  className,
}: SidebarProps) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);
  const [openMenus, setOpenMenus] = React.useState<Set<number>>(() => {
    const initial = new Set<number>();
    menuItems.forEach((item, index) => {
      if (item.active || item.children?.some((child) => child.active)) {
        initial.add(index);
      }
    });
    return initial;
  });

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      onCollapsedChange?.(next);
      return next;
    });
  };

  const toggleMenu = (index: number) => {
    setOpenMenus((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const handleMenuClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href?: string
  ) => {
    if (href && onMenuClick) {
      e.preventDefault();
      onMenuClick(href);
    }
  };

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 h-screen bg-krds-white border-r border-krds-gray-20 transition-all duration-300 z-40 flex flex-col',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
      aria-label="사이드바 메뉴"
    >
      {/* 헤더: 로고/타이틀 + 접기 버튼 */}
      <div className="flex items-center h-16 px-4 flex-shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {logo && <div className="flex-shrink-0">{logo}</div>}
            <span className="text-krds-body-md font-bold text-krds-gray-90 truncate">
              {siteTitle}
            </span>
          </div>
        )}
        <button
          type="button"
          onClick={toggleCollapsed}
          className={cn(
            'p-2 rounded-md text-krds-gray-60 hover:bg-krds-gray-10 hover:text-krds-gray-90',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-krds-blue-60',
            'transition-colors cursor-pointer',
            collapsed && 'mx-auto'
          )}
          aria-label={collapsed ? '사이드바 펼치기' : '사이드바 접기'}
        >
          {collapsed ? (
            <PanelLeftOpen className="w-5 h-5" aria-hidden="true" />
          ) : (
            <PanelLeftClose className="w-5 h-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* 메뉴 */}
      <nav className="flex-1 overflow-y-auto py-2">
        <ul className="list-none p-0 m-0">
          {menuItems.map((item, index) => {
            const hasChildren = item.children && item.children.length > 0;
            const isOpen = openMenus.has(index);
            const isActive =
              item.active || item.children?.some((child) => child.active);

            return (
              <li key={index}>
                {hasChildren && !collapsed ? (
                  <>
                    <button
                      type="button"
                      onClick={() => toggleMenu(index)}
                      className={cn(
                        'flex items-center w-full px-4 py-3 gap-3',
                        'text-krds-body-md text-krds-gray-70 text-left',
                        'hover:bg-krds-primary-5 hover:text-krds-gray-90',
                        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-krds-blue-60 focus-visible:outline-offset-[-2px]',
                        'transition-colors cursor-pointer border-0 bg-transparent',
                        isActive && 'text-krds-primary-base font-bold'
                      )}
                      aria-expanded={isOpen}
                    >
                      {item.icon && (
                        <span
                          className="flex-shrink-0 w-5 h-5"
                          aria-hidden="true"
                        >
                          {item.icon}
                        </span>
                      )}
                      <span className="flex-1 truncate">{item.label}</span>
                      <ChevronDown
                        className={cn(
                          'w-4 h-4 flex-shrink-0 transition-transform duration-200',
                          isOpen && 'rotate-180'
                        )}
                        aria-hidden="true"
                      />
                    </button>
                    {isOpen && (
                      <ul className="list-none p-0 m-0">
                        {item.children!.map((child, childIndex) => (
                          <li key={childIndex}>
                            <a
                              href={child.href}
                              onClick={(e) => handleMenuClick(e, child.href)}
                              className={cn(
                                'flex items-center w-full py-2 pl-12 pr-4 gap-3',
                                'text-[14px] text-krds-gray-60 no-underline',
                                'hover:bg-krds-primary-5 hover:text-krds-gray-90',
                                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-krds-blue-60 focus-visible:outline-offset-[-2px]',
                                'transition-colors',
                                child.active &&
                                  'text-krds-primary-base font-bold bg-krds-primary-5'
                              )}
                              aria-current={child.active ? 'page' : undefined}
                            >
                              {child.icon && (
                                <span
                                  className="flex-shrink-0 w-4 h-4"
                                  aria-hidden="true"
                                >
                                  {child.icon}
                                </span>
                              )}
                              <span className="truncate">{child.label}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  // href가 없으면 <a>는 링크가 아니라서 aria-label을 쓸 수 없다
                  // (axe aria-prohibited-attr). 그런 항목은 button으로 렌더한다.
                  React.createElement(
                    item.href ? 'a' : 'button',
                    {
                      href: item.href,
                      type: item.href ? undefined : 'button',
                      onClick: (e: React.MouseEvent<HTMLElement>) =>
                        handleMenuClick(
                          e as React.MouseEvent<HTMLAnchorElement>,
                          item.href
                        ),
                      className: cn(
                        'flex items-center w-full px-4 py-3 gap-3',
                        'text-krds-body-md text-krds-gray-70 no-underline text-left',
                        'hover:bg-krds-primary-5 hover:text-krds-gray-90',
                        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-krds-blue-60 focus-visible:outline-offset-[-2px]',
                        'transition-colors cursor-pointer border-0 bg-transparent',
                        collapsed && 'justify-center px-0',
                        isActive &&
                          'text-krds-primary-base font-bold bg-krds-primary-5'
                      ),
                      'aria-current': item.active ? 'page' : undefined,
                      'aria-label': collapsed ? item.label : undefined,
                      title: collapsed ? item.label : undefined,
                    },
                    <>
                      {item.icon && (
                        <span
                          className="flex-shrink-0 w-5 h-5"
                          aria-hidden="true"
                        >
                          {item.icon}
                        </span>
                      )}
                      {!collapsed && (
                        <span className="flex-1 truncate">{item.label}</span>
                      )}
                    </>
                  )
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 푸터 */}
      {footer && !collapsed && (
        <div className="flex-shrink-0 border-t border-krds-gray-20 p-4">
          {footer}
        </div>
      )}
    </aside>
  );
}

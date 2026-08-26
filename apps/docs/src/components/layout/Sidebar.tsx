'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef } from 'react';

// Navigation by section
const getStartedNavigation = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Introduction', href: '/docs/introduction' },
      { title: 'Quick Start', href: '/docs/quick-start' },
      { title: 'Installation', href: '/docs/installation' },
    ],
  },
  {
    title: 'Design System',
    items: [
      { title: 'Colors', href: '/docs/colors' },
      { title: 'Typography', href: '/docs/typography' },
      { title: 'Spacing', href: '/docs/spacing' },
      { title: 'Layout', href: '/docs/layout' },
    ],
  },
];

const designSystemNavigation = [
  {
    title: 'Design System',
    items: [
      { title: 'Colors', href: '/docs/colors' },
      { title: 'Typography', href: '/docs/typography' },
      { title: 'Spacing', href: '/docs/spacing' },
      { title: 'Border Radius', href: '/docs/border-radius' },
      { title: 'Layout', href: '/docs/layout' },
    ],
  },
];

const componentsNavigation = [
  {
    title: 'Components',
    items: [
      { title: 'Overview', href: '/components' },
      { title: 'Accordion', href: '/components/accordion' },
      { title: 'Alert', href: '/components/alert' },
      { title: 'AlertDialog', href: '/components/alert-dialog' },
      { title: 'AspectRatio', href: '/components/aspect-ratio' },
      { title: 'Badge', href: '/components/badge' },
      { title: 'Body', href: '/components/body' },
      { title: 'Breadcrumb', href: '/components/breadcrumb' },
      { title: 'Button', href: '/components/button' },
      { title: 'Card', href: '/components/card' },
      { title: 'Carousel', href: '/components/carousel' },
      { title: 'Center', href: '/components/center' },
      { title: 'Checkbox', href: '/components/checkbox' },
      { title: 'Code', href: '/components/code' },
      { title: 'Combobox', href: '/components/combobox', isNew: true },
      { title: 'Container', href: '/components/container' },
      {
        title: 'Critical Alerts',
        href: '/components/critical-alerts',
      },
      { title: 'DataTable', href: '/components/data-table' },
      { title: 'Date Input', href: '/components/date-input' },
      { title: 'Disclosure', href: '/components/disclosure' },
      { title: 'Display', href: '/components/display' },
      { title: 'DropdownMenu', href: '/components/dropdown-menu' },
      { title: 'File Upload', href: '/components/file-upload' },
      { title: 'Flex', href: '/components/flex' },
      { title: 'Footer', href: '/components/footer' },
      { title: 'Form Field', href: '/components/form-field' },
      { title: 'Grid', href: '/components/grid' },
      { title: 'Header', href: '/components/header' },
      { title: 'Heading', href: '/components/heading' },
      { title: 'Identifier', href: '/components/identifier' },
      { title: 'Image', href: '/components/image' },
      { title: 'In-page Navigation', href: '/components/in-page-navigation' },
      { title: 'Input', href: '/components/input' },
      { title: 'Label', href: '/components/label' },
      { title: 'List', href: '/components/list' },
      { title: 'Main Menu', href: '/components/main-menu' },
      { title: 'Masthead', href: '/components/masthead' },
      { title: 'Modal', href: '/components/modal' },
      { title: 'Pagination', href: '/components/pagination' },
      { title: 'Progress', href: '/components/progress' },
      { title: 'Radio', href: '/components/radio' },
      {
        title: 'Section Heading System',
        href: '/components/section-heading-system',
      },
      { title: 'Select', href: '/components/select' },
      { title: 'Side Navigation', href: '/components/side-navigation' },
      { title: 'Sidebar', href: '/components/sidebar' },
      { title: 'SimpleGrid', href: '/components/simple-grid' },
      { title: 'Skeleton', href: '/components/skeleton' },
      { title: 'SkipLink', href: '/components/skiplink' },
      { title: 'Slider', href: '/components/slider' },
      { title: 'Spinner', href: '/components/spinner' },
      { title: 'Stack', href: '/components/stack', isNew: true },
      {
        title: 'Step Indicator',
        href: '/components/step-indicator',
        isNew: true,
      },
      { title: 'Switch', href: '/components/switch' },
      { title: 'Tab Bars', href: '/components/tabbars' },
      { title: 'Table', href: '/components/table' },
      { title: 'Tabs', href: '/components/tabs' },
      { title: 'Tag', href: '/components/tag' },
      { title: 'Textarea', href: '/components/textarea' },
      { title: 'Toast', href: '/components/toast' },
      { title: 'Tooltip', href: '/components/tooltip' },
      { title: 'Wrap', href: '/components/wrap' },
    ],
  },
];

const blocksNavigation = [
  {
    title: 'Blocks',
    items: [{ title: 'Overview', href: '/blocks' }],
  },
  {
    title: '인증',
    items: [
      { title: 'Login Form', href: '/blocks/login-form' },
      { title: 'Signup Form', href: '/blocks/signup-form' },
      {
        title: 'Account Recovery',
        href: '/blocks/account-recovery',
      },
      { title: 'OTP Verify', href: '/blocks/otp-verify' },
    ],
  },
  {
    title: '결제 / 폼',
    items: [
      { title: 'Payment Card', href: '/blocks/payment-card' },
      {
        title: 'Billing Address',
        href: '/blocks/billing-address',
      },
      { title: 'Contact Form', href: '/blocks/contact-form' },
    ],
  },
  {
    title: '설정 / 프로필',
    items: [
      { title: 'Profile Card', href: '/blocks/profile-card' },
      {
        title: 'Settings Section',
        href: '/blocks/settings-section',
      },
      {
        title: 'Notification Settings',
        href: '/blocks/notification-settings',
      },
    ],
  },
  {
    title: '데이터 / 정보',
    items: [
      { title: 'Area Chart', href: '/blocks/area-chart' },
      { title: 'Bar Chart', href: '/blocks/bar-chart' },
      { title: 'Line Chart', href: '/blocks/line-chart' },
      { title: 'Pie Chart', href: '/blocks/pie-chart' },
      { title: 'Stats Card', href: '/blocks/stats-card' },
      { title: 'Team Members', href: '/blocks/team-members' },
      { title: 'Pricing Table', href: '/blocks/pricing-table' },
    ],
  },
  {
    title: '검색 / 네비게이션',
    items: [
      { title: 'Search Bar', href: '/blocks/search-bar' },
      { title: 'Empty State', href: '/blocks/empty-state' },
      { title: 'Error Page', href: '/blocks/error-page' },
    ],
  },
  {
    title: '공공기관 특화',
    items: [
      { title: 'Gov Login', href: '/blocks/gov-login' },
      {
        title: 'Application Form',
        href: '/blocks/application-form',
      },
      {
        title: 'Service Card Grid',
        href: '/blocks/service-card-grid',
      },
    ],
  },
  {
    title: 'CMS 관리',
    items: [
      { title: 'Site Settings', href: '/blocks/site-settings' },
      {
        title: 'User Management',
        href: '/blocks/user-management',
      },
      {
        title: 'Board Management',
        href: '/blocks/board-management',
      },
      { title: 'Media Gallery', href: '/blocks/media-gallery' },
      { title: 'Trash List', href: '/blocks/trash-list' },
    ],
  },
];

const templatesNavigation = [
  {
    title: 'Templates',
    items: [
      { title: 'Overview', href: '/templates' },
      { title: 'Basic Layout', href: '/templates/basic-layout' },
    ],
  },
];

const kitsNavigation = [
  {
    title: 'Kits',
    items: [
      { title: 'Overview', href: '/kits' },
      { title: 'Getting Started', href: '/kits/getting-started' },
      { title: 'Board Kit', href: '/kits/board' },
      { title: 'Auth Kit', href: '/kits/auth' },
      { title: 'Table Kit', href: '/kits/table' },
      { title: 'Form Kit', href: '/kits/form' },
      { title: 'Dashboard Kit', href: '/kits/dashboard' },
      { title: 'Search Kit', href: '/kits/search' },
      { title: 'Notification Kit', href: '/kits/notification' },
      { title: 'Settings Kit', href: '/kits/settings' },
    ],
  },
];

type NavigationItem = {
  title: string;
  href: string;
  isNew?: boolean;
  isComingSoon?: boolean;
};

type NavigationSection = {
  title: string;
  items: NavigationItem[];
};

function SidebarSection({
  section,
  onActiveRef,
}: {
  section: NavigationSection;
  onActiveRef?: (el: HTMLAnchorElement | null) => void;
}) {
  const pathname = usePathname();

  return (
    <div>
      <h3 className="px-2 text-xs text-krds-gray-50 mb-3">{section.title}</h3>
      <ul className="space-y-1">
        {section.items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              {item.isComingSoon ? (
                <span
                  className="flex items-center gap-1.5 py-1 px-2 rounded-md transition-colors text-sm text-krds-gray-40 cursor-not-allowed"
                  aria-disabled="true"
                >
                  {item.title}
                  <span className="text-xs text-krds-gray-40">Soon</span>
                </span>
              ) : (
                <Link
                  href={item.href}
                  ref={isActive ? onActiveRef : undefined}
                  className={`flex items-center gap-1.5 py-1 px-2 rounded-md transition-colors text-sm ${
                    isActive
                      ? 'bg-krds-primary-base text-white font-medium'
                      : 'text-krds-gray-70 hover:bg-krds-gray-5 hover:text-krds-gray-95'
                  }`}
                >
                  {item.title}
                  {item.isNew && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isActive ? 'bg-white' : 'bg-krds-primary-base'
                      }`}
                      aria-label="새로운 컴포넌트"
                    />
                  )}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export interface SidebarProps {
  /** 모바일 드로어 열림 상태 (md 미만에서만 적용) */
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const navRef = useRef<HTMLElement>(null);
  const activeRef = useRef<HTMLAnchorElement | null>(null);
  const pathname = usePathname();

  const getNavigation = () => {
    if (pathname?.startsWith('/docs')) return getStartedNavigation;
    if (pathname?.startsWith('/design-system')) return designSystemNavigation;
    if (pathname?.startsWith('/components')) return componentsNavigation;
    if (pathname?.startsWith('/blocks')) return blocksNavigation;
    if (pathname?.startsWith('/templates')) return templatesNavigation;
    if (pathname?.startsWith('/kits')) return kitsNavigation;
    return componentsNavigation;
  };

  const navigation = getNavigation();

  const handleActiveRef = (el: HTMLAnchorElement | null) => {
    activeRef.current = el;
  };

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const handleClick = () => {
      sessionStorage.setItem('sidebar-scroll', nav.scrollTop.toString());
    };
    nav.addEventListener('click', handleClick);
    return () => nav.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const savedScroll = sessionStorage.getItem('sidebar-scroll');
    if (savedScroll) {
      const id = setTimeout(() => {
        nav.scrollTop = parseInt(savedScroll, 10);
      }, 0);
      return () => clearTimeout(id);
    } else if (activeRef.current) {
      const id = setTimeout(() => {
        activeRef.current?.scrollIntoView({
          block: 'center',
          behavior: 'instant',
        });
      }, 0);
      return () => clearTimeout(id);
    }
  }, [pathname]);

  // 모바일에서 링크 클릭 시 드로어 닫기
  const handleNavClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('a')) onClose?.();
  };

  return (
    <>
      {/* KRDS medium(768px) 미만: 배경 딤 */}
      <div
        className={`fixed inset-0 z-30 bg-black/40 md:hidden transition-opacity duration-300 ${
          isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
        onClick={onClose}
      />

      {/* 사이드바
          mobile: fixed overlay (KRDS small ~767px) - 드로어
          md+(768px~): 인라인 static 사이드바 (KRDS medium~) */}
      <aside
        className={[
          // 모바일: fixed 드로어
          'fixed top-14 left-0 bottom-0 z-40 w-64 bg-krds-white',
          'transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          // KRDS medium(768px)+: 인라인 배치, 드로어 해제
          'md:relative md:top-auto md:bottom-auto md:z-auto md:bg-transparent',
          'md:translate-x-0 md:flex-shrink-0 md:w-52',
          'lg:w-64',
          'border-r border-krds-gray-5',
        ].join(' ')}
      >
        {/*
          내부 링크가 이미 포커스·활성화 가능한 요소라 키보드 경로는 확보돼 있다.
          여기의 핸들러는 링크 클릭을 위임 처리하기 위한 것이다.
        */}
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
        <nav
          ref={navRef}
          onClick={handleNavClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ')
              handleNavClick(e as unknown as React.MouseEvent);
          }}
          className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto p-4 md:p-6 pb-20 scrollbar-hide"
        >
          <div className="space-y-8">
            {navigation.map((section) => (
              <SidebarSection
                key={section.title}
                section={section}
                onActiveRef={handleActiveRef}
              />
            ))}
          </div>
        </nav>
      </aside>
    </>
  );
}

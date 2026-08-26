'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SitemapItem {
  /** 메뉴 이름 */
  label: string;
  /** URL */
  href: string;
  /** 하위 메뉴 */
  children?: SitemapItem[];
}

export interface SitemapPageProps {
  /** 제목 */
  title?: string;
  /** 사이트맵 데이터 */
  items?: SitemapItem[];
  /** 링크 컴포넌트 (Next.js Link 등) */
  LinkComponent?: React.ElementType;
  /** 추가 className */
  className?: string;
}

const defaultItems: SitemapItem[] = [
  {
    label: '기관소개',
    href: '/about',
    children: [
      { label: '인사말', href: '/about/greeting' },
      { label: '연혁', href: '/about/history' },
      { label: '조직도', href: '/about/organization' },
      { label: '오시는 길', href: '/about/location' },
    ],
  },
  {
    label: '알림마당',
    href: '/notice',
    children: [
      { label: '공지사항', href: '/notice/list' },
      { label: '보도자료', href: '/notice/press' },
      { label: '사업공고', href: '/notice/bid' },
    ],
  },
  {
    label: '민원안내',
    href: '/civil',
    children: [
      { label: '온라인 민원', href: '/civil/online' },
      { label: '자주 묻는 질문', href: '/civil/faq' },
      { label: '민원서식', href: '/civil/forms' },
    ],
  },
  {
    label: '정보공개',
    href: '/info',
    children: [
      { label: '사전공개', href: '/info/pre-disclosure' },
      { label: '정보목록', href: '/info/list' },
    ],
  },
];

/**
 * SitemapPage 블록
 *
 * 사이트맵 페이지. KWCAG 필수 요구사항입니다.
 * 전체 사이트 구조를 한눈에 보여주고, 모든 페이지에 접근할 수 있게 합니다.
 */
export function SitemapPage({
  title = '사이트맵',
  items = defaultItems,
  LinkComponent = 'a',
  className,
}: SitemapPageProps) {
  return (
    <section className={cn('', className)} aria-label={title}>
      <h2 className="text-2xl font-bold text-krds-gray-90 mb-8">{title}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((section) => (
          <div key={section.href}>
            <h3 className="text-base font-bold text-krds-gray-90 border-b-2 border-krds-primary-base pb-2 mb-3">
              <LinkComponent
                href={section.href}
                className="hover:text-krds-primary-base transition-colors"
              >
                {section.label}
              </LinkComponent>
            </h3>

            {section.children && section.children.length > 0 && (
              <ul className="space-y-2" role="list">
                {section.children.map((child) => (
                  <li key={child.href}>
                    <LinkComponent
                      href={child.href}
                      className="text-sm text-krds-gray-60 hover:text-krds-primary-base hover:underline transition-colors"
                    >
                      {child.label}
                    </LinkComponent>

                    {child.children && child.children.length > 0 && (
                      <ul className="ml-4 mt-1 space-y-1" role="list">
                        {child.children.map((grandchild) => (
                          <li key={grandchild.href}>
                            <LinkComponent
                              href={grandchild.href}
                              className="text-xs text-krds-gray-60 hover:text-krds-primary-base hover:underline"
                            >
                              {grandchild.label}
                            </LinkComponent>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

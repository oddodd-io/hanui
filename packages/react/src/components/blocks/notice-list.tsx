'use client';

import * as React from 'react';
import { Badge } from '../badge';
import { Body } from '../body';
import { cn } from '@/lib/utils';

export interface NoticeItem {
  /** 공지 ID */
  id: string | number;
  /** 제목 */
  title: string;
  /** 날짜 (YYYY-MM-DD) */
  date: string;
  /** 카테고리 */
  category?: string;
  /** 상단 고정 여부 */
  pinned?: boolean;
  /** 새 글 여부 */
  isNew?: boolean;
  /** 링크 URL */
  href?: string;
}

export interface NoticeListProps {
  /** 제목 */
  title?: string;
  /** 공지 목록 */
  items?: NoticeItem[];
  /** 더보기 링크 URL */
  moreHref?: string;
  /** 더보기 클릭 핸들러 */
  onMoreClick?: () => void;
  /** 항목 클릭 핸들러 */
  onItemClick?: (item: NoticeItem) => void;
  /** 링크 컴포넌트 (Next.js Link 등) */
  LinkComponent?: React.ElementType;
  /** 추가 className */
  className?: string;
}

const defaultItems: NoticeItem[] = [
  {
    id: 1,
    title: '2026년 상반기 정보화 사업 계획 공고',
    date: '2026-04-10',
    category: '공지',
    pinned: true,
  },
  {
    id: 2,
    title: '홈페이지 시스템 정기점검 안내 (4/15)',
    date: '2026-04-08',
    category: '안내',
    isNew: true,
  },
  {
    id: 3,
    title: '개인정보처리방침 개정 안내',
    date: '2026-04-05',
    category: '공지',
  },
  {
    id: 4,
    title: '2025년 연간 보고서 발간',
    date: '2026-03-28',
    category: '보도',
  },
  {
    id: 5,
    title: '온라인 민원 접수 시스템 개선 안내',
    date: '2026-03-20',
    category: '안내',
  },
];

/**
 * NoticeList 블록
 *
 * 공지사항 목록. 상단 고정, 새 글 표시, 카테고리 뱃지를 지원합니다.
 */
export function NoticeList({
  title = '공지사항',
  items = defaultItems,
  moreHref,
  onMoreClick,
  onItemClick,
  LinkComponent = 'a',
  className,
}: NoticeListProps) {
  return (
    <section className={cn('', className)} aria-label={title}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-krds-gray-90">{title}</h3>
        {(moreHref || onMoreClick) && (
          <LinkComponent
            href={moreHref || '#'}
            onClick={onMoreClick}
            className="text-sm text-krds-primary-base hover:underline"
          >
            더보기
          </LinkComponent>
        )}
      </div>

      <ul className="divide-y divide-krds-gray-10" role="list">
        {items.map((item) => (
          <li key={item.id}>
            <LinkComponent
              href={item.href || '#'}
              onClick={() => onItemClick?.(item)}
              className={cn(
                'flex items-center justify-between gap-4 py-3 hover:bg-krds-gray-5 -mx-2 px-2 rounded transition-colors',
                item.pinned && 'bg-krds-primary-5'
              )}
            >
              <div className="flex items-center gap-2 min-w-0">
                {item.category && (
                  <Badge variant={item.pinned ? 'primary' : 'gray'} size="md">
                    {item.category}
                  </Badge>
                )}
                <span
                  className={cn(
                    'text-sm text-krds-gray-80 truncate',
                    item.pinned && 'font-semibold'
                  )}
                >
                  {item.title}
                </span>
                {item.isNew && (
                  <Badge variant="error" size="md">
                    N
                  </Badge>
                )}
              </div>
              <Body
                size="sm"
                className="text-krds-gray-60 shrink-0 tabular-nums"
              >
                {item.date}
              </Body>
            </LinkComponent>
          </li>
        ))}
      </ul>
    </section>
  );
}

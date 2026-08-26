'use client';

import * as React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
} from '../card';
import { Button } from '../button';
import { Badge } from '../badge';
import { Select } from '../select';
import { Checkbox } from '../checkbox';
import { cn } from '@/lib/utils';
import { RotateCcw, Trash2, AlertTriangle } from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

/** 삭제된 항목의 원본 유형 */
export type TrashItemType = 'PAGE' | 'POST' | 'MEDIA' | 'MENU';

/** 삭제된 항목 데이터 */
export interface TrashItemData {
  /** 항목 ID */
  id: number;
  /** 항목 제목 */
  title: string;
  /** 원본 유형 */
  type: TrashItemType;
  /** 삭제한 사용자 */
  deletedBy: string;
  /** 삭제 일시 */
  deletedAt: string;
  /** 자동 영구삭제까지 남은 일수 */
  daysLeft?: number;
}

// ============================================================================
// TrashList Props
// ============================================================================

export interface TrashListProps {
  /** 삭제된 항목 목록 */
  items: TrashItemData[];
  /** 복구 핸들러 */
  onRestore?: (ids: number[]) => void;
  /** 영구삭제 핸들러 */
  onPermanentDelete?: (ids: number[]) => void;
  /** 추가 className */
  className?: string;
}

// ============================================================================
// Helpers
// ============================================================================

const TYPE_LABELS: Record<TrashItemType, string> = {
  PAGE: '페이지',
  POST: '게시글',
  MEDIA: '미디어',
  MENU: '메뉴',
};

const TYPE_FILTER_OPTIONS = [
  { label: '전체', value: 'ALL' },
  { label: '페이지', value: 'PAGE' },
  { label: '게시글', value: 'POST' },
  { label: '미디어', value: 'MEDIA' },
  { label: '메뉴', value: 'MENU' },
];

function getTypeBadgeVariant(type: TrashItemType) {
  switch (type) {
    case 'PAGE':
      return 'primary' as const;
    case 'POST':
      return 'info' as const;
    case 'MEDIA':
      return 'warning' as const;
    case 'MENU':
      return 'secondary' as const;
  }
}

// ============================================================================
// TrashList Component
// ============================================================================

/**
 * 휴지통 목록 블록
 *
 * 삭제된 항목을 목록으로 표시하고 복구/영구삭제 기능을 제공.
 * - 유형별 필터링 (페이지/게시글/미디어/메뉴)
 * - 체크박스 일괄 선택
 * - 복구 및 영구삭제 일괄 작업
 * - 자동 영구삭제 남은 일수 표시
 */
export function TrashList({
  items,
  onRestore,
  onPermanentDelete,
  className,
}: TrashListProps) {
  const [filterType, setFilterType] = React.useState('ALL');
  const [selectedIds, setSelectedIds] = React.useState<Set<number>>(new Set());

  const filteredItems =
    filterType === 'ALL'
      ? items
      : items.filter((item) => item.type === filterType);

  const allSelected =
    filteredItems.length > 0 &&
    filteredItems.every((item) => selectedIds.has(item.id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredItems.map((item) => item.id)));
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleRestore = () => {
    if (selectedIds.size > 0) {
      onRestore?.(Array.from(selectedIds));
      setSelectedIds(new Set());
    }
  };

  const handlePermanentDelete = () => {
    if (selectedIds.size > 0) {
      onPermanentDelete?.(Array.from(selectedIds));
      setSelectedIds(new Set());
    }
  };

  return (
    <Card variant="outlined" className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>휴지통</CardTitle>
            <CardDescription>
              삭제된 항목을 복구하거나 영구 삭제합니다. 30일 후 자동
              영구삭제됩니다.
            </CardDescription>
          </div>
          <div
            className="w-40"
            role="group"
            aria-labelledby="trash-filter-label"
          >
            <span id="trash-filter-label" className="sr-only">
              유형 필터
            </span>
            <Select
              options={TYPE_FILTER_OPTIONS}
              value={filterType}
              onChange={(value) => {
                setFilterType(value);
                setSelectedIds(new Set());
              }}
              size="sm"
              placeholder="유형 필터"
            />
          </div>
        </div>
      </CardHeader>

      <CardBody className="p-0">
        {/* 일괄 작업 바 */}
        {selectedIds.size > 0 && (
          <div
            className="flex items-center justify-between px-4 py-2 bg-krds-primary-5 border-b border-krds-gray-20"
            role="status"
            aria-live="polite"
          >
            <span className="text-sm text-krds-primary-base font-medium">
              {selectedIds.size}개 선택됨
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                iconLeft={<RotateCcw className="w-4 h-4" />}
                onClick={handleRestore}
              >
                복구
              </Button>
              <Button
                variant="danger"
                size="sm"
                iconLeft={<Trash2 className="w-4 h-4" />}
                onClick={handlePermanentDelete}
              >
                영구삭제
              </Button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="sr-only">휴지통 항목 목록</caption>
            <thead>
              <tr className="border-b border-krds-gray-20 bg-krds-gray-5">
                <th scope="col" className="w-12 py-3 px-4">
                  <Checkbox
                    size="sm"
                    checked={allSelected}
                    onCheckedChange={toggleSelectAll}
                    aria-label="전체 선택"
                  />
                </th>
                <th
                  scope="col"
                  className="text-left py-3 px-4 font-medium text-krds-gray-70"
                >
                  제목
                </th>
                <th
                  scope="col"
                  className="text-left py-3 px-4 font-medium text-krds-gray-70"
                >
                  유형
                </th>
                <th
                  scope="col"
                  className="text-left py-3 px-4 font-medium text-krds-gray-70"
                >
                  삭제자
                </th>
                <th
                  scope="col"
                  className="text-left py-3 px-4 font-medium text-krds-gray-70"
                >
                  삭제일
                </th>
                <th
                  scope="col"
                  className="text-right py-3 px-4 font-medium text-krds-gray-70"
                >
                  남은 일수
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-8 text-krds-gray-50"
                  >
                    휴지통이 비어 있습니다.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className={cn(
                      'border-b border-krds-gray-10 hover:bg-krds-gray-5 transition-colors',
                      selectedIds.has(item.id) && 'bg-krds-primary-5'
                    )}
                  >
                    <td className="py-3 px-4">
                      <Checkbox
                        size="sm"
                        checked={selectedIds.has(item.id)}
                        onCheckedChange={() => toggleSelect(item.id)}
                        aria-label={`${item.title} 선택`}
                      />
                    </td>
                    <td className="py-3 px-4 font-medium text-krds-gray-90">
                      {item.title}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={getTypeBadgeVariant(item.type)}>
                        {TYPE_LABELS[item.type]}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-krds-gray-70">
                      {item.deletedBy}
                    </td>
                    <td className="py-3 px-4 text-krds-gray-50">
                      {item.deletedAt}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {item.daysLeft !== undefined && (
                        <span
                          className={cn(
                            'text-sm font-medium',
                            item.daysLeft <= 7
                              ? 'text-krds-danger-base'
                              : 'text-krds-gray-50'
                          )}
                        >
                          {item.daysLeft <= 7 && (
                            <>
                              <AlertTriangle
                                className="w-3.5 h-3.5 inline mr-1 align-text-bottom"
                                aria-hidden="true"
                              />
                              <span className="sr-only">만료 임박: </span>
                            </>
                          )}
                          {item.daysLeft}일
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
}

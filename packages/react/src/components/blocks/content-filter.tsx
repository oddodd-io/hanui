'use client';

import * as React from 'react';
import { Input } from '../input';
import { Button } from '../button';
import { Select, type SelectOption } from '../select';
import { DateInput } from '../date-input';
import { cn } from '@/lib/utils';
import { Search, RotateCcw } from 'lucide-react';

// ============================================================================
// 타입 정의
// ============================================================================

/** 필터 상태 */
export interface FilterState {
  /** 게시물 상태 (전체/발행됨/임시저장/비공개/예약) */
  status: string;
  /** 카테고리 (전체/소식/정책/사업안내/채용/기타) */
  category: string;
  /** 기간 필터 시작일 (YYYY-MM-DD) */
  startDate: string;
  /** 기간 필터 종료일 (YYYY-MM-DD) */
  endDate: string;
  /** 검색어 */
  query: string;
}

export interface ContentFilterProps {
  /** 필터 변경 핸들러 */
  onFilterChange?: (filters: FilterState) => void;
  /** 초기 필터 값 */
  initialFilters?: Partial<FilterState>;
  /** 상태 옵션 커스터마이징 */
  statusOptions?: SelectOption[];
  /** 카테고리 옵션 커스터마이징 */
  categoryOptions?: SelectOption[];
  /** 추가 className */
  className?: string;
}

// ============================================================================
// 기본 옵션
// ============================================================================

const DEFAULT_STATUS_OPTIONS: SelectOption[] = [
  { value: 'all', label: '전체 상태' },
  { value: 'published', label: '발행됨' },
  { value: 'draft', label: '임시저장' },
  { value: 'private', label: '비공개' },
  { value: 'scheduled', label: '예약' },
];

const DEFAULT_CATEGORY_OPTIONS: SelectOption[] = [
  { value: 'all', label: '전체 카테고리' },
  { value: 'news', label: '소식' },
  { value: 'policy', label: '정책' },
  { value: 'project', label: '사업안내' },
  { value: 'recruit', label: '채용' },
  { value: 'etc', label: '기타' },
];

const INITIAL_FILTERS: FilterState = {
  status: 'all',
  category: 'all',
  startDate: '',
  endDate: '',
  query: '',
};

// ============================================================================
// ContentFilter 블록
// ============================================================================

export function ContentFilter({
  onFilterChange,
  initialFilters,
  statusOptions = DEFAULT_STATUS_OPTIONS,
  categoryOptions = DEFAULT_CATEGORY_OPTIONS,
  className,
}: ContentFilterProps) {
  const [filters, setFilters] = React.useState<FilterState>({
    ...INITIAL_FILTERS,
    ...initialFilters,
  });

  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    onFilterChange?.(next);
  };

  const handleReset = () => {
    const reset = { ...INITIAL_FILTERS, ...initialFilters };
    setFilters(reset);
    onFilterChange?.(reset);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange?.(filters);
  };

  return (
    <form
      onSubmit={handleSearch}
      className={cn(
        'rounded-lg border border-krds-gray-20 bg-krds-gray-5/50 p-4',
        className
      )}
    >
      <div className="flex flex-wrap items-end gap-3">
        {/* 상태 필터 */}
        <div className="w-36">
          <label className="mb-1 block text-xs font-medium text-krds-gray-60">
            상태
          </label>
          <Select
            options={statusOptions}
            value={filters.status}
            onChange={(value) => updateFilter('status', value)}
            size="sm"
          />
        </div>

        {/* 카테고리 필터 */}
        <div className="w-40">
          <label className="mb-1 block text-xs font-medium text-krds-gray-60">
            카테고리
          </label>
          <Select
            options={categoryOptions}
            value={filters.category}
            onChange={(value) => updateFilter('category', value)}
            size="sm"
          />
        </div>

        {/* 기간 필터 */}
        <div className="flex items-end gap-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-krds-gray-60">
              시작일
            </label>
            <DateInput
              value={filters.startDate}
              onChange={(value) => updateFilter('startDate', value)}
              showCalendarButton
              placeholder="YYYY-MM-DD"
            />
          </div>
          <span className="mb-2 text-krds-gray-60">~</span>
          <div>
            <label className="mb-1 block text-xs font-medium text-krds-gray-60">
              종료일
            </label>
            <DateInput
              value={filters.endDate}
              onChange={(value) => updateFilter('endDate', value)}
              showCalendarButton
              placeholder="YYYY-MM-DD"
            />
          </div>
        </div>

        {/* 검색 */}
        <div className="min-w-48 flex-1">
          <label className="mb-1 block text-xs font-medium text-krds-gray-60">
            검색
          </label>
          <Input
            type="text"
            placeholder="제목, 내용으로 검색"
            value={filters.query}
            onChange={(e) => updateFilter('query', e.target.value)}
            clearable
            size="sm"
          />
        </div>

        {/* 버튼 */}
        <div className="flex gap-2">
          <Button type="submit" variant="primary" size="sm">
            <Search className="mr-1 h-4 w-4" />
            검색
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
          >
            <RotateCcw className="mr-1 h-4 w-4" />
            초기화
          </Button>
        </div>
      </div>
    </form>
  );
}

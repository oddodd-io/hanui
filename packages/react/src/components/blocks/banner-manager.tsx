'use client';

// ============================================================================
// Types
// ============================================================================

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardBody } from '../card';
import { Button } from '../button';
import { Badge } from '../badge';
import { Switch } from '../switch';
import { Body } from '../body';
import { Plus, GripVertical, Pencil, Trash2, Image } from 'lucide-react';
import { cn } from '@/lib/utils';

export type BannerType = 'banner' | 'popup';

export interface BannerItem {
  /** 배너 ID */
  id: number;
  /** 배너 제목 */
  title: string;
  /** 배너 유형 */
  type: BannerType;
  /** 배너 이미지 URL */
  imageUrl?: string;
  /** 링크 URL */
  linkUrl?: string;
  /** 표시 순서 */
  order: number;
  /** 활성 상태 */
  isActive: boolean;
  /** 시작일 */
  startDate?: string;
  /** 종료일 */
  endDate?: string;
}

export interface BannerManagerProps {
  /** 배너 목록 */
  items: BannerItem[];
  /** 새 배너 추가 */
  onAdd?: (type: BannerType) => void;
  /** 배너 수정 */
  onEdit?: (id: number) => void;
  /** 배너 삭제 */
  onDelete?: (id: number) => void;
  /** 활성 상태 토글 */
  onToggleActive?: (id: number, isActive: boolean) => void;
  /** 순서 변경 */
  onReorder?: (items: BannerItem[]) => void;
  /** 추가 className */
  className?: string;
}

// ============================================================================
// Helpers
// ============================================================================

function getTypeLabel(type: BannerType): string {
  return type === 'banner' ? '배너' : '팝업';
}

function getDateStatus(
  startDate?: string,
  endDate?: string
): { label: string; variant: 'success' | 'warning' | 'gray' } {
  if (!startDate && !endDate) return { label: '상시', variant: 'gray' };

  const now = new Date();
  if (startDate && new Date(startDate) > now)
    return { label: '예정', variant: 'warning' };
  if (endDate && new Date(endDate) < now)
    return { label: '종료', variant: 'gray' };
  return { label: '진행중', variant: 'success' };
}

// ============================================================================
// BannerManager Component
// ============================================================================

export function BannerManager({
  items,
  onAdd,
  onEdit,
  onDelete,
  onToggleActive,
  onReorder,
  className,
}: BannerManagerProps) {
  const [activeTab, setActiveTab] = React.useState<BannerType>('banner');
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);

  const filteredItems = items
    .filter((item) => item.type === activeTab)
    .sort((a, b) => a.order - b.order);

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;

    const reordered = [...filteredItems];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(index, 0, moved);

    const updated = reordered.map((item, i) => ({ ...item, order: i }));
    onReorder?.(updated);
    setDragIndex(index);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  return (
    <Card variant="outlined" className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>배너/팝업 관리</CardTitle>
          <Button
            variant="primary"
            size="sm"
            iconLeft={<Plus className="w-4 h-4" />}
            onClick={() => onAdd?.(activeTab)}
          >
            {getTypeLabel(activeTab)} 추가
          </Button>
        </div>
      </CardHeader>

      <CardBody className="space-y-4">
        {/* 탭 */}
        <div className="flex gap-1 p-1 bg-krds-gray-5 rounded-lg w-fit">
          {(['banner', 'popup'] as BannerType[]).map((type) => {
            const count = items.filter((i) => i.type === type).length;
            return (
              <button type="button"
                key={type}
                onClick={() => setActiveTab(type)}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                  activeTab === type
                    ? 'bg-white text-krds-gray-95 shadow-sm'
                    : 'text-krds-gray-60 hover:text-krds-gray-80'
                )}
              >
                {getTypeLabel(type)} ({count})
              </button>
            );
          })}
        </div>

        {/* 목록 */}
        {filteredItems.length === 0 ? (
          <div className="py-12 text-center">
            <Image className="w-8 h-8 mx-auto mb-2 text-krds-gray-40" />
            <Body size="sm" className="text-krds-gray-50">
              등록된 {getTypeLabel(activeTab)}이 없습니다
            </Body>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredItems.map((item, index) => {
              const dateStatus = getDateStatus(item.startDate, item.endDate);
              return (
                <div
                  key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg border border-krds-gray-20 bg-white transition-colors',
                    dragIndex === index && 'opacity-50',
                    'hover:border-krds-gray-30'
                  )}
                >
                  {/* 드래그 핸들 */}
                  <button type="button"
                    className="cursor-grab text-krds-gray-40 hover:text-krds-gray-60"
                    aria-label="순서 변경"
                  >
                    <GripVertical className="w-4 h-4" />
                  </button>

                  {/* 썸네일 */}
                  <div className="w-16 h-10 rounded bg-krds-gray-10 flex items-center justify-center shrink-0 overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image className="w-4 h-4 text-krds-gray-40" />
                    )}
                  </div>

                  {/* 정보 */}
                  <div className="flex-1 min-w-0">
                    <Body size="sm" weight="medium" className="truncate">
                      {item.title}
                    </Body>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant={dateStatus.variant} size="md">
                        {dateStatus.label}
                      </Badge>
                      {item.startDate && (
                        <Body size="xs" className="text-krds-gray-50">
                          {item.startDate}
                          {item.endDate ? ` ~ ${item.endDate}` : ''}
                        </Body>
                      )}
                    </div>
                  </div>

                  {/* 활성 토글 */}
                  <Switch
                    checked={item.isActive}
                    onCheckedChange={(checked) =>
                      onToggleActive?.(item.id, checked)
                    }
                    aria-label={`${item.title} 활성화`}
                  />

                  {/* 액션 */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit?.(item.id)}
                      aria-label="수정"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete?.(item.id)}
                      aria-label="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

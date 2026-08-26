'use client';

// ============================================================================
// Types
// ============================================================================

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardBody } from '../card';
import { Button } from '../button';
import { Input } from '../input';
import { Body } from '../body';
import {
  Plus,
  GripVertical,
  Pencil,
  Trash2,
  ChevronRight,
  ChevronDown,
  Check,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MenuItem {
  /** 메뉴 ID */
  id: number;
  /** 메뉴 이름 */
  name: string;
  /** 메뉴 URL */
  url: string;
  /** 부모 메뉴 ID (최상위면 null) */
  parentId: number | null;
  /** 표시 순서 */
  order: number;
  /** 활성 상태 */
  isActive: boolean;
  /** 하위 메뉴 */
  children?: MenuItem[];
}

export interface MenuManagerProps {
  /** 메뉴 목록 (트리 구조) */
  items: MenuItem[];
  /** 메뉴 추가 */
  onAdd?: (parentId: number | null) => void;
  /** 메뉴 수정 */
  onEdit?: (id: number, data: { name: string; url: string }) => void;
  /** 메뉴 삭제 */
  onDelete?: (id: number) => void;
  /** 순서 변경 */
  onReorder?: (items: MenuItem[]) => void;
  /** 추가 className */
  className?: string;
}

// ============================================================================
// MenuItemRow Component
// ============================================================================

function MenuItemRow({
  item,
  depth,
  onAdd,
  onEdit,
  onDelete,
}: {
  item: MenuItem;
  depth: number;
  onAdd?: (parentId: number | null) => void;
  onEdit?: (id: number, data: { name: string; url: string }) => void;
  onDelete?: (id: number) => void;
}) {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editName, setEditName] = React.useState(item.name);
  const [editUrl, setEditUrl] = React.useState(item.url);
  const hasChildren = item.children && item.children.length > 0;

  const handleSave = () => {
    onEdit?.(item.id, { name: editName, url: editUrl });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(item.name);
    setEditUrl(item.url);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') handleCancel();
  };

  return (
    <>
      <div
        className={cn(
          'flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-krds-gray-5 group transition-colors',
          !item.isActive && 'opacity-50'
        )}
        style={{ paddingLeft: `${depth * 24 + 12}px` }}
      >
        {/* 드래그 핸들 */}
        <button
          type="button"
          className="cursor-grab text-krds-gray-30 hover:text-krds-gray-60 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="순서 변경"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        {/* 확장/축소 */}
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-krds-gray-50 hover:text-krds-gray-80"
            aria-label={isExpanded ? '접기' : '펼치기'}
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        ) : (
          <span className="w-4" />
        )}

        {/* 이름/URL */}
        {isEditing ? (
          <div className="flex-1 flex items-center gap-2">
            <Input
              size="sm"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="메뉴 이름"
              className="w-32"
              // 사용자가 '이름 변경'을 누른 직후에만 렌더되는 입력이라
              // 포커스를 옮기는 것이 기대 동작이다.
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
            <Input
              size="sm"
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="/url"
              className="w-40"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSave}
              aria-label="저장"
            >
              <Check className="w-4 h-4 text-green-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              aria-label="취소"
            >
              <X className="w-4 h-4 text-krds-gray-50" />
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 min-w-0">
              <Body size="sm" weight="medium" className="truncate">
                {item.name}
              </Body>
            </div>
            <Body size="xs" className="text-krds-gray-50 hidden sm:block">
              {item.url}
            </Body>
          </>
        )}

        {/* 액션 */}
        {!isEditing && (
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {depth < 2 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onAdd?.(item.id)}
                aria-label="하위 메뉴 추가"
              >
                <Plus className="w-3.5 h-3.5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
              aria-label="수정"
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete?.(item.id)}
              aria-label="삭제"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      </div>

      {/* 하위 메뉴 */}
      {hasChildren && isExpanded && (
        <div>
          {item
            .children!.sort((a, b) => a.order - b.order)
            .map((child) => (
              <MenuItemRow
                key={child.id}
                item={child}
                depth={depth + 1}
                onAdd={onAdd}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
        </div>
      )}
    </>
  );
}

// ============================================================================
// MenuManager Component
// ============================================================================

export function MenuManager({
  items,
  onAdd,
  onEdit,
  onDelete,
  className,
}: MenuManagerProps) {
  const sortedItems = [...items].sort((a, b) => a.order - b.order);

  return (
    <Card variant="outlined" className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>메뉴 관리</CardTitle>
            <Body size="sm" className="text-krds-gray-60 mt-1">
              드래그로 순서를 변경하고 이름을 클릭하여 수정하세요
            </Body>
          </div>
          <Button
            variant="primary"
            size="sm"
            iconLeft={<Plus className="w-4 h-4" />}
            onClick={() => onAdd?.(null)}
          >
            메뉴 추가
          </Button>
        </div>
      </CardHeader>

      <CardBody>
        {sortedItems.length === 0 ? (
          <div className="py-12 text-center">
            <Body size="sm" className="text-krds-gray-50">
              등록된 메뉴가 없습니다
            </Body>
          </div>
        ) : (
          <div className="divide-y divide-krds-gray-10">
            {sortedItems.map((item) => (
              <MenuItemRow
                key={item.id}
                item={item}
                depth={0}
                onAdd={onAdd}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

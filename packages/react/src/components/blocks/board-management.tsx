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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../tabs';
import { cn } from '@/lib/utils';
import { Plus, Pencil, Trash2, Pin, PinOff } from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

/** 게시글 상태 */
export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'HIDDEN';

/** 게시판 데이터 */
export interface BoardData {
  /** 게시판 ID */
  id: number;
  /** 게시판 이름 */
  name: string;
  /** 게시판 슬러그 */
  slug: string;
  /** 게시글 수 */
  postCount: number;
}

/** 게시글 데이터 */
export interface PostData {
  /** 게시글 ID */
  id: number;
  /** 게시글 제목 */
  title: string;
  /** 작성자 */
  author: string;
  /** 게시판 ID */
  boardId: number;
  /** 상태 */
  status: PostStatus;
  /** 고정 여부 */
  isPinned: boolean;
  /** 조회수 */
  views: number;
  /** 작성일 */
  createdAt: string;
}

// ============================================================================
// BoardManagement Props
// ============================================================================

export interface BoardManagementProps {
  /** 게시판 목록 */
  boards: BoardData[];
  /** 게시글 목록 */
  posts: PostData[];
  /** 새 글 작성 핸들러 */
  onNewPost?: (boardId: number) => void;
  /** 게시글 수정 핸들러 */
  onEditPost?: (postId: number) => void;
  /** 게시글 삭제 핸들러 */
  onDeletePost?: (postIds: number[]) => void;
  /** 게시글 고정/해제 핸들러 */
  onTogglePin?: (postId: number, pinned: boolean) => void;
  /** 추가 className */
  className?: string;
}

// ============================================================================
// Helpers
// ============================================================================

const STATUS_LABELS: Record<PostStatus, string> = {
  DRAFT: '임시저장',
  PUBLISHED: '게시중',
  HIDDEN: '숨김',
};

function getStatusBadgeVariant(status: PostStatus) {
  switch (status) {
    case 'PUBLISHED':
      return 'success' as const;
    case 'DRAFT':
      return 'warning' as const;
    case 'HIDDEN':
      return 'secondary' as const;
  }
}

const STATUS_FILTER_OPTIONS = [
  { label: '전체 상태', value: 'ALL' },
  { label: '게시중', value: 'PUBLISHED' },
  { label: '임시저장', value: 'DRAFT' },
  { label: '숨김', value: 'HIDDEN' },
];

// ============================================================================
// BoardManagement Component
// ============================================================================

/**
 * 게시판 관리 블록
 *
 * 게시판별 탭으로 게시글을 관리.
 * - 게시판별 탭 전환
 * - 상태 필터 (게시중/임시저장/숨김)
 * - 체크박스 일괄 선택 + 일괄 삭제
 * - 고정/해제, 수정, 삭제 개별 작업
 */
export function BoardManagement({
  boards,
  posts,
  onNewPost,
  onEditPost,
  onDeletePost,
  onTogglePin,
  className,
}: BoardManagementProps) {
  const [activeBoardId, setActiveBoardId] = React.useState<number>(
    boards[0]?.id ?? 0
  );
  const [statusFilter, setStatusFilter] = React.useState('ALL');
  const [selectedIds, setSelectedIds] = React.useState<Set<number>>(new Set());

  const boardPosts = React.useMemo(() => {
    let filtered = posts.filter((p) => p.boardId === activeBoardId);
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }
    return filtered;
  }, [posts, activeBoardId, statusFilter]);

  const allSelected =
    boardPosts.length > 0 && boardPosts.every((p) => selectedIds.has(p.id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(boardPosts.map((p) => p.id)));
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

  const handleBoardChange = (boardId: string) => {
    setActiveBoardId(Number(boardId));
    setSelectedIds(new Set());
    setStatusFilter('ALL');
  };

  const handleBulkDelete = () => {
    if (selectedIds.size > 0) {
      onDeletePost?.(Array.from(selectedIds));
      setSelectedIds(new Set());
    }
  };

  return (
    <Card variant="outlined" className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>게시판 관리</CardTitle>
            <CardDescription>
              게시글을 관리하고 새 글을 작성합니다.
            </CardDescription>
          </div>
          <Button
            variant="primary"
            size="sm"
            iconLeft={<Plus className="w-4 h-4" />}
            onClick={() => onNewPost?.(activeBoardId)}
          >
            새 글 작성
          </Button>
        </div>
      </CardHeader>

      <CardBody className="p-0">
        {/* 게시판 탭 */}
        <Tabs
          value={String(activeBoardId)}
          onValueChange={handleBoardChange}
          size="sm"
        >
          <TabsList>
            {boards.map((board) => (
              <TabsTrigger key={board.id} value={String(board.id)}>
                {board.name}
                <span className="ml-1.5 text-xs text-krds-gray-50">
                  ({board.postCount})
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {boards.map((board) => (
            <TabsContent key={board.id} value={String(board.id)}>
              {/* 필터 + 일괄 작업 */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-krds-gray-20">
                <div
                  className="w-40"
                  role="group"
                  aria-labelledby="board-status-filter-label"
                >
                  <span id="board-status-filter-label" className="sr-only">
                    상태 필터
                  </span>
                  <Select
                    options={STATUS_FILTER_OPTIONS}
                    value={statusFilter}
                    onChange={(value) => {
                      setStatusFilter(value);
                      setSelectedIds(new Set());
                    }}
                    size="sm"
                  />
                </div>
                {selectedIds.size > 0 && (
                  <div
                    className="flex items-center gap-2"
                    role="status"
                    aria-live="polite"
                  >
                    <span className="text-sm text-krds-primary-base font-medium">
                      {selectedIds.size}개 선택
                    </span>
                    <Button
                      variant="danger"
                      size="sm"
                      iconLeft={<Trash2 className="w-4 h-4" />}
                      onClick={handleBulkDelete}
                    >
                      삭제
                    </Button>
                  </div>
                )}
              </div>

              {/* 게시글 테이블 */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <caption className="sr-only">게시판 목록</caption>
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
                        작성자
                      </th>
                      <th
                        scope="col"
                        className="text-left py-3 px-4 font-medium text-krds-gray-70"
                      >
                        상태
                      </th>
                      <th
                        scope="col"
                        className="text-right py-3 px-4 font-medium text-krds-gray-70"
                      >
                        조회수
                      </th>
                      <th
                        scope="col"
                        className="text-left py-3 px-4 font-medium text-krds-gray-70"
                      >
                        작성일
                      </th>
                      <th
                        scope="col"
                        className="text-right py-3 px-4 font-medium text-krds-gray-70"
                      >
                        관리
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {boardPosts.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="text-center py-8 text-krds-gray-50"
                        >
                          게시글이 없습니다.
                        </td>
                      </tr>
                    ) : (
                      boardPosts.map((post) => (
                        <tr
                          key={post.id}
                          className={cn(
                            'border-b border-krds-gray-10 hover:bg-krds-gray-5 transition-colors',
                            selectedIds.has(post.id) && 'bg-krds-primary-5',
                            post.isPinned && 'bg-krds-warning-5'
                          )}
                        >
                          <td className="py-3 px-4">
                            <Checkbox
                              size="sm"
                              checked={selectedIds.has(post.id)}
                              onCheckedChange={() => toggleSelect(post.id)}
                              aria-label={`${post.title} 선택`}
                            />
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              {post.isPinned && (
                                <Pin className="w-3.5 h-3.5 text-krds-warning-40 flex-shrink-0" />
                              )}
                              <span className="font-medium text-krds-gray-90 truncate max-w-xs">
                                {post.title}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-krds-gray-70">
                            {post.author}
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={getStatusBadgeVariant(post.status)}>
                              {STATUS_LABELS[post.status]}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-right text-krds-gray-50">
                            {post.views.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-krds-gray-50">
                            {post.createdAt}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() =>
                                  onTogglePin?.(post.id, !post.isPinned)
                                }
                                className="p-2 rounded-md text-krds-gray-50 hover:text-krds-warning-40 hover:bg-krds-warning-5 transition-colors cursor-pointer border-0 bg-transparent"
                                aria-label={
                                  post.isPinned
                                    ? `${post.title} 고정 해제`
                                    : `${post.title} 고정`
                                }
                                title={
                                  post.isPinned ? '고정 해제' : '상단 고정'
                                }
                              >
                                {post.isPinned ? (
                                  <PinOff className="w-4 h-4" />
                                ) : (
                                  <Pin className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => onEditPost?.(post.id)}
                                className="p-2 rounded-md text-krds-gray-50 hover:text-krds-gray-90 hover:bg-krds-gray-10 transition-colors cursor-pointer border-0 bg-transparent"
                                aria-label={`${post.title} 수정`}
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => onDeletePost?.([post.id])}
                                className="p-2 rounded-md text-krds-gray-50 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer border-0 bg-transparent"
                                aria-label={`${post.title} 삭제`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardBody>
    </Card>
  );
}

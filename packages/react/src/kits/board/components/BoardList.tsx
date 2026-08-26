/**
 * Board Kit - BoardList Component
 * 게시글 목록 (검색, 정렬, 페이지네이션)
 */

'use client';

import { usePosts } from '../hooks/useBoard';
import {
  useBoardStore,
  useBoardFilters,
  useBoardSelection,
} from '../store/boardStore';
import { BoardItem } from './BoardItem';
import type { Post } from '../types/board';

// HANUI 컴포넌트 (프로젝트에 맞게 경로 수정)
// import { Button } from '@/components/hanui/button'
// import { Input } from '@/components/hanui/input'
// import { Pagination } from '@/components/hanui/pagination'

interface BoardListProps {
  onItemClick?: (post: Post) => void;
  onWriteClick?: () => void;
}

export function BoardList({ onItemClick, onWriteClick }: BoardListProps) {
  const { searchKeyword, sortBy, page, limit } = useBoardFilters();
  const { setSearchKeyword, setSortBy, setPage } = useBoardStore();
  const { selectedIds, toggleSelect, selectAll, clearSelection } =
    useBoardSelection();

  const { data, isLoading, error } = usePosts({
    page,
    limit,
    search: searchKeyword,
    sortBy,
  });

  const posts = data?.data || [];
  const pagination = data?.pagination;

  // 전체 선택/해제
  const handleSelectAll = () => {
    if (selectedIds.length === posts.length) {
      clearSelection();
    } else {
      selectAll(posts.map((p) => p.id));
    }
  };

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        데이터를 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 검색 및 필터 */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {/* 검색 입력 */}
          <input
            type="text"
            aria-label="검색어"
            placeholder="검색어를 입력하세요"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="px-3 py-2 border rounded-md"
          />

          {/* 정렬 선택 */}
          <select
            aria-label="정렬 기준"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="latest">최신순</option>
            <option value="oldest">오래된순</option>
            <option value="views">조회순</option>
          </select>
        </div>

        {/* 글쓰기 버튼 */}
        <button type="button"
          onClick={onWriteClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          글쓰기
        </button>
      </div>

      {/* 게시글 목록 */}
      <div className="border rounded-md">
        {/* 테이블 헤더 */}
        <div className="flex items-center gap-4 px-4 py-3 bg-gray-50 border-b font-medium">
          <input
            type="checkbox"
            aria-label="전체 선택"
            checked={posts.length > 0 && selectedIds.length === posts.length}
            onChange={handleSelectAll}
            className="w-4 h-4"
          />
          <span className="flex-1">제목</span>
          <span className="w-24 text-center">작성자</span>
          <span className="w-24 text-center">작성일</span>
          <span className="w-16 text-center">조회</span>
        </div>

        {/* 로딩 상태 */}
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">로딩 중...</div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            게시글이 없습니다.
          </div>
        ) : (
          posts.map((post) => (
            <BoardItem
              key={post.id}
              post={post}
              isSelected={selectedIds.includes(post.id)}
              onSelect={() => toggleSelect(post.id)}
              onClick={() => onItemClick?.(post)}
            />
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <nav className="flex items-center gap-1">
            <button type="button"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              이전
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (p) => (
                <button type="button"
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1 border rounded ${
                    p === page ? 'bg-blue-600 text-white' : ''
                  }`}
                >
                  {p}
                </button>
              )
            )}
            <button type="button"
              onClick={() => setPage(page + 1)}
              disabled={page === pagination.totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              다음
            </button>
          </nav>
        </div>
      )}

      {/* 선택된 항목 액션 */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-gray-800 text-white rounded-lg shadow-lg flex items-center gap-4">
          <span>{selectedIds.length}개 선택됨</span>
          <button type="button"
            onClick={clearSelection}
            className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-700"
          >
            선택 해제
          </button>
          <button type="button" className="px-3 py-1 bg-red-600 rounded hover:bg-red-700">
            삭제
          </button>
        </div>
      )}
    </div>
  );
}

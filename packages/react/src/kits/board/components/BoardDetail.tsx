/**
 * Board Kit - BoardDetail Component
 * 게시글 상세 보기
 */

'use client';

import { usePost, useDeletePost } from '../hooks/useBoard';
import { useBoardDeleteModal } from '../store/boardStore';
import { BoardDeleteModal } from './BoardDeleteModal';
import type { Post } from '../types/board';

interface BoardDetailProps {
  postId: number;
  onBack?: () => void;
  onEdit?: (post: Post) => void;
}

export function BoardDetail({ postId, onBack, onEdit }: BoardDetailProps) {
  const { data: post, isLoading, error } = usePost(postId);
  const { openDeleteModal } = useBoardDeleteModal();
  const deletePost = useDeletePost();

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 파일 크기 포맷팅
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // 삭제 처리
  const handleDelete = async () => {
    try {
      await deletePost.mutateAsync(postId);
      onBack?.();
    } catch (error) {
      console.error('삭제 실패:', error);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">로딩 중...</div>;
  }

  if (error || !post) {
    return (
      <div className="p-8 text-center text-red-500">
        게시글을 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <button type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
        >
          ← 목록으로
        </button>
        <div className="flex items-center gap-2">
          <button type="button"
            onClick={() => onEdit?.(post)}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            수정
          </button>
          <button type="button"
            onClick={() => openDeleteModal(postId)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            삭제
          </button>
        </div>
      </div>

      {/* 게시글 내용 */}
      <article className="border rounded-lg">
        {/* 제목 영역 */}
        <div className="px-6 py-4 border-b">
          <h1 className="text-2xl font-bold">{post.title}</h1>
          <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
            <span>작성자: {post.author}</span>
            <span>작성일: {formatDate(post.createdAt)}</span>
            <span>조회수: {post.viewCount}</span>
          </div>
        </div>

        {/* 본문 영역 */}
        <div className="px-6 py-6 min-h-[200px]">
          <div className="prose max-w-none whitespace-pre-wrap">
            {post.content}
          </div>
        </div>

        {/* 첨부파일 */}
        {post.attachments && post.attachments.length > 0 && (
          <div className="px-6 py-4 border-t bg-gray-50">
            <h3 className="font-medium mb-2">첨부파일</h3>
            <ul className="space-y-1">
              {post.attachments.map((file) => (
                <li key={file.id}>
                  <a
                    href={file.url}
                    download={file.name}
                    className="flex items-center gap-2 text-blue-600 hover:underline"
                  >
                    <span>📎</span>
                    <span>{file.name}</span>
                    <span className="text-gray-400 text-sm">
                      ({formatFileSize(file.size)})
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>

      {/* 삭제 확인 모달 */}
      <BoardDeleteModal onConfirm={handleDelete} />
    </div>
  );
}

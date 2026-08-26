/**
 * Board Kit - BoardDeleteModal Component
 * 삭제 확인 모달
 */

'use client';

import { useBoardDeleteModal } from '../store/boardStore';

interface BoardDeleteModalProps {
  onConfirm: () => void;
}

export function BoardDeleteModal({ onConfirm }: BoardDeleteModalProps) {
  const { isDeleteModalOpen, closeDeleteModal } = useBoardDeleteModal();

  if (!isDeleteModalOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    closeDeleteModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div
        role="button"
        tabIndex={0}
        className="absolute inset-0 bg-black/50"
        onClick={closeDeleteModal}
        onKeyDown={(e) => e.key === 'Escape' && closeDeleteModal()}
      />

      {/* 모달 내용 */}
      <div className="relative bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
        <h2 className="text-lg font-bold mb-2">삭제 확인</h2>
        <p className="text-gray-600 mb-6">
          정말 이 게시글을 삭제하시겠습니까?
          <br />
          삭제된 게시글은 복구할 수 없습니다.
        </p>

        <div className="flex justify-end gap-2">
          <button type="button"
            onClick={closeDeleteModal}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            취소
          </button>
          <button type="button"
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}

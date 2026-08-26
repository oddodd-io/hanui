/**
 * Board Kit - BoardForm Component
 * 게시글 작성/수정 폼
 */

'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreatePost, useUpdatePost } from '../hooks/useBoard';
import type { Post, PostFormData } from '../types/board';

// 폼 유효성 검사 스키마
const postSchema = z.object({
  title: z
    .string()
    .min(1, '제목을 입력해주세요')
    .max(100, '제목은 100자 이내로 입력해주세요'),
  content: z
    .string()
    .min(1, '내용을 입력해주세요')
    .max(10000, '내용은 10000자 이내로 입력해주세요'),
});

type FormValues = z.infer<typeof postSchema>;

interface BoardFormProps {
  post?: Post; // 수정 시 기존 게시글 데이터
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function BoardForm({ post, onSuccess, onCancel }: BoardFormProps) {
  const isEdit = !!post;
  const [files, setFiles] = useState<File[]>([]);

  const createPost = useCreatePost();
  const updatePost = useUpdatePost();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post?.title || '',
      content: post?.content || '',
    },
  });

  // 파일 선택 처리
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  // 파일 제거
  const handleFileRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // 파일 크기 포맷팅
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // 폼 제출
  const onSubmit = async (data: FormValues) => {
    try {
      const formData: PostFormData = {
        ...data,
        attachments: files.length > 0 ? files : undefined,
      };

      if (isEdit && post) {
        await updatePost.mutateAsync({ id: post.id, data: formData });
      } else {
        await createPost.mutateAsync(formData);
      }

      onSuccess?.();
    } catch (error) {
      console.error('저장 실패:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 제목 */}
      <div>
        <label htmlFor="title" className="block font-medium mb-1">
          제목 <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          placeholder="제목을 입력하세요"
          className={`w-full px-3 py-2 border rounded-md ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          {...register('title')}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      {/* 내용 */}
      <div>
        <label htmlFor="content" className="block font-medium mb-1">
          내용 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          placeholder="내용을 입력하세요"
          rows={10}
          className={`w-full px-3 py-2 border rounded-md resize-none ${
            errors.content ? 'border-red-500' : 'border-gray-300'
          }`}
          {...register('content')}
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>
        )}
      </div>

      {/* 첨부파일 */}
      <div>
        <label htmlFor="board-form-files" className="block font-medium mb-1">
          첨부파일
        </label>
        <input
          id="board-form-files"
          type="file"
          multiple
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-medium
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />

        {/* 선택된 파일 목록 */}
        {files.length > 0 && (
          <ul className="mt-2 space-y-1">
            {files.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded"
              >
                <span className="text-sm">
                  {file.name} ({formatFileSize(file.size)})
                </span>
                <button
                  type="button"
                  onClick={() => handleFileRemove(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* 기존 첨부파일 (수정 시) */}
        {isEdit && post?.attachments && post.attachments.length > 0 && (
          <div className="mt-2">
            <p className="text-sm text-gray-500 mb-1">기존 첨부파일:</p>
            <ul className="space-y-1">
              {post.attachments.map((file) => (
                <li
                  key={file.id}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <span>📎</span>
                  <span>{file.name}</span>
                  <span className="text-gray-400">
                    ({formatFileSize(file.size)})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 버튼 */}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded-md hover:bg-gray-50"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? '저장 중...' : isEdit ? '수정' : '등록'}
        </button>
      </div>
    </form>
  );
}

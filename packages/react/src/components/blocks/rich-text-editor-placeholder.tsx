'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link,
  Image,
  Code,
  Quote,
  Minus,
  Undo,
  Redo,
  Type,
} from 'lucide-react';

// ============================================================================
// 타입 정의
// ============================================================================

export interface RichTextEditorPlaceholderProps {
  /** 본문 내용 */
  value?: string;
  /** 변경 핸들러 */
  onChange?: (value: string) => void;
  /** placeholder */
  placeholder?: string;
  /** 최소 높이 */
  minHeight?: string;
  /** 추가 className */
  className?: string;
}

// ============================================================================
// 툴바 버튼
// ============================================================================

interface ToolbarButtonProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

function ToolbarButton({ icon, label, active }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'rounded p-1.5 text-krds-gray-50 transition-colors hover:bg-krds-gray-10 hover:text-krds-gray-80',
        active && 'bg-krds-gray-10 text-krds-gray-90'
      )}
      aria-label={label}
      title={label}
    >
      {icon}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="mx-1 h-5 w-px bg-krds-gray-20" />;
}

// ============================================================================
// RichTextEditorPlaceholder 블록
// ============================================================================

export function RichTextEditorPlaceholder({
  value = '',
  onChange,
  placeholder = '내용을 입력하세요...',
  minHeight = '400px',
  className,
}: RichTextEditorPlaceholderProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg border border-krds-gray-20',
        className
      )}
    >
      {/* 툴바 */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-krds-gray-20 bg-krds-gray-5/50 px-2 py-1.5">
        {/* 텍스트 스타일 */}
        <ToolbarButton icon={<Type className="h-4 w-4" />} label="제목" />
        <ToolbarDivider />
        <ToolbarButton icon={<Bold className="h-4 w-4" />} label="굵게" />
        <ToolbarButton icon={<Italic className="h-4 w-4" />} label="기울임" />
        <ToolbarButton icon={<Underline className="h-4 w-4" />} label="밑줄" />
        <ToolbarButton
          icon={<Strikethrough className="h-4 w-4" />}
          label="취소선"
        />
        <ToolbarDivider />

        {/* 정렬 */}
        <ToolbarButton
          icon={<AlignLeft className="h-4 w-4" />}
          label="왼쪽 정렬"
          active
        />
        <ToolbarButton
          icon={<AlignCenter className="h-4 w-4" />}
          label="가운데 정렬"
        />
        <ToolbarButton
          icon={<AlignRight className="h-4 w-4" />}
          label="오른쪽 정렬"
        />
        <ToolbarDivider />

        {/* 목록 */}
        <ToolbarButton
          icon={<List className="h-4 w-4" />}
          label="글머리 목록"
        />
        <ToolbarButton
          icon={<ListOrdered className="h-4 w-4" />}
          label="번호 목록"
        />
        <ToolbarDivider />

        {/* 삽입 */}
        <ToolbarButton icon={<Link className="h-4 w-4" />} label="링크" />
        <ToolbarButton icon={<Image className="h-4 w-4" />} label="이미지" />
        <ToolbarButton icon={<Code className="h-4 w-4" />} label="코드" />
        <ToolbarButton icon={<Quote className="h-4 w-4" />} label="인용" />
        <ToolbarButton icon={<Minus className="h-4 w-4" />} label="구분선" />
        <ToolbarDivider />

        {/* 실행취소 */}
        <ToolbarButton icon={<Undo className="h-4 w-4" />} label="실행 취소" />
        <ToolbarButton icon={<Redo className="h-4 w-4" />} label="다시 실행" />
      </div>

      {/* 에디터 본문 */}
      <textarea
        className="block w-full resize-none bg-white p-4 text-krds-body-md text-krds-gray-90 placeholder:text-krds-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-krds-primary-60"
        style={{ minHeight }}
        placeholder={placeholder}
        aria-label="본문 내용"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}

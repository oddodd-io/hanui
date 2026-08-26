'use client';

import * as React from 'react';
import { Button } from '../button';
import { Badge } from '../badge';
import { Body } from '../body';
import { cn } from '@/lib/utils';

export interface FileItem {
  /** 파일명 */
  name: string;
  /** 파일 크기 (표시용, 예: "2.3MB") */
  size: string;
  /** 파일 확장자 */
  extension: string;
  /** 다운로드 URL */
  href: string;
}

export interface FileDownloadProps {
  /** 제목 */
  title?: string;
  /** 파일 목록 */
  files?: FileItem[];
  /** 다운로드 클릭 핸들러 */
  onDownload?: (file: FileItem) => void;
  /** 추가 className */
  className?: string;
}

const extensionColors: Record<string, string> = {
  hwp: 'primary',
  pdf: 'error',
  doc: 'info',
  docx: 'info',
  xls: 'success',
  xlsx: 'success',
  ppt: 'warning',
  pptx: 'warning',
  zip: 'gray',
};

const defaultFiles: FileItem[] = [
  {
    name: '2026년 상반기 사업계획서',
    size: '2.3MB',
    extension: 'hwp',
    href: '#',
  },
  {
    name: '개인정보 수집·이용 동의서',
    size: '150KB',
    extension: 'pdf',
    href: '#',
  },
  {
    name: '민원 접수 양식',
    size: '45KB',
    extension: 'docx',
    href: '#',
  },
];

/**
 * FileDownload 블록
 *
 * 첨부파일 다운로드 영역. 공공 웹사이트 게시글 하단에서 자주 사용됩니다.
 * 파일 확장자별 뱃지 색상, 파일 크기 표시를 지원합니다.
 */
export function FileDownload({
  title = '첨부파일',
  files = defaultFiles,
  onDownload,
  className,
}: FileDownloadProps) {
  if (files.length === 0) return null;

  return (
    <section
      className={cn('border border-krds-gray-20 rounded-lg p-4', className)}
      aria-label={title}
    >
      <h4 className="text-sm font-semibold text-krds-gray-70 mb-3">
        {title} ({files.length})
      </h4>

      <ul className="space-y-2" role="list">
        {files.map((file) => (
          <li
            key={file.href + file.name}
            className="flex items-center justify-between gap-3 py-2 px-3 rounded hover:bg-krds-gray-5 transition-colors"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Badge
                variant={
                  (extensionColors[file.extension.toLowerCase()] ||
                    'gray') as any
                }
                size="md"
              >
                {file.extension.toUpperCase()}
              </Badge>
              <span className="text-sm text-krds-gray-80 truncate">
                {file.name}
              </span>
              <Body size="xs" className="text-krds-gray-60 shrink-0">
                ({file.size})
              </Body>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDownload?.(file)}
              href={onDownload ? undefined : file.href}
              aria-label={`${file.name} 다운로드`}
            >
              다운로드
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}

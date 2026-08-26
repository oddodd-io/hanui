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
import { Input } from '../input';
import { Modal, ModalTitle, ModalBody, ModalFooter } from '../modal';
import { cn } from '@/lib/utils';
import {
  Upload,
  Grid,
  List,
  Image as ImageIcon,
  FileText,
  Trash2,
  Copy,
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

/** 미디어 파일 유형 */
export type MediaFileType = 'IMAGE' | 'DOCUMENT' | 'VIDEO' | 'OTHER';

/** 미디어 파일 데이터 */
export interface MediaFileData {
  /** 파일 ID */
  id: number;
  /** 파일명 */
  fileName: string;
  /** 파일 URL */
  url: string;
  /** 썸네일 URL (이미지인 경우) */
  thumbnailUrl?: string;
  /** 파일 유형 */
  type: MediaFileType;
  /** 파일 크기 (bytes) */
  size: number;
  /** 업로드 일시 */
  uploadedAt: string;
  /** 업로드한 사용자 */
  uploadedBy?: string;
}

// ============================================================================
// MediaGallery Props
// ============================================================================

export interface MediaGalleryProps {
  /** 미디어 파일 목록 */
  items: MediaFileData[];
  /** 파일 업로드 핸들러 */
  onUpload?: (files: File[]) => void;
  /** 파일 삭제 핸들러 */
  onDelete?: (id: number) => void;
  /** 파일 선택 핸들러 (미디어 선택기 모드) */
  onSelect?: (item: MediaFileData) => void;
  /** 추가 className */
  className?: string;
}

// ============================================================================
// Helpers
// ============================================================================

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileTypeIcon(type: MediaFileType) {
  switch (type) {
    case 'IMAGE':
      return <ImageIcon className="w-5 h-5" />;
    case 'DOCUMENT':
    case 'VIDEO':
    case 'OTHER':
      return <FileText className="w-5 h-5" />;
  }
}

function getFileTypeBadgeVariant(type: MediaFileType) {
  switch (type) {
    case 'IMAGE':
      return 'primary' as const;
    case 'DOCUMENT':
      return 'info' as const;
    case 'VIDEO':
      return 'warning' as const;
    case 'OTHER':
      return 'secondary' as const;
  }
}

const FILE_TYPE_LABELS: Record<MediaFileType, string> = {
  IMAGE: '이미지',
  DOCUMENT: '문서',
  VIDEO: '영상',
  OTHER: '기타',
};

// ============================================================================
// MediaGallery Component
// ============================================================================

/**
 * 미디어 갤러리 블록
 *
 * 미디어 파일을 그리드/리스트로 표시하고 업로드/삭제/상세보기 기능을 제공.
 * - 그리드/리스트 보기 전환
 * - 검색 필터링
 * - 파일 업로드 (드래그앤드롭 지원)
 * - 상세보기 모달 (미리보기 + 메타정보)
 */
export function MediaGallery({
  items,
  onUpload,
  onDelete,
  onSelect,
  className,
}: MediaGalleryProps) {
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedItem, setSelectedItem] = React.useState<MediaFileData | null>(
    null
  );
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const filteredItems = searchQuery
    ? items.filter((item) =>
        item.fileName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : items;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onUpload?.(Array.from(files));
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onUpload?.(Array.from(files));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleItemClick = (item: MediaFileData) => {
    if (onSelect) {
      onSelect(item);
    } else {
      setSelectedItem(item);
    }
  };

  return (
    <>
      <Card variant="outlined" className={cn('w-full', className)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>미디어 관리</CardTitle>
              <CardDescription>
                이미지, 문서 등 미디어 파일을 관리합니다.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                iconLeft={<Upload className="w-4 h-4" />}
                onClick={() => fileInputRef.current?.click()}
              >
                업로드
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                aria-label="미디어 파일 업로드"
              />
            </div>
          </div>

          {/* 검색 + 보기 전환 */}
          <div className="flex items-center gap-2 mt-4">
            <div className="flex-1 relative">
              <Input
                placeholder="파일명으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                clearable
              />
            </div>
            <div className="flex items-center border border-krds-gray-20 rounded-md overflow-hidden">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 transition-colors cursor-pointer border-0',
                  viewMode === 'grid'
                    ? 'bg-krds-primary-base text-krds-white'
                    : 'bg-krds-white text-krds-gray-50 hover:bg-krds-gray-5'
                )}
                aria-label="그리드 보기"
                aria-pressed={viewMode === 'grid'}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 transition-colors cursor-pointer border-0',
                  viewMode === 'list'
                    ? 'bg-krds-primary-base text-krds-white'
                    : 'bg-krds-white text-krds-gray-50 hover:bg-krds-gray-5'
                )}
                aria-label="리스트 보기"
                aria-pressed={viewMode === 'list'}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </CardHeader>

        <CardBody>
          {/* 드래그앤드롭 영역 */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={cn(
              'transition-colors rounded-lg',
              isDragOver &&
                'bg-krds-primary-5 ring-2 ring-krds-primary-base ring-dashed'
            )}
          >
            {filteredItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-krds-gray-50">
                <Upload className="w-10 h-10 mb-3 text-krds-gray-50" />
                <p className="text-sm">
                  {searchQuery
                    ? '검색 결과가 없습니다.'
                    : '파일을 드래그하거나 업로드 버튼을 클릭하세요.'}
                </p>
              </div>
            ) : viewMode === 'grid' ? (
              /* 그리드 뷰 */
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleItemClick(item)}
                    className="group relative rounded-lg border border-krds-gray-20 overflow-hidden hover:border-krds-primary-base hover:shadow-sm transition-all bg-krds-white cursor-pointer p-0 text-left"
                  >
                    <div className="aspect-square bg-krds-gray-5 flex items-center justify-center overflow-hidden">
                      {item.type === 'IMAGE' && item.thumbnailUrl ? (
                        <img
                          src={item.thumbnailUrl}
                          alt={item.fileName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-krds-gray-30">
                          {getFileTypeIcon(item.type)}
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-medium text-krds-gray-90 truncate">
                        {item.fileName}
                      </p>
                      <p className="text-xs text-krds-gray-50">
                        {formatFileSize(item.size)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              /* 리스트 뷰 */
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <caption className="sr-only">미디어 파일 목록</caption>
                  <thead>
                    <tr className="border-b border-krds-gray-20 bg-krds-gray-5">
                      <th scope="col" className="text-left py-3 px-4 font-medium text-krds-gray-70">
                        파일명
                      </th>
                      <th scope="col" className="text-left py-3 px-4 font-medium text-krds-gray-70">
                        유형
                      </th>
                      <th scope="col" className="text-left py-3 px-4 font-medium text-krds-gray-70">
                        크기
                      </th>
                      <th scope="col" className="text-left py-3 px-4 font-medium text-krds-gray-70">
                        업로드일
                      </th>
                      <th scope="col" className="text-right py-3 px-4 font-medium text-krds-gray-70">
                        관리
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-krds-gray-10 hover:bg-krds-gray-5 transition-colors cursor-pointer focus-within:ring-2 focus-within:ring-krds-blue-60 focus-within:ring-inset"
                        onClick={() => handleItemClick(item)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleItemClick(item);
                          }
                        }}
                        tabIndex={0}
                        role="row"
                        aria-label={`${item.fileName} 상세보기`}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-krds-gray-60 flex-shrink-0">
                              {getFileTypeIcon(item.type)}
                            </span>
                            <span className="font-medium text-krds-gray-90 truncate max-w-xs">
                              {item.fileName}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={getFileTypeBadgeVariant(item.type)}>
                            {FILE_TYPE_LABELS[item.type]}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-krds-gray-50">
                          {formatFileSize(item.size)}
                        </td>
                        <td className="py-3 px-4 text-krds-gray-50">
                          {item.uploadedAt}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete?.(item.id);
                              }}
                              className="p-2 rounded-md text-krds-gray-50 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer border-0 bg-transparent"
                              aria-label={`${item.fileName} 삭제`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* 상세보기 모달 */}
      <Modal
        open={!!selectedItem}
        onClose={() => {
          setSelectedItem(null);
          setCopied(false);
        }}
      >
        {selectedItem && (
          <>
            <ModalTitle>파일 상세</ModalTitle>
            <ModalBody>
              <div className="space-y-4">
                {/* 미리보기 */}
                <div className="rounded-lg border border-krds-gray-20 bg-krds-gray-5 overflow-hidden">
                  {selectedItem.type === 'IMAGE' ? (
                    <img
                      src={selectedItem.url}
                      alt={selectedItem.fileName}
                      className="w-full max-h-80 object-contain"
                    />
                  ) : (
                    <div className="flex items-center justify-center py-12 text-krds-gray-60">
                      {getFileTypeIcon(selectedItem.type)}
                      <span className="ml-2 text-sm">
                        미리보기를 지원하지 않는 파일입니다.
                      </span>
                    </div>
                  )}
                </div>

                {/* 메타 정보 */}
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-krds-gray-50">파일명</dt>
                    <dd className="font-medium text-krds-gray-90 mt-0.5 break-all">
                      {selectedItem.fileName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-krds-gray-50">유형</dt>
                    <dd className="mt-0.5">
                      <Badge
                        variant={getFileTypeBadgeVariant(selectedItem.type)}
                      >
                        {FILE_TYPE_LABELS[selectedItem.type]}
                      </Badge>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-krds-gray-50">크기</dt>
                    <dd className="font-medium text-krds-gray-90 mt-0.5">
                      {formatFileSize(selectedItem.size)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-krds-gray-50">업로드일</dt>
                    <dd className="font-medium text-krds-gray-90 mt-0.5">
                      {selectedItem.uploadedAt}
                    </dd>
                  </div>
                  {selectedItem.uploadedBy && (
                    <div>
                      <dt className="text-krds-gray-50">업로더</dt>
                      <dd className="font-medium text-krds-gray-90 mt-0.5">
                        {selectedItem.uploadedBy}
                      </dd>
                    </div>
                  )}
                </dl>

                {/* URL 복사 */}
                <div className="flex items-center gap-2 p-3 bg-krds-gray-5 rounded-md">
                  <code className="flex-1 text-xs text-krds-gray-70 truncate">
                    {selectedItem.url}
                  </code>
                  <Button
                    variant="secondary"
                    size="sm"
                    iconLeft={<Copy className="w-3.5 h-3.5" />}
                    onClick={() => {
                      navigator.clipboard.writeText(selectedItem.url);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                  >
                    {copied ? '복사됨' : '복사'}
                  </Button>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="danger"
                size="sm"
                iconLeft={<Trash2 className="w-4 h-4" />}
                onClick={() => {
                  onDelete?.(selectedItem.id);
                  setSelectedItem(null);
                }}
              >
                삭제
              </Button>
              <Button variant="secondary" onClick={() => setSelectedItem(null)}>
                닫기
              </Button>
            </ModalFooter>
          </>
        )}
      </Modal>
    </>
  );
}

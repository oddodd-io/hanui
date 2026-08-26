'use client';

import * as React from 'react';
import { Upload, X, Download, Eye, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

/**
 * File upload status types
 */
export type FileUploadStatus = 'idle' | 'uploading' | 'complete' | 'error';

/**
 * File with metadata
 */
export interface UploadedFile {
  file: File;
  id: string;
  status: FileUploadStatus;
  progress?: number;
  error?: string;
  preview?: string;
}

/**
 * FileUpload Props Interface
 */
export interface FileUploadProps {
  /**
   * Title for the file upload section
   * @default "파일 첨부"
   */
  title?: string;

  /**
   * Description text below the title
   */
  description?: string;

  /**
   * Accept file types (e.g., ".pdf,.hwp,.jpg,.png")
   */
  accept?: string;

  /**
   * Maximum file size in bytes
   */
  maxSize?: number;

  /**
   * Maximum number of files
   */
  maxFiles?: number;

  /**
   * Allow multiple file selection
   * @default false
   */
  multiple?: boolean;

  /**
   * Callback when files are selected
   */
  onUpload?: (files: File[]) => void | Promise<void>;

  /**
   * Callback when files change (added/removed)
   */
  onChange?: (files: UploadedFile[]) => void;

  /**
   * Callback when validation errors occur
   */
  onError?: (error: string) => void;

  /**
   * Callback when file is removed
   */
  onRemove?: (file: UploadedFile) => void;

  /**
   * Callback when file preview is requested
   */
  onPreview?: (file: UploadedFile) => void;

  /**
   * Callback when file download is requested
   */
  onDownload?: (file: UploadedFile) => void;

  /**
   * Disabled state
   */
  disabled?: boolean;

  /**
   * Show bordered variant
   * @default false
   */
  bordered?: boolean;

  /**
   * Additional className
   */
  className?: string;

  /**
   * Upload button text
   * @default "파일 선택"
   */
  uploadButtonText?: string;

  /**
   * Upload instruction text
   * @default "파일을 선택하거나 끌어다 놓으세요"
   */
  instructionText?: string;

  /**
   * Show delete all button
   * @default true
   */
  showDeleteAll?: boolean;

  /**
   * Delete all button text
   * @default "전체 삭제"
   */
  deleteAllText?: string;
}

/**
 * Format bytes to human readable size
 */
function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Get file extension
 */
function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
}

/**
 * Check if file is an image
 */
function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

/**
 * FileUpload Component
 *
 * KRDS-compliant file upload component with:
 * - Header section with title and description
 * - Upload area with button and instructions
 * - File list with status indicators (uploading, complete, error)
 * - File actions (preview, download, delete)
 * - Delete all functionality
 * - Full accessibility support
 *
 * @example
 * ```tsx
 * <FileUpload
 *   title="서류 첨부"
 *   description="최대 5개 파일, 각 10MB 이하"
 *   accept=".pdf,.hwp,.jpg,.png"
 *   maxSize={10 * 1024 * 1024}
 *   maxFiles={5}
 *   multiple
 *   bordered
 *   onUpload={(files) => console.log(files)}
 * />
 * ```
 */
export const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      title = '파일 첨부',
      description,
      accept,
      maxSize,
      maxFiles = 5,
      multiple = false,
      onUpload,
      onChange,
      onError,
      onRemove,
      onPreview,
      onDownload,
      disabled = false,
      bordered = false,
      className,
      uploadButtonText = '파일 선택',
      instructionText = '파일을 선택하거나 끌어다 놓으세요',
      showDeleteAll = true,
      deleteAllText = '전체 삭제',
    },
    ref
  ) => {
    const [files, setFiles] = React.useState<UploadedFile[]>([]);
    const [isDragging, setIsDragging] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);
    // 한 페이지에 FileUpload가 여러 개여도 id가 겹치지 않도록 인스턴스별 id 생성
    const inputId = React.useId();
    const dragCounter = React.useRef(0);

    /**
     * Validate file
     */
    const validateFile = React.useCallback(
      (file: File): string | null => {
        // Check file size
        if (maxSize && file.size > maxSize) {
          return `파일 크기가 ${formatBytes(maxSize)} 를 초과합니다.`;
        }

        // Check file extension
        if (accept) {
          const acceptedExtensions = accept.split(',').map((ext) => ext.trim());
          const fileExtension = '.' + getFileExtension(file.name);
          const isAccepted = acceptedExtensions.some(
            (ext) =>
              ext === fileExtension ||
              ext === file.type ||
              (ext.startsWith('.') && fileExtension === ext)
          );

          if (!isAccepted) {
            return `허용되지 않는 파일 형식입니다. (${acceptedExtensions.join(', ')})`;
          }
        }

        return null;
      },
      [accept, maxSize]
    );

    /**
     * Process files
     */
    const processFiles = React.useCallback(
      async (fileList: FileList | File[]) => {
        const fileArray = Array.from(fileList);

        // Check max files limit
        if (files.length + fileArray.length > maxFiles) {
          onError?.(`최대 ${maxFiles}개 파일만 업로드 가능합니다.`);
          return;
        }

        const newFiles: UploadedFile[] = [];
        const validFiles: File[] = [];

        for (const file of fileArray) {
          const error = validateFile(file);

          const id = `${file.name}-${Date.now()}-${Math.random()}`;
          let preview: string | undefined;

          // Generate preview for images
          if (isImageFile(file)) {
            preview = URL.createObjectURL(file);
          }

          if (error) {
            newFiles.push({
              file,
              id,
              status: 'error',
              error,
              preview,
            });
            onError?.(error);
          } else {
            newFiles.push({
              file,
              id,
              status: 'uploading',
              progress: 0,
              preview,
            });
            validFiles.push(file);
          }
        }

        if (newFiles.length > 0) {
          const updatedFiles = [...files, ...newFiles];
          setFiles(updatedFiles);
          onChange?.(updatedFiles);

          // Call onUpload callback for valid files
          if (onUpload && validFiles.length > 0) {
            try {
              await onUpload(validFiles);
              // Update status to complete after successful upload
              setFiles((prev) =>
                prev.map((f) =>
                  newFiles.some(
                    (nf) => nf.id === f.id && nf.status === 'uploading'
                  )
                    ? {
                        ...f,
                        status: 'complete' as FileUploadStatus,
                        progress: 100,
                      }
                    : f
                )
              );
            } catch (err) {
              // Update status to error if upload fails
              setFiles((prev) =>
                prev.map((f) =>
                  newFiles.some((nf) => nf.id === f.id)
                    ? {
                        ...f,
                        status: 'error' as FileUploadStatus,
                        error:
                          err instanceof Error
                            ? err.message
                            : '파일 업로드에 실패했습니다.',
                      }
                    : f
                )
              );
              onError?.(
                err instanceof Error
                  ? err.message
                  : '파일 업로드에 실패했습니다.'
              );
            }
          }
        }
      },
      [files, maxFiles, validateFile, onChange, onUpload, onError]
    );

    /**
     * Handle file input change
     */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        processFiles(e.target.files);
        // Reset input value to allow re-uploading the same file
        e.target.value = '';
      }
    };

    /**
     * Handle drag events
     */
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current++;
      if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
        setIsDragging(true);
      }
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current--;
      if (dragCounter.current === 0) {
        setIsDragging(false);
      }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      dragCounter.current = 0;

      if (disabled) return;

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files);
      }
    };

    /**
     * Handle click to open file dialog
     */
    const handleUploadClick = () => {
      if (!disabled) {
        inputRef.current?.click();
      }
    };

    /**
     * Remove file
     */
    const removeFile = (uploadedFile: UploadedFile) => {
      setFiles((prev) => {
        if (uploadedFile.preview) {
          URL.revokeObjectURL(uploadedFile.preview);
        }
        const updated = prev.filter((f) => f.id !== uploadedFile.id);
        onChange?.(updated);
        return updated;
      });
      onRemove?.(uploadedFile);
    };

    /**
     * Remove all files
     */
    const removeAllFiles = () => {
      files.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
      setFiles([]);
      onChange?.([]);
    };

    /**
     * Cleanup preview URLs on unmount
     */
    React.useEffect(() => {
      return () => {
        files.forEach((file) => {
          if (file.preview) {
            URL.revokeObjectURL(file.preview);
          }
        });
      };
    }, [files]);

    return (
      <div
        ref={ref}
        className={cn(
          'krds-file-upload',
          bordered && 'line border border-krds-gray-30 rounded-lg p-6',
          className
        )}
      >
        {/* Header Section */}
        <div className="file-head mb-4">
          <h3 className="[font-size:var(--krds-body-lg)] font-semibold text-krds-gray-95 mb-2">
            {title}
          </h3>
          {description && (
            <p className="[font-size:var(--krds-body-sm)] text-krds-gray-70">
              {description}
            </p>
          )}
        </div>

        {/* Upload Area */}
        <div
          className={cn(
            'file-upload border-2 border-dashed rounded-lg p-6 text-center transition-colors',
            isDragging &&
              !disabled && ['border-krds-primary-50', 'bg-krds-primary-5'],
            !isDragging && !disabled && 'border-krds-gray-30',
            disabled && ['border-krds-gray-20', 'bg-krds-gray-5', 'opacity-60']
          )}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileChange}
            disabled={disabled}
            className="sr-only"
            // 실제 조작은 아래 '파일 선택' 버튼이 담당한다.
            // aria-hidden을 쓰는 이상 포커스도 받지 않아야 한다 (axe aria-hidden-focus).
            tabIndex={-1}
            aria-hidden="true"
            id={inputId}
          />

          <p className="[font-size:var(--krds-body-md)] text-krds-gray-70 mb-4">
            {instructionText}
          </p>

          <Button
            size="md"
            variant="primary"
            iconLeft={<Upload size={16} />}
            onClick={handleUploadClick}
            disabled={disabled}
          >
            {uploadButtonText}
          </Button>

          {/* File Info */}
          {(accept || maxSize) && (
            <p className="mt-3 [font-size:var(--krds-body-sm)] text-krds-gray-60">
              {accept && <span>형식: {accept}</span>}
              {accept && maxSize && <span> · </span>}
              {maxSize && <span>최대 크기: {formatBytes(maxSize)}</span>}
            </p>
          )}
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="file-list mt-6">
            <ul
              className="upload-list space-y-3"
              aria-label="업로드된 파일 목록"
            >
              {files.map((uploadedFile) => (
                <li
                  key={uploadedFile.id}
                  className={cn(
                    'flex items-center gap-4 p-4 rounded-lg border',
                    uploadedFile.status === 'error'
                      ? 'border-krds-danger-base bg-krds-danger-5 is-error'
                      : 'border-krds-gray-30 bg-krds-gray-5'
                  )}
                >
                  {/* File Info Section */}
                  <div className="file-info flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium [font-size:var(--krds-body-md)] text-krds-gray-95 truncate">
                        {uploadedFile.file.name}
                      </p>

                      {/* Status Icons */}
                      {uploadedFile.status === 'uploading' && (
                        <Loader2
                          className="h-4 w-4 animate-spin text-krds-primary-50"
                          aria-label="업로드 중"
                        />
                      )}
                      {uploadedFile.status === 'complete' && (
                        <CheckCircle2
                          className="h-4 w-4 text-krds-success-base"
                          aria-label="완료"
                        />
                      )}
                    </div>

                    <p className="[font-size:var(--krds-body-sm)] text-krds-gray-60 mt-1">
                      {formatBytes(uploadedFile.file.size)}
                    </p>

                    {/* Progress Bar */}
                    {uploadedFile.status === 'uploading' &&
                      uploadedFile.progress !== undefined && (
                        <div className="mt-2 w-full bg-krds-gray-20 rounded-full h-1.5">
                          <div
                            className="bg-krds-primary-50 h-1.5 rounded-full transition-all"
                            style={{ width: `${uploadedFile.progress}%` }}
                            role="progressbar"
                            aria-valuenow={uploadedFile.progress}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          />
                        </div>
                      )}

                    {/* Error Message */}
                    {uploadedFile.error && (
                      <p className="file-hint-invalid mt-2 [font-size:var(--krds-body-sm)] text-krds-danger-base">
                        {uploadedFile.error}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="btn-wrap flex items-center gap-2">
                    {/* Preview Button (for images) */}
                    {uploadedFile.preview && onPreview && (
                      <Button
                        size="sm"
                        variant="ghost"
                        iconLeft={<Eye size={16} />}
                        onClick={() => onPreview(uploadedFile)}
                        aria-label={`${uploadedFile.file.name} 미리보기`}
                      >
                        미리보기
                      </Button>
                    )}

                    {/* Download Button (for completed files) */}
                    {uploadedFile.status === 'complete' && onDownload && (
                      <Button
                        size="sm"
                        variant="ghost"
                        iconLeft={<Download size={16} />}
                        onClick={() => onDownload(uploadedFile)}
                        aria-label={`${uploadedFile.file.name} 다운로드`}
                      >
                        다운로드
                      </Button>
                    )}

                    {/* Delete Button */}
                    <Button
                      size="sm"
                      variant="ghost"
                      iconLeft={<X size={16} />}
                      onClick={() => removeFile(uploadedFile)}
                      aria-label={`${uploadedFile.file.name} 삭제`}
                    >
                      삭제
                    </Button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Delete All Button */}
            {showDeleteAll && files.length > 1 && (
              <div className="mt-4 flex justify-end">
                <Button
                  size="sm"
                  variant="tertiary"
                  onClick={removeAllFiles}
                  aria-label="모든 파일 삭제"
                >
                  {deleteAllText}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';

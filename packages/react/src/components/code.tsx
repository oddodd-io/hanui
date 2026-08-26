'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { codeToHtml } from 'shiki';
import { File, Copy, Check } from 'lucide-react';
import { cn } from '../lib/utils';

export interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  // Code Props
  variant?: 'inline' | 'block'; // 코드 타입 (기본값: inline)
  size?: 'sm' | 'default' | 'lg'; // 크기 (inline 전용, 기본값: default)
  language?: string; // 프로그래밍 언어 (Syntax highlighting, block 전용)
  showLineNumbers?: boolean; // 줄 번호 표시 (block + language 전용, 기본값: true)
  fileName?: string; // 파일명 표시 (block + language 전용)
  theme?: string; // Shiki 테마 (block + language 전용, 기본값: github-dark)
}

const sizeStyles = {
  // 인라인 코드 크기 스타일
  sm: 'text-krds-body-xs px-1 py-0.5',
  default: 'text-krds-body-sm px-1.5 py-0.5',
  lg: 'text-krds-body-md px-2 py-1',
} as const;

export const Code = React.forwardRef<HTMLElement, CodeProps>( // KRDS 코드 컴포넌트 (인라인/블록, Syntax highlighting, 복사 기능)
  (
    {
      variant = 'inline',
      size = 'default',
      language,
      showLineNumbers = true,
      fileName,
      theme = 'github-dark',
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [copied, setCopied] = React.useState(false);
    const [html, setHtml] = useState('');

    const code = typeof children === 'string' ? children : '';

    useEffect(() => {
      // Syntax highlighting (block + language)
      if (variant === 'block' && language) {
        const highlightCode = async () => {
          const highlighted = await codeToHtml(code, {
            lang: language,
            theme: theme,
          });
          setHtml(highlighted);
        };

        highlightCode();
      }
    }, [code, language, theme, variant]);

    const handleCopy = async () => {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    if (variant === 'block' && language) {
      // Block variant (Syntax highlighting 적용)
      if (!html) {
        return (
          <div
            className={cn('relative group bg-[#24292e] rounded-md', className)}
          >
            <div className="overflow-x-auto rounded-lg bg-krds-gray-90 p-5">
              <div className="animate-pulse">
                <div className="h-4 bg-krds-gray-70 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-krds-gray-70 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div
          className={cn('relative group bg-[#24292e] rounded-md', className)}
        >
          {fileName && (
            <div className="flex items-center gap-2 px-4 py-2 bg-krds-gray-90 border-b border-krds-gray-70 rounded-t-lg">
              <File className="w-3.5 h-3.5 text-krds-gray-40" />
              <span className="text-krds-body-xs text-krds-gray-60 font-mono">
                {fileName}
              </span>
            </div>
          )}
          <div className="relative">
            <button type="button"
              onClick={handleCopy}
              className={cn(
                'absolute top-4 right-3 p-2 rounded-md transition-all z-10',
                'bg-krds-gray-70 hover:bg-krds-gray-60',
                'text-krds-gray-10 opacity-0 group-hover:opacity-100'
              )}
              aria-label="Copy code"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            <div
              className={cn(
                'overflow-x-auto',
                // 줄 번호가 없을 때만 줄바꿈 적용 (줄 번호 있으면 가로 스크롤 유지)
                !showLineNumbers &&
                  '[&_pre]:whitespace-pre-wrap [&_pre]:break-words',
                fileName ? 'rounded-b-lg' : 'rounded-lg',
                showLineNumbers && 'code-with-line-numbers'
              )}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </div>
      );
    }

    if (variant === 'block') {
      // Block variant (단순, Syntax highlighting 없음)
      return (
        <div className="relative group bg-[#24292e]">
          <pre
            ref={ref as React.Ref<HTMLPreElement>}
            className={cn(
              'font-mono bg-krds-primary-5 rounded-lg p-4 whitespace-pre-wrap break-words',
              'text-krds-primary-70 border border-krds-primary-20',
              className
            )}
            {...props}
          >
            <code>{children}</code>
          </pre>
          <button type="button"
            onClick={handleCopy}
            className={cn(
              'absolute top-4 right-3 p-2 rounded-md transition-all z-10',
              'bg-krds-primary-10 hover:bg-krds-primary-20 border border-krds-primary-30',
              'text-krds-primary-70 opacity-0 group-hover:opacity-100'
            )}
            aria-label="Copy code"
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      );
    }

    return (
      // Inline variant
      <code
        ref={ref}
        className={cn(
          'font-mono bg-krds-primary-5 text-krds-primary-70 rounded border border-krds-primary-20',
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </code>
    );
  }
);

Code.displayName = 'Code';

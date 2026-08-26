'use client';

import { Button } from '../button';
import { Body } from '../body';
import { Display } from '../display';
import { cn } from '@/lib/utils';

export interface ErrorPageProps {
  /** 에러 코드 */
  code?: '404' | '500' | '403' | string;
  /** 에러 제목 */
  title?: string;
  /** 에러 설명 */
  description?: string;
  /** 홈으로 돌아가기 버튼 텍스트 */
  homeLabel?: string;
  /** 홈으로 돌아가기 핸들러 */
  onGoHome?: () => void;
  /** 뒤로가기 버튼 텍스트 */
  backLabel?: string;
  /** 뒤로가기 핸들러 */
  onGoBack?: () => void;
  /** 추가 className */
  className?: string;
}

const errorDefaults: Record<string, { title: string; description: string }> = {
  '404': {
    title: '페이지를 찾을 수 없습니다',
    description: '요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.',
  },
  '500': {
    title: '서버 오류가 발생했습니다',
    description: '일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
  },
  '403': {
    title: '접근 권한이 없습니다',
    description: '이 페이지에 접근할 수 있는 권한이 없습니다.',
  },
};

export function ErrorPage({
  code = '404',
  title,
  description,
  homeLabel = '홈으로 돌아가기',
  onGoHome,
  backLabel = '이전 페이지',
  onGoBack,
  className,
}: ErrorPageProps) {
  const defaults = errorDefaults[code] || errorDefaults['404'];
  const finalTitle = title || defaults.title;
  const finalDescription = description || defaults.description;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-20 space-y-6',
        className
      )}
    >
      {/* 에러 코드는 페이지 제목이 아니다. h1은 아래 title 하나만 둔다 */}
      <Display as="div" size="lg" className="text-krds-gray-40">
        {code}
      </Display>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-krds-gray-90">{finalTitle}</h1>
        <Body size="md" className="text-krds-gray-50 max-w-md">
          {finalDescription}
        </Body>
      </div>

      <div className="flex items-center gap-3">
        {onGoHome && (
          <Button variant="primary" onClick={onGoHome}>
            {homeLabel}
          </Button>
        )}
        {onGoBack && (
          <Button variant="outline" onClick={onGoBack}>
            {backLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

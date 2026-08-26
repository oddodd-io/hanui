'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface LogoProps {
  /** 로고 이미지 URL */
  src?: string;
  /** 로고 대체 텍스트 */
  alt?: string;
  /** 로고 클릭 시 이동할 URL */
  href?: string;
  /** 슬로건 (선택적) */
  slogan?: React.ReactNode;
  /** 로고 컨테이너 className */
  className?: string;
  /** 로고 이미지 className */
  logoClassName?: string;
}

const DEFAULT_LOGO =
  'https://www.krds.go.kr/resources/img/pattern/layout/head_logo.svg';
const DEFAULT_ALT = '대한민국정부';

/**
 * Logo 컴포넌트
 *
 * - Header/Footer에서 공통으로 사용
 * - slogan prop이 있으면 로고 옆에 슬로건 표시
 * - Footer에서는 slogan 없이 사용
 */
export function Logo({
  src = DEFAULT_LOGO,
  alt = DEFAULT_ALT,
  href = '/',
  slogan,
  className,
  logoClassName,
}: LogoProps) {
  return (
    <div className={cn('flex items-center', className)}>
      <a
        href={href}
        className={cn('inline-flex h-8 md:h-12', logoClassName)}
        aria-label={`${alt} 홈으로 이동`}
      >
        <img src={src} alt={alt} className="w-full h-full object-contain" />
      </a>
      {slogan && (
        <span className="inline-flex ml-3">
          <span className="sr-only">슬로건</span>
          {slogan}
        </span>
      )}
    </div>
  );
}

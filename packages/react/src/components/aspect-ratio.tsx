'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio?:
    | number
    | { base?: number; sm?: number; md?: number; lg?: number; xl?: number };
  children: React.ReactNode;
  className?: string;
}

/**
 * AspectRatio - 특정 종횡비를 유지하면서 반응형 콘텐츠를 표시하는 컴포넌트
 *
 * 비디오, 이미지, 맵 등의 임베드 콘텐츠에 유용합니다.
 *
 * @example
 * ```tsx
 * <AspectRatio ratio={16 / 9}>
 *   <iframe src="https://www.youtube.com/embed/..." />
 * </AspectRatio>
 * ```
 */
export const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio = 4 / 3, children, className, style, ...props }, ref) => {
    let paddingBottom: string;
    let responsiveClasses = '';

    if (typeof ratio === 'number') {
      // 고정 비율
      paddingBottom = `${(1 / ratio) * 100}%`;
    } else {
      // 반응형 비율 (Tailwind aspect-ratio 유틸리티 사용)
      const { base, sm, md, lg, xl } = ratio;
      const classes: string[] = [];

      // Tailwind의 aspect-ratio 유틸리티는 aspect-[ratio] 형태로 사용
      if (base) {
        const baseRatio = `${Math.round(base * 100) / 100}`.replace('.', '/');
        classes.push(`aspect-[${baseRatio}]`);
      }
      if (sm) {
        const smRatio = `${Math.round(sm * 100) / 100}`.replace('.', '/');
        classes.push(`sm:aspect-[${smRatio}]`);
      }
      if (md) {
        const mdRatio = `${Math.round(md * 100) / 100}`.replace('.', '/');
        classes.push(`md:aspect-[${mdRatio}]`);
      }
      if (lg) {
        const lgRatio = `${Math.round(lg * 100) / 100}`.replace('.', '/');
        classes.push(`lg:aspect-[${lgRatio}]`);
      }
      if (xl) {
        const xlRatio = `${Math.round(xl * 100) / 100}`.replace('.', '/');
        classes.push(`xl:aspect-[${xlRatio}]`);
      }

      responsiveClasses = classes.join(' ');
      paddingBottom = '0'; // 반응형 클래스 사용 시 padding 불필요
    }

    // 고정 비율일 때는 padding-bottom 트릭 사용
    const containerStyle: React.CSSProperties =
      typeof ratio === 'number'
        ? {
            position: 'relative',
            paddingBottom,
            height: 0,
            overflow: 'hidden',
          }
        : {};

    const childWrapperStyle: React.CSSProperties =
      typeof ratio === 'number'
        ? {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }
        : {};

    return (
      <div
        ref={ref}
        className={cn('w-full', responsiveClasses, className)}
        style={{ ...containerStyle, ...style }}
        {...props}
      >
        <div style={childWrapperStyle}>{children}</div>
      </div>
    );
  }
);

AspectRatio.displayName = 'AspectRatio';

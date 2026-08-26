'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';

// Tooltip 스타일 변형 정의 - KRDS 접근성 자동화 지원
const tooltipVariants = cva(
  [
    'absolute',
    'z-50',
    'px-3',
    'py-1',
    'text-sm',
    'rounded-md',
    'shadow-lg',
    'pointer-events-none',
    'w-max',
    'max-w-xs',
    'break-words',
    'animate-in',
    'fade-in-0',
    'zoom-in-95',
  ].join(' '),
  {
    variants: {
      // 스타일 변형 - KRDS 기본: 다크 배경 + 흰색 텍스트
      variant: {
        default: ['bg-krds-gray-90', 'text-white'].join(' '),
        light: [
          'bg-white',
          'text-krds-gray-90',
          'border',
          'border-krds-gray-20',
        ].join(' '),
      },
      // 위치 설정 (화살표 위치만, 색상은 compoundVariants에서)
      position: {
        top: [
          'bottom-full left-1/2 -translate-x-1/2 mb-2',
          'before:content-[""] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2',
          'before:border-[6px] before:border-transparent',
        ].join(' '),
        bottom: [
          'top-full left-1/2 -translate-x-1/2 mt-2',
          'before:content-[""] before:absolute before:bottom-full before:left-1/2 before:-translate-x-1/2',
          'before:border-[6px] before:border-transparent',
        ].join(' '),
        left: [
          'right-full top-1/2 -translate-y-1/2 mr-2',
          'before:content-[""] before:absolute before:left-full before:top-1/2 before:-translate-y-1/2',
          'before:border-[6px] before:border-transparent',
        ].join(' '),
        right: [
          'left-full top-1/2 -translate-y-1/2 ml-2',
          'before:content-[""] before:absolute before:right-full before:top-1/2 before:-translate-y-1/2',
          'before:border-[6px] before:border-transparent',
        ].join(' '),
      },
    },
    // variant + position 조합에 따른 화살표 색상
    compoundVariants: [
      // default (dark) variant - 회색 화살표
      {
        variant: 'default',
        position: 'top',
        class: 'before:border-t-krds-gray-90',
      },
      {
        variant: 'default',
        position: 'bottom',
        class: 'before:border-b-krds-gray-90',
      },
      {
        variant: 'default',
        position: 'left',
        class: 'before:border-l-krds-gray-90',
      },
      {
        variant: 'default',
        position: 'right',
        class: 'before:border-r-krds-gray-90',
      },
      // light variant - 흰색 화살표
      { variant: 'light', position: 'top', class: 'before:border-t-white' },
      { variant: 'light', position: 'bottom', class: 'before:border-b-white' },
      { variant: 'light', position: 'left', class: 'before:border-l-white' },
      { variant: 'light', position: 'right', class: 'before:border-r-white' },
    ],
    defaultVariants: {
      variant: 'default',
      position: 'right',
    },
  }
);

// Tooltip Props 인터페이스
export interface TooltipProps extends VariantProps<typeof tooltipVariants> {
  /** 툴팁 콘텐츠 */
  content: React.ReactNode;

  /** 툴팁을 트리거할 자식 요소 */
  children: React.ReactElement;

  /** 툴팁 표시 지연 시간 (ms) @default 200 */
  delay?: number;

  /** 툴팁 비활성화 여부 @default false */
  disabled?: boolean;

  /** 자동 위치 조절 (화면 위치에 따라 left/right 자동 선택) @default true */
  autoPosition?: boolean;

  /** 툴팁 컨테이너 추가 CSS 클래스 */
  className?: string;

  /** 래퍼 추가 CSS 클래스 */
  wrapperClassName?: string;
}

/**
 * Tooltip 컴포넌트
 * KRDS 2.2 접근성 가이드라인 준수 (WCAG 2.1 / KWCAG 2.2 AA)
 * - aria-describedby 자동 연결 (추가 설명 제공)
 * - ESC 키로 닫기 및 포커스 복원
 * - 마우스 호버 + 키보드 포커스 지원
 * - 자동 위치 조절 (화면 위치에 따라 left/right 선택)
 */
export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      content,
      children,
      variant,
      position,
      delay = 200,
      disabled = false,
      autoPosition = true,
      className,
      wrapperClassName,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const [autoPos, setAutoPos] = React.useState<'left' | 'right'>('right');
    const [tooltipId] = React.useState(
      () => `tooltip-${Math.random().toString(36).substr(2, 9)}`
    );
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const wrapperRef = React.useRef<HTMLDivElement>(null);
    const buttonRef = React.useRef<HTMLElement | null>(null);

    // 요소 위치에 따라 툴팁 방향 결정
    const calculatePosition = React.useCallback(() => {
      if (!wrapperRef.current || !autoPosition) return;

      const rect = wrapperRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const elementCenter = rect.left + rect.width / 2;

      // 화면 중앙 기준으로 왼쪽이면 right, 오른쪽이면 left
      if (elementCenter > viewportWidth / 2) {
        setAutoPos('left');
      } else {
        setAutoPos('right');
      }
    }, [autoPosition]);

    // 마우스 진입 또는 포커스 시 툴팁 표시
    const handleShow = React.useCallback(() => {
      if (disabled) return;

      calculatePosition();

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
      }, delay);
    }, [disabled, delay, calculatePosition]);

    // 마우스 이탈 또는 블러 시 툴팁 숨김
    const handleHide = React.useCallback(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsVisible(false);
    }, []);

    // ESC 키로 툴팁 닫기 및 포커스 복원 (KRDS 2.2)
    const handleKeyDown = React.useCallback(
      (event: KeyboardEvent) => {
        if (event.key === 'Escape' && isVisible) {
          handleHide();
          // 활성화 버튼으로 포커스 복원
          if (buttonRef.current) {
            buttonRef.current.focus();
          }
        }
      },
      [isVisible, handleHide]
    );

    // 이벤트 리스너 설정 (마우스 호버 + 키보드 포커스 + ESC)
    React.useEffect(() => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      const child = wrapper.firstElementChild as HTMLElement;
      if (!child) return;

      // ESC 포커스 복원을 위한 활성화 버튼 참조 저장
      buttonRef.current = child;

      // 마우스 이벤트
      child.addEventListener('mouseenter', handleShow);
      child.addEventListener('mouseleave', handleHide);

      // 포커스 이벤트
      child.addEventListener('focus', handleShow);
      child.addEventListener('blur', handleHide);

      // ESC 키 이벤트
      document.addEventListener('keydown', handleKeyDown);

      return () => {
        child.removeEventListener('mouseenter', handleShow);
        child.removeEventListener('mouseleave', handleHide);
        child.removeEventListener('focus', handleShow);
        child.removeEventListener('blur', handleHide);
        document.removeEventListener('keydown', handleKeyDown);

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, [handleShow, handleHide, handleKeyDown]);

    // aria-describedby 자동 연결 (KRDS 2.2) - 툴팁은 추가 설명이므로 describedby 사용
    const childWithAria = React.cloneElement(children, {
      'aria-describedby': isVisible ? tooltipId : undefined,
    } as React.HTMLAttributes<HTMLElement>);

    // 최종 위치: position prop이 명시되면 사용, 아니면 autoPosition 결과 사용
    const finalPosition = position || (autoPosition ? autoPos : 'right');

    return (
      <div
        ref={wrapperRef}
        className={cn('relative inline-block', wrapperClassName)}
        {...props}
      >
        {childWithAria}

        {/* 툴팁 콘텐츠 */}
        {isVisible && !disabled && (
          <div
            ref={ref}
            id={tooltipId}
            role="tooltip"
            className={cn(
              tooltipVariants({ variant, position: finalPosition }),
              className
            )}
          >
            {content}
          </div>
        )}
      </div>
    );
  }
);

Tooltip.displayName = 'Tooltip';

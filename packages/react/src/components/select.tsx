'use client';

import * as SelectPrimitive from '@radix-ui/react-select';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDownIcon, CheckIcon } from 'lucide-react';
import { useFormFieldOptional } from './form-field';

// ============================================================================
// 타입 정의
// ============================================================================

/**
 * Select 옵션 아이템
 *
 * @example
 * const option: SelectOption = {
 *   value: 'seoul',
 *   label: '서울특별시',
 *   disabled: false,  // 선택 불가 처리 (선택사항)
 *   group: '수도권'    // 그룹핑용 (선택사항, 현재 미사용)
 * }
 */
export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
  group?: string;
}

/**
 * Select 컴포넌트 Props
 */
export interface SelectProps<T = string> {
  /** 드롭다운에 표시될 옵션 목록 */
  options: SelectOption<T>[];

  /** 현재 선택된 값 */
  value?: T;

  /** 값 변경 시 호출되는 콜백 */
  onChange?: (value: T) => void;

  /** 미선택 시 표시되는 안내 텍스트 */
  placeholder?: string;

  /** 비활성화 여부 */
  disabled?: boolean;

  /**
   * 에러 상태 표시
   * @deprecated status="error" 사용을 권장합니다
   */
  error?: boolean;

  /** 입력 상태 (error: 빨강, success: 초록, info: 파랑) */
  status?: 'error' | 'success' | 'info';

  /** 크기 (lg: 56px, md: 48px, sm: 40px) */
  size?: 'lg' | 'md' | 'sm';

  /** 추가 스타일 클래스 */
  className?: string;

  /** 옵션 아이템 커스텀 렌더링 함수 */
  renderOption?: (option: SelectOption<T>) => React.ReactNode;

  /**
   * 레이블 텍스트
   * @deprecated FormField + FormLabel 조합 사용을 권장합니다
   */
  label?: string;

  /** 접근성 레이블 (시각적 레이블이 없을 때 필수) */
  'aria-label'?: string;

  /** 접근성 레이블 ID 참조 */
  'aria-labelledby'?: string;
}

// ============================================================================
// Select 컴포넌트
// ============================================================================

/**
 * Select 컴포넌트
 *
 * Radix UI Select 기반의 드롭다운 선택 컴포넌트입니다.
 * 키보드 네비게이션, 스크린리더 등 접근성을 완벽하게 지원합니다.
 *
 * @example
 * // 1. 단독 사용
 * <Select
 *   options={[
 *     { value: 'seoul', label: '서울' },
 *     { value: 'busan', label: '부산' },
 *   ]}
 *   value={city}
 *   onChange={setCity}
 *   placeholder="도시 선택"
 * />
 *
 * @example
 * // 2. FormField와 함께 사용 (권장)
 * <FormField id="city" required status="error">
 *   <FormLabel>도시</FormLabel>
 *   <Select options={cities} value={city} onChange={setCity} />
 *   <FormError>도시를 선택해주세요</FormError>
 * </FormField>
 */
// 사이즈별 높이 클래스
const sizeClasses = {
  lg: 'h-14', // 56px
  md: 'h-12', // 48px
  sm: 'h-10', // 40px
} as const;

export function Select<T = string>({
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
  error = false,
  status,
  size = 'lg',
  className,
  renderOption,
  label,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: SelectProps<T>) {
  // --------------------------------------------------------------------------
  // FormField 연동 (선택적)
  // FormField 내부에서 사용되면 자동으로 id, status, disabled 등을 상속받음
  // --------------------------------------------------------------------------
  const formField = useFormFieldOptional();

  // --------------------------------------------------------------------------
  // 최종 상태값 계산
  // 우선순위: Select props > FormField context > 기본값
  // --------------------------------------------------------------------------
  const finalStatus =
    status || formField?.status || (error ? 'error' : undefined);
  const hasError = finalStatus === 'error';
  const finalDisabled = formField?.disabled || disabled;
  const finalId = formField?.id;

  // --------------------------------------------------------------------------
  // 이벤트 핸들러
  // Radix는 string만 지원하므로 제네릭 T로 변환
  // --------------------------------------------------------------------------
  const handleValueChange = (newValue: string) => {
    onChange?.(newValue as T);
  };

  // value를 string으로 변환 (Radix 호환)
  const stringValue = value !== undefined ? String(value) : undefined;

  // --------------------------------------------------------------------------
  // 렌더링
  // --------------------------------------------------------------------------
  return (
    <SelectPrimitive.Root
      value={stringValue}
      onValueChange={handleValueChange}
      disabled={finalDisabled}
    >
      <div className={cn('relative', className)}>
        {/* 레이블 (deprecated - FormLabel 사용 권장) */}
        {label && (
          <label className="block text-sm leading-[150%] font-medium text-krds-gray-70 mb-1">
            {label}
          </label>
        )}

        {/* 트리거 버튼: 클릭하면 드롭다운이 열림 */}
        <SelectPrimitive.Trigger
          id={finalId}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-invalid={hasError ? true : undefined}
          aria-required={formField?.required || undefined}
          aria-describedby={
            [formField?.errorId, formField?.helperId]
              .filter(Boolean)
              .join(' ') || undefined
          }
          className={cn(
            // 기본 스타일 + 사이즈
            'flex w-full items-center justify-between rounded-md border bg-krds-white pl-4 pr-12 py-2 text-lg leading-[150%] shadow-sm transition-colors',
            sizeClasses[size],
            // 포커스 스타일
            'focus:outline-none focus:ring-2 focus:ring-krds-primary-60 focus:ring-offset-2',
            // 에러/정상 상태에 따른 테두리 색상
            hasError
              ? 'border-krds-danger-60 focus:ring-krds-danger-60'
              : 'border-krds-gray-60 hover:border-krds-gray-40',
            // 비활성화 스타일
            finalDisabled &&
              'cursor-not-allowed bg-krds-gray-5 text-krds-gray-40',
            // 플레이스홀더 색상
            'data-[placeholder]:text-krds-gray-50'
          )}
        >
          <SelectPrimitive.Value placeholder={placeholder || '선택하세요'} />
          <SelectPrimitive.Icon>
            <ChevronDownIcon className="h-6 w-6 absolute right-4 top-1/2 -translate-y-1/2" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        {/* 드롭다운 포털: body에 렌더링되어 z-index 문제 방지 */}
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className={cn(
              // 기본 스타일
              'relative z-50 max-h-96 min-w-[8rem] w-full overflow-hidden rounded-md border bg-krds-white text-base leading-[150%] shadow-md',
              // 열기/닫기 애니메이션
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
              'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
              'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
              // 방향에 따른 슬라이드 애니메이션
              'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
              'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2'
            )}
            position="popper"
          >
            {/* 옵션 목록 */}
            <SelectPrimitive.Viewport className="p-1">
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={String(option.value)}
                  value={String(option.value)}
                  disabled={option.disabled}
                  className={cn(
                    // 기본 스타일
                    'relative flex cursor-pointer select-none items-center rounded-sm py-2 pl-8 pr-2 outline-none',
                    // 포커스(키보드 탐색) 시 하이라이트
                    'focus:bg-krds-primary-60 focus:text-krds-white',
                    // 비활성화 옵션 스타일
                    'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                    option.disabled && 'cursor-not-allowed opacity-50'
                  )}
                >
                  {/* 선택됨 표시 (체크 아이콘) */}
                  <SelectPrimitive.ItemIndicator className="absolute left-2 flex w-4 items-center justify-center">
                    <CheckIcon className="h-4 w-4" />
                  </SelectPrimitive.ItemIndicator>

                  {/* 옵션 텍스트 */}
                  <SelectPrimitive.ItemText>
                    {renderOption ? renderOption(option) : option.label}
                  </SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </div>
    </SelectPrimitive.Root>
  );
}

Select.displayName = 'Select';

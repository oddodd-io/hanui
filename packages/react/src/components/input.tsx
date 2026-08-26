'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { Eye, EyeOff, X } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { useFormFieldOptional } from './form-field';

const inputVariants = cva(
  // Input 스타일 variants (cva로 타입 안전한 variant 관리)
  [
    'flex',
    'w-full',
    'rounded-md',
    'font-bold',
    'transition-colors',
    'placeholder:text-krds-gray-50',
    'focus-visible:outline-none',
    'disabled:cursor-not-allowed',
    'disabled:opacity-60',
    'disabled:bg-krds-gray-10',
    'read-only:bg-krds-gray-5',
    'read-only:cursor-default',
  ].join(' '),
  {
    variants: {
      variant: {
        // 시각적 스타일 (default, filled)
        default: [
          'border',
          'border-krds-gray-60',
          'bg-krds-white',
          'focus-visible:border-2',
          'focus-visible:border-krds-primary-base',
        ].join(' '),
        filled: [
          'border',
          'border-transparent',
          'bg-krds-gray-10',
          'focus-visible:border-2',
          'focus-visible:border-krds-primary-base',
        ].join(' '),
      },
      size: {
        // 크기 (sm: 40px, md: 48px, lg: 56px)
        sm: [
          'h-10',
          'px-4',
          'text-[15px]',
          'rounded-md',
          'leading-[150%]',
        ].join(' '), // 40px - KRDS body-sm
        md: [
          'h-12',
          'px-4',
          'text-krds-body-md',
          'rounded-md',
          'leading-[150%]',
        ].join(' '), // 48px - KRDS body-md (기본)
        lg: [
          'h-14',
          'px-4',
          'text-krds-body-lg',
          'rounded-lg',
          'leading-[150%]',
        ].join(' '), // 56px - KRDS body-lg
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface InputProps // Input Props
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  size?: 'sm' | 'md' | 'lg'; // 크기 (기본값: md)
  variant?: 'default' | 'filled'; // 시각적 스타일 (기본값: default)
  status?: 'error' | 'success' | 'info'; // 상태 (error: 에러, success: 성공, info: 정보)
  error?: boolean; // @deprecated status="error" 사용 권장 (하위 호환성)
  readOnly?: boolean; // 읽기 전용 상태
  clearable?: boolean; // 값이 있을 때 지우기 버튼 표시 (password 제외)
  onClear?: () => void; // 지우기 버튼 클릭 콜백
  leftAddon?: React.ReactNode; // 왼쪽 addon 요소 (아이콘, 접두사 등)
  rightAddon?: React.ReactNode; // 오른쪽 addon 요소 (아이콘, 접미사 등)
  className?: string; // 레이아웃 조정용 className (margin, width만 허용)
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>( // KRDS 입력 컴포넌트 (password 토글, clearable, addon, FormField 통합)
  (
    {
      className,
      type = 'text',
      variant,
      size,
      status,
      error = false,
      disabled = false,
      readOnly = false,
      clearable = false,
      onClear,
      leftAddon,
      rightAddon,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false); // 비밀번호 가시성 토글 상태

    // FormField 컨텍스트 (선택적)
    const formField = useFormFieldOptional();

    const inputType = type === 'password' && showPassword ? 'text' : type; // 실제 input type 결정 (password 가시성 토글 처리)
    const isClearable = formField?.clearable ?? clearable; // clearable 결정 (FormField > Input prop)
    const internalRef = React.useRef<HTMLInputElement>(null); // 비제어 컴포넌트용 내부 ref
    const [internalValue, setInternalValue] = React.useState(''); // 비제어 컴포넌트용 내부 값

    React.useImperativeHandle(ref, () => internalRef.current!); // 외부/내부 ref 병합

    React.useEffect(() => {
      // 비제어 컴포넌트의 internalValue 동기화
      if (value == null && internalRef.current) {
        setInternalValue(internalRef.current.value);
      }
    }, [value]);

    const hasValue = value != null ? value !== '' : internalValue !== ''; // clearable 기능을 위한 값 존재 여부 체크

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // input 변경 처리 (내부 값 추적)
      setInternalValue(e.target.value);
      if (onChange) {
        onChange(e);
      }
    };

    const handleClear = () => {
      // 지우기 버튼 클릭 처리
      setInternalValue('');
      if (internalRef.current) {
        internalRef.current.value = '';
      }
      if (onClear) {
        onClear();
      }
      if (onChange) {
        // onChange도 빈 값으로 트리거
        const syntheticEvent = {
          target: { value: '' },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    };

    const finalRightAddon = (() => {
      // 오른쪽 addon 구성 (password 토글, clear 버튼)
      const buttons: React.ReactNode[] = [];

      if (isClearable && hasValue) {
        // clearable이고 값이 있으면 clear 버튼 추가
        buttons.push(
          <button
            key="clear"
            type="button"
            onClick={handleClear}
            className="cursor-pointer hover:text-krds-primary-60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-krds-primary-60 rounded"
            aria-label="입력 지우기"
          >
            <X size={16} />
          </button>
        );
      }

      if (type === 'password') {
        // password 타입이면 가시성 토글 버튼 추가 (clear 버튼 다음)
        buttons.push(
          <button
            key="password-toggle"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="cursor-pointer hover:text-krds-primary-60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-krds-primary-60 rounded"
            aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        );
      }

      if (rightAddon) {
        // 커스텀 오른쪽 addon 추가
        buttons.push(rightAddon);
      }

      if (buttons.length === 0) return null; // 버튼 없으면 null 반환
      if (buttons.length === 1) return buttons[0];

      return <div className="flex items-center gap-2">{buttons}</div>;
    })();

    const finalStatus =
      status || formField?.status || (error ? 'error' : undefined); // 최종 status 결정 (우선순위: Input status > FormField status > error prop)
    const hasError = finalStatus === 'error';

    const mergedProps = {
      // FormField 컨텍스트가 있으면 props 병합
      ...props,
      value,
      onChange: handleChange,
      id: formField?.id || props.id,
      disabled: formField?.disabled || disabled,
      readOnly: readOnly,
      'aria-invalid': hasError ? true : undefined,
      'aria-required': formField?.required || props['aria-required'],
      'aria-describedby':
        [formField?.errorId, formField?.helperId, props['aria-describedby']]
          .filter(Boolean)
          .join(' ') || undefined,
      inputMode: type === 'number' ? ('numeric' as const) : props.inputMode, // 모바일 키보드 지원 (number 타입은 숫자 키보드)
    };

    const getStatusClasses = () => {
      // status 기반 스타일링
      if (hasError) {
        return 'border-krds-danger-60 focus-visible:border-2 focus-visible:border-krds-danger-60';
      }
      return ''; // success/info는 helper text 색상만 영향
    };

    if (leftAddon || finalRightAddon || isClearable || type === 'password') {
      // addon이 있거나 동적으로 생길 수 있으면 항상 컨테이너 사용 (DOM 구조 변경으로 인한 포커스 유실 방지)
      return (
        <div className={cn('relative flex items-center', className)}>
          {leftAddon && (
            <div className="pointer-events-none absolute left-3 flex items-center text-krds-gray-60">
              {leftAddon}
            </div>
          )}
          <input
            type={inputType}
            className={cn(
              inputVariants({ variant, size }),
              getStatusClasses(),
              leftAddon && 'pl-10',
              finalRightAddon && 'pr-10'
            )}
            ref={internalRef}
            {...mergedProps}
          />
          {finalRightAddon && (
            <div
              className={cn(
                'absolute right-3 flex items-center text-krds-gray-60',
                type === 'password' && 'pointer-events-auto'
              )}
            >
              {finalRightAddon}
            </div>
          )}
        </div>
      );
    }

    return (
      // addon 없는 단순 input
      <input
        type={inputType}
        className={cn(
          inputVariants({ variant, size }),
          getStatusClasses(),
          className
        )}
        ref={internalRef}
        {...mergedProps}
      />
    );
  }
);

Input.displayName = 'Input';

export { inputVariants }; // inputVariants 내보내기 (커스텀 input 스타일 확장용)

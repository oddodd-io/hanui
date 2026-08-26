'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useFormFieldOptional } from './form-field';

const checkboxVariants = cva(
  [
    'peer',
    'shrink-0',
    'rounded-md',
    'border',
    'border-krds-gray-60',
    'ring-offset-background',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-krds-primary-base',
    'focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed',
    'disabled:opacity-60',
    'data-[state=checked]:bg-krds-primary-base',
    'data-[state=checked]:border-krds-primary-base',
    'data-[state=checked]:text-krds-white',
    'transition-colors',
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'h-4 w-4', // 16px
        md: 'h-5 w-5', // 20px
        lg: 'h-6 w-6', // 24px
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface CheckboxProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
      'size'
    >,
    VariantProps<typeof checkboxVariants> {
  /** 체크박스 크기 */
  size?: 'sm' | 'md' | 'lg';
  /** 상태 표시 */
  status?: 'error' | 'success' | 'info';
  /** @deprecated status="error" 사용 권장 */
  error?: boolean;
  /** 레이블 텍스트 (제공 시 label 요소와 함께 렌더링) */
  label?: React.ReactNode;
  /** 레이블 위치 */
  labelPosition?: 'right' | 'left';
}

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(
  (
    {
      className,
      size,
      status,
      error = false,
      disabled,
      label,
      labelPosition = 'right',
      id,
      ...props
    },
    ref
  ) => {
    // FormField 컨텍스트 (선택적)
    const formField = useFormFieldOptional();

    const finalStatus =
      status || formField?.status || (error ? 'error' : undefined);
    const hasError = finalStatus === 'error';
    const finalDisabled = formField?.disabled || disabled;

    // label 있을 때 id 자동 생성
    const generatedId = React.useId();
    const checkboxId = id || (label ? generatedId : undefined);

    const getStatusClasses = () => {
      if (hasError) {
        return 'border-krds-danger-60 data-[state=checked]:bg-krds-danger-60 data-[state=checked]:border-krds-danger-60';
      }
      return '';
    };

    const getCheckIconSize = () => {
      switch (size) {
        case 'sm':
          return 12;
        case 'lg':
          return 16;
        case 'md':
        default:
          return 14;
      }
    };

    const checkboxElement = (
      <CheckboxPrimitive.Root
        ref={ref}
        id={checkboxId}
        className={cn(
          checkboxVariants({ size }),
          getStatusClasses(),
          className
        )}
        disabled={finalDisabled}
        aria-invalid={hasError ? true : undefined}
        aria-describedby={
          [formField?.errorId, formField?.helperId, props['aria-describedby']]
            .filter(Boolean)
            .join(' ') || undefined
        }
        {...props}
      >
        <CheckboxPrimitive.Indicator
          className={cn('flex items-center justify-center text-current')}
        >
          <Check size={getCheckIconSize()} strokeWidth={3} aria-hidden="true" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );

    // label 없으면 체크박스만 반환
    if (!label) {
      return checkboxElement;
    }

    // label 있으면 래퍼와 함께 반환
    return (
      <div
        className={cn(
          'flex items-center gap-2',
          labelPosition === 'left' && 'flex-row-reverse'
        )}
      >
        {checkboxElement}
        <label
          htmlFor={checkboxId}
          className={cn(
            'text-krds-body-md text-krds-gray-90 cursor-pointer select-none',
            finalDisabled && 'cursor-not-allowed opacity-60'
          )}
        >
          {label}
        </label>
      </div>
    );
  }
);

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

// CheckboxGroup Context
interface CheckboxGroupContextValue {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  status?: 'error' | 'success' | 'info';
}

const CheckboxGroupContext = React.createContext<
  CheckboxGroupContextValue | undefined
>(undefined);

const useCheckboxGroup = () => {
  const context = React.useContext(CheckboxGroupContext);
  if (!context) {
    throw new Error('useCheckboxGroup must be used within CheckboxGroup');
  }
  return context;
};

export interface CheckboxGroupProps {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  status?: 'error' | 'success' | 'info';
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  children: React.ReactNode;
}

export const CheckboxGroup = React.forwardRef<
  HTMLDivElement,
  CheckboxGroupProps
>(
  (
    {
      value: controlledValue,
      defaultValue = [],
      onValueChange,
      disabled,
      size = 'md',
      status,
      orientation = 'vertical',
      className,
      children,
    },
    ref
  ) => {
    const [internalValue, setInternalValue] =
      React.useState<string[]>(defaultValue);

    // FormField 컨텍스트 (선택적)
    const formField = useFormFieldOptional();

    const finalStatus = status || formField?.status;
    const finalDisabled = formField?.disabled || disabled;

    const value = controlledValue ?? internalValue;

    const handleChange = (newValue: string[]) => {
      if (!controlledValue) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    };

    const contextValue: CheckboxGroupContextValue = {
      value,
      onChange: handleChange,
      disabled: finalDisabled,
      size,
      status: finalStatus,
    };

    return (
      <CheckboxGroupContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            'flex',
            orientation === 'vertical' ? 'flex-col gap-3' : 'flex-row gap-4',
            className
          )}
          role="group"
          aria-invalid={finalStatus === 'error' ? true : undefined}
          aria-describedby={
            [formField?.errorId, formField?.helperId]
              .filter(Boolean)
              .join(' ') || undefined
          }
        >
          {children}
        </div>
      </CheckboxGroupContext.Provider>
    );
  }
);

CheckboxGroup.displayName = 'CheckboxGroup';

export interface CheckboxGroupItemProps {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const CheckboxGroupItem = React.forwardRef<
  HTMLDivElement,
  CheckboxGroupItemProps
>(({ value, label, disabled, className }, ref) => {
  const group = useCheckboxGroup();

  const isChecked = group.value.includes(value);
  const isDisabled = group.disabled || disabled;

  const handleCheckedChange = (checked: boolean) => {
    if (checked) {
      group.onChange([...group.value, value]);
    } else {
      group.onChange(group.value.filter((v) => v !== value));
    }
  };

  return (
    <div ref={ref} className={cn('flex items-center gap-2', className)}>
      <Checkbox
        checked={isChecked}
        onCheckedChange={handleCheckedChange}
        disabled={isDisabled}
        size={group.size}
        status={group.status}
        id={value}
      />
      <label
        htmlFor={value}
        className={cn(
          'text-krds-body-md text-krds-gray-90 cursor-pointer select-none',
          isDisabled && 'cursor-not-allowed opacity-60'
        )}
      >
        {label}
      </label>
    </div>
  );
});

CheckboxGroupItem.displayName = 'CheckboxGroupItem';

// ============================================================================
// ChipCheckbox (칩 스타일 체크박스)
// ============================================================================

const chipCheckboxVariants = cva(
  [
    'inline-flex',
    'items-center',
    'gap-2',
    'px-4',
    'py-2',
    'rounded',
    'border',
    'cursor-pointer',
    'select-none',
    'transition-colors',
    // 실제 포커스는 내부의 네이티브 checkbox가 받는다.
    // (peer는 형제만 대상으로 하므로 부모인 label에서는 :has()를 쓴다)
    '[&:has(:focus-visible)]:outline-none',
    '[&:has(:focus-visible)]:ring-2',
    '[&:has(:focus-visible)]:ring-krds-primary-base',
    '[&:has(:focus-visible)]:ring-offset-2',
  ].join(' '),
  {
    variants: {
      checked: {
        true: 'bg-krds-primary-base border-krds-primary-base text-white',
        false:
          'bg-white border-krds-gray-30 text-krds-gray-90 hover:bg-krds-gray-5',
      },
      disabled: {
        true: 'opacity-60 cursor-not-allowed',
        false: '',
      },
    },
    defaultVariants: {
      checked: false,
      disabled: false,
    },
  }
);

export interface ChipCheckboxProps
  extends Omit<React.HTMLAttributes<HTMLLabelElement>, 'onChange'> {
  /** 체크박스 레이블 */
  label: React.ReactNode;
  /** 선택 상태 (제어) */
  checked?: boolean;
  /** 기본 선택 상태 (비제어) */
  defaultChecked?: boolean;
  /** 상태 변경 콜백 */
  onCheckedChange?: (checked: boolean) => void;
  /** 비활성화 */
  disabled?: boolean;
  /** 체크박스 값 */
  value?: string;
  /** 폼 제출용 필드 이름 */
  name?: string;
}

export const ChipCheckbox = React.forwardRef<
  HTMLLabelElement,
  ChipCheckboxProps
>(
  (
    {
      label,
      checked: controlledChecked,
      defaultChecked = false,
      onCheckedChange,
      disabled = false,
      value,
      name,
      className,
      ...props
    },
    ref
  ) => {
    const [internalChecked, setInternalChecked] =
      React.useState(defaultChecked);
    const isControlled = controlledChecked !== undefined;
    const isChecked = isControlled ? controlledChecked : internalChecked;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked;
      if (!isControlled) {
        setInternalChecked(newChecked);
      }
      onCheckedChange?.(newChecked);
    };

    return (
      <label
        ref={ref}
        className={cn(
          chipCheckboxVariants({ checked: isChecked, disabled }),
          className
        )}
        data-state={isChecked ? 'checked' : 'unchecked'}
        {...props}
      >
        {/* 네이티브 checkbox가 역할·키보드·폼 제출을 모두 담당한다 */}
        <input
          type="checkbox"
          name={name}
          value={value}
          checked={isChecked}
          disabled={disabled}
          onChange={handleChange}
          className="sr-only"
        />
        <Check
          size={16}
          strokeWidth={2.5}
          aria-hidden="true"
          className={cn(
            'shrink-0 transition-opacity',
            isChecked ? 'opacity-100' : 'opacity-40'
          )}
        />
        <span className="text-base">{label}</span>
      </label>
    );
  }
);

ChipCheckbox.displayName = 'ChipCheckbox';

export { checkboxVariants, chipCheckboxVariants };

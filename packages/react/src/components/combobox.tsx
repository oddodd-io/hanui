'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Command as CommandPrimitive } from 'cmdk';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, Search, X } from 'lucide-react';

/**
 * Combobox 스타일 variants
 */
const comboboxTriggerVariants = cva(
  'flex h-10 w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-krds-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border-krds-gray-30 focus:ring-krds-primary-base focus:border-krds-primary-base',
        error:
          'border-krds-danger-base focus:ring-krds-danger-base focus:border-krds-danger-base',
      },
      size: {
        sm: 'h-8 text-xs px-2',
        md: 'h-10 text-sm px-3',
        lg: 'h-12 text-base px-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface ComboboxOption {
  /** 옵션 값 */
  value: string;
  /** 표시될 레이블 */
  label: string;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 그룹 (선택적) */
  group?: string;
  /** 아이콘 (선택적) */
  icon?: React.ReactNode;
  /** 설명 (선택적) */
  description?: string;
}

interface ComboboxBaseProps
  extends VariantProps<typeof comboboxTriggerVariants> {
  /** 옵션 목록 */
  options: ComboboxOption[];
  /** 플레이스홀더 */
  placeholder?: string;
  /** 검색 플레이스홀더 */
  searchPlaceholder?: string;
  /** 결과 없을 때 메시지 */
  emptyMessage?: string;
  /** 비활성화 */
  disabled?: boolean;
  /** 검색어 변경 콜백 */
  onSearchChange?: (search: string) => void;
  /** 클리어 가능 여부 */
  clearable?: boolean;
  /** 추가 className */
  className?: string;
  /** 필수 여부 */
  required?: boolean;
  /** aria-label */
  'aria-label'?: string;
  /** aria-labelledby */
  'aria-labelledby'?: string;
  /** 팝오버 너비 */
  popoverWidth?: 'trigger' | 'content' | number;
  /** 최대 높이 */
  maxHeight?: number;
  /** 로딩 상태 */
  loading?: boolean;
}

interface ComboboxSingleProps extends ComboboxBaseProps {
  /** 다중 선택 여부 (false 또는 미지정) */
  multiple?: false;
  /** 선택된 값 */
  value?: string;
  /** 값 변경 콜백 */
  onValueChange?: (value: string) => void;
}

interface ComboboxMultipleProps extends ComboboxBaseProps {
  /** 다중 선택 모드 활성화 */
  multiple: true;
  /** 선택된 값 배열 */
  value?: string[];
  /** 값 변경 콜백 (배열) */
  onValueChange?: (value: string[]) => void;
  /** 다중 선택 시 트리거에 표시할 최대 칩 개수 (초과 시 "+N" 표시) */
  maxDisplayedItems?: number;
}

export type ComboboxProps = ComboboxSingleProps | ComboboxMultipleProps;

/**
 * Combobox 컴포넌트
 *
 * 검색 가능한 드롭다운 선택 컴포넌트입니다.
 *
 * 접근성:
 * - role="combobox" 적용
 * - aria-expanded로 열림 상태 표시
 * - aria-controls로 리스트박스 연결
 * - 키보드 탐색 지원 (화살표, Enter, Escape)
 * - 스크린리더 친화적 구조
 *
 * @example
 * ```tsx
 * const options = [
 *   { value: 'react', label: 'React' },
 *   { value: 'vue', label: 'Vue' },
 *   { value: 'angular', label: 'Angular' },
 * ];
 *
 * <Combobox
 *   options={options}
 *   value={selectedValue}
 *   onValueChange={setSelectedValue}
 *   placeholder="프레임워크 선택"
 * />
 * ```
 */
export const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>(
  (props, ref) => {
    const {
      options,
      placeholder = '선택해주세요',
      searchPlaceholder = '검색...',
      emptyMessage = '결과가 없습니다.',
      disabled = false,
      onSearchChange,
      clearable = false,
      className,
      variant,
      size,
      required,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      popoverWidth = 'trigger',
      maxHeight = 300,
      loading = false,
    } = props;

    const isMultiple = props.multiple === true;
    const maxDisplayedItems = isMultiple
      ? (props.maxDisplayedItems ?? 3)
      : undefined;

    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState('');
    const [triggerWidth, setTriggerWidth] = React.useState<number | null>(null);
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const listboxId = React.useId();

    // triggerWidth 업데이트
    React.useEffect(() => {
      if (open && triggerRef.current) {
        setTriggerWidth(triggerRef.current.offsetWidth);
      }
    }, [open]);

    // 그룹화된 옵션
    const groupedOptions = React.useMemo(() => {
      const groups = new Map<string, ComboboxOption[]>();
      const ungrouped: ComboboxOption[] = [];

      options.forEach((option) => {
        if (option.group) {
          const group = groups.get(option.group) || [];
          group.push(option);
          groups.set(option.group, group);
        } else {
          ungrouped.push(option);
        }
      });

      return { groups, ungrouped };
    }, [options]);

    // 다중/단일 모드별 선택값 처리
    const selectedValues = isMultiple
      ? (props.value ?? [])
      : props.value
        ? [props.value]
        : [];
    const selectedOptions = options.filter((opt) =>
      selectedValues.includes(opt.value)
    );
    const singleSelectedOption = !isMultiple
      ? options.find((opt) => opt.value === props.value)
      : null;

    const handleSelect = (currentValue: string) => {
      if (isMultiple) {
        const current = props.value ?? [];
        const newValue = current.includes(currentValue)
          ? current.filter((v) => v !== currentValue)
          : [...current, currentValue];
        props.onValueChange?.(newValue);
        // 다중 선택 시 popover 유지
      } else {
        const newValue = currentValue === props.value ? '' : currentValue;
        props.onValueChange?.(newValue);
        setOpen(false);
        setSearch('');
      }
    };

    const handleRemoveValue = (e: React.MouseEvent, valueToRemove: string) => {
      e.stopPropagation();
      if (isMultiple) {
        const current = props.value ?? [];
        props.onValueChange?.(current.filter((v) => v !== valueToRemove));
      }
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isMultiple) {
        props.onValueChange?.([]);
      } else {
        props.onValueChange?.('');
      }
      setSearch('');
    };

    const handleSearchChange = (newSearch: string) => {
      setSearch(newSearch);
      onSearchChange?.(newSearch);
    };

    // 팝오버 너비 계산
    const getPopoverWidth = () => {
      if (typeof popoverWidth === 'number') {
        return `${popoverWidth}px`;
      }
      if (popoverWidth === 'trigger' && triggerWidth) {
        return `${triggerWidth}px`;
      }
      return 'auto';
    };

    const renderOption = (option: ComboboxOption) => (
      <CommandPrimitive.Item
        key={option.value}
        value={option.value}
        onSelect={handleSelect}
        disabled={option.disabled}
        aria-selected={selectedValues.includes(option.value)}
        className={cn(
          'relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none',
          'data-[selected=true]:bg-krds-gray-10 data-[selected=true]:text-krds-gray-95',
          'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
          'hover:bg-krds-gray-5'
        )}
      >
        <span
          className={cn(
            'mr-2 flex h-4 w-4 items-center justify-center',
            selectedValues.includes(option.value) ? 'opacity-100' : 'opacity-0'
          )}
        >
          <Check className="h-4 w-4 text-krds-primary-base" />
        </span>
        {option.icon && (
          <span className="mr-2 text-krds-gray-50" aria-hidden="true">
            {option.icon}
          </span>
        )}
        <div className="flex flex-col">
          <span>{option.label}</span>
          {option.description && (
            <span className="text-xs text-krds-gray-50">
              {option.description}
            </span>
          )}
        </div>
      </CommandPrimitive.Item>
    );

    return (
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger asChild>
          <button
            ref={(node) => {
              if (typeof ref === 'function') ref(node);
              else if (ref) ref.current = node;
              (
                triggerRef as React.MutableRefObject<HTMLButtonElement | null>
              ).current = node;
            }}
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-haspopup="listbox"
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-required={required}
            disabled={disabled}
            className={cn(
              comboboxTriggerVariants({ variant, size }),
              className
            )}
          >
            {isMultiple ? (
              <span className="flex-1 flex flex-wrap gap-1 items-center text-left min-w-0">
                {selectedOptions.length === 0 ? (
                  <span className="text-krds-gray-50">{placeholder}</span>
                ) : (
                  <>
                    {selectedOptions.slice(0, maxDisplayedItems).map((opt) => (
                      <span
                        key={opt.value}
                        className="inline-flex items-center gap-1 rounded-sm bg-krds-gray-10 px-2 py-0.5 text-xs font-medium text-krds-gray-90"
                      >
                        {opt.label}
                        {!disabled && (
                          <button
                            type="button"
                            tabIndex={-1}
                            onClick={(e) => handleRemoveValue(e, opt.value)}
                            className="rounded-full hover:bg-krds-gray-30 p-0.5"
                            aria-label={`${opt.label} 제거`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </span>
                    ))}
                    {selectedOptions.length >
                      (maxDisplayedItems ?? selectedOptions.length) && (
                      <span className="inline-flex items-center rounded-sm bg-krds-gray-10 px-2 py-0.5 text-xs font-medium text-krds-gray-70">
                        +{selectedOptions.length - (maxDisplayedItems ?? 0)}
                      </span>
                    )}
                  </>
                )}
              </span>
            ) : (
              <span
                className={cn(
                  'flex-1 truncate text-left',
                  !singleSelectedOption && 'text-krds-gray-50'
                )}
              >
                {singleSelectedOption
                  ? singleSelectedOption.label
                  : placeholder}
              </span>
            )}
            <div className="flex items-center gap-1">
              {clearable && selectedValues.length > 0 && !disabled && (
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={handleClear}
                  className="rounded-full p-0.5 hover:bg-krds-gray-20"
                  aria-label="선택 해제"
                >
                  <X className="h-3.5 w-3.5 text-krds-gray-50" />
                </button>
              )}
              <ChevronsUpDown
                className="h-4 w-4 shrink-0 text-krds-gray-40"
                aria-hidden="true"
              />
            </div>
          </button>
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            className={cn(
              'z-50 overflow-hidden rounded-md border border-krds-gray-20 bg-white shadow-md',
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
              'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
              'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
              'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2'
            )}
            style={{ minWidth: getPopoverWidth(), width: 'auto' }}
            sideOffset={4}
            align="start"
          >
            <CommandPrimitive
              className="flex h-full w-full flex-col overflow-hidden"
              shouldFilter={true}
            >
              {/* 검색 입력 */}
              <div className="flex items-center border-b border-krds-gray-20 px-3">
                <Search
                  className="mr-2 h-4 w-4 shrink-0 text-krds-gray-40"
                  aria-hidden="true"
                />
                <CommandPrimitive.Input
                  value={search}
                  onValueChange={handleSearchChange}
                  placeholder={searchPlaceholder}
                  className="flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-krds-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {/* 로딩 상태 */}
              {loading && (
                <div className="flex items-center justify-center py-6">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-krds-gray-20 border-t-krds-primary-base" />
                </div>
              )}

              {/* 옵션 리스트 */}
              {!loading && (
                <CommandPrimitive.List
                  id={listboxId}
                  role="listbox"
                  className="overflow-auto p-2"
                  style={{ maxHeight }}
                >
                  <CommandPrimitive.Empty className="py-6 text-center text-sm text-krds-gray-50">
                    {emptyMessage}
                  </CommandPrimitive.Empty>

                  {/* 그룹화되지 않은 옵션 */}
                  {groupedOptions.ungrouped.map(renderOption)}

                  {/* 그룹화된 옵션 */}
                  {Array.from(groupedOptions.groups.entries()).map(
                    ([groupName, groupOptions]) => (
                      <CommandPrimitive.Group
                        key={groupName}
                        heading={groupName}
                        className="px-2 py-1.5"
                      >
                        <div className="mb-1 text-xs font-medium text-krds-gray-50">
                          {groupName}
                        </div>
                        {groupOptions.map(renderOption)}
                      </CommandPrimitive.Group>
                    )
                  )}
                </CommandPrimitive.List>
              )}
            </CommandPrimitive>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    );
  }
);

Combobox.displayName = 'Combobox';

export { comboboxTriggerVariants };

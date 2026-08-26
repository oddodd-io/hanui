'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '../lib/utils';

// ============================================================================
// Steps Compound Component
// Chakra UI 스타일의 유연한 단계 표시기
// ============================================================================

type StepStatus = 'completed' | 'current' | 'upcoming';
type Orientation = 'horizontal' | 'vertical';
type Size = 'sm' | 'md' | 'lg';

// ============================================================================
// Context
// ============================================================================

interface StepsContextValue {
  step: number;
  count: number;
  orientation: Orientation;
  size: Size;
  goTo: (step: number) => void;
  next: () => void;
  prev: () => void;
  isFirst: boolean;
  isLast: boolean;
  isComplete: boolean;
  getStatus: (index: number) => StepStatus;
}

const StepsContext = React.createContext<StepsContextValue | null>(null);

function useStepsContext() {
  const context = React.useContext(StepsContext);
  if (!context) {
    throw new Error('Steps 컴포넌트는 Steps.Root 내부에서 사용해야 합니다.');
  }
  return context;
}

// Item Context (현재 아이템의 index)
interface StepsItemContextValue {
  index: number;
  status: StepStatus;
}

const StepsItemContext = React.createContext<StepsItemContextValue | null>(
  null
);

function useStepsItemContext() {
  const context = React.useContext(StepsItemContext);
  if (!context) {
    throw new Error(
      'Steps.Indicator/Title/Separator는 Steps.Item 내부에서 사용해야 합니다.'
    );
  }
  return context;
}

// ============================================================================
// Variants
// ============================================================================

const stepsListVariants = cva('', {
  variants: {
    orientation: {
      horizontal: 'flex flex-row items-start',
      vertical: 'flex flex-col',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

const stepsItemVariants = cva('relative flex', {
  variants: {
    orientation: {
      horizontal: 'flex-1 flex-col',
      vertical: 'flex-row gap-3 pb-8 last:pb-0',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

const stepsIndicatorVariants = cva(
  'flex items-center justify-center rounded-full font-medium transition-colors shrink-0 border-[3px]',
  {
    variants: {
      status: {
        completed: 'bg-krds-gray-50 border-krds-gray-50 text-white',
        current:
          'bg-white border-krds-primary-base text-krds-primary-base ring-4 ring-krds-primary-20',
        upcoming: 'bg-krds-gray-10 border-krds-gray-20 text-krds-gray-70',
      },
      size: {
        sm: 'w-6 h-6 text-krds-body-xs',
        md: 'w-8 h-8 text-krds-body-sm',
        lg: 'w-10 h-10 text-krds-body-md',
      },
    },
    defaultVariants: {
      status: 'upcoming',
      size: 'md',
    },
  }
);

const stepsTitleVariants = cva('font-bold transition-colors', {
  variants: {
    status: {
      completed: 'text-krds-gray-70',
      current: 'text-krds-gray-95',
      upcoming: 'text-krds-gray-50',
    },
    size: {
      sm: 'text-krds-body-xs',
      md: 'text-krds-body-sm',
      lg: 'text-krds-body-md',
    },
  },
  defaultVariants: {
    status: 'upcoming',
    size: 'md',
  },
});

const stepsDescriptionVariants = cva('transition-colors', {
  variants: {
    status: {
      completed: 'text-krds-gray-50',
      current: 'text-krds-gray-70',
      upcoming: 'text-krds-gray-60',
    },
    size: {
      sm: 'text-krds-body-xs',
      md: 'text-krds-body-xs',
      lg: 'text-krds-body-sm',
    },
  },
  defaultVariants: {
    status: 'upcoming',
    size: 'md',
  },
});

const stepsSeparatorVariants = cva('transition-colors', {
  variants: {
    orientation: {
      horizontal: 'h-[3px] flex-1 mx-2',
      vertical: 'w-[3px] absolute left-4 top-10 bottom-2',
    },
    status: {
      completed: 'bg-krds-gray-50',
      current: 'bg-krds-gray-20',
      upcoming: 'bg-krds-gray-20',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
    },
  },
  compoundVariants: [
    { orientation: 'vertical', size: 'sm', className: 'left-3 top-8' },
    { orientation: 'vertical', size: 'md', className: 'left-4 top-10' },
    { orientation: 'vertical', size: 'lg', className: 'left-5 top-12' },
  ],
  defaultVariants: {
    orientation: 'horizontal',
    status: 'upcoming',
    size: 'md',
  },
});

// ============================================================================
// Steps.Root
// ============================================================================

export interface StepsRootProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 현재 단계 (0부터 시작) */
  step: number;
  /** 단계 변경 핸들러 */
  onStepChange?: (details: { step: number }) => void;
  /** 총 단계 수 */
  count: number;
  /** 방향 */
  orientation?: Orientation;
  /** 크기 */
  size?: Size;
}

const StepsRoot = React.forwardRef<HTMLDivElement, StepsRootProps>(
  (
    {
      children,
      className,
      step,
      onStepChange,
      count,
      orientation = 'horizontal',
      size = 'md',
      ...props
    },
    ref
  ) => {
    const goTo = React.useCallback(
      (newStep: number) => {
        if (newStep >= 0 && newStep < count) {
          onStepChange?.({ step: newStep });
        }
      },
      [count, onStepChange]
    );

    const next = React.useCallback(() => {
      if (step < count - 1) {
        onStepChange?.({ step: step + 1 });
      }
    }, [step, count, onStepChange]);

    const prev = React.useCallback(() => {
      if (step > 0) {
        onStepChange?.({ step: step - 1 });
      }
    }, [step, onStepChange]);

    const getStatus = React.useCallback(
      (index: number): StepStatus => {
        if (index < step) return 'completed';
        if (index === step) return 'current';
        return 'upcoming';
      },
      [step]
    );

    const contextValue: StepsContextValue = {
      step,
      count,
      orientation,
      size,
      goTo,
      next,
      prev,
      isFirst: step === 0,
      isLast: step === count - 1,
      isComplete: step >= count,
      getStatus,
    };

    return (
      <StepsContext.Provider value={contextValue}>
        <div ref={ref} className={cn('steps-root', className)} {...props}>
          {children}
        </div>
      </StepsContext.Provider>
    );
  }
);
StepsRoot.displayName = 'Steps.Root';

// ============================================================================
// Steps.List
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface StepsListProps
  extends React.OlHTMLAttributes<HTMLOListElement> {}

const StepsList = React.forwardRef<HTMLOListElement, StepsListProps>(
  ({ children, className, ...props }, ref) => {
    const { orientation } = useStepsContext();

    return (
      <ol
        ref={ref}
        className={cn(stepsListVariants({ orientation }), className)}
        aria-label="진행 단계"
        {...props}
      >
        {children}
      </ol>
    );
  }
);
StepsList.displayName = 'Steps.List';

// ============================================================================
// Steps.Item
// ============================================================================

export interface StepsItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  /** 단계 인덱스 (0부터 시작) */
  index: number;
}

const StepsItem = React.forwardRef<HTMLLIElement, StepsItemProps>(
  ({ children, className, index, ...props }, ref) => {
    const { orientation, getStatus } = useStepsContext();
    const status = getStatus(index);

    return (
      <StepsItemContext.Provider value={{ index, status }}>
        <li
          ref={ref}
          className={cn(stepsItemVariants({ orientation }), className)}
          aria-current={status === 'current' ? 'step' : undefined}
          {...props}
        >
          {children}
        </li>
      </StepsItemContext.Provider>
    );
  }
);
StepsItem.displayName = 'Steps.Item';

// ============================================================================
// Steps.Indicator
// ============================================================================

export interface StepsIndicatorProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  /** 체크 아이콘 표시 여부 (완료 시) */
  showCheckIcon?: boolean;
}

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const StepsIndicator = React.forwardRef<HTMLSpanElement, StepsIndicatorProps>(
  ({ children, className, showCheckIcon = true, ...props }, ref) => {
    const { size } = useStepsContext();
    const { index, status } = useStepsItemContext();

    const content =
      children ??
      (status === 'completed' && showCheckIcon ? (
        <CheckIcon className="w-4 h-4" />
      ) : (
        <span>{index + 1}</span>
      ));

    return (
      <span
        ref={ref}
        className={cn(stepsIndicatorVariants({ status, size }), className)}
        aria-hidden="true"
        {...props}
      >
        {content}
      </span>
    );
  }
);
StepsIndicator.displayName = 'Steps.Indicator';

// ============================================================================
// Steps.Title
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface StepsTitleProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

const StepsTitle = React.forwardRef<HTMLSpanElement, StepsTitleProps>(
  ({ children, className, ...props }, ref) => {
    const { size } = useStepsContext();
    const { status } = useStepsItemContext();

    return (
      <span
        ref={ref}
        className={cn(stepsTitleVariants({ status, size }), className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);
StepsTitle.displayName = 'Steps.Title';

// ============================================================================
// Steps.Description
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface StepsDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

const StepsDescription = React.forwardRef<
  HTMLParagraphElement,
  StepsDescriptionProps
>(({ children, className, ...props }, ref) => {
  const { size } = useStepsContext();
  const { status } = useStepsItemContext();

  return (
    <p
      ref={ref}
      className={cn(stepsDescriptionVariants({ status, size }), className)}
      {...props}
    >
      {children}
    </p>
  );
});
StepsDescription.displayName = 'Steps.Description';

// ============================================================================
// Steps.Separator
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface StepsSeparatorProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const StepsSeparator = React.forwardRef<HTMLDivElement, StepsSeparatorProps>(
  ({ className, ...props }, ref) => {
    const { orientation, size, step } = useStepsContext();
    const { index } = useStepsItemContext();

    const status: StepStatus = index < step ? 'completed' : 'upcoming';

    return (
      <div
        ref={ref}
        className={cn(
          stepsSeparatorVariants({ orientation, status, size }),
          className
        )}
        aria-hidden="true"
        {...props}
      />
    );
  }
);
StepsSeparator.displayName = 'Steps.Separator';

// ============================================================================
// Steps.Content
// ============================================================================

export interface StepsContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** 단계 인덱스 */
  index: number;
}

const StepsContent = React.forwardRef<HTMLDivElement, StepsContentProps>(
  ({ children, className, index, ...props }, ref) => {
    const { step } = useStepsContext();

    if (step !== index) return null;

    return (
      <div
        ref={ref}
        className={cn('steps-content', className)}
        role="tabpanel"
        {...props}
      >
        {children}
      </div>
    );
  }
);
StepsContent.displayName = 'Steps.Content';

// ============================================================================
// Steps.CompletedContent
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface StepsCompletedContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const StepsCompletedContent = React.forwardRef<
  HTMLDivElement,
  StepsCompletedContentProps
>(({ children, className, ...props }, ref) => {
  const { step, count } = useStepsContext();

  // 마지막 단계를 넘어선 경우에만 표시
  if (step < count) return null;

  return (
    <div
      ref={ref}
      className={cn('steps-completed-content', className)}
      {...props}
    >
      {children}
    </div>
  );
});
StepsCompletedContent.displayName = 'Steps.CompletedContent';

// ============================================================================
// Steps.PrevTrigger
// ============================================================================

export interface StepsPrevTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const StepsPrevTrigger = React.forwardRef<
  HTMLButtonElement,
  StepsPrevTriggerProps
>(({ children, asChild, disabled, onClick, ...props }, ref) => {
  const { prev, isFirst } = useStepsContext();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (!e.defaultPrevented) {
      prev();
    }
  };

  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      ref={ref}
      type="button"
      disabled={disabled ?? isFirst}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Comp>
  );
});
StepsPrevTrigger.displayName = 'Steps.PrevTrigger';

// ============================================================================
// Steps.NextTrigger
// ============================================================================

export interface StepsNextTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const StepsNextTrigger = React.forwardRef<
  HTMLButtonElement,
  StepsNextTriggerProps
>(({ children, asChild, disabled, onClick, ...props }, ref) => {
  const { next, isLast } = useStepsContext();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (!e.defaultPrevented) {
      next();
    }
  };

  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      ref={ref}
      type="button"
      disabled={disabled ?? isLast}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Comp>
  );
});
StepsNextTrigger.displayName = 'Steps.NextTrigger';

// ============================================================================
// Export
// ============================================================================

export const Steps = {
  Root: StepsRoot,
  List: StepsList,
  Item: StepsItem,
  Indicator: StepsIndicator,
  Title: StepsTitle,
  Description: StepsDescription,
  Separator: StepsSeparator,
  Content: StepsContent,
  CompletedContent: StepsCompletedContent,
  PrevTrigger: StepsPrevTrigger,
  NextTrigger: StepsNextTrigger,
};

// Variants export
export {
  stepsListVariants,
  stepsItemVariants,
  stepsIndicatorVariants,
  stepsTitleVariants,
  stepsDescriptionVariants,
  stepsSeparatorVariants,
};

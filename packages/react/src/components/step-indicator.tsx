'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

// ============================================================================
// Step Indicator 컴포넌트
// KRDS 단계 표시기 - 사용자가 거쳐야 하는 일련의 단계를 시각화
// ============================================================================

// Step 상태 타입
type StepStatus = 'completed' | 'current' | 'upcoming';

// 개별 Step 데이터 타입
export interface StepItem {
  /** 단계 레이블 */
  label: string;
  /** 단계 설명 (선택) */
  description?: string;
  /** 선택적 단계 여부 */
  optional?: boolean;
}

// 컨테이너 스타일
const stepIndicatorVariants = cva('', {
  variants: {
    orientation: {
      horizontal: 'flex flex-row items-start',
      vertical: 'flex flex-col',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
    size: 'md',
  },
});

// 개별 Step 스타일
const stepVariants = cva('relative flex', {
  variants: {
    orientation: {
      horizontal: 'flex-1 flex-col',
      vertical: 'flex-row gap-3 pb-8 last:pb-0',
    },
    status: {
      completed: '',
      current: '',
      upcoming: '',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
    status: 'upcoming',
    size: 'md',
  },
});

// 원형 인디케이터 스타일
const stepCircleVariants = cva(
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

// 레이블 스타일 (모바일 숨김)
const stepLabelVariants = cva('font-bold transition-colors hidden md:block', {
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

// 설명 스타일 (모바일 숨김)
const stepDescriptionVariants = cva('transition-colors hidden md:block', {
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

// 연결선 스타일
const stepConnectorVariants = cva('transition-colors', {
  variants: {
    orientation: {
      horizontal: 'h-[3px] flex-1',
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
    // 수직 방향일 때 크기별 위치 조정
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
// StepIndicator Props
// ============================================================================

export interface StepIndicatorProps
  extends Omit<React.HTMLAttributes<HTMLOListElement>, 'children'>,
    VariantProps<typeof stepIndicatorVariants> {
  /** 단계 목록 */
  steps: StepItem[];
  /** 현재 단계 인덱스 (0부터 시작) */
  currentStep: number;
  /** 단계 클릭 핸들러 (적응형 탐색 시 사용) */
  onStepClick?: (stepIndex: number) => void;
  /** 클릭 가능 여부 - true면 완료된 단계 클릭 가능 */
  clickable?: boolean;
  /** 완료 아이콘 표시 여부 */
  showCheckIcon?: boolean;
}

// 체크 아이콘 컴포넌트
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

// ============================================================================
// StepIndicator 컴포넌트
// ============================================================================

export const StepIndicator = React.forwardRef<
  HTMLOListElement,
  StepIndicatorProps
>(
  (
    {
      className,
      steps,
      currentStep,
      orientation = 'horizontal',
      size = 'md',
      onStepClick,
      clickable = false,
      showCheckIcon = true,
      ...props
    },
    ref
  ) => {
    // 각 단계의 상태 결정
    const getStepStatus = (index: number): StepStatus => {
      if (index < currentStep) return 'completed';
      if (index === currentStep) return 'current';
      return 'upcoming';
    };

    // 단계 클릭 핸들러
    const handleStepClick = (index: number) => {
      if (!clickable || !onStepClick) return;
      // 완료된 단계만 클릭 가능
      if (index < currentStep) {
        onStepClick(index);
      }
    };

    return (
      <ol
        ref={ref}
        className={cn(stepIndicatorVariants({ orientation, size }), className)}
        aria-label="진행 단계"
        {...props}
      >
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const isClickable = clickable && status === 'completed';
          const isLastStep = index === steps.length - 1;

          return (
            <li
              key={index}
              className={cn(stepVariants({ orientation, status, size }))}
              aria-current={status === 'current' ? 'step' : undefined}
            >
              {/* 수평 방향: 원 + 연결선 + 콘텐츠 */}
              {orientation === 'horizontal' ? (
                <>
                  {/* 원과 연결선 컨테이너 */}
                  <div className="flex items-center w-full">
                    {/* Step 원 */}
                    {isClickable ? (
                      <button
                        type="button"
                        className={cn(
                          stepCircleVariants({ status, size }),
                          'cursor-pointer hover:ring-4 hover:ring-krds-primary-20'
                        )}
                        onClick={() => handleStepClick(index)}
                        aria-label={`${index + 1}단계 (완료): ${step.label}`}
                      >
                        {status === 'completed' && showCheckIcon ? (
                          <CheckIcon className="w-4 h-4" />
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </button>
                    ) : (
                      <span
                        className={cn(stepCircleVariants({ status, size }))}
                        aria-hidden="true"
                      >
                        {status === 'completed' && showCheckIcon ? (
                          <CheckIcon className="w-4 h-4" />
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </span>
                    )}

                    {/* 연결선 (마지막 단계 제외) */}
                    {!isLastStep && (
                      <div
                        className={cn(
                          stepConnectorVariants({
                            orientation,
                            status:
                              index < currentStep ? 'completed' : 'upcoming',
                            size,
                          }),
                          'mx-2'
                        )}
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  {/* 레이블과 설명 */}
                  <div className="mt-4">
                    {/* 스크린리더용 현재 단계 표시 */}
                    {status === 'current' && (
                      <span className="sr-only">현재단계</span>
                    )}
                    {/* 단계 번호 - 모바일에서 숨김 */}
                    <span className="text-krds-gray-50 text-krds-body-xs hidden md:block">
                      {index + 1}단계
                    </span>
                    <span className={cn(stepLabelVariants({ status, size }))}>
                      {step.label}
                      {step.optional && (
                        <span className="text-krds-gray-50 ml-1">(선택)</span>
                      )}
                    </span>
                    {step.description && (
                      <p
                        className={cn(
                          stepDescriptionVariants({ status, size }),
                          'mt-1'
                        )}
                      >
                        {step.description}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                /* 수직 방향 */
                <>
                  {/* Step 원 */}
                  {isClickable ? (
                    <button
                      type="button"
                      className={cn(
                        stepCircleVariants({ status, size }),
                        'cursor-pointer hover:ring-4 hover:ring-krds-primary-20'
                      )}
                      onClick={() => handleStepClick(index)}
                      aria-label={`${index + 1}단계 (완료): ${step.label}`}
                    >
                      {status === 'completed' && showCheckIcon ? (
                        <CheckIcon className="w-4 h-4" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </button>
                  ) : (
                    <span
                      className={cn(stepCircleVariants({ status, size }))}
                      aria-hidden="true"
                    >
                      {status === 'completed' && showCheckIcon ? (
                        <CheckIcon className="w-4 h-4" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </span>
                  )}

                  {/* 연결선 (마지막 단계 제외) */}
                  {!isLastStep && (
                    <div
                      className={cn(
                        stepConnectorVariants({
                          orientation,
                          status:
                            index < currentStep ? 'completed' : 'upcoming',
                          size,
                        })
                      )}
                      aria-hidden="true"
                    />
                  )}

                  {/* 레이블과 설명 */}
                  <div className="flex flex-col">
                    {/* 스크린리더용 현재 단계 표시 */}
                    {status === 'current' && (
                      <span className="sr-only">현재단계</span>
                    )}
                    {/* 단계 번호 */}
                    <span className="text-krds-gray-50 text-krds-body-xs">
                      {index + 1}단계
                    </span>
                    <span
                      className={cn(
                        stepLabelVariants({ status, size }),
                        'block' // 수직에서는 항상 표시
                      )}
                    >
                      {step.label}
                      {step.optional && (
                        <span className="text-krds-gray-50 ml-1">(선택)</span>
                      )}
                    </span>
                    {step.description && (
                      <p
                        className={cn(
                          stepDescriptionVariants({ status, size }),
                          'mt-0.5 block' // 수직에서는 항상 표시
                        )}
                      >
                        {step.description}
                      </p>
                    )}
                  </div>
                </>
              )}
            </li>
          );
        })}
      </ol>
    );
  }
);

StepIndicator.displayName = 'StepIndicator';

// ============================================================================
// useSteps 훅
// ============================================================================

export interface UseStepsOptions {
  /** 총 단계 수 */
  count: number;
  /** 초기 단계 (기본: 0) */
  initialStep?: number;
}

export interface UseStepsReturn {
  /** 현재 단계 인덱스 */
  currentStep: number;
  /** 특정 단계로 이동 */
  goTo: (step: number) => void;
  /** 다음 단계로 이동 */
  next: () => void;
  /** 이전 단계로 이동 */
  prev: () => void;
  /** 첫 번째 단계인지 */
  isFirst: boolean;
  /** 마지막 단계인지 */
  isLast: boolean;
  /** 특정 단계가 완료되었는지 */
  isCompleted: (step: number) => boolean;
  /** 모든 단계가 완료되었는지 (마지막 단계에 도달) */
  isAllCompleted: boolean;
  /** 초기 단계로 리셋 */
  reset: () => void;
  /** StepIndicator에 바로 전달할 props */
  bind: {
    currentStep: number;
    onStepClick: (step: number) => void;
    clickable: boolean;
  };
}

/**
 * Step Indicator 상태 관리 훅
 *
 * @example
 * ```tsx
 * const stepper = useSteps({ count: 4 });
 *
 * <StepIndicator steps={steps} {...stepper.bind} />
 * <Button onClick={stepper.prev} disabled={stepper.isFirst}>이전</Button>
 * <Button onClick={stepper.next} disabled={stepper.isLast}>다음</Button>
 * ```
 */
export function useSteps({
  count,
  initialStep = 0,
}: UseStepsOptions): UseStepsReturn {
  const [currentStep, setCurrentStep] = React.useState(initialStep);

  const goTo = React.useCallback(
    (step: number) => {
      if (step >= 0 && step < count) {
        setCurrentStep(step);
      }
    },
    [count]
  );

  const next = React.useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, count - 1));
  }, [count]);

  const prev = React.useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const reset = React.useCallback(() => {
    setCurrentStep(initialStep);
  }, [initialStep]);

  const isCompleted = React.useCallback(
    (step: number) => step < currentStep,
    [currentStep]
  );

  return {
    currentStep,
    goTo,
    next,
    prev,
    isFirst: currentStep === 0,
    isLast: currentStep === count - 1,
    isCompleted,
    isAllCompleted: currentStep === count - 1,
    reset,
    bind: {
      currentStep,
      onStepClick: goTo,
      clickable: true,
    },
  };
}

// ============================================================================
// 샘플 데이터
// ============================================================================

export const SAMPLE_STEPS: StepItem[] = [
  { label: '약관 동의', description: '이용약관에 동의해주세요' },
  { label: '정보 입력', description: '기본 정보를 입력해주세요' },
  { label: '본인 인증', description: '본인 인증을 진행해주세요' },
  { label: '가입 완료' },
];

// Variants export
export { stepIndicatorVariants, stepCircleVariants, stepLabelVariants };

'use client';

/**
 * Form Kit - MultiStepForm Component
 * 다단계 폼 컴포넌트
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';

// ============================================================================
// 타입 정의
// ============================================================================

export interface MultiStepFormStep {
  /** 단계 ID */
  id: string;
  /** 단계 제목 */
  title: string;
  /** 단계 설명 (선택) */
  description?: string;
  /** 단계 아이콘 (선택) */
  icon?: React.ReactNode;
  /** 유효성 검사 함수 */
  validate?: () => boolean | Promise<boolean>;
  /** 건너뛰기 가능 여부 */
  optional?: boolean;
}

export interface MultiStepFormProps {
  /** 단계 배열 */
  steps: MultiStepFormStep[];
  /** 현재 단계 인덱스 (0부터 시작) */
  currentStep: number;
  /** 단계 변경 핸들러 */
  onStepChange: (step: number) => void;
  /** 폼 제출 핸들러 */
  onSubmit: () => void | Promise<void>;
  /** 각 단계 콘텐츠 렌더링 */
  children: React.ReactNode;
  /** 추가 className */
  className?: string;
  /** 진행 표시 스타일 */
  progressVariant?: 'bar' | 'steps' | 'dots';
  /** 네비게이션 버튼 숨김 */
  hideNavigation?: boolean;
  /** 단계 표시 숨김 */
  hideProgress?: boolean;
  /** 이전 버튼 텍스트 */
  prevButtonText?: string;
  /** 다음 버튼 텍스트 */
  nextButtonText?: string;
  /** 제출 버튼 텍스트 */
  submitButtonText?: string;
  /** 제출 중 상태 */
  isSubmitting?: boolean;
  /** 다음 버튼 비활성화 */
  disableNext?: boolean;
  /** 커스텀 네비게이션 렌더링 */
  renderNavigation?: (props: {
    currentStep: number;
    totalSteps: number;
    isFirstStep: boolean;
    isLastStep: boolean;
    goToPrev: () => void;
    goToNext: () => void;
    isSubmitting: boolean;
    disableNext: boolean;
  }) => React.ReactNode;
}

export interface MultiStepFormContextValue {
  currentStep: number;
  totalSteps: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  goToNext: () => void;
  goToPrev: () => void;
  goToStep: (step: number) => void;
}

// ============================================================================
// Context
// ============================================================================

const MultiStepFormContext =
  React.createContext<MultiStepFormContextValue | null>(null);

export function useMultiStepFormContext() {
  const context = React.useContext(MultiStepFormContext);
  if (!context) {
    throw new Error(
      'useMultiStepFormContext must be used within MultiStepForm'
    );
  }
  return context;
}

// ============================================================================
// Progress Bar
// ============================================================================

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

function ProgressBar({ currentStep, totalSteps, className }: ProgressBarProps) {
  const progress = Math.round(((currentStep + 1) / totalSteps) * 100);

  return (
    <div className={cn('w-full', className)}>
      <div
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`진행률 ${progress}%`}
        className="h-2 w-full rounded-full bg-krds-gray-20 overflow-hidden"
      >
        <div
          className="h-full rounded-full bg-krds-primary-base transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p
        className="mt-2 text-sm text-krds-gray-60 text-center"
        aria-live="polite"
      >
        {currentStep + 1} / {totalSteps} 단계
      </p>
    </div>
  );
}

// ============================================================================
// Step Indicator
// ============================================================================

interface StepIndicatorProps {
  steps: MultiStepFormStep[];
  currentStep: number;
  completedSteps: number[];
  onStepClick?: (step: number) => void;
  className?: string;
}

function StepIndicator({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
  className,
}: StepIndicatorProps) {
  return (
    <nav aria-label="폼 진행 단계" className={className}>
      <ol className="flex items-center justify-center gap-2">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(index);
          const isCurrent = index === currentStep;
          const isPast = index < currentStep;
          const canClick = isPast || isCompleted;

          return (
            <li key={step.id} className="flex items-center">
              {index > 0 && (
                <div
                  className={cn(
                    'w-8 h-0.5 mx-1',
                    isPast || isCompleted
                      ? 'bg-krds-primary-base'
                      : 'bg-krds-gray-30'
                  )}
                  aria-hidden="true"
                />
              )}
              <button
                type="button"
                onClick={() => canClick && onStepClick?.(index)}
                disabled={!canClick}
                className={cn(
                  'relative flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-all',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-krds-primary-base focus-visible:ring-offset-2',
                  isCurrent && [
                    'bg-krds-primary-base text-white',
                    'ring-2 ring-krds-primary-base ring-offset-2',
                  ],
                  isCompleted &&
                    !isCurrent && [
                      'bg-krds-primary-base text-white',
                      'hover:bg-krds-primary-60 cursor-pointer',
                    ],
                  !isCurrent &&
                    !isCompleted && [
                      'bg-krds-gray-20 text-krds-gray-70',
                      'cursor-not-allowed',
                    ]
                )}
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={`${step.title} ${
                  isCompleted ? '(완료)' : isCurrent ? '(현재)' : ''
                }`}
              >
                {isCompleted && !isCurrent ? (
                  <Check size={16} aria-hidden="true" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </button>
            </li>
          );
        })}
      </ol>
      {/* 현재 단계 정보 */}
      <div className="mt-4 text-center" aria-live="polite">
        <p className="text-lg font-semibold text-krds-gray-90">
          {steps[currentStep]?.title}
        </p>
        {steps[currentStep]?.description && (
          <p className="mt-1 text-sm text-krds-gray-60">
            {steps[currentStep].description}
          </p>
        )}
      </div>
    </nav>
  );
}

// ============================================================================
// Dot Indicator
// ============================================================================

interface DotIndicatorProps {
  totalSteps: number;
  currentStep: number;
  className?: string;
}

function DotIndicator({
  totalSteps,
  currentStep,
  className,
}: DotIndicatorProps) {
  return (
    <div
      className={cn('flex items-center justify-center gap-2', className)}
      role="tablist"
      aria-label="폼 진행 단계"
    >
      {Array.from({ length: totalSteps }, (_, index) => (
        <div
          key={index}
          role="tab"
          aria-selected={index === currentStep}
          aria-label={`${index + 1}단계 ${index === currentStep ? '(현재)' : ''}`}
          className={cn(
            'w-2.5 h-2.5 rounded-full transition-all',
            index === currentStep
              ? 'bg-krds-primary-base w-6'
              : index < currentStep
                ? 'bg-krds-primary-base'
                : 'bg-krds-gray-30'
          )}
        />
      ))}
    </div>
  );
}

// ============================================================================
// MultiStepForm 컴포넌트
// ============================================================================

/**
 * 다단계 폼 컴포넌트
 *
 * 접근성 기능:
 * - 현재 단계 aria-current="step"
 * - 진행률 role="progressbar"
 * - 단계 변경 시 자동 포커스 관리
 *
 * @example
 * ```tsx
 * const steps = [
 *   { id: 'info', title: '기본 정보' },
 *   { id: 'contact', title: '연락처' },
 *   { id: 'confirm', title: '확인' },
 * ];
 *
 * function SignupForm() {
 *   const [currentStep, setCurrentStep] = React.useState(0);
 *
 *   return (
 *     <MultiStepForm
 *       steps={steps}
 *       currentStep={currentStep}
 *       onStepChange={setCurrentStep}
 *       onSubmit={handleSubmit}
 *     >
 *       {currentStep === 0 && <InfoStep />}
 *       {currentStep === 1 && <ContactStep />}
 *       {currentStep === 2 && <ConfirmStep />}
 *     </MultiStepForm>
 *   );
 * }
 * ```
 */
export function MultiStepForm({
  steps,
  currentStep,
  onStepChange,
  onSubmit,
  children,
  className,
  progressVariant = 'steps',
  hideNavigation = false,
  hideProgress = false,
  prevButtonText = '이전',
  nextButtonText = '다음',
  submitButtonText = '제출',
  isSubmitting = false,
  disableNext = false,
  renderNavigation,
}: MultiStepFormProps) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [completedSteps, setCompletedSteps] = React.useState<number[]>([]);

  const totalSteps = steps.length;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  // 단계 변경 시 포커스 관리
  const focusContent = React.useCallback(() => {
    requestAnimationFrame(() => {
      const focusable = contentRef.current?.querySelector<HTMLElement>(
        'input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable) {
        focusable.focus();
      } else {
        contentRef.current?.focus();
      }
    });
  }, []);

  // 다음 단계로 이동
  const goToNext = React.useCallback(async () => {
    const currentStepConfig = steps[currentStep];

    // 유효성 검사
    if (currentStepConfig.validate) {
      const isValid = await currentStepConfig.validate();
      if (!isValid) return;
    }

    // 현재 단계 완료 처리
    setCompletedSteps((prev) =>
      prev.includes(currentStep) ? prev : [...prev, currentStep]
    );

    if (isLastStep) {
      await onSubmit();
    } else {
      onStepChange(currentStep + 1);
      focusContent();
    }
  }, [currentStep, steps, isLastStep, onSubmit, onStepChange, focusContent]);

  // 이전 단계로 이동
  const goToPrev = React.useCallback(() => {
    if (!isFirstStep) {
      onStepChange(currentStep - 1);
      focusContent();
    }
  }, [currentStep, isFirstStep, onStepChange, focusContent]);

  // 특정 단계로 이동
  const goToStep = React.useCallback(
    (step: number) => {
      if (step >= 0 && step < totalSteps) {
        onStepChange(step);
        focusContent();
      }
    },
    [totalSteps, onStepChange, focusContent]
  );

  const contextValue: MultiStepFormContextValue = {
    currentStep,
    totalSteps,
    isFirstStep,
    isLastStep,
    goToNext,
    goToPrev,
    goToStep,
  };

  // 진행 표시 렌더링
  const renderProgress = () => {
    if (hideProgress) return null;

    switch (progressVariant) {
      case 'bar':
        return (
          <ProgressBar
            currentStep={currentStep}
            totalSteps={totalSteps}
            className="mb-6"
          />
        );
      case 'dots':
        return (
          <DotIndicator
            totalSteps={totalSteps}
            currentStep={currentStep}
            className="mb-6"
          />
        );
      case 'steps':
      default:
        return (
          <StepIndicator
            steps={steps}
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={(step) => {
              if (completedSteps.includes(step) || step < currentStep) {
                goToStep(step);
              }
            }}
            className="mb-8"
          />
        );
    }
  };

  // 네비게이션 렌더링
  /* eslint-disable react-hooks/refs */
  const navigationContent = renderNavigation ? (
    renderNavigation({
      currentStep,
      totalSteps,
      isFirstStep,
      isLastStep,
      goToPrev,
      goToNext,
      isSubmitting,
      disableNext,
    })
  ) : (
    /* eslint-enable react-hooks/refs */
    <div className="flex items-center justify-between gap-4 mt-8">
      <button
        type="button"
        onClick={goToPrev}
        disabled={isFirstStep || isSubmitting}
        className={cn(
          'flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-colors',
          'text-krds-gray-70 bg-krds-gray-10 hover:bg-krds-gray-20',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-krds-primary-base focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        <ChevronLeft size={20} aria-hidden="true" />
        {prevButtonText}
      </button>

      <button
        type="button"
        onClick={goToNext}
        disabled={isSubmitting || disableNext}
        className={cn(
          'flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-colors',
          'text-white bg-krds-primary-base hover:bg-krds-primary-60',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-krds-primary-base focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        {isSubmitting ? (
          '처리 중...'
        ) : isLastStep ? (
          submitButtonText
        ) : (
          <>
            {nextButtonText}
            <ChevronRight size={20} aria-hidden="true" />
          </>
        )}
      </button>
    </div>
  );

  return (
    <MultiStepFormContext.Provider value={contextValue}>
      <div className={cn('w-full', className)}>
        {renderProgress()}

        {/* 단계 콘텐츠 */}
        <div
          ref={contentRef}
          tabIndex={-1}
          className="focus:outline-none"
          role="region"
          aria-label={`${steps[currentStep]?.title} 단계`}
        >
          {children}
        </div>

        {/* 네비게이션 */}
        {!hideNavigation && navigationContent}
      </div>
    </MultiStepFormContext.Provider>
  );
}

MultiStepForm.displayName = 'MultiStepForm';

// ============================================================================
// MultiStepFormStep 컴포넌트
// ============================================================================

export interface MultiStepFormStepProps {
  /** 단계 인덱스 (0부터 시작) */
  step: number;
  /** 자식 요소 */
  children: React.ReactNode;
  /** 추가 className */
  className?: string;
}

/**
 * 다단계 폼 단계 컴포넌트
 *
 * 현재 단계에 해당할 때만 렌더링됩니다.
 */
export function MultiStepFormStepContent({
  step,
  children,
  className,
}: MultiStepFormStepProps) {
  const { currentStep } = useMultiStepFormContext();

  if (step !== currentStep) {
    return null;
  }

  return (
    <div
      className={cn('animate-in fade-in-0 slide-in-from-right-4', className)}
    >
      {children}
    </div>
  );
}

MultiStepFormStepContent.displayName = 'MultiStepFormStepContent';

'use client';

// ============================================================================
// Types
// ============================================================================

import * as React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
  CardFooter,
} from '../card';
import { Button } from '../button';
import { Textarea } from '../textarea';
import { Body } from '../body';
import { cn } from '@/lib/utils';

export type SurveyQuestionType = 'rating' | 'choice' | 'text';

export interface SurveyQuestion {
  /** 질문 ID */
  id: number;
  /** 질문 내용 */
  question: string;
  /** 질문 유형 */
  type: SurveyQuestionType;
  /** 필수 여부 */
  required?: boolean;
  /** 선택지 (choice 유형) */
  options?: string[];
}

export interface SurveyAnswer {
  questionId: number;
  value: string | number;
}

export interface SurveyFormProps {
  /** 설문 제목 */
  title?: string;
  /** 설문 설명 */
  description?: string;
  /** 질문 목록 */
  questions: SurveyQuestion[];
  /** 제출 핸들러 */
  onSubmit?: (answers: SurveyAnswer[]) => void;
  /** 추가 className */
  className?: string;
}

// ============================================================================
// RatingInput Component
// ============================================================================

function RatingInput({
  value,
  onChange,
  labelledBy,
}: {
  value: number;
  onChange: (v: number) => void;
  /** 이 평점이 답하는 질문의 id */
  labelledBy?: string;
}) {
  const labels = ['매우 불만족', '불만족', '보통', '만족', '매우 만족'];

  return (
    <div className="space-y-2">
      <div className="flex gap-2" role="group" aria-labelledby={labelledBy}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={cn(
              'w-10 h-10 rounded-lg border-2 text-sm font-medium transition-colors',
              value === n
                ? 'border-krds-primary-base bg-krds-primary-base text-white'
                : 'border-krds-gray-20 text-krds-gray-60 hover:border-krds-primary-base hover:text-krds-primary-base'
            )}
            aria-label={`${n}점 - ${labels[n - 1]}`}
            aria-pressed={value === n}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="flex justify-between px-1">
        <Body size="xs" className="text-krds-gray-50">
          매우 불만족
        </Body>
        <Body size="xs" className="text-krds-gray-50">
          매우 만족
        </Body>
      </div>
    </div>
  );
}

// ============================================================================
// SurveyForm Component
// ============================================================================

export function SurveyForm({
  title = '만족도 조사',
  description,
  questions,
  onSubmit,
  className,
}: SurveyFormProps) {
  const [answers, setAnswers] = React.useState<Record<number, string | number>>(
    {}
  );
  const [submitted, setSubmitted] = React.useState(false);
  // 한 페이지에 설문이 여러 개여도 질문 id와 라디오 name이 겹치지 않도록 한다
  const formId = React.useId();

  const updateAnswer = (questionId: number, value: string | number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result: SurveyAnswer[] = Object.entries(answers).map(
      ([questionId, value]) => ({
        questionId: Number(questionId),
        value,
      })
    );
    onSubmit?.(result);
    setSubmitted(true);
  };

  const requiredQuestions = questions.filter((q) => q.required);
  const allRequiredAnswered = requiredQuestions.every(
    (q) => answers[q.id] !== undefined && answers[q.id] !== ''
  );

  if (submitted) {
    return (
      <Card variant="outlined" className={cn('w-full', className)}>
        <CardBody className="py-16 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-50 flex items-center justify-center">
            <Body size="lg" className="text-green-600">
              ✓
            </Body>
          </div>
          <Body size="lg" weight="bold" className="mb-2">
            감사합니다
          </Body>
          <Body size="sm" className="text-krds-gray-60">
            설문이 제출되었습니다. 소중한 의견 감사드립니다.
          </Body>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card variant="outlined" className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardBody className="space-y-8">
          {questions.map((q, index) => {
            const questionId = `${formId}-q-${q.id}`;
            return (
              <div key={q.id} className="space-y-3">
                <Body size="sm" weight="medium" id={questionId}>
                  {index + 1}. {q.question}
                  {q.required && (
                    <>
                      <span className="text-red-500 ml-1" aria-hidden="true">
                        *
                      </span>
                      <span className="sr-only">(필수)</span>
                    </>
                  )}
                </Body>

                {q.type === 'rating' && (
                  <RatingInput
                    value={(answers[q.id] as number) || 0}
                    onChange={(v) => updateAnswer(q.id, v)}
                    labelledBy={questionId}
                  />
                )}

                {q.type === 'choice' && q.options && (
                  <div
                    className="space-y-2"
                    role="radiogroup"
                    aria-labelledby={questionId}
                  >
                    {q.options.map((option, optIndex) => (
                      <label
                        key={optIndex}
                        className={cn(
                          'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                          answers[q.id] === option
                            ? 'border-krds-primary-base bg-krds-primary-5'
                            : 'border-krds-gray-20 hover:border-krds-gray-30'
                        )}
                      >
                        <input
                          type="radio"
                          name={`${formId}-q-${q.id}`}
                          value={option}
                          checked={answers[q.id] === option}
                          onChange={() => updateAnswer(q.id, option)}
                          className="accent-krds-primary-base"
                        />
                        <Body size="sm">{option}</Body>
                      </label>
                    ))}
                  </div>
                )}

                {q.type === 'text' && (
                  <Textarea
                    placeholder="의견을 작성해주세요..."
                    value={(answers[q.id] as string) || ''}
                    onChange={(e) => updateAnswer(q.id, e.target.value)}
                    rows={3}
                    aria-labelledby={questionId}
                  />
                )}
              </div>
            );
          })}
        </CardBody>

        <CardFooter className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            disabled={!allRequiredAnswered}
          >
            제출하기
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

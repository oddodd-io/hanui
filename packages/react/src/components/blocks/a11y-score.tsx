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
} from '../card';
import { Badge } from '../badge';
import { Body } from '../body';
import { cn } from '@/lib/utils';

export interface A11yScoreProps {
  /** 전체 점수 (0-100) */
  score: number;
  /** 카테고리별 점수 */
  categories?: A11yCategory[];
  /** 최근 변화 (이전 점수와의 차이) */
  change?: number;
  /** 마지막 검사 일시 */
  lastChecked?: string;
  /** 추가 className */
  className?: string;
}

export interface A11yCategory {
  /** 카테고리 이름 */
  name: string;
  /** 점수 (0-100) */
  score: number;
  /** 통과 항목 수 */
  passed: number;
  /** 전체 항목 수 */
  total: number;
}

// ============================================================================
// Helpers
// ============================================================================

function getScoreColor(score: number): string {
  if (score >= 90) return 'text-green-600';
  if (score >= 70) return 'text-yellow-600';
  if (score >= 50) return 'text-orange-600';
  return 'text-red-600';
}

function getScoreGrade(score: number): {
  label: string;
  variant: 'success' | 'warning' | 'error';
} {
  if (score >= 90) return { label: 'AA 충족', variant: 'success' };
  if (score >= 70) return { label: '개선 필요', variant: 'warning' };
  return { label: '미달', variant: 'error' };
}

function getBarColor(score: number): string {
  if (score >= 90) return 'bg-green-500';
  if (score >= 70) return 'bg-yellow-500';
  if (score >= 50) return 'bg-orange-500';
  return 'bg-red-500';
}

// ============================================================================
// ScoreRing Component
// ============================================================================

function ScoreRing({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-36 h-36">
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full -rotate-90"
        aria-hidden="true"
      >
        {/* 배경 원 */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-krds-gray-10"
        />
        {/* 점수 원 */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={getScoreColor(score)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Body
          as="span"
          weight="bold"
          className={cn('text-3xl', getScoreColor(score))}
        >
          {score}
        </Body>
        <Body size="xs" className="text-krds-gray-50">
          / 100
        </Body>
      </div>
    </div>
  );
}

// ============================================================================
// A11yScore Component
// ============================================================================

const defaultCategories: A11yCategory[] = [
  { name: '색상 대비', score: 95, passed: 19, total: 20 },
  { name: '키보드 접근성', score: 88, passed: 15, total: 17 },
  { name: 'ARIA 속성', score: 92, passed: 23, total: 25 },
  { name: '시맨틱 마크업', score: 80, passed: 12, total: 15 },
  { name: '포커스 관리', score: 85, passed: 17, total: 20 },
];

export function A11yScore({
  score,
  categories = defaultCategories,
  change,
  lastChecked,
  className,
}: A11yScoreProps) {
  const grade = getScoreGrade(score);

  return (
    <Card variant="outlined" className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>접근성 점수</CardTitle>
            <CardDescription>KWCAG 2.2 기준</CardDescription>
          </div>
          <Badge variant={grade.variant}>{grade.label}</Badge>
        </div>
      </CardHeader>

      <CardBody className="space-y-6">
        {/* 점수 링 */}
        <div className="flex items-center justify-center gap-8">
          <ScoreRing score={score} />

          <div className="space-y-2">
            {change !== undefined && (
              <div className="flex items-center gap-2">
                <Badge variant={change >= 0 ? 'success' : 'error'} size="md">
                  {change >= 0 ? '↑' : '↓'} {Math.abs(change)}점
                </Badge>
                <Body size="xs" className="text-krds-gray-50">
                  이전 대비
                </Body>
              </div>
            )}
            {lastChecked && (
              <Body size="xs" className="text-krds-gray-50">
                마지막 검사: {lastChecked}
              </Body>
            )}
          </div>
        </div>

        {/* 카테고리별 점수 */}
        <div className="space-y-3">
          {categories.map((cat) => (
            <div key={cat.name} className="space-y-1">
              <div className="flex items-center justify-between">
                <Body size="sm" className="text-krds-gray-70">
                  {cat.name}
                </Body>
                <Body size="sm" weight="medium">
                  {cat.passed}/{cat.total}
                  <span className="text-krds-gray-50 ml-1">
                    ({cat.score}점)
                  </span>
                </Body>
              </div>
              <div className="h-2 bg-krds-gray-10 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    getBarColor(cat.score)
                  )}
                  style={{ width: `${cat.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

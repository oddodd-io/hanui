'use client';

// ============================================================================
// Types
// ============================================================================

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardBody } from '../card';
import { Badge } from '../badge';
import { Button } from '../button';
import { Body } from '../body';
import { ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export type A11ySeverity = 'critical' | 'major' | 'minor';

export interface A11yIssue {
  /** 이슈 ID */
  id: number;
  /** 규칙 이름 (예: 'color-contrast') */
  rule: string;
  /** 이슈 설명 */
  description: string;
  /** 심각도 */
  severity: A11ySeverity;
  /** 영향받는 페이지 URL */
  pageUrl: string;
  /** 영향받는 요소 선택자 */
  selector?: string;
  /** 해결 방법 */
  solution?: string;
  /** WCAG 기준 (예: '1.4.3') */
  wcag?: string;
}

export interface A11yPageGroup {
  /** 페이지 URL */
  url: string;
  /** 페이지 제목 */
  title: string;
  /** 이슈 목록 */
  issues: A11yIssue[];
}

export interface A11yReportProps {
  /** 페이지별 이슈 그룹 */
  pages: A11yPageGroup[];
  /** 리포트 내보내기 */
  onExport?: () => void;
  /** 추가 className */
  className?: string;
}

// ============================================================================
// Helpers
// ============================================================================

const SEVERITY_CONFIG: Record<
  A11ySeverity,
  { label: string; variant: 'error' | 'warning' | 'info' }
> = {
  critical: { label: '심각', variant: 'error' },
  major: { label: '주요', variant: 'warning' },
  minor: { label: '경미', variant: 'info' },
};

// ============================================================================
// IssueRow Component
// ============================================================================

function IssueRow({ issue }: { issue: A11yIssue }) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const config = SEVERITY_CONFIG[issue.severity];

  return (
    <div className="border-b border-krds-gray-10 last:border-b-0">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-start gap-3 py-3 px-4 text-left hover:bg-krds-gray-5 transition-colors"
      >
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 mt-0.5 text-krds-gray-50 shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 mt-0.5 text-krds-gray-50 shrink-0" />
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={config.variant} size="md">
              {config.label}
            </Badge>
            <Body size="sm" weight="medium" className="truncate">
              {issue.description}
            </Body>
          </div>
          <Body size="xs" className="text-krds-gray-50 mt-0.5">
            {issue.rule}
            {issue.wcag && <span className="ml-2">WCAG {issue.wcag}</span>}
          </Body>
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-3 ml-7 space-y-2">
          {issue.selector && (
            <div>
              <Body size="xs" weight="medium" className="text-krds-gray-60">
                영향 요소
              </Body>
              <code className="block mt-0.5 text-xs bg-krds-gray-5 px-2 py-1 rounded font-mono text-krds-gray-80">
                {issue.selector}
              </code>
            </div>
          )}
          {issue.solution && (
            <div>
              <Body size="xs" weight="medium" className="text-krds-gray-60">
                해결 방법
              </Body>
              <Body size="xs" className="text-krds-gray-70 mt-0.5">
                {issue.solution}
              </Body>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// PageGroup Component
// ============================================================================

function PageGroup({ page }: { page: A11yPageGroup }) {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const criticalCount = page.issues.filter(
    (i) => i.severity === 'critical'
  ).length;
  const majorCount = page.issues.filter((i) => i.severity === 'major').length;
  const minorCount = page.issues.filter((i) => i.severity === 'minor').length;

  return (
    <div className="border border-krds-gray-20 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-krds-gray-5 hover:bg-krds-gray-10 transition-colors"
      >
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-krds-gray-50 shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 text-krds-gray-50 shrink-0" />
        )}

        <div className="flex-1 min-w-0 text-left">
          <Body size="sm" weight="medium" className="truncate">
            {page.title}
          </Body>
          <Body size="xs" className="text-krds-gray-50 truncate">
            {page.url}
          </Body>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {criticalCount > 0 && (
            <Badge variant="error" size="md">
              {criticalCount}
            </Badge>
          )}
          {majorCount > 0 && (
            <Badge variant="warning" size="md">
              {majorCount}
            </Badge>
          )}
          {minorCount > 0 && (
            <Badge variant="info" size="md">
              {minorCount}
            </Badge>
          )}
        </div>
      </button>

      {isExpanded && (
        <div>
          {page.issues
            .sort((a, b) => {
              const order: Record<A11ySeverity, number> = {
                critical: 0,
                major: 1,
                minor: 2,
              };
              return order[a.severity] - order[b.severity];
            })
            .map((issue) => (
              <IssueRow key={issue.id} issue={issue} />
            ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// A11yReport Component
// ============================================================================

export function A11yReport({ pages, onExport, className }: A11yReportProps) {
  const totalIssues = pages.reduce((sum, p) => sum + p.issues.length, 0);
  const totalCritical = pages.reduce(
    (sum, p) => sum + p.issues.filter((i) => i.severity === 'critical').length,
    0
  );
  const totalMajor = pages.reduce(
    (sum, p) => sum + p.issues.filter((i) => i.severity === 'major').length,
    0
  );
  const totalMinor = pages.reduce(
    (sum, p) => sum + p.issues.filter((i) => i.severity === 'minor').length,
    0
  );

  return (
    <Card variant="outlined" className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>접근성 검사 리포트</CardTitle>
            <Body size="sm" className="text-krds-gray-60 mt-1">
              {pages.length}개 페이지에서 {totalIssues}건 발견
            </Body>
          </div>
          {onExport && (
            <Button
              variant="outline"
              size="sm"
              iconLeft={<ExternalLink className="w-4 h-4" />}
              onClick={onExport}
            >
              리포트 내보내기
            </Button>
          )}
        </div>

        {/* 요약 뱃지 */}
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center gap-1.5">
            <Badge variant="error">심각 {totalCritical}</Badge>
          </div>
          <div className="flex items-center gap-1.5">
            <Badge variant="warning">주요 {totalMajor}</Badge>
          </div>
          <div className="flex items-center gap-1.5">
            <Badge variant="info">경미 {totalMinor}</Badge>
          </div>
        </div>
      </CardHeader>

      <CardBody className="space-y-3">
        {pages.map((page, index) => (
          <PageGroup key={index} page={page} />
        ))}
      </CardBody>
    </Card>
  );
}

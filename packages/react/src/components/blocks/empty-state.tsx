'use client';

import * as React from 'react';
import { Card, CardBody } from '../card';
import { Button } from '../button';
import { Body } from '../body';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  /** 제목 */
  title?: string;
  /** 설명 */
  description?: string;
  /** 아이콘 */
  icon?: React.ReactNode;
  /** CTA 버튼 텍스트 */
  actionLabel?: string;
  /** CTA 클릭 핸들러 */
  onAction?: () => void;
  /** 보조 CTA 텍스트 */
  secondaryActionLabel?: string;
  /** 보조 CTA 핸들러 */
  onSecondaryAction?: () => void;
  /** 추가 className */
  className?: string;
}

function DefaultIcon() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="8"
        y="12"
        width="48"
        height="40"
        rx="4"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <path
        d="M24 32h16M32 24v16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function EmptyState({
  title = '데이터가 없습니다',
  description = '아직 등록된 데이터가 없습니다. 새로 추가해보세요.',
  icon,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <Card variant="outlined" className={cn('w-full', className)}>
      <CardBody className="flex flex-col items-center text-center py-16 space-y-4">
        <div className="text-krds-gray-50">{icon || <DefaultIcon />}</div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold text-krds-gray-80">{title}</h3>
          <Body size="md" className="text-krds-gray-50 max-w-sm">
            {description}
          </Body>
        </div>

        {(actionLabel || secondaryActionLabel) && (
          <div className="flex items-center gap-3 pt-2">
            {actionLabel && (
              <Button variant="primary" onClick={onAction}>
                {actionLabel}
              </Button>
            )}
            {secondaryActionLabel && (
              <Button variant="outline" onClick={onSecondaryAction}>
                {secondaryActionLabel}
              </Button>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

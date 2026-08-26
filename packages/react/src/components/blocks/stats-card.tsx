'use client';

import * as React from 'react';
import { Card, CardBody } from '../card';
import { Badge } from '../badge';
import { Body } from '../body';
import { cn } from '@/lib/utils';

export interface StatItem {
  /** 통계 라벨 */
  label: string;
  /** 통계 값 */
  value: string | number;
  /** 변화율 (%) */
  change?: number;
  /** 아이콘 */
  icon?: React.ReactNode;
}

export interface StatsCardProps {
  /** 통계 항목 목록 */
  items: StatItem[];
  /** 칼럼 수 (기본: 자동) */
  columns?: 1 | 2 | 3 | 4;
  /** 추가 className */
  className?: string;
}

const defaultItems: StatItem[] = [
  { label: '총 사용자', value: '12,345', change: 12.5 },
  { label: '활성 사용자', value: '8,901', change: 3.2 },
  { label: '신규 가입', value: '234', change: -2.1 },
  { label: '페이지뷰', value: '1.2M', change: 8.7 },
];

export function StatsCard({
  items = defaultItems,
  columns,
  className,
}: StatsCardProps) {
  const gridColsMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  } as const;

  const gridCols = gridColsMap[columns ?? 4];

  return (
    <div className={cn('grid gap-4', gridCols, className)}>
      {items.map((item, index) => (
        <Card key={index} variant="outlined">
          <CardBody className="space-y-2">
            <div className="flex items-center justify-between">
              <Body size="sm" className="text-krds-gray-60">
                {item.label}
              </Body>
              {item.icon && (
                <Body as="span" className="text-krds-gray-60">
                  {item.icon}
                </Body>
              )}
            </div>

            <div className="flex items-end gap-2">
              <Body
                as="span"
                weight="bold"
                className="text-2xl text-krds-gray-95"
              >
                {item.value}
              </Body>
              {item.change !== undefined && (
                <Badge
                  variant={item.change >= 0 ? 'success' : 'error'}
                  size="md"
                >
                  {item.change >= 0 ? '↑' : '↓'}{' '}
                  {Math.abs(item.change).toFixed(1)}%
                </Badge>
              )}
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

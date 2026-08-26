'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Table2, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle } from '@/components/card';
import { Button } from '@/components/button';

const chartWidgetVariants = cva('', {
  variants: {
    size: {
      sm: '',
      md: '',
      lg: '',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export interface ChartDataPoint {
  /** 데이터 레이블 (x축) */
  label: string;
  /** 데이터 값 */
  value: number;
  /** 선택적 색상 */
  color?: string;
}

export interface ChartWidgetProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'onClick'>,
    VariantProps<typeof chartWidgetVariants> {
  /** 차트 제목 */
  title: string;
  /** 차트 설명 */
  description?: string;
  /** 차트 데이터 */
  data: ChartDataPoint[];
  /** 값 단위 */
  unit?: string;
  /** 차트 유형 */
  type?: 'bar' | 'horizontal-bar';
  /** 차트 높이 */
  height?: number;
  /** 커스텀 차트 렌더러 (외부 차트 라이브러리 사용 시) */
  renderChart?: (data: ChartDataPoint[]) => React.ReactNode;
  /** 초기 표시 모드 */
  defaultView?: 'chart' | 'table';
  /** 표로 보기 토글 숨김 */
  hideTableToggle?: boolean;
}

/**
 * 간단한 바 차트 SVG 렌더러
 */
const SimpleBarChart: React.FC<{
  data: ChartDataPoint[];
  height: number;
  type: 'bar' | 'horizontal-bar';
  title: string;
  unit?: string;
}> = ({ data, height, type, title, unit }) => {
  // 한 화면에 차트가 여러 개일 때 title/desc id가 겹치지 않도록 인스턴스별 id 생성
  const chartId = React.useId();
  const titleId = `${chartId}-title`;
  const descId = `${chartId}-desc`;
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const barColors = [
    'var(--krds-primary-50)',
    'var(--krds-primary-40)',
    'var(--krds-primary-30)',
    'var(--krds-info-base)',
    'var(--krds-success-base)',
  ];

  if (type === 'horizontal-bar') {
    const barHeight = Math.min(40, (height - 40) / data.length);
    const chartHeight = barHeight * data.length + 20;

    return (
      <svg
        width="100%"
        height={chartHeight}
        role="img"
        aria-labelledby={`${titleId} ${descId}`}
        className="overflow-visible"
      >
        <title id={titleId}>{title} 차트</title>
        <desc id={descId}>
          {data.map((d) => `${d.label}: ${d.value}${unit || ''}`).join(', ')}
        </desc>
        {data.map((point, index) => {
          const barWidth = (point.value / maxValue) * 100;
          const y = index * barHeight + 10;
          const color = point.color || barColors[index % barColors.length];

          return (
            <g key={point.label}>
              <text
                x="0"
                y={y + barHeight / 2}
                dominantBaseline="middle"
                className="text-xs fill-krds-gray-60"
              >
                {point.label}
              </text>
              <rect
                x="80"
                y={y}
                width={`calc(${barWidth}% - 80px)`}
                height={barHeight - 8}
                rx="4"
                fill={color}
                className="transition-all duration-300"
              />
              <text
                x={`calc(${barWidth}% + 4px)`}
                y={y + barHeight / 2}
                dominantBaseline="middle"
                className="text-xs fill-krds-gray-70 font-medium"
              >
                {point.value.toLocaleString('ko-KR')}
                {unit}
              </text>
            </g>
          );
        })}
      </svg>
    );
  }

  // Vertical bar chart
  const barWidth = Math.min(60, (300 - 40) / data.length);
  const chartWidth = barWidth * data.length + 40;

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${chartWidth} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-labelledby={`${titleId} ${descId}`}
    >
      <title id={titleId}>{title} 차트</title>
      <desc id={descId}>
        {data.map((d) => `${d.label}: ${d.value}${unit || ''}`).join(', ')}
      </desc>
      {data.map((point, index) => {
        const barHeight = (point.value / maxValue) * (height - 60);
        const x = index * barWidth + 20;
        const y = height - barHeight - 30;
        const color = point.color || barColors[index % barColors.length];

        return (
          <g key={point.label}>
            <rect
              x={x + 4}
              y={y}
              width={barWidth - 8}
              height={barHeight}
              rx="4"
              fill={color}
              className="transition-all duration-300"
            />
            <text
              x={x + barWidth / 2}
              y={height - 10}
              textAnchor="middle"
              className="text-xs fill-krds-gray-60"
            >
              {point.label}
            </text>
            <text
              x={x + barWidth / 2}
              y={y - 8}
              textAnchor="middle"
              className="text-xs fill-krds-gray-70 font-medium"
            >
              {point.value.toLocaleString('ko-KR')}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

/**
 * 데이터 테이블 (접근성 대체 콘텐츠)
 */
const DataTable: React.FC<{
  data: ChartDataPoint[];
  title: string;
  unit?: string;
}> = ({ data, title, unit }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <caption className="sr-only">{title} 데이터 표</caption>
        <thead>
          <tr className="border-b border-krds-gray-20">
            <th
              scope="col"
              className="text-left py-2 px-3 font-medium text-krds-gray-70"
            >
              항목
            </th>
            <th
              scope="col"
              className="text-right py-2 px-3 font-medium text-krds-gray-70"
            >
              값{unit && ` (${unit})`}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((point, index) => (
            <tr
              key={point.label}
              className={cn(
                'border-b border-krds-gray-10',
                index % 2 === 0 ? 'bg-krds-gray-5' : 'bg-white'
              )}
            >
              <td className="py-2 px-3 text-krds-gray-80">{point.label}</td>
              <td className="py-2 px-3 text-right tabular-nums text-krds-gray-90 font-medium">
                {point.value.toLocaleString('ko-KR')}
                {unit}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-krds-gray-10">
            <td className="py-2 px-3 font-medium text-krds-gray-80">합계</td>
            <td className="py-2 px-3 text-right tabular-nums font-bold text-krds-gray-90">
              {data.reduce((sum, d) => sum + d.value, 0).toLocaleString('ko-KR')}
              {unit}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export const ChartWidget = React.forwardRef<HTMLDivElement, ChartWidgetProps>(
  (
    {
      className,
      size,
      title,
      description,
      data,
      unit,
      type = 'bar',
      height = 200,
      renderChart,
      defaultView = 'chart',
      hideTableToggle = false,
      ...props
    },
    ref
  ) => {
    const [viewMode, setViewMode] = React.useState<'chart' | 'table'>(
      defaultView
    );

    const toggleView = () => {
      setViewMode((prev) => (prev === 'chart' ? 'table' : 'chart'));
    };

    return (
      <Card
        ref={ref}
        className={cn(chartWidgetVariants({ size }), className)}
        variant="outlined"
        padding="md"
        {...props}
      >
        <CardHeader className="flex-row items-start justify-between gap-4 space-y-0 pb-4">
          <div>
            <CardTitle as="h3" className="text-lg">
              {title}
            </CardTitle>
            {description && (
              <p className="mt-1 text-sm text-krds-gray-60">{description}</p>
            )}
          </div>
          {!hideTableToggle && (
            <Button
              variant="ghost"
              size="xs"
              onClick={toggleView}
              aria-label={
                viewMode === 'chart' ? '표로 보기' : '차트로 보기'
              }
              aria-pressed={viewMode === 'table'}
              iconLeft={
                viewMode === 'chart' ? (
                  <Table2 className="h-4 w-4" />
                ) : (
                  <BarChart3 className="h-4 w-4" />
                )
              }
            >
              {viewMode === 'chart' ? '표로 보기' : '차트로 보기'}
            </Button>
          )}
        </CardHeader>

        <div className="mt-2">
          {viewMode === 'chart' ? (
            renderChart ? (
              renderChart(data)
            ) : (
              <SimpleBarChart
                data={data}
                height={height}
                type={type}
                title={title}
                unit={unit}
              />
            )
          ) : (
            <DataTable data={data} title={title} unit={unit} />
          )}
        </div>
      </Card>
    );
  }
);

ChartWidget.displayName = 'ChartWidget';

export { chartWidgetVariants };

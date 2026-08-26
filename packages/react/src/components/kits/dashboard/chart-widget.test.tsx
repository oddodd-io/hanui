import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from '../../../test/setup';
import { ChartWidget } from './chart-widget';

const DATA = [
  { label: '1월', value: 120 },
  { label: '2월', value: 240 },
  { label: '3월', value: 180 },
];

const getChartNames = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('svg[role="img"]')).map((svg) => {
    const ids = (svg.getAttribute('aria-labelledby') || '').split(/\s+/);
    return ids
      .map((id) => container.ownerDocument.getElementById(id)?.textContent)
      .join(' ');
  });

describe('ChartWidget', () => {
  it('제목이 렌더링되어야 합니다', () => {
    render(<ChartWidget title="월별 방문자" data={DATA} />);
    expect(screen.getByText('월별 방문자')).toBeInTheDocument();
  });

  it('차트에 role="img"와 접근명이 있어야 합니다', () => {
    const { container } = render(
      <ChartWidget title="월별 방문자" data={DATA} />
    );
    const [name] = getChartNames(container);
    expect(name).toContain('월별 방문자 차트');
  });

  it('차트가 여러 개여도 title/desc id가 겹치지 않아야 합니다', () => {
    const { container } = render(
      <>
        <ChartWidget title="방문자" data={DATA} />
        <ChartWidget title="다운로드" data={DATA} />
      </>
    );

    const ids = Array.from(container.querySelectorAll('title, desc')).map(
      (el) => el.id
    );
    expect(ids.every(Boolean)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('차트가 여러 개일 때 각자의 제목으로 읽혀야 합니다', () => {
    const { container } = render(
      <>
        <ChartWidget title="방문자" data={DATA} />
        <ChartWidget title="다운로드" data={DATA} />
      </>
    );

    // id가 중복되면 두 차트 모두 첫 번째 차트 제목으로 읽힌다
    const names = getChartNames(container);
    expect(names).toHaveLength(2);
    expect(names[0]).toContain('방문자 차트');
    expect(names[1]).toContain('다운로드 차트');
  });

  it('horizontal-bar 타입도 고유한 접근명을 가져야 합니다', () => {
    const { container } = render(
      <>
        <ChartWidget title="가로 A" data={DATA} type="horizontal-bar" />
        <ChartWidget title="가로 B" data={DATA} type="horizontal-bar" />
      </>
    );
    const names = getChartNames(container);
    expect(names[0]).toContain('가로 A 차트');
    expect(names[1]).toContain('가로 B 차트');
  });

  it('접근성 위반이 없어야 합니다', async () => {
    const { container } = render(
      <ChartWidget title="월별 방문자" data={DATA} unit="명" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('차트가 여러 개일 때도 접근성 위반이 없어야 합니다', async () => {
    const { container } = render(
      <>
        <ChartWidget title="방문자" data={DATA} />
        <ChartWidget title="다운로드" data={DATA} />
      </>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

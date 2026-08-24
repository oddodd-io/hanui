/**
 * 리스트 컴포넌트 전수 훑기
 *
 * 1편에서 "행이 많아질 때 실제로 느려지는 게 있는지 재겠다"고 한 것의 이행.
 * 각 컴포넌트를 '현실적 최대'와 '극단' 두 조건으로 재고,
 * 부모만 리렌더시켰을 때 자식이 커밋되는지 본다.
 *
 *   npx vitest run src/__experiments__/list-components-sweep.test.tsx
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, it } from 'vitest';

import { Breadcrumb } from '../components/breadcrumb';
import { Pagination } from '../components/pagination';
import { StepIndicator } from '../components/step-indicator';
import { NavigationMenu } from '../components/menu-navigation';
import { SideNavigation } from '../components/side-navigation';

type Case = {
  name: string;
  /** 현실적으로 이 정도까지 간다 */
  realistic: number;
  /** 일부러 극단까지 밀어본다 */
  extreme: number;
  render: (n: number) => React.ReactElement;
};

const CASES: Case[] = [
  {
    name: 'Breadcrumb',
    realistic: 5,
    extreme: 200,
    render: (n) => (
      <Breadcrumb
        items={Array.from({ length: n }, (_, i) => ({
          label: `단계 ${i}`,
          href: i === n - 1 ? undefined : `/p/${i}`,
        }))}
      />
    ),
  },
  {
    name: 'StepIndicator',
    realistic: 5,
    extreme: 200,
    render: (n) => (
      <StepIndicator
        steps={Array.from({ length: n }, (_, i) => ({ label: `단계 ${i}` }))}
        currentStep={0}
      />
    ),
  },
  {
    name: 'NavigationMenu',
    realistic: 8,
    extreme: 200,
    render: (n) => (
      <NavigationMenu
        items={Array.from({ length: n }, (_, i) => ({
          label: `메뉴 ${i}`,
          href: `/m/${i}`,
        }))}
      />
    ),
  },
  {
    name: 'SideNavigation',
    realistic: 10,
    extreme: 200,
    render: (n) => (
      <SideNavigation
        title="사이드"
        menuItems={Array.from({ length: n }, (_, i) => ({
          label: `섹션 ${i}`,
          href: `/s/${i}`,
        }))}
      />
    ),
  },
  {
    name: 'Pagination',
    realistic: 10,
    extreme: 5000,
    render: (n) => (
      <Pagination currentPage={1} totalPages={n} onPageChange={() => {}} />
    ),
  },
];

/**
 * 주의: children을 미리 만든 엘리먼트로 넘기면 참조가 같아서
 * React가 통째로 bailout 해버린다. 실제 코드처럼 매 렌더 JSX를 새로 만들어야 한다.
 */
function Harness({
  renderChild,
  onRender,
}: {
  renderChild: () => React.ReactElement;
  onRender: React.ProfilerOnRenderCallback;
}) {
  const [, setTick] = React.useState(0);
  return (
    <div>
      <button onClick={() => setTick((t) => t + 1)}>부모 리렌더</button>
      <React.Profiler id="c" onRender={onRender}>
        {renderChild()}
      </React.Profiler>
    </div>
  );
}

const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)] ?? 0;
};

async function measure(renderChild: () => React.ReactElement) {
  const durations: number[] = [];
  const onRender: React.ProfilerOnRenderCallback = (_id, phase, actual) => {
    if (phase !== 'mount') durations.push(actual);
  };
  const user = userEvent.setup();
  const { unmount } = render(
    <Harness renderChild={renderChild} onRender={onRender} />
  );
  for (let i = 0; i < 3; i++) {
    await user.click(screen.getByText('부모 리렌더'));
  }
  const commits = durations.length;
  const cost = median(durations);
  unmount();
  return { commits, cost };
}

describe('리스트 컴포넌트 — 부모 리렌더 비용 훑기', () => {
  it('현실적 최대 / 극단 비교', async () => {
    console.log('');
    console.log(
      '  컴포넌트          현실적 개수 → 비용     극단 개수 → 비용      배율  커밋'
    );
    console.log(
      '  ---------------------------------------------------------------------'
    );

    for (const c of CASES) {
      let r, e;
      try {
        r = await measure(() => c.render(c.realistic));
        e = await measure(() => c.render(c.extreme));
      } catch (err) {
        console.log(`  ${c.name.padEnd(16)} 렌더 실패 — 건너뜀`);
        continue;
      }
      const ratio = r.cost > 0 ? (e.cost / r.cost).toFixed(1) : '—';
      console.log(
        `  ${c.name.padEnd(16)} ${String(c.realistic).padStart(5)}개 → ${r.cost
          .toFixed(2)
          .padStart(6)}ms   ${String(c.extreme).padStart(5)}개 → ${e.cost
          .toFixed(2)
          .padStart(6)}ms   ${String(ratio).padStart(5)}x  ${e.commits}회`
      );
    }
    console.log('');
  });
});

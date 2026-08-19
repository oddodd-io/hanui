/**
 * 실제 hanui 컴포넌트 프로파일링
 *
 * React.Profiler API로 actualDuration을 수집한다.
 * DevTools Profiler가 화면에 보여주는 것과 같은 데이터를 코드로 받는다.
 *
 *   npx vitest run src/__experiments__/profiler-real-components.test.tsx
 *
 * 주의: jsdom 환경이라 절대 ms는 브라우저와 다르다.
 *       의미가 있는 건 "행 수에 따라 어떻게 늘어나는가"(스케일링)와 커밋 횟수.
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, it } from 'vitest';
import { DataTable } from '../components/data-table';

type Row = { id: number; name: string; dept: string; status: string };

const columns = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: '이름' },
  { accessorKey: 'dept', header: '부서' },
  { accessorKey: 'status', header: '상태' },
];

const makeRows = (n: number): Row[] =>
  Array.from({ length: n }, (_, i) => ({
    id: i,
    name: `사용자 ${i}`,
    dept: `부서 ${i % 10}`,
    status: i % 3 === 0 ? '활성' : '대기',
  }));

/** 한 번의 커밋 기록 */
type Commit = { phase: string; actualDuration: number };

function collect() {
  const commits: Commit[] = [];
  const onRender = (
    _id: string,
    phase: 'mount' | 'update' | 'nested-update',
    actualDuration: number
  ) => {
    commits.push({ phase, actualDuration });
  };
  return { commits, onRender };
}

/** memo로 감싼 DataTable — props가 같으면 리렌더 skip */
const MemoTable = React.memo(DataTable) as typeof DataTable;

/** 부모만 리렌더시키는 래퍼 — 자식(DataTable) props는 그대로 */
function Harness({
  rows,
  onRender,
  memoized = false,
}: {
  rows: Row[];
  onRender: React.ProfilerOnRenderCallback;
  memoized?: boolean;
}) {
  const Table = memoized ? MemoTable : DataTable;
  const [tick, setTick] = React.useState(0);
  const stableColumns = React.useMemo(() => columns, []);
  const stableData = React.useMemo(() => rows, [rows]);
  return (
    <div>
      <button onClick={() => setTick((t) => t + 1)}>부모 리렌더</button>
      <span data-testid="tick">{tick}</span>
      <React.Profiler id="table" onRender={onRender}>
        <Table columns={stableColumns as never} data={stableData} />
      </React.Profiler>
    </div>
  );
}

const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)] ?? 0;
};
const fmt = (n: number) => n.toFixed(1).padStart(7);

describe('DataTable — 행 수에 따른 렌더 비용', () => {
  const SIZES = [50, 200, 1000];

  it('마운트 / 부모 리렌더 비용 측정', async () => {
    console.log('');
    console.log('  행 수    마운트(ms)   부모리렌더(ms)   업데이트 커밋');
    console.log('  ------------------------------------------------------');

    for (const size of SIZES) {
      const { commits, onRender } = collect();
      const rows = makeRows(size);
      const user = userEvent.setup();

      const { unmount } = render(<Harness rows={rows} onRender={onRender} />);

      const mount = commits
        .filter((c) => c.phase === 'mount')
        .reduce((a, c) => a + c.actualDuration, 0);

      // 부모만 3번 리렌더 — DataTable props는 변하지 않음
      const updates: number[] = [];
      for (let i = 0; i < 3; i++) {
        const before = commits.length;
        await user.click(screen.getByText('부모 리렌더'));
        const added = commits.slice(before);
        updates.push(added.reduce((a, c) => a + c.actualDuration, 0));
      }

      const updateCommits = commits.filter((c) => c.phase !== 'mount').length;

      console.log(
        `  ${String(size).padStart(5)}  ${fmt(mount)}      ${fmt(
          median(updates)
        )}        ${String(updateCommits).padStart(3)}회`
      );

      unmount();
    }
    console.log('');
  });

  it('memo 적용 전/후 — 부모 리렌더 비용', async () => {
    console.log('');
    console.log('  행 수    memo 없음(ms)   memo 적용(ms)   감소');
    console.log('  ------------------------------------------------');

    for (const size of SIZES) {
      const rows = makeRows(size);
      const results: Record<string, number> = {};

      for (const memoized of [false, true]) {
        const { commits, onRender } = collect();
        const user = userEvent.setup();
        const { unmount } = render(
          <Harness rows={rows} onRender={onRender} memoized={memoized} />
        );

        const updates: number[] = [];
        for (let i = 0; i < 3; i++) {
          const before = commits.length;
          await user.click(screen.getByText('부모 리렌더'));
          const added = commits.slice(before);
          updates.push(added.reduce((a, c) => a + c.actualDuration, 0));
        }
        results[String(memoized)] = median(updates);
        unmount();
      }

      const before = results['false'];
      const after = results['true'];
      const cut = before > 0 ? ((1 - after / before) * 100).toFixed(0) : '0';
      console.log(
        `  ${String(size).padStart(5)}  ${fmt(before)}       ${fmt(
          after
        )}      ${String(cut).padStart(3)}%`
      );
    }
    console.log('');
  });
});

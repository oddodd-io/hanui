/**
 * 리렌더 횟수 측정 실험
 *
 * "useCallback을 썼다"와 "리렌더가 줄었다"는 다른 얘기라는 걸 숫자로 확인한다.
 * 블로그 글(프론트엔드 성능 측정 3편)의 근거 데이터.
 *
 *   pnpm --filter @hanui/react exec vitest run src/__experiments__
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it } from 'vitest';

const ROWS = 200;

/** 각 케이스마다 자식이 몇 번 그려졌는지 센다 */
function makeCounter() {
  return { count: 0 };
}

// ─────────────────────────────────────────────
// 케이스 A: memo 없음 + 인라인 화살표 (현재 hanui 상태)
// ─────────────────────────────────────────────
function RowA({ onSelect, label }: { onSelect: () => void; label: string }) {
  counterA.count++;
  return <button onClick={onSelect}>{label}</button>;
}
const counterA = makeCounter();

function ListA() {
  const [, setTick] = React.useState(0);
  const rows = React.useMemo(
    () => Array.from({ length: ROWS }, (_, i) => `행 ${i}`),
    []
  );
  return (
    <div>
      <button onClick={() => setTick((t) => t + 1)}>부모 상태 변경</button>
      {rows.map((label, i) => (
        <RowA key={i} label={label} onSelect={() => void i} />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// 케이스 B: memo 있음 + 인라인 화살표 (memo만 붙인 경우)
// ─────────────────────────────────────────────
const counterB = makeCounter();
const RowB = React.memo(function RowB({
  onSelect,
  label,
}: {
  onSelect: () => void;
  label: string;
}) {
  counterB.count++;
  return <button onClick={onSelect}>{label}</button>;
});

function ListB() {
  const [, setTick] = React.useState(0);
  const rows = React.useMemo(
    () => Array.from({ length: ROWS }, (_, i) => `행 ${i}`),
    []
  );
  return (
    <div>
      <button onClick={() => setTick((t) => t + 1)}>부모 상태 변경</button>
      {rows.map((label, i) => (
        <RowB key={i} label={label} onSelect={() => void i} />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// 케이스 C: memo + 안정된 콜백 (둘 다 갖춘 경우)
// ─────────────────────────────────────────────
const counterC = makeCounter();
const RowC = React.memo(function RowC({
  onSelect,
  index,
  label,
}: {
  onSelect: (index: number) => void;
  index: number;
  label: string;
}) {
  counterC.count++;
  return <button onClick={() => onSelect(index)}>{label}</button>;
});

function ListC() {
  const [, setTick] = React.useState(0);
  const rows = React.useMemo(
    () => Array.from({ length: ROWS }, (_, i) => `행 ${i}`),
    []
  );
  // 참조가 유지되는 콜백 하나를 모든 행이 공유한다
  const handleSelect = React.useCallback((_index: number) => {}, []);
  return (
    <div>
      <button onClick={() => setTick((t) => t + 1)}>부모 상태 변경</button>
      {rows.map((label, i) => (
        <RowC key={i} label={label} index={i} onSelect={handleSelect} />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// 케이스 D: memo 없음 + 안정된 콜백 (useCallback만 쓴 경우 = hanui 상태)
// ─────────────────────────────────────────────
const counterD = makeCounter();
function RowD({
  onSelect,
  index,
  label,
}: {
  onSelect: (index: number) => void;
  index: number;
  label: string;
}) {
  counterD.count++;
  return <button onClick={() => onSelect(index)}>{label}</button>;
}

function ListD() {
  const [, setTick] = React.useState(0);
  const rows = React.useMemo(
    () => Array.from({ length: ROWS }, (_, i) => `행 ${i}`),
    []
  );
  const handleSelect = React.useCallback((_index: number) => {}, []);
  return (
    <div>
      <button onClick={() => setTick((t) => t + 1)}>부모 상태 변경</button>
      {rows.map((label, i) => (
        <RowD key={i} label={label} index={i} onSelect={handleSelect} />
      ))}
    </div>
  );
}

describe(`부모 상태 1회 변경 시 자식 ${ROWS}개의 리렌더 횟수`, () => {
  async function measure(ui: React.ReactElement, counter: { count: number }) {
    const user = userEvent.setup();
    render(ui);
    counter.count = 0; // 최초 마운트분 제외
    await user.click(screen.getAllByText('부모 상태 변경')[0]);
    return counter.count;
  }

  it('A) memo 없음 + 인라인 화살표', async () => {
    const n = await measure(<ListA />, counterA);
    console.log(`  A) memo 없음  + 인라인 화살표 : ${n}개 리렌더`);
    expect(n).toBe(ROWS);
  });

  it('B) memo 있음 + 인라인 화살표', async () => {
    const n = await measure(<ListB />, counterB);
    console.log(`  B) memo 있음  + 인라인 화살표 : ${n}개 리렌더`);
    expect(n).toBe(ROWS);
  });

  it('C) memo 있음 + 안정된 콜백', async () => {
    const n = await measure(<ListC />, counterC);
    console.log(`  C) memo 있음  + 안정된 콜백   : ${n}개 리렌더`);
    expect(n).toBe(0);
  });

  it('D) memo 없음 + 안정된 콜백 (useCallback만)', async () => {
    const n = await measure(<ListD />, counterD);
    console.log(`  D) memo 없음  + 안정된 콜백   : ${n}개 리렌더`);
    expect(n).toBe(ROWS);
  });
});

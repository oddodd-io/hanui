/**
 * 실행: node --test apps/docs/src/lib/blog-queue.test.mjs
 *
 * 이 모듈의 값은 "오늘을 세지 않는다"는 경계에 걸려 있다. 경계가 한 칸 틀리면
 * 지연을 부재로 잘못 알리거나(매일 거짓 알람), 밀린 걸 못 잡는다(2026-11-17 그대로).
 * 그래서 경계 전후 하루를 직접 고정해 둔다.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  daysLate,
  findOverdue,
  findUndated,
  findUpcoming,
  kstToday,
  readField,
  runsOutOn,
} from './blog-queue.mjs';

describe('kstToday', () => {
  it('UTC 자정 직후는 KST로 이미 그날 오전 9시다', () => {
    assert.equal(kstToday(Date.parse('2026-11-17T00:00:00Z')), '2026-11-17');
  });

  it('UTC 15:00은 KST 자정 — 날짜가 하루 넘어간다', () => {
    // 본 실행 cron '19 15 * * *'이 바로 이 경계 뒤에 있다(00:19 KST)
    assert.equal(kstToday(Date.parse('2026-11-17T14:59:59Z')), '2026-11-17');
    assert.equal(kstToday(Date.parse('2026-11-17T15:00:00Z')), '2026-11-18');
  });
});

describe('readField', () => {
  const mdx = [
    '---',
    'title: 이중화를 두 시간 간격으로 두면 이중화가 아니다',
    "date: '2026-11-18'",
    'tags: [운영]',
    '---',
    '',
    '본문',
  ].join('\n');

  it('따옴표가 있어도 벗겨서 읽는다', () => {
    assert.equal(readField(mdx, 'date'), '2026-11-18');
  });

  it('따옴표가 없어도 읽는다', () => {
    assert.equal(
      readField(mdx, 'title'),
      '이중화를 두 시간 간격으로 두면 이중화가 아니다'
    );
  });

  it('없는 칸은 빈 문자열', () => {
    assert.equal(readField(mdx, 'thumbnail'), '');
  });
});

describe('findOverdue — 오늘은 세지 않는다', () => {
  const today = '2026-11-17';

  it('어제 치가 큐에 남아 있으면 밀린 것이다', () => {
    const overdue = findOverdue([{ file: 'a.mdx', date: '2026-11-16' }], today);
    assert.deepEqual(
      overdue.map((e) => e.file),
      ['a.mdx']
    );
  });

  it('오늘 치는 세지 않는다 — 발행 실행이 지연 중일 수 있다', () => {
    // 발행은 date <= today로 집으므로 오늘 치는 오늘 중에 나간다.
    // 지연 최대 +6h07m 관측 — 그 사이에 알람이 울리면 매일 거짓 알람이 된다.
    assert.deepEqual(findOverdue([{ file: 'b.mdx', date: today }], today), []);
  });

  it('미래 치는 당연히 세지 않는다', () => {
    assert.deepEqual(
      findOverdue([{ file: 'c.mdx', date: '2026-11-18' }], today),
      []
    );
  });

  it('여러 편이 밀리면 오래된 것부터 돌려준다', () => {
    const overdue = findOverdue(
      [
        { file: 'new.mdx', date: '2026-11-16' },
        { file: 'old.mdx', date: '2026-11-14' },
        { file: 'mid.mdx', date: '2026-11-15' },
        { file: 'future.mdx', date: '2026-11-20' },
      ],
      today
    );
    assert.deepEqual(
      overdue.map((e) => e.file),
      ['old.mdx', 'mid.mdx', 'new.mdx']
    );
  });

  it('date가 없는 글은 밀린 발행으로 세지 않는다', () => {
    // 프론트매터 결함이라 발행 스크립트도 건너뛴다 — 다른 알람이어야 한다
    assert.deepEqual(
      findOverdue([{ file: 'broken.mdx', date: '' }], today),
      []
    );
    assert.deepEqual(findUndated([{ file: 'broken.mdx', date: '' }]), [
      'broken.mdx',
    ]);
  });

  it('빈 큐는 밀린 것이 없다', () => {
    assert.deepEqual(findOverdue([], today), []);
  });
});

describe('daysLate', () => {
  it('하루 밀림', () => {
    assert.equal(daysLate('2026-11-16', '2026-11-17'), 1);
  });

  it('달을 넘겨도 센다', () => {
    assert.equal(daysLate('2026-10-30', '2026-11-02'), 3);
  });

  it('오늘 치는 0', () => {
    assert.equal(daysLate('2026-11-17', '2026-11-17'), 0);
  });
});

/**
 * 재고(앞으로 나갈 글)는 밀린 편수와 **다른 축**이다.
 * 큐가 비면 findOverdue는 0을 돌려주므로 부재 감시는 침묵한다 — 재고를 따로 세는 이유.
 */
describe('findUpcoming', () => {
  const today = '2026-11-23';
  const queue = [
    { file: 'late.mdx', date: '2026-11-20' },
    { file: 'today.mdx', date: '2026-11-23' },
    { file: 'soon.mdx', date: '2026-11-24' },
    { file: 'broken.mdx', date: '' },
  ];

  it('오늘 치도 재고다 — 아직 안 나갔으면 재고다', () => {
    assert.deepEqual(
      findUpcoming(queue, today).map((e) => e.file),
      ['today.mdx', 'soon.mdx']
    );
  });

  it('date가 빈 글은 재고가 아니다 — 발행 스크립트가 가져가지 않는다', () => {
    assert.ok(!findUpcoming(queue, today).some((e) => e.file === 'broken.mdx'));
  });

  it('밀린 글은 재고가 아니다 — findOverdue와 겹치지 않는다', () => {
    const up = findUpcoming(queue, today).map((e) => e.file);
    const over = findOverdue(queue, today).map((e) => e.file);
    assert.deepEqual(
      up.filter((f) => over.includes(f)),
      []
    );
  });

  it('가까운 날짜부터 돌려준다', () => {
    const shuffled = [
      { file: 'c.mdx', date: '2026-11-26' },
      { file: 'a.mdx', date: '2026-11-24' },
      { file: 'b.mdx', date: '2026-11-25' },
    ];
    assert.deepEqual(
      findUpcoming(shuffled, today).map((e) => e.file),
      ['a.mdx', 'b.mdx', 'c.mdx']
    );
  });

  it('빈 큐는 재고 0 — 이때 findOverdue도 0이라 부재 감시는 아무것도 못 본다', () => {
    assert.deepEqual(findUpcoming([], today), []);
    assert.deepEqual(findOverdue([], today), []);
  });

  it('밀린 글만 남은 큐는 재고가 0이다', () => {
    const onlyLate = [{ file: 'late.mdx', date: '2026-11-20' }];
    assert.deepEqual(findUpcoming(onlyLate, today), []);
  });
});

describe('runsOutOn', () => {
  const today = '2026-11-23';

  it('마지막 예약일을 돌려준다', () => {
    const q = [
      { file: 'a.mdx', date: '2026-11-24' },
      { file: 'b.mdx', date: '2026-11-26' },
    ];
    assert.equal(runsOutOn(findUpcoming(q, today)), '2026-11-26');
  });

  it('재고가 없으면 빈 문자열 — 날짜 자리에 undefined가 새지 않는다', () => {
    assert.equal(runsOutOn([]), '');
  });

  it('재고가 한 편이면 그 날짜가 곧 바닥나는 날이다', () => {
    const q = [{ file: 'last.mdx', date: '2026-11-24' }];
    assert.equal(runsOutOn(findUpcoming(q, today)), '2026-11-24');
  });
});

/**
 * 예약 발행 **부재** 감지 (Vercel Cron)
 *
 * 왜 여기 있나 — 2026-11-16에 GitHub Actions 예약이 두 번 다 건너뛰어져 11-17 글이
 * 발행되지 않았는데, **아무 알림도 오지 않았다.** 실패하면 알림이 오지만 부재는 오지 않는다.
 * 그 감시를 같은 GitHub Actions cron에 올리면 같은 이유로 같이 죽으므로,
 * 완전히 다른 스케줄러(Vercel Cron)에서 본다.
 *
 * 무엇을 보나 — **실행 이력이 아니라 저장소 상태를 본다.** 큐에 `date`가 어제 이하인
 * 글이 남아 있으면, 그 글을 가져가야 했던 실행이 없었던 것이다. 덕분에
 *   - 실행 로그를 추적할 필요가 없다(= 추적 상태가 썩을 일이 없다)
 *   - 이 감시가 하루 빠져도 다음 날 똑같이 잡아낸다(멱등)
 *   - 하루 중 아무 때나 돌려도 된다(발행 창이 언제 열리는지 몰라도 된다)
 *
 * 어디까지 못 보나 — 이 라우트 자체가 죽으면 아무도 모른다. 감시자의 감시자는 없다.
 * 완전한 사각을 없애려면 "침묵이 곧 알람"인 외부 dead man's switch가 필요하다.
 * 지금은 발행(GitHub Actions)과 감시(Vercel)가 서로 다른 곳에서 죽는다는 것까지만 보장한다.
 *
 * 필요한 환경 변수 (Vercel 프로젝트 설정)
 *   CRON_SECRET               Vercel이 Authorization: Bearer 로 보내는 값. 없으면 503으로 거부한다.
 *   BLOG_WATCH_GITHUB_TOKEN   이슈를 열 권한(issues: write). 없으면 503 — 조용히 넘어가지 않는다.
 *   BLOG_WATCH_REPO           기본 'oddodd-io/hanui'
 *   BLOG_WATCH_REF            큐를 읽을 브랜치. 기본은 저장소 기본 브랜치.
 *                             알람이 실제로 울리는지 시험할 때, 발행일을 과거로 돌린 글을
 *                             시험용 브랜치에 올려 두고 이 값만 바꿔 쓴다 — main을 더럽히지 않는다.
 *                             (한 번도 울려 본 적 없는 알람은 알람이 아니다. 재고 알림이
 *                              2026-07-01부터 11-16까지 죽어 있던 걸 아무도 몰랐다.)
 */
import { timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import {
  daysLate,
  findOverdue,
  findUndated,
  findUpcoming,
  kstToday,
  readField,
  runsOutOn,
} from '@/lib/blog-queue.mjs';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const QUEUE_PATH = 'apps/docs/blog-queue';

/**
 * 알람 둘은 **뜻이 다르므로 라벨도 이슈도 따로 쓴다.**
 *
 * 섞으면 알람이 무슨 뜻인지 알 수 없게 된다(같은 이유로 `findOverdue`가 날짜 없는 글을
 * 따로 뺀다). 둘은 원인도 할 일도 다르다 —
 *   MISSED : 글은 있는데 발행이 안 돌았다 → 워크플로우를 수동 실행한다
 *   RESTOCK: 발행은 도는데 쓸 글이 없다  → 글을 쓴다
 *
 * 반대로 **같은 뜻이면 스케줄러가 달라도 같은 라벨을 쓴다.** 두 라벨 모두 발행
 * 워크플로우(.github/workflows/daily-publish.yml)도 같이 쓴다. 한 조건에 이슈가 둘로
 * 갈라지면 한쪽을 닫아도 다른 쪽이 남아, 고쳤는데 알람이 계속 울리는 꼴이 된다.
 *
 * 왜 재고를 여기서도 보나 — 워크플로우에도 재고 알림이 있지만 **그 알림은 워크플로우가
 * 돌 때만 돈다.** 2026-11-16에 예약 두 번이 모두 건너뛰어졌을 때 발행만 빠진 게 아니라
 * 재고 감시도 같이 쉬었다. 감시를 감시 대상과 같은 스케줄러에 두지 않는다는 원칙을
 * 부재 감시에만 적용하고 재고 감시에는 빠뜨렸던 것이다.
 */
const LABEL_MISSED = 'blog-publish-missed';
const LABEL_RESTOCK = 'blog-restock';

/**
 * 재고가 이 편수 **미만**이면 알린다. 0편이 되고 나서 알리면 이미 끊긴 뒤다.
 * 기본 3편 — 글 한 편 쓰는 데 하루는 걸린다고 보고 사흘 여유를 둔다.
 */
const DEFAULT_MIN_STOCK = 3;
const GITHUB_API = 'https://api.github.com';
const UA = 'hanui-blog-watch';

type QueueEntry = { file: string; date: string; title: string };

/** 길이가 달라도 새지 않는 비교 */
function secretMatches(given: string, expected: string): boolean {
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

function gh(token?: string): HeadersInit {
  return {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': UA,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * 큐에 있는 글과 각 글의 발행일을 읽는다.
 *
 * hanui 저장소는 공개라 읽기에는 토큰이 필요 없다. 토큰이 있으면 붙여서
 * 비인증 분당 한도(IP 기준)를 피한다 — 하루 몇 번 쓰는 수준이라 넉넉하지만,
 * Vercel 출구 IP는 남과 공유되므로 남의 호출에 밀릴 수 있다.
 */
async function readQueue(
  repo: string,
  token: string | undefined,
  ref?: string
): Promise<QueueEntry[]> {
  const listRes = await fetch(
    `${GITHUB_API}/repos/${repo}/contents/${QUEUE_PATH}${ref ? `?ref=${encodeURIComponent(ref)}` : ''}`,
    { headers: gh(token), cache: 'no-store' }
  );

  // 404를 "빈 큐"로 보면 안 된다. 폴더가 옮겨졌거나 BLOG_WATCH_REF를 잘못 적었을 때
  // 감시가 "밀린 글 없음"을 돌려주며 **영구히 침묵한다** — 이 라우트가 고치려는 결함과 같은 모양이다.
  // 큐 폴더에는 README.md가 있어 저장소가 온전하면 404가 날 일이 없으므로, 404면 설정이 틀린 것이다.
  if (listRes.status === 404) {
    throw new Error(
      `큐 폴더를 찾지 못했습니다 — ${repo}${ref ? `@${ref}` : ''}:${QUEUE_PATH} (경로나 BLOG_WATCH_REF를 확인하세요)`
    );
  }
  if (!listRes.ok) {
    throw new Error(`큐 목록을 읽지 못했습니다 (HTTP ${listRes.status})`);
  }

  const listed = (await listRes.json()) as {
    name: string;
    type: string;
    download_url: string | null;
  }[];

  const files = listed.filter(
    (f) => f.type === 'file' && f.name.endsWith('.mdx') && f.download_url
  );

  return Promise.all(
    files.map(async (f) => {
      const res = await fetch(f.download_url as string, {
        headers: { 'User-Agent': UA },
        cache: 'no-store',
      });
      if (!res.ok) {
        throw new Error(`${f.name}을 읽지 못했습니다 (HTTP ${res.status})`);
      }
      const text = await res.text();
      return {
        file: f.name,
        date: readField(text, 'date'),
        title: readField(text, 'title'),
      };
    })
  );
}

/** 라벨이 없으면 만든다. 이미 있으면(422) 그냥 넘어간다 */
async function ensureLabel(
  repo: string,
  token: string,
  name: string,
  color: string,
  description: string
): Promise<void> {
  await fetch(`${GITHUB_API}/repos/${repo}/labels`, {
    method: 'POST',
    headers: { ...gh(token), 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, color, description }),
  });
}

async function openIssueNumber(
  repo: string,
  token: string,
  label: string
): Promise<number | null> {
  const res = await fetch(
    `${GITHUB_API}/repos/${repo}/issues?state=open&labels=${encodeURIComponent(label)}&per_page=1`,
    { headers: gh(token), cache: 'no-store' }
  );
  if (!res.ok) throw new Error(`이슈 목록 조회 실패 (HTTP ${res.status})`);
  const issues = (await res.json()) as { number: number }[];
  return issues[0]?.number ?? null;
}

async function ghJson(
  url: string,
  token: string,
  method: 'POST' | 'PATCH',
  body: unknown
): Promise<void> {
  const res = await fetch(url, {
    method,
    headers: { ...gh(token), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`${method} ${url} 실패 (HTTP ${res.status})`);
  }
}

function issueBody(
  overdue: QueueEntry[],
  today: string,
  undated: string[]
): string {
  const worst = daysLate(overdue[0].date, today);
  const lines = [
    `예약 큐(\`${QUEUE_PATH}\`)에 **발행일이 지난 글 ${overdue.length}편**이 남아 있습니다.`,
    `가장 오래된 글은 **${worst}일** 밀렸습니다. (기준일 ${today} KST)`,
    '',
    '| 발행일 | 밀린 일수 | 글 |',
    '| --- | --- | --- |',
    ...overdue.map(
      (p) =>
        `| ${p.date} | ${daysLate(p.date, today)}일 | ${p.title || p.file} |`
    ),
    '',
    '### 무슨 뜻인가',
    '',
    '발행일이 지났는데 큐에 남아 있다는 건, 그 글을 가져가야 했던 **발행 실행이 없었다**는 뜻입니다.',
    '워크플로우가 실패한 게 아니라 **아예 만들어지지 않은** 경우가 있습니다',
    '(2026-11-16에 예약 두 번이 모두 건너뛰어졌습니다).',
    '',
    '### 지금 할 일',
    '',
    '1. Actions 탭 → **Daily Blog Publish** → `Run workflow`로 수동 실행합니다.',
    '   밀린 글은 오래된 것부터 한 번에 모두 따라잡습니다(`date <= today`).',
    '2. Actions 탭에서 어제·오늘 예약 실행이 **목록에 아예 없는지** 확인합니다.',
    '   없으면 스케줄러가 건너뛴 것이고, 있는데 빨간색이면 평소 실패입니다.',
    '',
    '큐가 정리되면 이 이슈는 **자동으로 닫힙니다.** 직접 닫지 않아도 됩니다.',
  ];
  if (undated.length > 0) {
    lines.push(
      '',
      '---',
      '',
      `참고 — \`date\` 프론트매터가 없는 글 ${undated.length}건: ${undated.map((f) => `\`${f}\``).join(', ')}`,
      '이 글들은 발행 대상으로 잡히지 않아 큐에 계속 남습니다. 발행 부재와는 다른 문제입니다.'
    );
  }
  return lines.join('\n');
}

/** 재고 부족 알람 본문 */
function lowStockBody(
  upcoming: QueueEntry[],
  today: string,
  minStock: number
): string {
  const last = runsOutOn(upcoming);
  const lines = [
    upcoming.length === 0
      ? `예약 큐(\`${QUEUE_PATH}\`)가 **비었습니다.** 앞으로 올라갈 글이 없습니다. (기준일 ${today} KST)`
      : `예약 큐(\`${QUEUE_PATH}\`)에 앞으로 올라갈 글이 **${upcoming.length}편** 남았습니다. (기준 ${minStock}편, 기준일 ${today} KST)`,
  ];
  if (upcoming.length > 0) {
    lines.push(
      '',
      '| 발행일 | 글 |',
      '| --- | --- |',
      ...upcoming.map((p) => `| ${p.date} | ${p.title || p.file} |`),
      '',
      `마지막 글은 **${last}**에 나갑니다. 그 다음날부터 올라갈 글이 없습니다.`
    );
  }
  lines.push(
    '',
    '### 무슨 뜻인가',
    '',
    '발행이 밀린 게 아니라 **쓸 글이 없는** 것입니다. 둘은 다른 문제입니다',
    `(발행이 밀린 건 \`${LABEL_MISSED}\` 이슈로 따로 옵니다).`,
    '',
    '### 지금 할 일',
    '',
    '1. `docs/worklog/`에서 `글감: 미정` 또는 `글감(트랙 …)` 항목을 꺼냅니다.',
    '2. `/blog`로 글을 쓰고 `apps/docs/blog-queue/`에 발행일을 붙여 넣습니다.',
    '',
    `재고가 **${minStock}편 이상**으로 돌아오면 이 이슈는 자동으로 닫힙니다.`,
    '',
    '---',
    '',
    '이 이슈는 발행 워크플로우와 Vercel Cron이 **함께** 씁니다. 워크플로우 쪽 재고 알림은',
    '워크플로우가 돌 때만 도는데, GitHub 스케줄러가 실행을 통째로 건너뛰면 그날은 재고도',
    '아무도 보지 않습니다(2026-11-16에 예약 두 번이 모두 건너뛰어졌습니다). 그래서 다른',
    '스케줄러에서 한 번 더 셉니다. 둘 다 같은 이슈를 열고 닫으므로 알림이 두 번 오지 않습니다.'
  );
  return lines.join('\n');
}

/**
 * 알람 하나를 현재 상태에 맞춘다 — 열고·갱신하고·조건이 풀리면 닫는다.
 *
 * 두 알람이 같은 수명주기를 쓰도록 한곳에 둔다. 한쪽만 "닫기"를 빠뜨리면
 * 이슈가 영영 열린 채 남아 알람이 소음이 되고, 소음이 된 알람은 무시된다
 * (재고 알림이 138일 죽어 있던 게 그 모양이었다).
 */
async function syncAlarm(opts: {
  repo: string;
  token: string;
  label: string;
  labelColor: string;
  labelDescription: string;
  firing: boolean;
  title: string;
  body: string;
  recurComment: string;
  resolvedComment: string;
}): Promise<string> {
  const { repo, token, label } = opts;
  const existing = await openIssueNumber(repo, token, label);

  if (!opts.firing) {
    if (existing === null) return 'none';
    await ghJson(
      `${GITHUB_API}/repos/${repo}/issues/${existing}/comments`,
      token,
      'POST',
      { body: opts.resolvedComment }
    );
    await ghJson(
      `${GITHUB_API}/repos/${repo}/issues/${existing}`,
      token,
      'PATCH',
      {
        state: 'closed',
      }
    );
    return `closed #${existing}`;
  }

  if (existing === null) {
    await ensureLabel(
      repo,
      token,
      label,
      opts.labelColor,
      opts.labelDescription
    );
    await ghJson(`${GITHUB_API}/repos/${repo}/issues`, token, 'POST', {
      title: opts.title,
      body: opts.body,
      labels: [label],
    });
    return 'created';
  }

  // 제목·본문을 현재 상태로 갱신하고, 날이 갈수록 댓글로 쌓는다.
  // (이슈가 한 번 열린 뒤 갱신이 없으면 내용이 썩어 언제 얘긴지 알 수 없게 된다.)
  await ghJson(
    `${GITHUB_API}/repos/${repo}/issues/${existing}`,
    token,
    'PATCH',
    {
      title: opts.title,
      body: opts.body,
    }
  );
  await ghJson(
    `${GITHUB_API}/repos/${repo}/issues/${existing}/comments`,
    token,
    'POST',
    { body: opts.recurComment }
  );
  return `updated #${existing}`;
}

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const token = process.env.BLOG_WATCH_GITHUB_TOKEN;
  const repo = process.env.BLOG_WATCH_REPO ?? 'oddodd-io/hanui';
  const ref = process.env.BLOG_WATCH_REF;

  // 숫자가 아니거나 음수면 기본값으로 떨어진다. 오타 하나로 감시가 꺼지면 안 된다
  // (0으로 읽히면 "재고 0편"조차 알람이 아니게 된다).
  const parsedMinStock = Number.parseInt(
    process.env.BLOG_WATCH_MIN_STOCK ?? '',
    10
  );
  const minStock =
    Number.isInteger(parsedMinStock) && parsedMinStock > 0
      ? parsedMinStock
      : DEFAULT_MIN_STOCK;

  // 설정이 빠졌으면 통과시키지 않고 실패한다. 조용히 넘어가는 감시는 감시가 아니다 —
  // 이 라우트가 고치려는 결함이 바로 그것이다.
  if (!secret) {
    return NextResponse.json(
      { error: 'CRON_SECRET이 설정되지 않았습니다.' },
      { status: 503 }
    );
  }

  const auth = request.headers.get('authorization') ?? '';
  if (!auth.startsWith('Bearer ') || !secretMatches(auth.slice(7), secret)) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 401 });
  }

  if (!token) {
    return NextResponse.json(
      { error: 'BLOG_WATCH_GITHUB_TOKEN이 설정되지 않아 알릴 수 없습니다.' },
      { status: 503 }
    );
  }

  try {
    const today = kstToday();
    const queue = await readQueue(repo, token, ref);
    const overdue = findOverdue(queue, today) as QueueEntry[];
    const upcoming = findUpcoming(queue, today) as QueueEntry[];
    const undated = findUndated(queue);

    // 두 알람은 서로를 막지 않는다. 발행이 멈춘 채 재고까지 바닥나면 둘 다 울려야 한다 —
    // 할 일이 둘(워크플로우 실행, 글쓰기)이기 때문이다.
    const worst = overdue.length > 0 ? daysLate(overdue[0].date, today) : 0;
    const missed = await syncAlarm({
      repo,
      token,
      label: LABEL_MISSED,
      labelColor: 'D73A4A',
      labelDescription: '예약 발행이 빠진 날 (부재 감지)',
      firing: overdue.length > 0,
      title: `🚨 블로그 예약 발행이 빠졌습니다 (${overdue.length}편 밀림, 최대 ${worst}일)`,
      body: overdue.length > 0 ? issueBody(overdue, today, undated) : '',
      recurComment: `${today} 기준 여전히 **${overdue.length}편** 밀려 있습니다(최대 ${worst}일).`,
      resolvedComment: `큐에 밀린 글이 없어졌습니다(기준일 ${today} KST). 자동으로 닫습니다.`,
    });

    const lowStock = await syncAlarm({
      repo,
      token,
      label: LABEL_RESTOCK,
      labelColor: 'FBCA04',
      labelDescription: '블로그 예약글 재고 알림',
      firing: upcoming.length < minStock,
      // 제목은 워크플로우 쪽과 **글자까지 같게 맞춘다.** 둘이 같은 이슈를 쓰는데
      // 형식이 다르면 돌 때마다 제목을 서로 되돌린다.
      title: `📝 블로그 예약글 재고 부족 (남은 ${upcoming.length}편)`,
      body: lowStockBody(upcoming, today, minStock),
      recurComment:
        upcoming.length === 0
          ? `${today} 기준 큐가 여전히 **비어 있습니다.**`
          : `${today} 기준 **${upcoming.length}편** 남았습니다. 마지막 글은 ${runsOutOn(upcoming)}에 나갑니다.`,
      resolvedComment: `재고가 **${upcoming.length}편**으로 돌아왔습니다(기준 ${minStock}편, ${today} KST). 자동으로 닫습니다.`,
    });

    return NextResponse.json({
      today,
      ref: ref ?? 'default',
      queued: queue.length,
      overdue: overdue.length,
      worstDaysLate: worst,
      upcoming: upcoming.length,
      runsOutOn: runsOutOn(upcoming),
      minStock,
      undated,
      issues: { missed, lowStock },
    });
  } catch (error) {
    console.error('[blog-watch]', error);
    return NextResponse.json(
      {
        error: '부재 점검에 실패했습니다.',
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

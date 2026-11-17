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
  kstToday,
  readField,
} from '@/lib/blog-queue.mjs';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const QUEUE_PATH = 'apps/docs/blog-queue';
const LABEL = 'blog-publish-missed';
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
async function ensureLabel(repo: string, token: string): Promise<void> {
  await fetch(`${GITHUB_API}/repos/${repo}/labels`, {
    method: 'POST',
    headers: { ...gh(token), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: LABEL,
      color: 'D73A4A',
      description: '예약 발행이 빠진 날 (부재 감지)',
    }),
  });
}

async function openIssueNumber(
  repo: string,
  token: string
): Promise<number | null> {
  const res = await fetch(
    `${GITHUB_API}/repos/${repo}/issues?state=open&labels=${LABEL}&per_page=1`,
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

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const token = process.env.BLOG_WATCH_GITHUB_TOKEN;
  const repo = process.env.BLOG_WATCH_REPO ?? 'oddodd-io/hanui';
  const ref = process.env.BLOG_WATCH_REF;

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
    const undated = findUndated(queue);
    const existing = await openIssueNumber(repo, token);

    if (overdue.length === 0) {
      if (existing !== null) {
        await ghJson(
          `${GITHUB_API}/repos/${repo}/issues/${existing}/comments`,
          token,
          'POST',
          {
            body: `큐에 밀린 글이 없어졌습니다(기준일 ${today} KST). 자동으로 닫습니다.`,
          }
        );
        await ghJson(
          `${GITHUB_API}/repos/${repo}/issues/${existing}`,
          token,
          'PATCH',
          { state: 'closed' }
        );
      }
      return NextResponse.json({
        today,
        ref: ref ?? 'default',
        queued: queue.length,
        overdue: 0,
        undated,
        issue: existing === null ? 'none' : `closed #${existing}`,
      });
    }

    const worst = daysLate(overdue[0].date, today);
    const title = `🚨 블로그 예약 발행이 빠졌습니다 (${overdue.length}편 밀림, 최대 ${worst}일)`;
    const body = issueBody(overdue, today, undated);

    if (existing === null) {
      await ensureLabel(repo, token);
      await ghJson(`${GITHUB_API}/repos/${repo}/issues`, token, 'POST', {
        title,
        body,
        labels: [LABEL],
      });
    } else {
      // 제목·본문을 현재 상태로 갱신하고, 날짜가 지날수록 댓글로 쌓는다.
      // (재고 알림에서 겪은 것 — 이슈가 한 번 열린 뒤로 갱신이 없으면
      //  내용이 썩어서 언제 얘긴지 알 수 없게 된다.)
      await ghJson(
        `${GITHUB_API}/repos/${repo}/issues/${existing}`,
        token,
        'PATCH',
        { title, body }
      );
      await ghJson(
        `${GITHUB_API}/repos/${repo}/issues/${existing}/comments`,
        token,
        'POST',
        {
          body: `${today} 기준 여전히 **${overdue.length}편** 밀려 있습니다(최대 ${worst}일).`,
        }
      );
    }

    return NextResponse.json({
      today,
      ref: ref ?? 'default',
      queued: queue.length,
      overdue: overdue.length,
      worstDaysLate: worst,
      undated,
      issue: existing === null ? 'created' : `updated #${existing}`,
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

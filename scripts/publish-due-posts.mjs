// 예약 발행 스크립트
// apps/docs/blog-queue/ 안의 글 중 발행일(date)이 오늘(KST) 이하인 것을
// apps/docs/src/content/blog/ 로 옮긴다. 옮긴 게 있으면 커밋·푸시는 워크플로우가 한다.
//
// 출력(GITHUB_OUTPUT): published_count, published_files, published_titles, remaining,
//                      low_stock, late_count, late_detail
// 환경변수 DRY_RUN=1 이면 파일을 옮기지 않고 로그만 찍는다(로컬 점검용).

import fs from 'fs';
import path from 'path';
// 날짜 판정은 부재 감시(app/api/cron/blog-watch)와 한 모듈을 쓴다.
// 둘이 따로 세면 "발행은 했다는데 감시는 밀렸다고 한다"가 된다.
import {
  daysLate,
  findUpcoming,
  kstToday,
  readField,
} from '../apps/docs/src/lib/blog-queue.mjs';

const QUEUE_DIR = 'apps/docs/blog-queue';
const BLOG_DIR = 'apps/docs/src/content/blog';
const LOW_STOCK_THRESHOLD = 3;
const DRY_RUN = !!process.env.DRY_RUN;

const today = kstToday();

if (!fs.existsSync(QUEUE_DIR)) {
  console.log(`큐 폴더 없음(${QUEUE_DIR}). 발행할 글 없음.`);
  writeOutput({ published: [], remaining: 0 });
  process.exit(0);
}

const queued = fs.readdirSync(QUEUE_DIR).filter((f) => f.endsWith('.mdx'));
const due = [];

for (const file of queued) {
  const text = fs.readFileSync(path.join(QUEUE_DIR, file), 'utf-8');
  const date = readField(text, 'date');
  if (!date) {
    console.warn(`⚠️  ${file}: date 프론트매터 없음 — 건너뜀`);
    continue;
  }
  if (date <= today) {
    due.push({ file, date, title: readField(text, 'title') });
  }
}

// 발행일 순서대로(밀린 게 여러 개면 오래된 것부터)
due.sort((a, b) => a.date.localeCompare(b.date));

for (const post of due) {
  const from = path.join(QUEUE_DIR, post.file);
  const to = path.join(BLOG_DIR, post.file);
  if (DRY_RUN) {
    console.log(`[DRY_RUN] 발행 예정: ${post.file} (${post.date})`);
  } else {
    fs.renameSync(from, to);
    console.log(`✅ 발행: ${post.file} (${post.date})`);
  }
}

// 재고는 **파일 수가 아니라 앞으로 나갈 편수**다. date가 없는 글은 이 스크립트가
// 건너뛰므로 큐에 영원히 남는데(위 경고), 파일 수로 세면 그 글들이 재고를 부풀려
// "재고 3편"이라며 알람이 안 울린 채 발행이 끊긴다.
//
// 부재 감시(app/api/cron/blog-watch)도 같은 findUpcoming으로 센다. 둘이 따로 세면
// 같은 이슈에 번갈아 다른 편수를 적어 "발행은 3편이라는데 감시는 1편이라 한다"가 된다.
const remaining = findUpcoming(
  fs
    .readdirSync(QUEUE_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((file) => ({
      file,
      date: readField(
        fs.readFileSync(path.join(QUEUE_DIR, file), 'utf-8'),
        'date'
      ),
    }))
    // DRY_RUN이면 파일을 안 옮겼으므로, 이번에 나갈 글을 손으로 빼야 실제 실행과 같아진다.
    .filter((e) => !(DRY_RUN && due.some((d) => d.file === e.file))),
  today
).length;

// 발행일이 **어제 이하**인 글을 지금 올렸다면, 그 글을 가져가야 했던 실행이 없었던 것이다.
// 스크립트가 date <= today로 집기 때문에 밀린 글은 조용히 따라잡히고 끝난다 —
// 그래서 2026-11-16에 예약 두 번이 다 건너뛰어진 걸 사람이 보고 나서야 알았다.
// 늦게라도 돌았으면 늦었다고 말하게 둔다. (실행이 아예 없는 경우는 Vercel Cron 감시가 본다)
const late = due.filter((p) => p.date < today);

console.log(
  `오늘(${today}) 발행 ${due.length}편, 남은 예약글 ${remaining}편` +
    (remaining < LOW_STOCK_THRESHOLD ? ' — ⚠️ 재고 부족' : '')
);
if (late.length > 0) {
  console.warn(
    `⚠️  밀린 발행 ${late.length}편 — ` +
      late
        .map((p) => `${p.file}(${p.date}, ${daysLate(p.date, today)}일 늦음)`)
        .join(', ')
  );
}

writeOutput({ published: due, remaining, late });

function writeOutput({ published, remaining, late = [] }) {
  const out = [
    `published_count=${published.length}`,
    `published_files=${published.map((p) => p.file).join(',')}`,
    `published_titles=${published.map((p) => p.title).join(' / ')}`,
    `remaining=${remaining}`,
    `low_stock=${remaining < LOW_STOCK_THRESHOLD ? 'true' : 'false'}`,
    `late_count=${late.length}`,
    `late_detail=${late
      .map(
        (p) =>
          `${p.date}(${daysLate(p.date, today)}일 늦음) ${p.title || p.file}`
      )
      .join(' / ')}`,
  ].join('\n');
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, out + '\n');
  }
}

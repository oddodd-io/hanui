/**
 * 예약 발행 큐(apps/docs/blog-queue/)의 날짜 판정.
 *
 * 발행 스크립트(scripts/publish-due-posts.mjs)와 부재 감시(app/api/cron/blog-watch)가
 * **같은 규칙**을 쓰도록 한곳에 둔다. 둘이 따로 날짜를 세면 "발행은 했다는데 감시는
 * 밀렸다고 한다" 같은 상황이 생긴다.
 *
 * 다만 두 쪽의 경계는 하루 다르고, 이건 의도한 것이다.
 *
 *   발행: date <= today  — 오늘 치 글을 오늘 올린다
 *   감시: date <  today  — 어제 치가 아직 큐에 있으면 발행이 빠진 것
 *
 * 오늘 치 글이 큐에 남아 있는 건 정상이다. 발행 실행이 지연 중일 수 있고
 * (GitHub 스케줄러 실측 지연 +3h59m ~ +6h07m), 지연은 부재가 아니다.
 * 감시가 '오늘'을 세지 않는 덕분에 감시를 **하루 중 아무 때나** 돌려도 된다 —
 * 발행 창이 언제 열리고 닫히는지 몰라도 오판하지 않는다.
 *
 * .mjs인 이유: Node 스크립트(plain node)와 Next 라우트(TS) 양쪽에서 그대로 import한다.
 */

/** 하루를 밀리초로 */
const DAY_MS = 24 * 60 * 60 * 1000;
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

/**
 * 오늘(KST) 날짜를 'YYYY-MM-DD'로.
 *
 * 프론트매터 date가 'YYYY-MM-DD' 문자열이라 문자열 비교(`<`, `<=`)로 충분하다.
 * 타임존 라이브러리를 들이지 않으려고 UTC에 9시간을 더해 KST 달력일을 얻는다.
 *
 * @param {number} [now] 밀리초 epoch (테스트에서 고정값을 넣는다)
 * @returns {string} 'YYYY-MM-DD'
 */
export function kstToday(now = Date.now()) {
  return new Date(now + KST_OFFSET_MS).toISOString().slice(0, 10);
}

/**
 * 프론트매터에서 한 칸을 읽는다.
 *
 * @param {string} text mdx 전문
 * @param {string} field 칸 이름 (date, title …)
 * @returns {string} 없으면 빈 문자열
 */
export function readField(text, field) {
  const m = text.match(
    new RegExp(`^${field}:\\s*['"]?([^'"\\n]+)['"]?\\s*$`, 'm')
  );
  return m ? m[1].trim() : '';
}

/**
 * 발행이 밀린 글만 골라 오래된 것부터 돌려준다.
 *
 * date가 비어 있는 글은 세지 않는다 — 발행 스크립트도 건너뛰므로
 * 영원히 큐에 남지만, 그건 '밀린 발행'이 아니라 프론트매터 결함이다.
 * 둘을 같은 알람에 섞으면 알람이 무슨 뜻인지 알 수 없게 된다.
 *
 * @param {{file: string, date: string}[]} entries 큐에 있는 글
 * @param {string} today kstToday()
 * @returns {{file: string, date: string}[]} 오래된 것부터
 */
export function findOverdue(entries, today) {
  return entries
    .filter((e) => e.date && e.date < today)
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * 며칠 밀렸나. 두 'YYYY-MM-DD'의 달력일 차이.
 *
 * 둘 다 UTC 자정으로 읽어서 빼므로 서머타임·타임존이 끼어들지 않는다.
 *
 * @param {string} date 'YYYY-MM-DD'
 * @param {string} today 'YYYY-MM-DD'
 * @returns {number} date가 today보다 앞이면 양수
 */
export function daysLate(date, today) {
  return Math.round(
    (Date.parse(`${today}T00:00:00Z`) - Date.parse(`${date}T00:00:00Z`)) /
      DAY_MS
  );
}

/**
 * 프론트매터가 없거나 date 칸이 빈 글 — 알람 문구에 따로 적는다.
 *
 * @param {{file: string, date: string}[]} entries
 * @returns {string[]} 파일 이름
 */
export function findUndated(entries) {
  return entries.filter((e) => !e.date).map((e) => e.file);
}

/**
 * 아직 발행되지 않은 '재고' — 가까운 날짜부터.
 *
 * 오늘 치도 재고로 센다. 아직 안 나갔으면 재고다.
 * date가 빈 글은 빼는데, 발행 스크립트가 가져가지 않으므로 **셀 수 있는 재고가 아니다**.
 * 이걸 세면 프론트매터가 깨진 글 때문에 재고가 넉넉해 보인다.
 *
 * @param {{file: string, date: string}[]} entries 큐에 있는 글
 * @param {string} today kstToday()
 * @returns {{file: string, date: string}[]} 가까운 날짜부터
 */
export function findUpcoming(entries, today) {
  return entries
    .filter((e) => e.date && e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * 재고가 바닥나는 날 = 마지막 예약일. 그 다음날부터 올라갈 글이 없다.
 *
 * @param {{date: string}[]} upcoming findUpcoming() 결과
 * @returns {string} 'YYYY-MM-DD', 재고가 없으면 빈 문자열
 */
export function runsOutOn(upcoming) {
  return upcoming.length > 0 ? upcoming[upcoming.length - 1].date : '';
}

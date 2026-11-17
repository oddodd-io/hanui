# 도메인 역할 나누기 — 작업 지시서

작성 2026-11-17. 블로그 세션에서 정리해 넘긴 문서다. **이 문서대로 작업하면 된다.**

## 목표 구조

| 주소             | 역할                                   |
| ---------------- | -------------------------------------- |
| `hanui.io`       | **인트로 + 블로그만.** 프레임워크 중립 |
| `vue.hanui.io`   | Vue 문서 (최신 버전)                   |
| `react.hanui.io` | React 문서 (개편 예정)                 |

## 지금 상태 (2026-11-17 확인)

- 세 주소 모두 Vercel에 연결돼 있고 `Valid Configuration`. `react.hanui.io`는 오늘 추가했고 200으로 열린다.
- 세 주소가 **같은 빌드, 같은 HTML**을 내려준다. 프레임워크는 브라우저에서 `FrameworkTabs.tsx`가 주소를 보고 고른다.
- canonical은 전부 `https://hanui.io/...`로 모인다 (`metadataBase` 덕분). **확인 완료** — `react.hanui.io/components/button` → `https://hanui.io/components/button`.
- 토글 하이드레이션 어긋남과 `react.` 서브도메인 처리는 **오늘 이미 고쳤다**(커밋 완료). `react.hanui.io`에서 Vue 누르면 `vue.hanui.io`로 간다.

## 해야 할 일 3가지

### 1. React 탭 → `react.hanui.io`로 보내기

**파일:** `apps/docs/src/components/FrameworkTabs.tsx`

지금은 React를 누르면 기본 도메인(`hanui.io`)으로 간다. `react.hanui.io`로 가야 한다.

```ts
// 현재 (handleSetFramework 안)
const target =
  newFramework === DEFAULT_FRAMEWORK ? base : `${newFramework}.${base}`;

// 바꿀 방향: 프레임워크는 항상 자기 서브도메인으로
const target = `${newFramework}.${base}`;
```

**같이 결정할 것:** `hanui.io`(서브도메인 없음)로 들어왔을 때 토글이 뭘 보여줄지.
`getFrameworkFromHostname()`이 `SUBDOMAIN[...] ?? DEFAULT_FRAMEWORK`라 지금은 react가 된다.
2번을 하면 `hanui.io`는 문서를 아예 안 보여주므로 큰 문제는 아니지만,
**최신이 Vue이니 `DEFAULT_FRAMEWORK`를 `'vue'`로 바꾸는 쪽을 검토**할 것.
단 이 상수는 **서버 렌더 기본값**이기도 해서 바꾸면 첫 화면이 Vue로 그려진다.

### 2. `hanui.io`의 문서 주소 → `vue.hanui.io`로 리다이렉트

Vue가 최신이라 Vue로 보낸다.

**파일:** `apps/docs/next.config.ts` (이미 `async redirects()`가 있다)

호스트 조건부 리다이렉트를 쓴다.

```ts
{
  source: '/:path(components|blocks|kits|templates|a11y|docs|playground|showcase|typography|api)/:rest*',
  has: [{ type: 'host', value: 'hanui.io' }],
  destination: 'https://vue.hanui.io/:path/:rest*',
  permanent: false,   // 처음엔 false(307)로 두고 안정되면 true로
}
```

**주의 3가지**

- `hanui.io`에 **남길 것**: `/`(인트로), `/blog/*`, `/sitemap.xml`, `/blog/rss.xml`. 리다이렉트 경로에 넣지 말 것.
- `permanent: true`(308)는 브라우저가 영구 캐시한다. **처음엔 `false`로 두고** 잘 도는지 보고 바꾼다.
- `www.hanui.io`는 Vercel이 이미 308로 `hanui.io`에 보낸다. next.config에서 또 건드리면 무한 루프가 난다 (파일 주석에 적혀 있음).

### 3. 인트로를 프레임워크 공통 문구로

**파일:** `apps/docs/src/app/docs/introduction/content.tsx` (118~132줄 근처)

지금은 `isVue` 분기로 "Vue 3도 지원합니다! vue.hanui.io에서…" / "React도 지원합니다! hanui.io에서…"를 보여준다.
`hanui.io`가 중립이 되므로 **분기 없이 둘 다 안내**하는 문구로 바꾼다.

- React는 `react.hanui.io`, Vue는 `vue.hanui.io`로 링크
- "React도 지원합니다! **hanui.io**에서" → 주소가 바뀌었으니 반드시 수정
- 인트로 본문에 React 기준 표현이 더 있는지 같이 훑을 것

## 건드리지 말 것

**canonical은 지금처럼 `hanui.io`로 모아둔다.**

세 주소가 같은 HTML을 내려주므로, 검색엔진 눈에는 `react.hanui.io/components/button`과
`vue.hanui.io/components/button`이 **같은 페이지**다. 주소별로 canonical을 나누면
중복 콘텐츠가 된다. 도메인을 나누는 건 **정리 목적**이고 검색 노출이 늘지는 않는다.

관련해서 오늘 고친 것 (되돌리지 말 것):

- `apps/docs/src/app/layout.tsx` — `alternates: { canonical: '/' }` **제거함.** 이게 있으면 자기 canonical이 없는 모든 페이지가 홈을 가리켜 홈의 중복본으로 색인된다.
- `apps/docs/src/app/blog/[slug]/page.tsx` — `canonical: post.canonicalUrl ?? ` + 자기 주소.

## 끝나고 확인할 것

```bash
pnpm build          # apps/docs 에서
```

그리고 배포 뒤 브라우저에서:

1. `react.hanui.io` → React 탭 켜짐, Vue 누르면 `vue.hanui.io`
2. `vue.hanui.io` → Vue 탭 켜짐, React 누르면 `react.hanui.io`
3. `hanui.io/components/button` → `vue.hanui.io/components/button`으로 이동
4. `hanui.io/blog/...` → **이동하지 않음** (그대로 열려야 함)
5. 아무 문서 페이지에서 `<link rel="canonical">`이 `https://hanui.io/...`인지

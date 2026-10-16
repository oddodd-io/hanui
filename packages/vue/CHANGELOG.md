# @hanui/vue 변경 기록

## 0.3.1 - 2026-10-16

### 수정

- `Table`: `scroll`·`mobScroll`을 주지 않아도 표가 실제로 가로로 넘치면(KRDS 모바일 최소 너비 등) 키보드로 초점을 받아 방향키로 스크롤할 수 있게 `role="region"`·`tabindex="0"`·caption 이름을 붙인다(WCAG 2.1.1). 표 래퍼를 `position: relative`로 두어 표 안의 화면낭독기 전용 글자가 페이지 가로 넘침을 만들지 않게 했다

## 0.3.0 - 2026-10-15

### 추가

- `InPageNavigation`: KRDS "이 페이지의 구성"(콘텐츠 내 탐색) 컴포넌트

### 수정

- `Select`: 서버 렌더링 때 선택된 `option`에 `selected`를 출력 — JS 실행 전에도 올바른 선택이 보인다
- `FormField`: 필수 항목 레이블 뒤에 "(필수)"를 보이게 표시(`aria-hidden`, 화면낭독은 `aria-required`), KRDS 보완 스타일
- `Header`: 이미지 로고를 KRDS 고정 너비 대신 이미지 비율대로 표시. 최대 너비 PC 32rem·모바일 18rem(CSS 변수로 변경 가능), 넘치면 비율을 유지해 줄인다

## 0.2.0 - 2026-10-01

- 패키지 이름을 `@hanui/vue`로 변경(이전 `@hanui/vue-components`는 지원 중단)

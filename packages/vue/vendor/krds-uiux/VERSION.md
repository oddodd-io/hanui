# KRDS HTML ComponentKit (vendor)

업스트림 원본을 그대로 복사한 폴더다. **이 폴더 안의 파일은 수정하지 않는다.**
업데이트는 폴더 전체를 교체하고 아래 기록을 갱신한다.

| 항목      | 값                                                                             |
| --------- | ------------------------------------------------------------------------------ |
| 저장소    | https://github.com/KRDS-uiux/krds-uiux                                         |
| 버전      | 1.1.0                                                                          |
| 커밋      | d6bb184c823e4757f05807ea4646a23e3133b6e6                                       |
| 복사일    | 2026-09-22                                                                     |
| 복사 범위 | `resources/`, `tokens/` (`html/code` 예제는 `reference/krds-uiux`에서 대조)    |
| 라이선스  | ISC + KRDS 이용약관 (https://www.krds.go.kr/html/site/utility/utility_06.html) |

## 사용 방식

- 스타일: `resources/scss/component/output.scss`를 hanui SCSS 진입점에서 import한다. 미리 빌드된 `resources/css/component/component.css`는 이미지 경로가 `img/img/`로 깨져 있으므로 사용하지 않는다.
- 토큰: `resources/css/token/krds_tokens.css`(output.scss에 포함)를 그대로 사용한다.
- 아이콘: `.svg-icon.ico-*` 클래스 (CSS mask 방식).
- JS: `resources/js/component/ui-script.js`는 전역 `DOMContentLoaded` 초기화 방식이라 Vue 동적 렌더와 맞지 않는다. **동작은 Vue로 재구현하고 이 파일은 참조 기준으로만 사용한다.**

## 업데이트 절차

1. `reference/krds-uiux`에서 원하는 커밋 체크아웃
2. `vendor/krds-uiux/resources`, `tokens` 삭제 후 복사
3. 이 파일의 버전·커밋·복사일 갱신
4. `pnpm test && pnpm build` 후 컴포넌트별 화면 대조

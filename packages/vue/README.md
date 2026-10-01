# @hanui/vue

KRDS(대한민국 정부 디자인 시스템) HTML ComponentKit 리소스를 그대로 사용하는 공공 웹사이트용 Vue 3 컴포넌트 라이브러리입니다.

- 스타일은 KRDS 원본 CSS 클래스를 그대로 사용합니다.
- 키보드 조작·초점 관리·ARIA 등 동작은 Vue로 다시 구현하고, KRDS 원본 스크립트의 접근성 결함을 보완했습니다.

## 설치

```bash
pnpm add @hanui/vue
```

Vue `^3.5.0`이 필요합니다.

## 사용

```ts
// main.ts
import '@hanui/vue/styles.css';
```

```vue
<script setup lang="ts">
import { Button } from '@hanui/vue';
</script>

<template>
  <Button variant="primary" size="large">확인</Button>
</template>
```

## 컴포넌트

Button, FormField, Input, Textarea, Select, Table, Pagination, Badge, Modal, FileUpload, Breadcrumb, SkipLink, Masthead, DropMenu, Header, MainMenu, MobileMenu, Identifier, Footer, SideNavigation, Spinner

## 라이선스

- hanui 코드: MIT
- 포함된 KRDS 리소스(CSS·토큰·아이콘): [KRDS-uiux/krds-uiux](https://github.com/KRDS-uiux/krds-uiux) v1.1.0, ISC 및 [KRDS 이용약관](https://www.krds.go.kr/html/site/utility/utility_06.html)

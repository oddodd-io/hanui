# HANUI App

이 프로젝트는 [create-hanui-app](https://github.com/hanui-o/hanui)으로 생성되었습니다.

## 시작하기

먼저 개발 서버를 실행하세요:

```bash
npm run dev
# 또는
yarn dev
# 또는
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

`src/app/page.tsx` 파일을 수정하여 페이지를 편집할 수 있습니다. 파일을 수정하면 페이지가 자동으로 업데이트됩니다.

## HANUI 컴포넌트 사용하기

HANUI는 KRDS(Korea Republic Design System) 기반의 React 컴포넌트 라이브러리입니다.

```tsx
import { Button, Container } from '@hanui/react';

export default function Page() {
  return (
    <Container>
      <Button>클릭하세요</Button>
    </Container>
  );
}
```

## 문서

더 자세한 정보는 다음 문서를 참고하세요:

- [HANUI 문서](https://hanui.io/docs/introduction)
- [Next.js 문서](https://nextjs.org/docs)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)

## 더 알아보기

- [HANUI GitHub](https://github.com/hanui-o/hanui)
- [KRDS 디자인 시스템](https://www.gov.kr/portal/designSystem)

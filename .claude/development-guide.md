# HANUI 개발 가이드

## 개발 환경 설정

### 1. 필수 도구 설치

```bash
# Node.js 20+ (nvm 권장)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20

# pnpm 설치
npm install -g pnpm@10.17.1

# 저장소 클론
git clone https://github.com/hanui-o/hanui.git
cd hanui

# 의존성 설치
pnpm install
```

### 2. 개발 서버 실행

```bash
# 모든 패키지 개발 모드
pnpm dev

# 문서 사이트만 실행 (추천)
pnpm dev:docs
# → http://localhost:4000  (3000은 다른 작업에 쓰므로 비켜 둔다)
#    다른 포트가 필요하면: PORT=4500 pnpm dev:docs

# 특정 패키지만 실행
pnpm --filter @hanui/react dev
pnpm --filter @hanui/vue dev
```

### 3. 빌드 확인

```bash
# 전체 빌드
pnpm build

# CLI만 빌드
pnpm build:cli

# 타입 체크
pnpm --filter @hanui/react exec tsc --noEmit
```

## 새 컴포넌트 개발 워크플로우

### React 컴포넌트 추가

#### 1. 컴포넌트 파일 생성

```bash
# packages/react/src/components/tooltip.tsx
```

```tsx
import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const tooltipVariants = cva(
  'z-50 overflow-hidden rounded-md px-3 py-1.5 text-sm shadow-md',
  {
    variants: {
      variant: {
        default: 'bg-krds-gray-90 text-white',
        light: 'bg-white text-krds-gray-90 border border-krds-gray-20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface TooltipProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
    VariantProps<typeof tooltipVariants> {}

const Tooltip = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipProps
>(({ className, variant, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    className={cn(tooltipVariants({ variant }), className)}
    {...props}
  />
));
Tooltip.displayName = 'Tooltip';

export { Tooltip };
```

#### 2. index.ts에 export 추가

```tsx
// packages/react/src/index.ts
export { Tooltip } from './components/tooltip';
```

#### 3. 레지스트리에 등록

```bash
# packages/registry/src/react/tooltip.json
```

```json
{
  "name": "tooltip",
  "type": "ui",
  "description": "KRDS 툴팁 컴포넌트",
  "dependencies": [
    "@radix-ui/react-tooltip",
    "class-variance-authority",
    "clsx",
    "tailwind-merge"
  ],
  "files": [
    {
      "path": "components/tooltip.tsx",
      "type": "component",
      "target": "src/components/ui/tooltip.tsx"
    }
  ],
  "meta": {
    "krdsCompliant": true,
    "a11yLevel": "AA",
    "keywords": ["tooltip", "popover", "hint"]
  }
}
```

#### 4. 문서 페이지 생성

```bash
# apps/docs/src/app/docs/components/tooltip/page.tsx
```

```tsx
import { Metadata } from 'next';
import { Heading, Section } from '@/components/content';
import { PreviewBox, CodeBlock, PropsTable } from '@/components/helpers';
import { Tooltip, TooltipProvider, TooltipTrigger } from '@hanui/react';

export const metadata: Metadata = {
  title: 'Tooltip - HANUI',
  description: '추가 정보를 표시하는 툴팁 컴포넌트',
};

export default function TooltipPage() {
  return (
    <>
      <Heading
        level="h1"
        title="Tooltip"
        description="요소 위에 호버 시 추가 정보를 표시하는 팝업"
      />

      <Section>
        <Heading level="h2" id="preview" title="미리보기" />
        <PreviewBox>
          <TooltipProvider>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <Tooltip>추가 정보</Tooltip>
          </TooltipProvider>
        </PreviewBox>
      </Section>

      <Section>
        <Heading level="h2" id="installation" title="설치" />
        <CodeBlock code="npx hanui add tooltip" language="bash" />
      </Section>

      {/* ... 나머지 섹션 */}
    </>
  );
}
```

#### 5. 빌드 및 테스트

```bash
# TypeScript 타입 체크
pnpm --filter @hanui/react exec tsc --noEmit

# 빌드
pnpm --filter @hanui/react build

# 문서 사이트에서 확인
pnpm dev:docs
```

### Vue 컴포넌트 추가

#### 1. 컴포넌트 파일 생성

```bash
# packages/vue/src/components/Tooltip.vue
```

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';

const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'light';
    content: string;
    class?: string;
  }>(),
  {
    variant: 'default',
  }
);

const classes = computed(() =>
  cn(
    'z-50 overflow-hidden rounded-md px-3 py-1.5 text-sm shadow-md',
    props.variant === 'default' && 'bg-krds-gray-90 text-white',
    props.variant === 'light' &&
      'bg-white text-krds-gray-90 border border-krds-gray-20',
    props.class
  )
);
</script>

<template>
  <div :class="classes">
    {{ content }}
  </div>
</template>
```

#### 2. 나머지 과정은 React와 동일

## 코딩 컨벤션

### 파일 명명 규칙

```
React 컴포넌트: kebab-case.tsx
  ✅ button.tsx
  ✅ alert-dialog.tsx
  ❌ Button.tsx
  ❌ AlertDialog.tsx

Vue 컴포넌트: PascalCase.vue
  ✅ Button.vue
  ✅ AlertDialog.vue
  ❌ button.vue
  ❌ alert-dialog.vue

Hooks: use*.ts
  ✅ useSteps.ts
  ✅ useFocusTrap.ts

Composables: use*.ts
  ✅ useSteps.ts
  ✅ useToggle.ts

Utils: camelCase.ts
  ✅ cn.ts
  ✅ formatDate.ts
```

### 컴포넌트 구조 순서

```tsx
// 1. Imports
import * as React from 'react';
import { cva } from 'class-variance-authority';

// 2. Types/Interfaces
export interface ButtonProps {
  variant?: 'default' | 'primary';
}

// 3. Variants (CVA)
const buttonVariants = cva('base-classes', {
  variants: {
    /* ... */
  },
});

// 4. Component
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    return <button ref={ref} {...props} />;
  }
);

// 5. DisplayName
Button.displayName = 'Button';

// 6. Exports
export { Button, buttonVariants };
```

### KRDS 디자인 토큰 사용

```tsx
// ✅ Good - KRDS 토큰 사용
'bg-krds-primary-60';
'text-krds-gray-90';
'border-krds-gray-30';
'p-krds-4';

// ❌ Bad - 하드코딩
'bg-blue-600';
'text-gray-900';
'border-gray-300';
'p-4';
```

### 접근성 필수 요소

```tsx
// 1. ARIA 속성
<button
  role="button"
  aria-label="닫기"
  aria-disabled={disabled}
/>

// 2. 키보드 이벤트
<button
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onClick?.(e);
    }
  }}
/>

// 3. 포커스 스타일
'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-krds-primary-60'
```

## 테스트 체크리스트

### 컴포넌트 완성 전 확인사항

- [ ] TypeScript 타입 오류 없음
- [ ] KRDS 디자인 토큰 사용
- [ ] ARIA 속성 포함
- [ ] 키보드 네비게이션 지원
- [ ] 포커스 스타일 정의
- [ ] 다크모드 지원 (해당되는 경우)
- [ ] 반응형 디자인
- [ ] 레지스트리에 등록
- [ ] 문서 페이지 작성

### 빌드 전 확인

```bash
# TypeScript 타입 체크
pnpm --filter @hanui/react exec tsc --noEmit

# Lint
pnpm lint

# Format
pnpm format

# 빌드
pnpm build
```

## Git 워크플로우

### 브랜치 전략

```
main              # 배포 브랜치 (보호됨)
  ├── feat/*      # 새 기능
  ├── fix/*       # 버그 수정
  ├── docs/*      # 문서 업데이트
  └── refactor/*  # 리팩토링
```

### 커밋 메시지 규칙

```bash
# 형식
<type>(<scope>): <subject>

# 예시
feat(button): add loading state
fix(modal): prevent scroll when open
docs(tooltip): update usage examples
refactor(input): simplify variant logic
chore: update dependencies
```

### 타입 종류

- `feat`: 새 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `refactor`: 코드 리팩토링
- `style`: 코드 포맷팅 (기능 변경 없음)
- `test`: 테스트 추가/수정
- `chore`: 빌드 프로세스, 도구 변경

### Pull Request 프로세스

```bash
# 1. 브랜치 생성
git checkout -b feat/tooltip

# 2. 변경사항 커밋
git add .
git commit -m "feat(tooltip): add tooltip component"

# 3. 푸시
git push origin feat/tooltip

# 4. GitHub에서 PR 생성
# 5. 코드 리뷰 대기
# 6. 승인 후 main에 merge
```

## 버전 관리 (Changesets)

### Changeset 생성

```bash
# 변경사항 기록
pnpm changeset

# 대화형 프롬프트
? What kind of change is this?
  → patch (버그 수정)
  → minor (새 기능)
  → major (Breaking change)

? Which packages should be included?
  → @hanui/react
  → @hanui/cli

? Summary:
  → Add tooltip component with accessibility support
```

### 버전 업데이트

```bash
# 버전 자동 업데이트 (CI에서 실행)
pnpm version-packages

# package.json 버전 변경됨
# CHANGELOG.md 자동 생성됨
```

### 배포

```bash
# 빌드 및 퍼블리시 (CI/CD에서 자동)
pnpm release

# 수동으로 하는 경우
pnpm build
pnpm changeset publish
```

## 디버깅 팁

### TypeScript 오류 해결

```bash
# 타입 캐시 삭제
rm -rf node_modules/.cache

# 재설치
pnpm install

# 타입 체크
pnpm --filter @hanui/react exec tsc --noEmit
```

### 빌드 오류 해결

```bash
# 빌드 캐시 삭제
pnpm clean

# 재빌드
pnpm build
```

### Tailwind CSS 적용 안 될 때

```bash
# 1. tailwind.config.ts 확인
content: [
  './src/**/*.{ts,tsx}',
]

# 2. CSS import 확인
import '@hanui/react/styles.css'

# 3. JIT 모드 재시작
pnpm dev:docs
```

## 자주 묻는 질문

### Q1: 새 컴포넌트 추가 시 순서는?

```
1. 컴포넌트 파일 생성 (packages/react/src/components/)
2. index.ts에 export 추가
3. 레지스트리 등록 (packages/registry/src/react/)
4. 문서 페이지 작성 (apps/docs/)
5. 타입 체크 및 빌드
6. Changeset 생성
7. PR 생성
```

### Q2: KRDS 색상이 적용 안 될 때?

```bash
# variables.css import 확인
import '@hanui/react/variables.css'

# Tailwind preset 확인
import hanuiPreset from '@hanui/react/tailwind.preset'

export default {
  presets: [hanuiPreset],
}
```

### Q3: 접근성 체크는 어떻게?

```tsx
// axe-core 사용
import { useEffect } from 'react';

if (process.env.NODE_ENV === 'development') {
  import('@axe-core/react').then(({ default: axe }) => {
    axe(React, ReactDOM, 1000);
  });
}
```

### Q4: 컴포넌트가 CLI로 설치 안 될 때?

```bash
# 레지스트리 파일 확인
ls packages/registry/src/react/[component].json

# 빌드 확인
pnpm build:cli

# 로컬 테스트
pnpm hanui add [component]
```

## 개발 환경 문제 해결

### pnpm 설치 오류

```bash
# npm으로 설치
npm install -g pnpm@10.17.1

# 버전 확인
pnpm --version
```

### Node 버전 오류

```bash
# .nvmrc 사용
nvm use

# 또는 직접 지정
nvm use 20
```

### 의존성 충돌

```bash
# pnpm-lock.yaml 삭제 후 재설치
rm -rf pnpm-lock.yaml node_modules
pnpm install
```

## 유용한 명령어 모음

```bash
# 특정 패키지만 빌드
pnpm --filter @hanui/react build

# 특정 패키지 의존성 추가
pnpm --filter @hanui/react add -D typescript

# 모든 패키지 clean
pnpm clean

# Format 검사
pnpm format

# Lint 실행
pnpm lint

# 로컬 CLI 테스트
pnpm hanui add button

# 문서 사이트 빌드
pnpm --filter docs build
```

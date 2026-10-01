# HANUI 컴포넌트 개발 가이드라인

## 개요

HANUI는 KRDS(한국 정부 디자인 시스템) 기반의 React/Vue 컴포넌트 라이브러리입니다.

## 프로젝트 구조

```
packages/
├── react/          # React 컴포넌트 (@hanui/react)
├── vue/            # Vue 3 컴포넌트 (@hanui/vue)
├── cli/            # CLI 도구 (@hanui/cli)
└── registry/       # 컴포넌트 레지스트리

apps/
└── docs/           # Next.js 문서 사이트
```

## React 컴포넌트 규칙

### 파일 명명 규칙

- 컴포넌트 파일: `kebab-case.tsx` (예: `button.tsx`, `alert-dialog.tsx`)
- 타입 정의: 컴포넌트 파일 내에 정의
- 인덱스: `src/index.ts`에서 모든 컴포넌트 export

### 컴포넌트 구조

```tsx
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const componentVariants = cva('base-classes', {
  variants: {
    variant: {
      default: 'default-classes',
      primary: 'primary-classes',
    },
    size: {
      sm: 'small-classes',
      md: 'medium-classes',
      lg: 'large-classes',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

export interface ComponentProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof componentVariants> {
  // 추가 props
}

const Component = React.forwardRef<HTMLElement, ComponentProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <element
        ref={ref}
        className={cn(componentVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Component.displayName = 'Component';

export { Component };
```

### KRDS 디자인 토큰 사용

```tsx
// 색상
'text-krds-primary-60'; // 주요 색상
'bg-krds-gray-10'; // 배경 색상
'border-krds-gray-30'; // 테두리 색상

// 타이포그래피
'text-krds-body-md'; // 본문 크기
'text-krds-heading-lg'; // 제목 크기
'font-krds-bold'; // 굵기

// 간격
'p-krds-4'; // padding
'gap-krds-2'; // gap
```

### 접근성 필수 요소

1. **ARIA 속성**: 적절한 role, aria-label, aria-describedby
2. **키보드 네비게이션**: Tab, Enter, Space, Escape, Arrow keys
3. **포커스 관리**: 모달/다이얼로그에서 포커스 트래핑
4. **색상 대비**: WCAG AA 기준 4.5:1 이상

```tsx
// 예시: 버튼 접근성
<button
  role="button"
  aria-disabled={disabled}
  aria-busy={loading}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onClick?.(e);
    }
  }}
/>
```

## Vue 컴포넌트 규칙

### 파일 명명 규칙

- 컴포넌트 파일: `PascalCase.vue` (예: `Button.vue`, `AlertDialog.vue`)
- Composables: `use*.ts` (예: `useSteps.ts`)

### 컴포넌트 구조

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';

const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'primary' | 'secondary';
    size?: 'sm' | 'md' | 'lg';
    class?: string;
  }>(),
  {
    variant: 'default',
    size: 'md',
  }
);

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const classes = computed(() =>
  cn(
    'base-classes',
    props.variant === 'primary' && 'primary-classes',
    props.size === 'sm' && 'small-classes',
    props.class
  )
);
</script>

<template>
  <element :class="classes" @click="emit('click', $event)">
    <slot />
  </element>
</template>
```

## CLI 개발 규칙

### 레지스트리 구조 (`packages/registry/`)

```json
{
  "button": {
    "name": "button",
    "type": "ui",
    "description": "KRDS 버튼 컴포넌트",
    "dependencies": ["class-variance-authority", "clsx", "tailwind-merge"],
    "files": [{ "path": "components/button.tsx", "type": "component" }]
  }
}
```

### CLI 명령어

```bash
# 초기화
npx hanui init -f react   # React 프로젝트
npx hanui init -f vue     # Vue 프로젝트

# 컴포넌트 추가
npx hanui add button
npx hanui add all -f vue -y
```

## 문서 페이지 규칙 (`apps/docs/`)

### 컴포넌트 문서 구조

```
src/app/docs/components/[component]/
├── page.tsx              # 메인 문서 페이지
└── examples/             # 예제 컴포넌트들
```

### 문서 페이지 템플릿

```tsx
import { Heading, Section, Subsection } from '@/components/content';
import { PreviewBox, CodeBlock } from '@/components/helpers';

export default function ComponentPage() {
  return (
    <>
      <Heading level="h1" title="컴포넌트 이름" description="컴포넌트 설명" />

      <Section>
        <Heading level="h2" id="preview" title="미리보기" />
        <PreviewBox>{/* 컴포넌트 예제 */}</PreviewBox>
      </Section>

      <Section>
        <Heading level="h2" id="usage" title="사용법" />
        <CodeBlock code={`import { Component } from '@hanui/react';`} />
      </Section>

      <Section>
        <Heading level="h2" id="api" title="API" />
        {/* Props 테이블 */}
      </Section>
    </>
  );
}
```

## 테스트 체크리스트

- [ ] TypeScript 타입 검사 통과 (`pnpm exec tsc --noEmit`)
- [ ] 빌드 성공 (`pnpm build`)
- [ ] 접근성 검사 (axe-core)
- [ ] 키보드 네비게이션 테스트
- [ ] 반응형 디자인 확인
- [ ] 다크모드 지원 (해당되는 경우)

## 커밋 메시지 규칙

```
feat(component): 새 기능 추가
fix(component): 버그 수정
docs(component): 문서 업데이트
refactor(component): 코드 리팩토링
chore: 기타 작업
```

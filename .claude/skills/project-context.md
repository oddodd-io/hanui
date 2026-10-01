# HANUI 프로젝트 컨텍스트

> 이 스킬은 대화 시작 시 자동으로 활성화되어 HANUI 프로젝트의 핵심 컨텍스트를 제공합니다.

## 프로젝트 정의

**HANUI = 중소기업을 위한 KRDS 기반 프론트엔드 컴포넌트 라이브러리**

```
전자정부프레임워크 (eGovFrame)
└─ 백엔드 표준 프레임워크 (Spring, 공통컴포넌트)

HANUI
└─ 프론트엔드 컴포넌트 표준 (React/Vue, KRDS, 접근성)
```

## 3가지 핵심 가치

### 1. KRDS 2.2 준수

- 한국 정부 디자인 시스템 100% 준수
- 디자인 토큰 (색상, 타이포그래피, 간격) 내장
- 공공 웹사이트 디자인 가이드라인 자동 적용

### 2. 접근성 내장 (KWCAG 2.2 / WCAG 2.1 AA)

- 모든 컴포넌트에 ARIA 속성 기본 탑재
- 키보드 네비게이션 완전 지원
- 스크린 리더 호환성
- 포커스 관리 자동화

### 3. 최적화

- Tree-shaking 지원 (ESM)
- 번들 사이즈 최소화
- React 18+ 최적화
- shadcn/ui 방식 (복사-붙여넣기)

## Monorepo 구조

```
hanui/
├── packages/
│   ├── react/          # @hanui/react (v0.2.0) - 55+ 컴포넌트
│   ├── vue/            # @hanui/vue (v0.2.0) - Vue 3 컴포넌트 (KRDS 리소스 기반)
│   ├── cli/            # @hanui/cli (v0.3.15) - CLI 도구
│   ├── registry/       # 컴포넌트 레지스트리
│   ├── core/           # 공통 유틸리티
│   └── create-hanui-app/
└── apps/
    └── docs/           # Next.js 15 문서 사이트 (hanui.io)
```

## 기술 스택

- **빌드**: Turborepo + pnpm workspace
- **언어**: TypeScript 5.7
- **UI Primitives**: Radix UI
- **스타일**: Tailwind CSS 4.1
- **Variants**: class-variance-authority (CVA)

## 개발 시 핵심 원칙

### 1. 복사-붙여넣기 우선 (shadcn/ui 방식)

```bash
# ✅ 이 방식
npx hanui add button
# → 프로젝트에 직접 복사, 완전한 커스터마이징 가능

# ❌ 이 방식 아님
npm install @hanui/react
# → node_modules 의존, 커스터마이징 어려움
```

### 2. KRDS 디자인 토큰 사용 필수

```tsx
// ✅ Good
'bg-krds-primary-60';
'text-krds-gray-90';
'p-krds-4';

// ❌ Bad
'bg-blue-600';
'text-gray-900';
'p-4';
```

### 3. 접근성 우선

모든 컴포넌트는 기본적으로:

```tsx
<button
  role="button"
  aria-disabled={disabled}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') onClick?.(e);
  }}
  className="focus-visible:ring-2 focus-visible:ring-krds-primary-60"
/>
```

### 4. 파일 명명 규칙

```
React: kebab-case.tsx
  ✅ button.tsx, alert-dialog.tsx
  ❌ Button.tsx, AlertDialog.tsx

Vue: PascalCase.vue
  ✅ Button.vue, AlertDialog.vue
  ❌ button.vue, alert-dialog.vue
```

## 컴포넌트 구조 템플릿

### React

```tsx
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// 1. Variants (CVA) - KRDS 토큰 사용
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-krds-primary-60',
  {
    variants: {
      variant: {
        default: 'bg-krds-gray-90 text-white hover:bg-krds-gray-80',
        primary: 'bg-krds-primary-60 text-white hover:bg-krds-primary-70',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-6 text-base',
        lg: 'h-13 px-8 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

// 2. Props Interface
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

// 3. Component (forwardRef)
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
```

## 새 컴포넌트 추가 워크플로우

```
1. 컴포넌트 파일 생성
   packages/react/src/components/tooltip.tsx

2. index.ts에 export 추가
   packages/react/src/index.ts

3. 레지스트리 등록
   packages/registry/src/react/tooltip.json

4. 문서 페이지 생성
   apps/docs/src/app/docs/components/tooltip/page.tsx

5. 타입 체크 및 빌드
   pnpm --filter @hanui/react exec tsc --noEmit
   pnpm --filter @hanui/react build
```

## 접근성 체크리스트

모든 컴포넌트는 다음을 포함해야 함:

- [ ] ARIA 속성 (role, aria-label, aria-disabled 등)
- [ ] 키보드 네비게이션 (Enter, Space, Escape, Arrow)
- [ ] 포커스 스타일 (focus-visible:ring-2)
- [ ] 색상 대비 4.5:1 이상
- [ ] 스크린 리더 호환성

## 커밋 메시지 규칙

```bash
feat(component): 새 기능 추가
fix(component): 버그 수정
docs(component): 문서 업데이트
refactor(component): 코드 리팩토링
chore: 기타 작업
```

## 상세 문서 참조

더 자세한 정보가 필요할 때:

- **전체 개요**: `.claude/project-overview.md`
- **아키텍처**: `.claude/architecture.md`
- **개발 가이드**: `.claude/development-guide.md`

## 자주 사용하는 명령어

```bash
# 개발 서버
pnpm dev:docs

# 빌드
pnpm build

# 특정 패키지 빌드
pnpm --filter @hanui/react build

# 타입 체크
pnpm --filter @hanui/react exec tsc --noEmit

# CLI 로컬 테스트
pnpm hanui add button
```

---

**핵심 요약**: HANUI는 중소기업이 KRDS 준수 + 접근성 AA + 최적화된 공공 웹사이트를 쉽게 만들 수 있도록 돕는 프론트엔드 컴포넌트 라이브러리입니다.

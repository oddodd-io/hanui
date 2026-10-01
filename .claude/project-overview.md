# HANUI 프로젝트 개요

## 프로젝트 정의

**HANUI**는 중소기업을 위한 **KRDS 기반 프론트엔드 컴포넌트 라이브러리**입니다.

전자정부프레임워크(eGovFrame)가 백엔드 표준 프레임워크라면, HANUI는 **프론트엔드 컴포넌트의 표준**을 제공합니다.

## 핵심 가치

### 1. KRDS 2.2 준수

- 한국 정부 디자인 시스템 100% 준수
- 디자인 토큰 (색상, 타이포그래피, 간격) 내장
- 공공 웹사이트 디자인 가이드라인 자동 적용

### 2. 접근성 내장 (KWCAG 2.2 / WCAG 2.1 AA)

- 모든 컴포넌트에 ARIA 속성 기본 탑재
- 키보드 네비게이션 완전 지원
- 스크린 리더 호환성
- 포커스 관리 자동화
- 색상 대비 4.5:1 이상 보장

### 3. 최적화

- Tree-shaking 지원 (ESM)
- 번들 사이즈 최소화
- React 18+ 최적화
- 다크모드 지원
- 반응형 디자인 자동 적용

## 프로젝트 포지셔닝

```
┌─────────────────────────────────────────────────────┐
│  공공/중소기업 웹 애플리케이션                        │
├─────────────────────────────────────────────────────┤
│  Frontend (HANUI)          │  Backend (eGovFrame)   │
│  - React/Vue 컴포넌트       │  - Spring 기반         │
│  - KRDS 2.2 디자인          │  - 공통 컴포넌트       │
│  - 접근성 AA 등급           │  - 표준 프레임워크     │
│  - UI/UX 표준화            │  - 개발 프레임워크     │
└─────────────────────────────────────────────────────┘
```

## 대상 사용자

1. **중소기업 개발팀**
   - 적은 인력으로 KRDS 준수 웹사이트 개발
   - 접근성 인증 요구사항 자동 충족

2. **공공기관 웹 개발팀**
   - KRDS 가이드라인 숙지 시간 단축
   - 컴포넌트 처음부터 개발 불필요

3. **에이전시/SI 업체**
   - 프로젝트 초기 셋업 시간 단축
   - 일관된 디자인 시스템 적용

## Monorepo 구조

```
hanui/
├── packages/
│   ├── react/              # @hanui/react (v0.2.0)
│   │   ├── src/
│   │   │   ├── components/  # 55+ 컴포넌트
│   │   │   ├── hooks/       # React hooks
│   │   │   ├── lib/         # 유틸리티
│   │   │   └── variables.css # KRDS 디자인 토큰
│   │   └── package.json
│   │
│   ├── vue/                # @hanui/vue (v0.2.0)
│   │   ├── src/
│   │   │   ├── components/  # Vue 3 컴포넌트
│   │   │   └── composables/ # Vue composables
│   │   └── package.json
│   │
│   ├── cli/                # @hanui/cli (v0.3.15)
│   │   ├── src/
│   │   │   ├── commands/    # CLI 명령어
│   │   │   ├── utils/       # 유틸리티
│   │   │   └── templates/   # 프로젝트 템플릿
│   │   └── package.json
│   │
│   ├── registry/           # @hanui/registry
│   │   └── src/
│   │       ├── react/       # React 컴포넌트 레지스트리
│   │       └── vue/         # Vue 컴포넌트 레지스트리
│   │
│   ├── core/               # @hanui/core
│   │   └── src/            # 공통 유틸리티 및 타입
│   │
│   └── create-hanui-app/   # create-hanui-app
│       └── src/            # 프로젝트 생성 CLI
│
└── apps/
    └── docs/               # 문서 사이트 (hanui.io)
        ├── src/
        │   ├── app/         # Next.js 15 App Router
        │   ├── components/  # 문서 컴포넌트
        │   └── content/     # MDX 콘텐츠
        └── package.json
```

## 패키지 정보

| 패키지           | 버전    | 역할                                         | 상태       |
| ---------------- | ------- | -------------------------------------------- | ---------- |
| @hanui/react     | v0.2.0  | React 컴포넌트 라이브러리                    | ✅ 배포    |
| @hanui/vue       | v0.2.0  | Vue 3 컴포넌트 라이브러리 (KRDS 리소스 기반) | 🚧 Preview |
| @hanui/cli       | v0.3.15 | CLI 설치 도구                                | ✅ 배포    |
| @hanui/registry  | -       | 컴포넌트 레지스트리                          | 내부       |
| @hanui/core      | -       | 공통 유틸리티                                | 내부       |
| create-hanui-app | -       | 프로젝트 생성 CLI                            | ✅ 배포    |
| docs             | -       | 문서 사이트                                  | ✅ 운영    |

## 기술 스택

### 빌드 시스템

- **Monorepo**: Turborepo + pnpm workspace
- **패키지 매니저**: pnpm 10.17.1
- **Node**: >=20.0.0
- **버전 관리**: Changesets

### React 라이브러리

- **빌드**: Vite 6
- **언어**: TypeScript 5.7
- **UI Primitives**: Radix UI
- **스타일링**: Tailwind CSS 4.1
- **Variants**: class-variance-authority (CVA)

### Vue 라이브러리

- **빌드**: Vite 6
- **언어**: TypeScript 5.7
- **UI Primitives**: Radix Vue
- **스타일링**: Tailwind CSS 4.1

### 문서 사이트

- **프레임워크**: Next.js 15 (App Router)
- **콘텐츠**: MDX
- **배포**: Vercel
- **URL**: https://hanui.io

### CLI

- **빌드**: tsup
- **프롬프트**: prompts
- **파일 복사**: fs-extra
- **실행**: execa

## 컴포넌트 현황 (55+)

### Form (12개)

Button, Input, Textarea, Select, Radio, Checkbox, Switch, Combobox, Slider, FileUpload, FormField, Label

### Data Display (10개)

Card, Badge, Table, DataTable, List, Image, Code, Skeleton, Progress, Spinner

### Feedback (5개)

Modal, AlertDialog, Toast, Alert, Tooltip

### Navigation (11개)

Tabs, TabBars, Breadcrumb, Pagination, SkipLink, SideNavigation, InPageNavigation, MegaMenu, NavigationMenu, DropdownMenu, Link

### Layout (10개)

Container, Stack, Flex, Grid, SimpleGrid, Center, Wrap, AspectRatio, Box, Header, Footer, Masthead, Identifier

### Typography (6개)

Display, Heading, Body, Label, Section, SectionHeader

### Overlay (1개)

Accordion

## 개발 환경 설정

### 필수 설치

```bash
# Node 20+ 설치 (nvm 사용 권장)
nvm install 20
nvm use 20

# pnpm 설치
npm install -g pnpm@10.17.1

# 의존성 설치
pnpm install
```

### 개발 서버 실행

```bash
# 모든 패키지 개발 모드
pnpm dev

# 문서 사이트만 실행
pnpm dev:docs

# 특정 패키지 개발 모드
pnpm --filter @hanui/react dev
pnpm --filter @hanui/vue dev
```

### 빌드

```bash
# 모든 패키지 빌드
pnpm build

# CLI만 빌드
pnpm build:cli

# 특정 패키지 빌드
pnpm --filter @hanui/react build
```

### 테스트

```bash
# TypeScript 타입 체크
pnpm --filter @hanui/react exec tsc --noEmit

# Lint
pnpm lint

# Format
pnpm format
```

## 개발 워크플로우

### 1. 새 컴포넌트 추가

```bash
# 1. 컴포넌트 파일 생성
packages/react/src/components/new-component.tsx

# 2. index.ts에 export 추가
packages/react/src/index.ts

# 3. 레지스트리에 등록
packages/registry/src/react/new-component.json

# 4. 문서 페이지 생성
apps/docs/src/app/docs/components/new-component/page.tsx

# 5. 타입 체크 및 빌드
pnpm --filter @hanui/react build
```

### 2. 버전 관리 (Changesets)

```bash
# 변경사항 기록
pnpm changeset

# 버전 업데이트
pnpm version-packages

# 배포 (CI/CD에서 자동)
pnpm release
```

### 3. 커밋 규칙

```
feat(component): 새 기능 추가
fix(component): 버그 수정
docs(component): 문서 업데이트
refactor(component): 코드 리팩토링
chore: 기타 작업
```

## 배포

### NPM 패키지

- **@hanui/react**: https://www.npmjs.com/package/@hanui/react
- **@hanui/cli**: https://www.npmjs.com/package/@hanui/cli
- 자동 배포: GitHub Actions (Changesets)

### 문서 사이트

- **URL**: https://hanui.io
- **호스팅**: Vercel
- 자동 배포: main 브랜치 푸시 시

## 로드맵

- [x] **v0.1** - 핵심 컴포넌트, CLI 도구
- [x] **v0.2** - 55+ 컴포넌트, Vue 지원 Preview
- [ ] **v0.3** - Form 검증, Toast 개선, 스타터 킷
- [ ] **v0.4** - DataGrid, 차트 컴포넌트
- [ ] **v1.0** - 전체 KRDS 컴포넌트, Figma 플러그인

## 주요 차별점

| 항목           | HANUI                   | 일반 UI 라이브러리   |
| -------------- | ----------------------- | -------------------- |
| KRDS 준수      | ✅ 100%                 | ❌ 없음              |
| 접근성         | ✅ AA 등급 내장         | ⚠️ 수동 구현 필요    |
| 공공 웹 최적화 | ✅ 전자정부 환경 최적화 | ❌ 일반 웹만         |
| 한글 지원      | ✅ 완벽 지원            | ⚠️ 부분 지원         |
| 중소기업 지원  | ✅ 최소 러닝커브        | ⚠️ 높은 진입장벽     |
| 복사-붙여넣기  | ✅ shadcn/ui 방식       | ❌ node_modules 의존 |

## 참고 링크

- **문서**: https://hanui.io
- **GitHub**: https://github.com/hanui-o/hanui
- **NPM**: https://www.npmjs.com/package/@hanui/react
- **KRDS 가이드**: https://www.gov.kr/portal/krds
- **전자정부프레임워크**: https://www.egovframe.go.kr

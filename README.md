<div align="center">

# HANUI

### Copy-paste React components for Korean Government Design System (KRDS)

**shadcn/ui style** component library with KRDS 2.2 compliance and accessibility built-in

<br />

[![npm version](https://img.shields.io/npm/v/@hanui/react.svg?style=flat-square&color=0052CC)](https://www.npmjs.com/package/@hanui/react)
[![license](https://img.shields.io/npm/l/@hanui/react.svg?style=flat-square)](./LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/hanui-o/hanui?style=flat-square)](https://github.com/hanui-o/hanui/stargazers)

[Documentation](https://hanui.io) · [Components](https://hanui.io/components) · [Quick Start](https://hanui.io/docs/quick-start)

</div>

<br />

## What is HANUI?

HANUI is a React component library that implements **KRDS (Korean Government Design System)**. Like [shadcn/ui](https://ui.shadcn.com), components are copied into your project - you own the code.

```bash
npx hanui init
npx hanui add button input modal
```

**Built with:**

- **React 18+** + **TypeScript**
- **Tailwind CSS** for styling
- **Radix UI** for accessible primitives
- **class-variance-authority** for type-safe variants

**Features:**

- KRDS 2.2 design tokens (colors, typography, spacing)
- KWCAG 2.2 / WCAG 2.1 AA accessibility
- 55+ production-ready components
- Dark mode support
- Responsive typography (mobile ↔ desktop)

<br />

---

<br />

<div align="center">

### KRDS 컴포넌트, 그냥 가져다 쓰세요

KRDS 2.2 표준, 접근성은 이미 챙겼습니다

</div>

<br />

## 왜 HANUI인가?

공공기관 웹 개발, 이런 경험 있으시죠?

- 📄 KRDS 가이드 수백 페이지 읽다가 퇴근
- 🔧 매번 컴포넌트 처음부터 개발
- ♿️ 접근성 요구사항 일일이 구현
- 🎨 디자인 시스템과 코드 불일치

**HANUI는 이 문제를 해결합니다.**

```bash
npx hanui add button input card
```

끝. KRDS 준수 + 접근성 AA 등급 컴포넌트가 프로젝트에 추가됩니다.

<br />

## 특징

|                      |                                      |
| -------------------- | ------------------------------------ |
| 🎨 **KRDS 2.2 준수** | 공공 웹 디자인 시스템 100% 준수      |
| ♿️ **WCAG 2.1 AA**   | 웹접근성 인증 대응, 스크린 리더 지원 |
| 🛠️ **CLI 도구**      | shadcn/ui 스타일 간편 설치           |
| 📦 **TypeScript**    | 완전한 타입 지원                     |
| 🎯 **Tree-shaking**  | ESM 지원, 최적화된 번들              |
| 🎨 **Tailwind CSS**  | 쉬운 커스터마이징                    |

<br />

## 빠른 시작

### 새 프로젝트

```bash
npx create-hanui-app my-project
cd my-project
npm run dev
```

### 기존 프로젝트

```bash
# 초기화
npx hanui init

# 컴포넌트 추가
npx hanui add button input card modal table
```

### 사용 예제

```tsx
import { Button, Input, Card } from '@/components/hanui';

export default function LoginForm() {
  return (
    <Card>
      <Input label="이메일" type="email" />
      <Input label="비밀번호" type="password" />
      <Button>로그인</Button>
    </Card>
  );
}
```

<br />

## 컴포넌트 (55+)

**Form**
`Button` `Input` `Textarea` `Select` `Radio` `Checkbox` `Switch` `Combobox` `Slider` `FileUpload` `FormField` `Label`

**Data Display**
`Card` `Badge` `Table` `DataTable` `List` `Image` `Code` `Skeleton` `Progress` `Spinner`

**Feedback**
`Modal` `AlertDialog` `Toast` `Alert` `Tooltip`

**Navigation**
`Tabs` `TabBars` `Breadcrumb` `Pagination` `SkipLink` `SideNavigation` `InPageNavigation` `MegaMenu` `NavigationMenu` `DropdownMenu` `Link`

**Layout**
`Container` `Stack` `Flex` `Grid` `SimpleGrid` `Center` `Wrap` `AspectRatio` `Box` `Header` `Footer` `Masthead` `Identifier`

**Typography**
`Display` `Heading` `Body` `Label` `Section` `SectionHeader`

**Overlay**
`Accordion`

→ [전체 컴포넌트 보기](https://hanui.io/components)

<br />

## 문서

- **시작하기**: [설치](https://hanui.io/docs/installation) · [빠른 시작](https://hanui.io/docs/quick-start)
- **컴포넌트**: [전체 목록](https://hanui.io/components)
- **디자인 시스템**: [Typography](https://hanui.io/design-system/typography) · [Colors](https://hanui.io/design-system/colors) · [Spacing](https://hanui.io/design-system/spacing)

<br />

## 로드맵

- [x] **v0.1** - 핵심 컴포넌트, CLI 도구
- [ ] **v0.2** - Form 검증, Toast, 스타터 킷
- [ ] **v0.3** - DataGrid, 차트, 다국어
- [ ] **v1.0** - 전체 KRDS 컴포넌트, Figma 플러그인

<br />

## 기여하기

HANUI는 오픈소스입니다. 기여를 환영합니다!

- 🐛 [버그 제보](https://github.com/hanui-o/hanui/issues/new)
- 💡 [기능 제안](https://github.com/hanui-o/hanui/discussions/new)
- ⭐ [Star 주기](https://github.com/hanui-o/hanui)

<br />

## 커뮤니티

- [GitHub Discussions](https://github.com/hanui-o/hanui/discussions)
- [Dev Blog](https://dev.to/hanui)
- [Velog (한국어)](https://velog.io/@hanui/)
- Email: mia@hanui.io

<br />

## 라이선스

MIT © [hanui-o](https://github.com/hanui-o)

---

<div align="center">

**Build better public websites with HANUI 🇰🇷**

[Get Started](https://hanui.io/docs/quick-start) · [Components](https://hanui.io/components) · [Star ⭐](https://github.com/hanui-o/hanui)

</div>

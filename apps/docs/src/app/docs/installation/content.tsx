'use client';

import { useState } from 'react';
import { Check, Sparkles, Zap } from 'lucide-react';

// Docs layout components
import {
  PageSection as Section,
  Heading,
  Subsection,
  PageNavigation,
} from '@/components/content';

// UI components - from @hanui/react
import {
  List,
  ListItem,
  Code,
  Body,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Alert,
  Button,
} from '@hanui/react';

import { useFramework } from '@/components/FrameworkTabs';

const AI_PROMPT_REACT = `HANUI 라이브러리를 설치하고 모든 컴포넌트를 추가해줘.

1. CLI 설치: npm install -D @hanui/cli
2. 초기화: npx hanui init -y
3. 모든 컴포넌트 설치: npx hanui add all -y

설치 후 사용법:
import { Button } from '@/components/hanui/button';
import { Card } from '@/components/hanui/card';

공식 문서: https://react.hanui.io/docs/installation`;

const AI_PROMPT_VUE = `HANUI Vue 라이브러리를 설치하고 모든 컴포넌트를 추가해줘.

1. CLI 설치: npm install -D @hanui/cli
2. 초기화: npx hanui init -f vue -y (Vue/Nuxt 자동 감지)
3. 모든 컴포넌트 설치: npx hanui add all -f vue -y

설치 후 사용법:
<script setup lang="ts">
import Button from '@/components/hanui/Button.vue';
import Card from '@/components/hanui/Card.vue';
</script>

<template>
  <Card>
    <h2>환영합니다!</h2>
    <Button variant="primary">시작하기</Button>
  </Card>
</template>

공식 문서: https://vue.hanui.io/docs/installation`;

export default function InstallationPage() {
  const [aiCopied, setAiCopied] = useState(false);
  const { framework } = useFramework();

  const currentPrompt = framework === 'vue' ? AI_PROMPT_VUE : AI_PROMPT_REACT;

  const handleAiCopy = async () => {
    await navigator.clipboard.writeText(currentPrompt);
    setAiCopied(true);
    setTimeout(() => setAiCopied(false), 2000);
  };

  return (
    <>
      <Heading
        level="h1"
        title="Installation"
        description="HANUI는 shadcn/ui처럼 소스 코드를 복사하는 방식입니다. CLI로 초기 설정하고, 필요한 컴포넌트만 가져가세요."
      />

      {/* AI로 설치하기 - 맨 위 */}
      <Section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-violet-600" />
              AI로 설치하기
            </CardTitle>
            <CardDescription>
              Cursor, Claude, ChatGPT 등 AI에게 아래 프롬프트를 붙여넣으세요.
            </CardDescription>
            <Button
              onClick={handleAiCopy}
              variant="secondary"
              iconLeft={
                aiCopied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )
              }
              className="bg-gradient-to-r from-violet-500 to-purple-500 text-white border-transparent hover:from-violet-600 hover:to-purple-600 absolute top-6 right-6"
            >
              {aiCopied ? '복사됨!' : 'AI 프롬프트 복사'}
            </Button>
          </CardHeader>
          <CardBody>
            <Code variant="block" language="text" className="text-sm">
              {currentPrompt}
            </Code>
          </CardBody>
        </Card>
      </Section>

      {/* 패키지 정보 */}
      <Section>
        <Heading level="h2" id="package" title="패키지" />
        <Card className="p-4">
          {framework === 'react' ? (
            <>
              <Body className="font-semibold mb-2">@hanui/cli (React)</Body>
              <Body className="text-sm text-krds-gray-60 mb-3">
                Next.js, Vite + React 등 React 기반 프로젝트용
              </Body>
              <Code variant="block" language="bash" showLineNumbers={false}>
                npm install -D @hanui/cli
              </Code>
            </>
          ) : (
            <>
              <Body className="font-semibold mb-2">@hanui/cli (Vue)</Body>
              <Body className="text-sm text-krds-gray-60 mb-3">
                Nuxt, Vite + Vue 등 Vue 3 기반 프로젝트용 (Vue/Nuxt 자동 감지)
              </Body>
              <Code variant="block" language="bash" showLineNumbers={false}>
                npm install -D @hanui/cli
              </Code>
            </>
          )}
        </Card>
      </Section>

      {/* 요구사항 */}
      <Section>
        <Heading level="h2" id="prerequisites" title="요구사항" />

        <div className="grid gap-4 md:grid-cols-3 mt-4">
          <Card className="p-4">
            <Body className="font-semibold mb-2">
              {framework === 'react' ? 'React' : 'Vue'}
            </Body>
            <Code>{framework === 'react' ? '18.0.0' : '3.3.0'}</Code> 이상
          </Card>
          <Card className="p-4">
            <Body className="font-semibold mb-2">Node.js</Body>
            <Code>18.0.0</Code> 이상
          </Card>
          <Card className="p-4">
            <Body className="font-semibold mb-2">Tailwind CSS</Body>
            <Code>v4.x</Code> (권장) 또는 <Code>v3.x</Code>
          </Card>
        </div>

        <Alert
          variant="success"
          className="mt-6"
          title="Tailwind CSS 자동 설치"
        >
          <Code>hanui init</Code> 실행 시 Tailwind CSS가 없으면{' '}
          <strong>자동으로 설치</strong>됩니다. 별도 설치 불필요!
        </Alert>

        <Alert variant="info" className="mt-4" title="v0.3.0 업데이트 (2024년)">
          <Body className="text-sm">
            번들 크기 최적화로 <strong>70% 크기 감소</strong>! CLI가 필요한 peer
            dependencies를 자동으로 설치합니다.
            <Code className="ml-2">hanui add button</Code> 실행 시 Radix UI 등
            필수 패키지가 자동으로 추가됩니다.
          </Body>
        </Alert>
      </Section>

      {/* 단계별 설치 */}
      <Section>
        <Heading level="h2" id="step-by-step" title="단계별 설치" />

        {framework === 'react' ? (
          <>
            <Subsection level="h3">
              <Heading level="h3" title="Step 1. CLI 설치" />
              <Body className="mb-4 text-krds-gray-70">
                프로젝트에 CLI를 devDependency로 설치합니다:
              </Body>

              <Tabs defaultValue="npm" className="mt-4">
                <TabsList>
                  <TabsTrigger value="npm">npm</TabsTrigger>
                  <TabsTrigger value="pnpm">pnpm</TabsTrigger>
                  <TabsTrigger value="yarn">yarn</TabsTrigger>
                </TabsList>
                <TabsContent value="npm">
                  <Code variant="block" language="bash" showLineNumbers={false}>
                    npm install -D @hanui/cli
                  </Code>
                </TabsContent>
                <TabsContent value="pnpm">
                  <Code variant="block" language="bash" showLineNumbers={false}>
                    pnpm add -D @hanui/cli
                  </Code>
                </TabsContent>
                <TabsContent value="yarn">
                  <Code variant="block" language="bash" showLineNumbers={false}>
                    yarn add -D @hanui/cli
                  </Code>
                </TabsContent>
              </Tabs>
            </Subsection>

            <Subsection level="h3">
              <Heading level="h3" title="Step 2. 프로젝트 초기화" />
              <Body className="mb-4 text-krds-gray-70">
                CLI를 실행하면 KRDS 디자인 토큰이 자동으로 설정됩니다:
              </Body>

              <Code variant="block" language="bash" showLineNumbers={false}>
                npx hanui init
              </Code>

              <Alert variant="info" className="mt-4" title="init이 하는 일">
                <List variant="check" className="mt-2 text-sm">
                  <ListItem>
                    <Code>variables.css</Code> 생성 — KRDS CSS 변수
                  </ListItem>
                  <ListItem>
                    <Code>globals.css</Code> 수정 — CSS 변수 import 추가
                  </ListItem>
                  <ListItem>
                    <Code>components/hanui</Code> 디렉토리 생성
                  </ListItem>
                </List>
              </Alert>
            </Subsection>

            <Subsection level="h3">
              <Heading level="h3" title="Step 3. 컴포넌트 추가" />
              <Body className="mb-4 text-krds-gray-70">
                필요한 컴포넌트를 추가합니다:
              </Body>

              <Code variant="block" language="bash" showLineNumbers={false}>
                {`# 단일 컴포넌트
npx hanui add button

# 여러 컴포넌트
npx hanui add button card input

# 모든 컴포넌트 (50+)
npx hanui add all`}
              </Code>

              <Alert variant="info" className="mt-4" title="자동 의존성 설치">
                <Body className="text-sm">
                  CLI가 각 컴포넌트의 필수 패키지를{' '}
                  <strong>자동으로 설치</strong>합니다. Radix UI, lucide-react
                  등 peer dependencies를 수동 설치할 필요 없습니다.
                </Body>
              </Alert>
            </Subsection>

            <Subsection level="h3">
              <Heading level="h3" title="Step 4. 사용하기" />
              <Code variant="block" language="tsx" showLineNumbers={false}>
                {`import { Button } from '@/components/hanui/button';
import { Card, CardBody } from '@/components/hanui/card';

export default function Page() {
  return (
    <Card>
      <CardBody>
        <h2>Welcome to HANUI</h2>
        <Button variant="primary">시작하기</Button>
      </CardBody>
    </Card>
  )
}`}
              </Code>
            </Subsection>
          </>
        ) : (
          <>
            <Subsection level="h3">
              <Heading level="h3" title="Step 1. CLI 설치" />
              <Body className="mb-4 text-krds-gray-70">
                프로젝트에 CLI를 devDependency로 설치합니다 (Vue/Nuxt 자동
                감지):
              </Body>

              <Tabs defaultValue="npm" className="mt-4">
                <TabsList>
                  <TabsTrigger value="npm">npm</TabsTrigger>
                  <TabsTrigger value="pnpm">pnpm</TabsTrigger>
                  <TabsTrigger value="yarn">yarn</TabsTrigger>
                </TabsList>
                <TabsContent value="npm">
                  <Code variant="block" language="bash" showLineNumbers={false}>
                    npm install -D @hanui/cli
                  </Code>
                </TabsContent>
                <TabsContent value="pnpm">
                  <Code variant="block" language="bash" showLineNumbers={false}>
                    pnpm add -D @hanui/cli
                  </Code>
                </TabsContent>
                <TabsContent value="yarn">
                  <Code variant="block" language="bash" showLineNumbers={false}>
                    yarn add -D @hanui/cli
                  </Code>
                </TabsContent>
              </Tabs>
            </Subsection>

            <Subsection level="h3">
              <Heading level="h3" title="Step 2. 프로젝트 초기화" />
              <Body className="mb-4 text-krds-gray-70">
                CLI를 실행하면 KRDS 디자인 토큰이 자동으로 설정됩니다 (Vue/Nuxt
                자동 감지):
              </Body>

              <Code variant="block" language="bash" showLineNumbers={false}>
                npx hanui init
              </Code>

              <Alert variant="info" className="mt-4" title="init이 하는 일">
                <List variant="check" className="mt-2 text-sm">
                  <ListItem>
                    <Code>variables.css</Code> 생성 — KRDS CSS 변수
                  </ListItem>
                  <ListItem>
                    <Code>main.css</Code> 수정 — CSS 변수 import 추가
                  </ListItem>
                  <ListItem>
                    <Code>hanui.preset.js</Code> 생성 — Tailwind preset
                  </ListItem>
                  <ListItem>
                    <Code>components/hanui</Code> 디렉토리 생성
                  </ListItem>
                </List>
              </Alert>
            </Subsection>

            <Subsection level="h3">
              <Heading level="h3" title="Step 3. 컴포넌트 추가" />
              <Body className="mb-4 text-krds-gray-70">
                필요한 컴포넌트를 추가합니다:
              </Body>

              <Code variant="block" language="bash" showLineNumbers={false}>
                {`# 단일 컴포넌트
npx hanui add button

# 여러 컴포넌트
npx hanui add button card input

# 모든 컴포넌트 (125+)
npx hanui add all`}
              </Code>

              <Alert variant="info" className="mt-4" title="자동 의존성 설치">
                <Body className="text-sm">
                  CLI가 각 컴포넌트의 필수 패키지를{' '}
                  <strong>자동으로 설치</strong>합니다. lucide-vue-next 등 peer
                  dependencies를 수동 설치할 필요 없습니다.
                </Body>
              </Alert>
            </Subsection>

            <Subsection level="h3">
              <Heading level="h3" title="Step 4. 사용하기" />
              <Body className="mb-4 text-krds-gray-70">
                컴포넌트를 import하여 사용합니다:
              </Body>

              <Code variant="block" language="vue" showLineNumbers={false}>
                {`<script setup lang="ts">
import Button from '@/components/hanui/Button.vue';
import Card from '@/components/hanui/Card.vue';
import CardBody from '@/components/hanui/CardBody.vue';
</script>

<template>
  <Card>
    <CardBody>
      <h2>Welcome to HANUI</h2>
      <Button variant="primary">시작하기</Button>
    </CardBody>
  </Card>
</template>`}
              </Code>
            </Subsection>

            <Alert variant="success" className="mt-4" title="Vue CLI 특징">
              <List variant="check" className="mt-2 text-sm">
                <ListItem>
                  <strong>125+ 컴포넌트</strong> — React 버전과 동일한 API
                </ListItem>
                <ListItem>
                  <strong>소스 코드 복사</strong> — 자유롭게 커스터마이징 가능
                </ListItem>
                <ListItem>
                  <strong>Composition API</strong> — TypeScript 완벽 지원
                </ListItem>
              </List>
            </Alert>
          </>
        )}
      </Section>

      {/* init이 생성하는 파일 */}
      <Section>
        <Heading level="h2" id="init-files" title="init이 생성하는 파일" />

        <Subsection level="h3">
          <Heading level="h3" title="variables.css" />
          <Body className="mb-4 text-krds-gray-70">
            KRDS 디자인 시스템의 CSS 변수가 정의되어 있습니다:
          </Body>

          <Code variant="block" language="css" showLineNumbers={false}>
            {`/* variables.css - KRDS 디자인 토큰 */
:root {
  /* Primary Colors */
  --krds-color-light-primary-50: #256ef4;
  --krds-color-light-primary-60: #0b50d0;

  /* Gray Scale */
  --krds-color-light-gray-0: #ffffff;
  --krds-color-light-gray-90: #1e2124;

  /* Semantic Colors */
  --krds-primary-base: var(--krds-color-light-primary-50);
  --krds-danger-base: var(--krds-color-light-danger-50);
}

.dark {
  /* 다크 모드 자동 지원 */
  --krds-color-light-gray-0: #000000;
  --krds-color-light-gray-90: #e6e8ea;
}`}
          </Code>
        </Subsection>

        <Subsection level="h3">
          <Heading
            level="h3"
            title={framework === 'react' ? 'globals.css' : 'main.css'}
          />
          <Body className="mb-4 text-krds-gray-70">
            기존{' '}
            <Code>{framework === 'react' ? 'globals.css' : 'main.css'}</Code>에
            CSS 변수 import가 추가됩니다:
          </Body>

          <Tabs defaultValue="v4" className="mt-4">
            <TabsList>
              <TabsTrigger value="v4">Tailwind v4</TabsTrigger>
              <TabsTrigger value="v3">Tailwind v3</TabsTrigger>
            </TabsList>
            <TabsContent value="v4">
              <Code variant="block" language="css" showLineNumbers={false}>
                {`/* ${framework === 'react' ? 'globals.css' : 'main.css'} - Tailwind v4 */
@import "tailwindcss";

@theme {
  /* KRDS 색상 - Tailwind v4는 실제 값이 필요합니다 (var() 참조 불가) */
  --color-krds-primary-50: #256ef4;
  --color-krds-primary-60: #0b50d0;
  --color-krds-gray-5: #f4f5f6;
  --color-krds-gray-90: #1e2124;
  /* ... 전체 색상은 init이 자동 생성합니다 */
}`}
              </Code>
              <Alert
                variant="warning"
                className="mt-4"
                title="Tailwind v4 주의"
              >
                <Code>@theme</Code> 블록 내에서는 <Code>var()</Code> 참조가
                작동하지 않습니다. 실제 HEX 값을 사용해야 합니다.{' '}
                <Code>hanui init</Code>이 자동으로 처리합니다.
              </Alert>
            </TabsContent>
            <TabsContent value="v3">
              <Code variant="block" language="css" showLineNumbers={false}>
                {`/* ${framework === 'react' ? 'globals.css' : 'main.css'} - Tailwind v3 */
@import './styles/variables.css';

@tailwind base;
@tailwind components;
@tailwind utilities;`}
              </Code>
            </TabsContent>
          </Tabs>
        </Subsection>
      </Section>

      {/* 프레임워크별 경로 */}
      <Section>
        <Heading
          level="h2"
          id="framework-paths"
          title="프레임워크별 파일 경로"
        />

        <div className="overflow-x-auto mt-6">
          <table className="w-full border-collapse border border-krds-gray-20 text-sm">
            <thead>
              <tr className="bg-krds-gray-5">
                <th className="border border-krds-gray-20 px-4 py-2 text-left">
                  프레임워크
                </th>
                <th className="border border-krds-gray-20 px-4 py-2 text-left">
                  컴포넌트 경로
                </th>
                <th className="border border-krds-gray-20 px-4 py-2 text-left">
                  CSS 경로
                </th>
              </tr>
            </thead>
            <tbody>
              {framework === 'react' ? (
                <>
                  <tr>
                    <td className="border border-krds-gray-20 px-4 py-2">
                      Next.js (App Router + src)
                    </td>
                    <td className="border border-krds-gray-20 px-4 py-2">
                      <Code>src/components/hanui/</Code>
                    </td>
                    <td className="border border-krds-gray-20 px-4 py-2">
                      <Code>src/app/globals.css</Code>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-krds-gray-20 px-4 py-2">
                      Next.js (App Router)
                    </td>
                    <td className="border border-krds-gray-20 px-4 py-2">
                      <Code>components/hanui/</Code>
                    </td>
                    <td className="border border-krds-gray-20 px-4 py-2">
                      <Code>app/globals.css</Code>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-krds-gray-20 px-4 py-2">
                      Vite + React
                    </td>
                    <td className="border border-krds-gray-20 px-4 py-2">
                      <Code>src/components/hanui/</Code>
                    </td>
                    <td className="border border-krds-gray-20 px-4 py-2">
                      <Code>src/index.css</Code>
                    </td>
                  </tr>
                </>
              ) : (
                <>
                  <tr>
                    <td className="border border-krds-gray-20 px-4 py-2">
                      Nuxt 3
                    </td>
                    <td className="border border-krds-gray-20 px-4 py-2">
                      <Code>components/hanui/</Code>
                    </td>
                    <td className="border border-krds-gray-20 px-4 py-2">
                      <Code>assets/css/main.css</Code>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-krds-gray-20 px-4 py-2">
                      Vite + Vue
                    </td>
                    <td className="border border-krds-gray-20 px-4 py-2">
                      <Code>src/components/hanui/</Code>
                    </td>
                    <td className="border border-krds-gray-20 px-4 py-2">
                      <Code>src/style.css</Code>
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 브랜드 커스터마이징 */}
      <Section>
        <Heading
          level="h2"
          id="customization"
          title="브랜드 색상 커스터마이징"
        />
        <Body className="mb-4 text-krds-gray-70">
          조직의 브랜드 색상을 적용하려면 CSS 변수를 오버라이드하세요:
        </Body>

        <Code variant="block" language="css" showLineNumbers={false}>
          {`/* ${framework === 'react' ? 'globals.css' : 'main.css'} 하단에 추가 */
:root {
  /* Primary 색상을 조직 브랜드 컬러로 변경 */
  --krds-color-light-primary-50: #0066cc;
  --krds-color-light-primary-60: #0052a3;
}`}
        </Code>
      </Section>

      {/* 문제 해결 */}
      <Section>
        <Heading level="h2" id="troubleshooting" title="문제 해결" />

        <Subsection level="h3">
          <Heading level="h3" title="KRDS 색상 클래스가 적용되지 않음" />
          <List className="mt-4">
            <ListItem>
              <Code>npx hanui init</Code>을 실행했는지 확인
            </ListItem>
            <ListItem>
              v3:{' '}
              <Code>tailwind.config.{framework === 'react' ? 'ts' : 'js'}</Code>
              에 <Code>hanUIPreset</Code>이 추가되어 있는지 확인
            </ListItem>
            <ListItem>개발 서버를 재시작</ListItem>
          </List>
        </Subsection>

        <Subsection level="h3">
          <Heading level="h3" title="컴포넌트 import 에러" />
          <Body className="mb-4 text-krds-gray-70">
            <Code>@/components/hanui</Code> 경로를 인식하지 못하는 경우:
          </Body>

          <Code
            variant="block"
            language="json"
            className="mt-4"
            showLineNumbers={false}
          >
            {`// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}`}
          </Code>
        </Subsection>

        <Subsection level="h3">
          <Heading level="h3" title="Peer dependencies 에러 (수동 설치)" />
          <Body className="mb-4 text-krds-gray-70">
            CLI가 자동 설치에 실패한 경우, 수동으로 설치할 수 있습니다:
          </Body>

          {framework === 'react' ? (
            <Code variant="block" language="bash" showLineNumbers={false}>
              {`# React - 필수 패키지
pnpm add @radix-ui/react-slot lucide-react tailwindcss

# 특정 컴포넌트 사용 시 (예시)
pnpm add @radix-ui/react-dialog  # Modal
pnpm add @radix-ui/react-dropdown-menu  # DropdownMenu
pnpm add @tanstack/react-table  # DataTable
pnpm add swiper  # Carousel`}
            </Code>
          ) : (
            <Code variant="block" language="bash" showLineNumbers={false}>
              {`# Vue - 필수 패키지
pnpm add lucide-vue-next tailwindcss

# 특정 컴포넌트 사용 시 (예시)
pnpm add swiper  # Carousel`}
            </Code>
          )}
        </Subsection>

        <Subsection level="h3">
          <Heading level="h3" title="다크 모드가 작동하지 않음" />
          <Code variant="block" language="html" showLineNumbers={false}>
            {`<!-- html 태그에 dark 클래스 추가 -->
<html class="dark">
  ...
</html>`}
          </Code>
        </Subsection>
      </Section>

      {/* Next Steps */}
      <PageNavigation
        prev={{ title: 'Introduction', href: '/docs/introduction' }}
        next={{ title: 'Quick Start', href: '/docs/quick-start' }}
      />
    </>
  );
}

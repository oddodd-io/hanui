'use client';

import { useState } from 'react';
import { Check, Sparkles, Zap } from 'lucide-react';

// Docs layout components
import {
  PageSection as Section,
  Heading,
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
  Alert,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
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

공식 문서: https://react.hanui.io/docs/quick-start`;

const AI_PROMPT_VUE = `HANUI Vue 라이브러리를 설치하고 모든 컴포넌트를 추가해줘.

1. CLI 설치: npm install -D @hanui/cli
2. 초기화: npx hanui init -y (Vue/Nuxt 자동 감지)
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

공식 문서: https://vue.hanui.io/docs/quick-start`;

export default function QuickStartPage() {
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
        title="Quick Start"
        description="HANUI를 가장 빠르게 시작하는 방법. 1분이면 충분합니다!"
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

      {/* 사전 요구사항 */}
      <Section>
        <Heading level="h2" id="prerequisites" title="사전 요구사항" />
        <Body className="mb-4 text-krds-gray-70">
          HANUI는 Tailwind CSS 기반입니다.
        </Body>

        <Alert variant="success" title="Tailwind CSS 자동 설치">
          <Code variant="inline">hanui init</Code> 실행 시 Tailwind CSS가 없으면{' '}
          <strong>자동으로 설치</strong>됩니다. 별도 설치 불필요!
        </Alert>

        <Alert variant="info" className="mt-4" title="v0.3.0 - 번들 최적화">
          <Body className="text-sm">
            CLI가 필요한 의존성을 자동으로 설치합니다. 번들 크기{' '}
            <strong>70% 감소</strong> 달성!
          </Body>
        </Alert>
      </Section>

      {/* 한번에 설치 */}
      <Section>
        <Heading level="h2" id="one-liner" title="한번에 설치" />

        {framework === 'react' ? (
          <>
            <Body className="mb-4 text-krds-gray-70">
              CLI 설치, 초기화, 기본 컴포넌트 추가를 한 줄로 실행합니다:
            </Body>

            <Tabs defaultValue="npm" className="mt-4">
              <TabsList>
                <TabsTrigger value="npm">npm</TabsTrigger>
                <TabsTrigger value="pnpm">pnpm</TabsTrigger>
                <TabsTrigger value="yarn">yarn</TabsTrigger>
              </TabsList>
              <TabsContent value="npm">
                <Code variant="block" language="bash" showLineNumbers={false}>
                  npm install -D @hanui/cli && npx hanui init -y && npx hanui
                  add button card input -y
                </Code>
              </TabsContent>
              <TabsContent value="pnpm">
                <Code variant="block" language="bash" showLineNumbers={false}>
                  pnpm add -D @hanui/cli && pnpm hanui init -y && pnpm hanui add
                  button card input -y
                </Code>
              </TabsContent>
              <TabsContent value="yarn">
                <Code variant="block" language="bash" showLineNumbers={false}>
                  yarn add -D @hanui/cli && yarn hanui init -y && yarn hanui add
                  button card input -y
                </Code>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <>
            <Body className="mb-4 text-krds-gray-70">
              CLI 설치, 초기화, 기본 컴포넌트 추가를 한 줄로 실행합니다:
            </Body>

            <Tabs defaultValue="npm" className="mt-4">
              <TabsList>
                <TabsTrigger value="npm">npm</TabsTrigger>
                <TabsTrigger value="pnpm">pnpm</TabsTrigger>
                <TabsTrigger value="yarn">yarn</TabsTrigger>
              </TabsList>
              <TabsContent value="npm">
                <Code variant="block" language="bash" showLineNumbers={false}>
                  npm install -D @hanui/cli && npx hanui init -f vue -y && npx
                  hanui add button card input -f vue -y
                </Code>
              </TabsContent>
              <TabsContent value="pnpm">
                <Code variant="block" language="bash" showLineNumbers={false}>
                  pnpm add -D @hanui/cli && pnpm hanui init -f vue -y && pnpm
                  hanui add button card input -f vue -y
                </Code>
              </TabsContent>
              <TabsContent value="yarn">
                <Code variant="block" language="bash" showLineNumbers={false}>
                  yarn add -D @hanui/cli && yarn hanui init -f vue -y && yarn
                  hanui add button card input -f vue -y
                </Code>
              </TabsContent>
            </Tabs>
          </>
        )}
      </Section>

      {/* 모든 컴포넌트 설치 */}
      <Section>
        <Heading level="h2" id="install-all" title="모든 컴포넌트 설치" />

        {framework === 'react' ? (
          <>
            <Body className="mb-4 text-krds-gray-70">
              50+ 컴포넌트를 한번에 설치합니다. 의존성도 자동으로 처리됩니다:
            </Body>

            <Tabs defaultValue="npm" className="mt-4">
              <TabsList>
                <TabsTrigger value="npm">npm</TabsTrigger>
                <TabsTrigger value="pnpm">pnpm</TabsTrigger>
                <TabsTrigger value="yarn">yarn</TabsTrigger>
              </TabsList>
              <TabsContent value="npm">
                <Code variant="block" language="bash" showLineNumbers={false}>
                  npx hanui add all -y
                </Code>
              </TabsContent>
              <TabsContent value="pnpm">
                <Code variant="block" language="bash" showLineNumbers={false}>
                  pnpm hanui add all -y
                </Code>
              </TabsContent>
              <TabsContent value="yarn">
                <Code variant="block" language="bash" showLineNumbers={false}>
                  yarn hanui add all -y
                </Code>
              </TabsContent>
            </Tabs>

            <Alert variant="success" className="mt-4" title="추천">
              처음 시작하신다면 <Code>hanui add all</Code>로 모든 컴포넌트를
              설치하세요. 필요 없는 컴포넌트는 나중에 삭제하면 됩니다.
            </Alert>
          </>
        ) : (
          <>
            <Body className="mb-4 text-krds-gray-70">
              125+ 컴포넌트를 한번에 설치합니다. 의존성도 자동으로 처리됩니다:
            </Body>

            <Tabs defaultValue="npm" className="mt-4">
              <TabsList>
                <TabsTrigger value="npm">npm</TabsTrigger>
                <TabsTrigger value="pnpm">pnpm</TabsTrigger>
                <TabsTrigger value="yarn">yarn</TabsTrigger>
              </TabsList>
              <TabsContent value="npm">
                <Code variant="block" language="bash" showLineNumbers={false}>
                  npx hanui add all -f vue -y
                </Code>
              </TabsContent>
              <TabsContent value="pnpm">
                <Code variant="block" language="bash" showLineNumbers={false}>
                  pnpm hanui add all -f vue -y
                </Code>
              </TabsContent>
              <TabsContent value="yarn">
                <Code variant="block" language="bash" showLineNumbers={false}>
                  yarn hanui add all -f vue -y
                </Code>
              </TabsContent>
            </Tabs>

            <Alert variant="success" className="mt-4" title="추천">
              처음 시작하신다면 <Code>hanui add all -f vue</Code>로 모든
              컴포넌트를 설치하세요. 필요 없는 컴포넌트는 나중에 삭제하면
              됩니다.
            </Alert>
          </>
        )}
      </Section>

      {/* 바로 사용하기 */}
      <Section>
        <Heading level="h2" id="usage" title="바로 사용하기" />
        <Body className="mb-4 text-krds-gray-70">
          설치가 완료되면 바로 컴포넌트를 import하여 사용할 수 있습니다:
        </Body>

        {framework === 'react' ? (
          <Code variant="block" language="tsx" showLineNumbers={false}>
            {`import { Button } from '@/components/hanui/button';
import { Card } from '@/components/hanui/card';

export default function Page() {
  return (
    <Card>
      <h2>환영합니다!</h2>
      <Button variant="primary">시작하기</Button>
    </Card>
  )
}`}
          </Code>
        ) : (
          <Code variant="block" language="vue" showLineNumbers={false}>
            {`<script setup lang="ts">
import Button from '@/components/hanui/Button.vue';
import Card from '@/components/hanui/Card.vue';
</script>

<template>
  <Card>
    <h2>환영합니다!</h2>
    <Button variant="primary">시작하기</Button>
  </Card>
</template>`}
          </Code>
        )}
      </Section>

      {/* 왜 이 방식인가요? */}
      <Section>
        <Heading
          level="h2"
          id="why-copy"
          title="왜 소스 코드 복사 방식인가요?"
        />
        <Card variant="filled">
          <List variant="check" className="text-krds-gray-90">
            <ListItem>
              <strong>완전한 소유권:</strong> 컴포넌트 코드가 프로젝트 안에 있어
              자유롭게 수정 가능
            </ListItem>
            <ListItem>
              <strong>버전 의존성 없음:</strong> 패키지 업데이트로 인한 Breaking
              Change 걱정 불필요
            </ListItem>
            <ListItem>
              <strong>번들 최적화:</strong> 사용하는 컴포넌트만 포함되어 번들
              크기 최소화
            </ListItem>
            <ListItem>
              <strong>프로젝트 맞춤:</strong> 디자인 시스템에 맞게 자유롭게 변경
            </ListItem>
          </List>
        </Card>
      </Section>

      {/* Page Navigation */}
      <PageNavigation
        prev={{ title: 'Installation', href: '/docs/installation' }}
      />
    </>
  );
}

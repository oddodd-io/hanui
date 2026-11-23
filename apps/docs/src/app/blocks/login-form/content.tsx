'use client';

import {
  PageSection as Section,
  Heading,
  Subsection,
} from '@/components/content';
import { Installation } from '@/components/content/Installation';
import { FrameworkCodeBlock } from '@/components/content/FrameworkCodeBlock';
import { ComponentPreview } from '@/components/content/ComponentPreview';
import {
  Code,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@hanui/react';
import { LoginForm } from '@hanui/react';

export default function LoginFormPage() {
  return (
    <>
      <Heading
        level="h1"
        title="Login Form"
        description="아이디, 비밀번호, 아이디 저장, 자동 로그인을 포함한 로그인 폼 블록"
      />

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="api">API 레퍼런스</TabsTrigger>
        </TabsList>

        {/* 개요 탭 */}
        <TabsContent value="overview">
          <Section level="h2">
            <Heading
              level="h2"
              id="overview"
              title="개요"
              className="sr-only"
            />
            <ComponentPreview>
              <LoginForm
                onSubmit={(data) => {
                  alert(JSON.stringify(data, null, 2));
                }}
              />
            </ComponentPreview>
            <FrameworkCodeBlock
              reactCode={`import { LoginForm } from '@/components/hanui/blocks/login-form'

<LoginForm
  onSubmit={(data) => {
    console.log(data);
    // { username, password, rememberMe, autoLogin }
  }}
/>`}
            />
          </Section>

          <Section level="h2">
            <Installation componentName="login-form" />
          </Section>

          <Section level="h2">
            <Heading level="h2" id="usage" title="사용법" />
            <FrameworkCodeBlock
              reactCode={`import { LoginForm } from '@/components/hanui/blocks/login-form'

export default function LoginPage() {
  const handleLogin = (data: {
    username: string;
    password: string;
    rememberMe: boolean;
    autoLogin: boolean;
  }) => {
    // API 호출 등 로그인 로직
    console.log(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoginForm onSubmit={handleLogin} />
    </div>
  );
}`}
            />
          </Section>

          <Section level="h2">
            <Heading level="h2" id="customization" title="커스터마이징" />

            <Subsection>
              <Heading level="h3" id="custom-title" title="제목/설명 변경" />
              <ComponentPreview>
                <LoginForm
                  title="관리자 로그인"
                  description="관리자 계정으로 로그인하세요."
                />
              </ComponentPreview>
              <FrameworkCodeBlock
                reactCode={`<LoginForm
  title="관리자 로그인"
  description="관리자 계정으로 로그인하세요."
/>`}
              />
            </Subsection>

            <Subsection>
              <Heading level="h3" id="hide-links" title="링크 숨기기" />
              <ComponentPreview>
                <LoginForm showForgotPassword={false} showSignupLink={false} />
              </ComponentPreview>
              <FrameworkCodeBlock
                reactCode={`<LoginForm
  showForgotPassword={false}
  showSignupLink={false}
/>`}
              />
            </Subsection>
          </Section>
        </TabsContent>

        {/* API 레퍼런스 탭 */}
        <TabsContent value="api">
          <Section level="h2">
            <Heading level="h2" id="props" title="Props" />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Default</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Code>onSubmit</Code>
                  </TableCell>
                  <TableCell>
                    <Code>(data) =&gt; void</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    폼 제출 핸들러. data에 username, password, rememberMe,
                    autoLogin 포함
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>className</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>추가 CSS 클래스</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>title</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>
                    <Code>&quot;로그인&quot;</Code>
                  </TableCell>
                  <TableCell>카드 제목</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>description</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>
                    <Code>&quot;계정에 로그인하여...&quot;</Code>
                  </TableCell>
                  <TableCell>카드 설명 텍스트</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>showForgotPassword</Code>
                  </TableCell>
                  <TableCell>
                    <Code>boolean</Code>
                  </TableCell>
                  <TableCell>
                    <Code>true</Code>
                  </TableCell>
                  <TableCell>비밀번호 찾기 링크 표시 여부</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>showSignupLink</Code>
                  </TableCell>
                  <TableCell>
                    <Code>boolean</Code>
                  </TableCell>
                  <TableCell>
                    <Code>true</Code>
                  </TableCell>
                  <TableCell>회원가입 링크 표시 여부</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>forgotPasswordHref</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>
                    <Code>&quot;/forgot-password&quot;</Code>
                  </TableCell>
                  <TableCell>비밀번호 찾기 링크 경로</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>signupHref</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>
                    <Code>&quot;/signup&quot;</Code>
                  </TableCell>
                  <TableCell>회원가입 링크 경로</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Section>
        </TabsContent>
      </Tabs>
    </>
  );
}

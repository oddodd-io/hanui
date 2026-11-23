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
import { GovLogin } from '@hanui/react';

export default function GovLoginPage() {
  return (
    <>
      <Heading
        level="h1"
        title="Gov Login"
        description="정부24 스타일 로그인 블록 (아이디/간편인증/공동인증서)"
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
              <GovLogin
                onLogin={(data) => {
                  alert(JSON.stringify(data, null, 2));
                }}
                onSimpleAuth={(method) => {
                  alert(method + ' 인증');
                }}
                onCertAuth={() => {
                  alert('공동인증서');
                }}
              />
            </ComponentPreview>
            <FrameworkCodeBlock
              reactCode={`import { GovLogin } from '@/components/hanui/blocks/gov-login'

<GovLogin
  onLogin={(data) => {
    console.log(data);
    // { username, password }
  }}
  onSimpleAuth={(method) => {
    console.log(method + ' 인증');
  }}
  onCertAuth={() => {
    console.log('공동인증서');
  }}
/>`}
            />
          </Section>

          <Section level="h2">
            <Installation componentName="gov-login" />
          </Section>

          <Section level="h2">
            <Heading level="h2" id="usage" title="사용법" />
            <FrameworkCodeBlock
              reactCode={`import { GovLogin } from '@/components/hanui/blocks/gov-login'

export default function LoginPage() {
  const handleLogin = (data: {
    username: string;
    password: string;
  }) => {
    // 아이디/비밀번호 로그인 API 호출
    console.log(data);
  };

  const handleSimpleAuth = (method: string) => {
    // 간편인증 팝업 열기
    console.log(method + ' 인증 시작');
  };

  const handleCertAuth = () => {
    // 공동인증서 프로그램 실행
    console.log('공동인증서 인증 시작');
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <GovLogin
        onLogin={handleLogin}
        onSimpleAuth={handleSimpleAuth}
        onCertAuth={handleCertAuth}
      />
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
                <GovLogin
                  title="시스템 로그인"
                  description="공공기관 통합 시스템에 로그인하세요."
                />
              </ComponentPreview>
              <FrameworkCodeBlock
                reactCode={`<GovLogin
  title="시스템 로그인"
  description="공공기관 통합 시스템에 로그인하세요."
/>`}
              />
            </Subsection>

            <Subsection>
              <Heading
                level="h3"
                id="custom-auth-methods"
                title="간편인증 방법 변경"
              />
              <ComponentPreview>
                <GovLogin simpleAuthMethods={['카카오', '네이버', 'PASS']} />
              </ComponentPreview>
              <FrameworkCodeBlock
                reactCode={`<GovLogin
  simpleAuthMethods={['카카오', '네이버', 'PASS']}
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
                    <Code>onLogin</Code>
                  </TableCell>
                  <TableCell>
                    <Code>(data) =&gt; void</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    아이디/비밀번호 로그인 핸들러. data에 username, password
                    포함
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>onSimpleAuth</Code>
                  </TableCell>
                  <TableCell>
                    <Code>(method: string) =&gt; void</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    간편인증 선택 핸들러. method에 인증 방법명 전달
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>onCertAuth</Code>
                  </TableCell>
                  <TableCell>
                    <Code>() =&gt; void</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>공동인증서 인증 핸들러</TableCell>
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
                    <Code>&quot;정부24 계정으로...&quot;</Code>
                  </TableCell>
                  <TableCell>카드 설명 텍스트</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>simpleAuthMethods</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string[]</Code>
                  </TableCell>
                  <TableCell>
                    <Code>[&quot;카카오톡&quot;, &quot;네이버&quot;, ...]</Code>
                  </TableCell>
                  <TableCell>간편인증 방법 목록</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Section>
        </TabsContent>
      </Tabs>
    </>
  );
}

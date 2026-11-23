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
import { AccountRecovery } from '@hanui/react';

export default function ForgotPasswordPage() {
  return (
    <>
      <Heading
        level="h1"
        title="Account Recovery"
        description="아이디 찾기와 비밀번호 찾기를 탭으로 제공하는 계정 찾기 블록"
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
              <AccountRecovery
                onFindId={(data) => {
                  alert(JSON.stringify(data, null, 2));
                }}
                onResetPassword={(data) => {
                  alert(JSON.stringify(data, null, 2));
                }}
              />
            </ComponentPreview>
            <FrameworkCodeBlock
              reactCode={`import { AccountRecovery } from '@/components/hanui/blocks/forgot-password'

<AccountRecovery
  onFindId={(data) => {
    console.log(data);
    // { name, phone }
  }}
  onResetPassword={(data) => {
    console.log(data);
    // { email }
  }}
/>`}
            />
          </Section>

          <Section level="h2">
            <Installation componentName="forgot-password" />
          </Section>

          <Section level="h2">
            <Heading level="h2" id="usage" title="사용법" />
            <FrameworkCodeBlock
              reactCode={`import { AccountRecovery } from '@/components/hanui/blocks/forgot-password'

export default function AccountRecoveryPage() {
  const handleFindId = (data: {
    name: string;
    phone: string;
  }) => {
    // API 호출 등 아이디 찾기 로직
    console.log(data);
  };

  const handleResetPassword = (data: {
    email: string;
  }) => {
    // API 호출 등 비밀번호 재설정 이메일 발송 로직
    console.log(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <AccountRecovery
        onFindId={handleFindId}
        onResetPassword={handleResetPassword}
      />
    </div>
  );
}`}
            />
          </Section>

          <Section level="h2">
            <Heading level="h2" id="customization" title="커스터마이징" />

            <Subsection>
              <Heading level="h3" id="default-tab" title="기본 탭 변경" />
              <ComponentPreview>
                <AccountRecovery
                  defaultTab="reset-password"
                  title="비밀번호 찾기"
                />
              </ComponentPreview>
              <FrameworkCodeBlock
                reactCode={`<AccountRecovery
  defaultTab="reset-password"
  title="비밀번호 찾기"
/>`}
              />
            </Subsection>

            <Subsection>
              <Heading level="h3" id="hide-links" title="링크 숨기기" />
              <ComponentPreview>
                <AccountRecovery
                  showBackToLogin={false}
                  showSignupLink={false}
                />
              </ComponentPreview>
              <FrameworkCodeBlock
                reactCode={`<AccountRecovery
  showBackToLogin={false}
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
                    <Code>onFindId</Code>
                  </TableCell>
                  <TableCell>
                    <Code>{`(data: { name, phone }) => void`}</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>아이디 찾기 폼 제출 핸들러</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>onResetPassword</Code>
                  </TableCell>
                  <TableCell>
                    <Code>{`(data: { email }) => void`}</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>비밀번호 찾기 폼 제출 핸들러</TableCell>
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
                    <Code>{`"계정 찾기"`}</Code>
                  </TableCell>
                  <TableCell>카드 제목</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>defaultTab</Code>
                  </TableCell>
                  <TableCell>
                    <Code>{`"find-id" | "reset-password"`}</Code>
                  </TableCell>
                  <TableCell>
                    <Code>{`"find-id"`}</Code>
                  </TableCell>
                  <TableCell>기본 활성 탭</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>showBackToLogin</Code>
                  </TableCell>
                  <TableCell>
                    <Code>boolean</Code>
                  </TableCell>
                  <TableCell>
                    <Code>true</Code>
                  </TableCell>
                  <TableCell>로그인으로 돌아가기 링크 표시 여부</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>loginHref</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>
                    <Code>{`"/login"`}</Code>
                  </TableCell>
                  <TableCell>로그인 링크 경로</TableCell>
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
                    <Code>signupHref</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>
                    <Code>{`"/signup"`}</Code>
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

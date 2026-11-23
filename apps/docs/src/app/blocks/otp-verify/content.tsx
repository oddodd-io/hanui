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
import { OtpVerify } from '@hanui/react';

export default function OtpVerifyPage() {
  return (
    <>
      <Heading
        level="h1"
        title="OTP Verify"
        description="인증번호를 입력하는 OTP 인증 블록"
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
              <OtpVerify
                onSubmit={(data) => {
                  alert(JSON.stringify(data, null, 2));
                }}
              />
            </ComponentPreview>
            <FrameworkCodeBlock
              reactCode={`import { OtpVerify } from '@/components/hanui/blocks/otp-verify'

<OtpVerify
  onSubmit={(data) => {
    console.log(data);
    // { code }
  }}
/>`}
            />
          </Section>

          <Section level="h2">
            <Installation componentName="otp-verify" />
          </Section>

          <Section level="h2">
            <Heading level="h2" id="usage" title="사용법" />
            <FrameworkCodeBlock
              reactCode={`import { OtpVerify } from '@/components/hanui/blocks/otp-verify'

export default function OtpVerifyPage() {
  const handleVerify = (data: {
    code: string;
  }) => {
    // API 호출 등 OTP 인증 로직
    console.log(data);
  };

  const handleResend = () => {
    // 인증번호 재발송 로직
    console.log('resend');
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <OtpVerify
        onSubmit={handleVerify}
        onResend={handleResend}
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
                <OtpVerify
                  title="이메일 인증"
                  description="이메일로 전송된 6자리 코드를 입력하세요."
                />
              </ComponentPreview>
              <FrameworkCodeBlock
                reactCode={`<OtpVerify
  title="이메일 인증"
  description="이메일로 전송된 6자리 코드를 입력하세요."
/>`}
              />
            </Subsection>

            <Subsection>
              <Heading
                level="h3"
                id="custom-code-length"
                title="인증번호 자릿수 변경"
              />
              <ComponentPreview>
                <OtpVerify codeLength={4} />
              </ComponentPreview>
              <FrameworkCodeBlock
                reactCode={`<OtpVerify
  codeLength={4}
/>`}
              />
            </Subsection>

            <Subsection>
              <Heading level="h3" id="hide-resend" title="재발송 버튼 숨기기" />
              <ComponentPreview>
                <OtpVerify showResend={false} />
              </ComponentPreview>
              <FrameworkCodeBlock
                reactCode={`<OtpVerify
  showResend={false}
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
                  <TableCell>폼 제출 핸들러. data에 code 포함</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>onResend</Code>
                  </TableCell>
                  <TableCell>
                    <Code>() =&gt; void</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>인증번호 재발송 핸들러</TableCell>
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
                    <Code>&quot;인증번호 확인&quot;</Code>
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
                    <Code>&quot;전송된 인증번호를...&quot;</Code>
                  </TableCell>
                  <TableCell>카드 설명 텍스트</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>codeLength</Code>
                  </TableCell>
                  <TableCell>
                    <Code>number</Code>
                  </TableCell>
                  <TableCell>
                    <Code>6</Code>
                  </TableCell>
                  <TableCell>인증번호 자릿수</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>showResend</Code>
                  </TableCell>
                  <TableCell>
                    <Code>boolean</Code>
                  </TableCell>
                  <TableCell>
                    <Code>true</Code>
                  </TableCell>
                  <TableCell>인증번호 재발송 버튼 표시 여부</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Section>
        </TabsContent>
      </Tabs>
    </>
  );
}

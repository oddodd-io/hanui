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
import { ContactForm } from '@hanui/react';

export default function ContactFormPage() {
  return (
    <>
      <Heading
        level="h1"
        title="Contact Form"
        description="이름, 이메일, 제목, 내용을 입력하는 문의 폼 블록"
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
              <ContactForm
                onSubmit={(data) => {
                  alert(JSON.stringify(data, null, 2));
                }}
              />
            </ComponentPreview>
            <FrameworkCodeBlock
              reactCode={`import { ContactForm } from '@/components/hanui/blocks/contact-form'

<ContactForm
  onSubmit={(data) => {
    console.log(data);
    // { name, email, subject, message }
  }}
/>`}
            />
          </Section>

          <Section level="h2">
            <Installation componentName="contact-form" />
          </Section>

          <Section level="h2">
            <Heading level="h2" id="usage" title="사용법" />
            <FrameworkCodeBlock
              reactCode={`import { ContactForm } from '@/components/hanui/blocks/contact-form'

export default function ContactPage() {
  const handleContact = (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => {
    // 문의 전송 API 호출 등 로직
    console.log(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <ContactForm onSubmit={handleContact} />
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
                <ContactForm
                  title="기술 지원 요청"
                  description="기술적인 문의사항을 남겨주세요."
                />
              </ComponentPreview>
              <FrameworkCodeBlock
                reactCode={`<ContactForm
  title="기술 지원 요청"
  description="기술적인 문의사항을 남겨주세요."
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
                    폼 제출 핸들러. data에 name, email, subject, message 포함
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
                    <Code>&quot;문의하기&quot;</Code>
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
                    <Code>&quot;문의사항을 남겨주세요.&quot;</Code>
                  </TableCell>
                  <TableCell>카드 설명 텍스트</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Section>
        </TabsContent>
      </Tabs>
    </>
  );
}

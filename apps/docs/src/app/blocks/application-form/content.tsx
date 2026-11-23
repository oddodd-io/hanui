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
import { ApplicationForm } from '@hanui/react';

export default function ApplicationFormPage() {
  return (
    <>
      <Heading
        level="h1"
        title="Application Form"
        description="신청인 정보와 첨부파일을 포함한 민원신청 폼 블록"
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
              <ApplicationForm
                onSubmit={(data) => {
                  alert(JSON.stringify(data, null, 2));
                }}
              />
            </ComponentPreview>
            <FrameworkCodeBlock
              reactCode={`import { ApplicationForm } from '@/components/hanui/blocks/application-form'

<ApplicationForm
  onSubmit={(data) => {
    console.log(data);
    // { name, phone, email, applicationType, content, files }
  }}
/>`}
            />
          </Section>

          <Section level="h2">
            <Installation componentName="application-form" />
          </Section>

          <Section level="h2">
            <Heading level="h2" id="usage" title="사용법" />
            <FrameworkCodeBlock
              reactCode={`import { ApplicationForm } from '@/components/hanui/blocks/application-form'

export default function ApplicationPage() {
  const handleSubmit = (data: {
    name: string;
    phone: string;
    email: string;
    applicationType: string;
    content: string;
    files: File[];
  }) => {
    // 민원 신청 API 호출
    console.log(data);
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <ApplicationForm onSubmit={handleSubmit} />
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
                <ApplicationForm
                  title="복지 서비스 신청"
                  description="복지 서비스를 신청합니다. 필수 항목을 모두 입력해주세요."
                />
              </ComponentPreview>
              <FrameworkCodeBlock
                reactCode={`<ApplicationForm
  title="복지 서비스 신청"
  description="복지 서비스를 신청합니다. 필수 항목을 모두 입력해주세요."
/>`}
              />
            </Subsection>

            <Subsection>
              <Heading level="h3" id="custom-types" title="신청 유형 변경" />
              <ComponentPreview>
                <ApplicationForm
                  applicationTypes={[
                    '주민등록',
                    '인감증명',
                    '가족관계',
                    '기타',
                  ]}
                />
              </ComponentPreview>
              <FrameworkCodeBlock
                reactCode={`<ApplicationForm
  applicationTypes={['주민등록', '인감증명', '가족관계', '기타']}
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
                    폼 제출 핸들러. data에 name, phone, email, applicationType,
                    content, files 포함
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
                    <Code>&quot;민원 신청&quot;</Code>
                  </TableCell>
                  <TableCell>폼 제목</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>description</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>
                    <Code>&quot;신청인 정보를 입력...&quot;</Code>
                  </TableCell>
                  <TableCell>폼 설명 텍스트</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>applicationTypes</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string[]</Code>
                  </TableCell>
                  <TableCell>
                    <Code>
                      [&quot;일반민원&quot;, &quot;건의사항&quot;, ...]
                    </Code>
                  </TableCell>
                  <TableCell>신청 유형 목록</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Section>
        </TabsContent>
      </Tabs>
    </>
  );
}

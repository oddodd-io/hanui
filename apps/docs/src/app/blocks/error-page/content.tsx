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
import { ErrorPage } from '@hanui/react';

export default function ErrorPagePage() {
  return (
    <>
      <Heading
        level="h1"
        title="Error Page"
        description="404, 500, 403 등 에러 페이지 블록"
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
              <ErrorPage
                code="404"
                onGoHome={() => alert('홈으로')}
                onGoBack={() => alert('뒤로가기')}
              />
            </ComponentPreview>
            <FrameworkCodeBlock
              reactCode={`import { ErrorPage } from '@/components/hanui/blocks/error-page'

<ErrorPage
  code="404"
  onGoHome={() => router.push('/')}
  onGoBack={() => router.back()}
/>`}
            />
          </Section>

          <Section level="h2">
            <Installation componentName="error-page" />
          </Section>

          <Section level="h2">
            <Heading level="h2" id="usage" title="사용법" />
            <FrameworkCodeBlock
              reactCode={`import { ErrorPage } from '@/components/hanui/blocks/error-page'

// app/not-found.tsx
export default function NotFound() {
  return (
    <ErrorPage
      code="404"
      onGoHome={() => window.location.href = '/'}
      onGoBack={() => window.history.back()}
    />
  );
}

// app/error.tsx
export default function Error() {
  return (
    <ErrorPage
      code="500"
      onGoHome={() => window.location.href = '/'}
      onGoBack={() => window.history.back()}
    />
  );
}`}
            />
          </Section>

          <Section level="h2">
            <Heading level="h2" id="customization" title="커스터마이징" />

            <Subsection>
              <Heading level="h3" id="error-500" title="500 에러" />
              <ComponentPreview>
                <ErrorPage code="500" />
              </ComponentPreview>
              <FrameworkCodeBlock reactCode={`<ErrorPage code="500" />`} />
            </Subsection>

            <Subsection>
              <Heading level="h3" id="custom-content" title="제목/설명 변경" />
              <ComponentPreview>
                <ErrorPage
                  code="403"
                  title="접근 권한이 없습니다"
                  description="이 페이지에 접근할 권한이 없습니다. 관리자에게 문의하세요."
                  homeLabel="메인으로"
                  backLabel="이전 페이지"
                />
              </ComponentPreview>
              <FrameworkCodeBlock
                reactCode={`<ErrorPage
  code="403"
  title="접근 권한이 없습니다"
  description="이 페이지에 접근할 권한이 없습니다. 관리자에게 문의하세요."
  homeLabel="메인으로"
  backLabel="이전 페이지"
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
                    <Code>code</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>
                    <Code>&quot;404&quot;</Code>
                  </TableCell>
                  <TableCell>에러 코드 (404, 500, 403 등)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>title</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>코드에 따라 자동 설정</TableCell>
                  <TableCell>에러 페이지 제목</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>description</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>코드에 따라 자동 설정</TableCell>
                  <TableCell>에러 페이지 설명 텍스트</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>homeLabel</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>
                    <Code>&quot;홈으로&quot;</Code>
                  </TableCell>
                  <TableCell>홈 버튼 텍스트</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>onGoHome</Code>
                  </TableCell>
                  <TableCell>
                    <Code>() =&gt; void</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>홈 버튼 클릭 핸들러</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>backLabel</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>
                    <Code>&quot;뒤로가기&quot;</Code>
                  </TableCell>
                  <TableCell>뒤로가기 버튼 텍스트</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>onGoBack</Code>
                  </TableCell>
                  <TableCell>
                    <Code>() =&gt; void</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>뒤로가기 버튼 클릭 핸들러</TableCell>
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
              </TableBody>
            </Table>
          </Section>
        </TabsContent>
      </Tabs>
    </>
  );
}

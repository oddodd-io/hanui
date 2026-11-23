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
import { EmptyState } from '@hanui/react';

export default function EmptyStatePage() {
  return (
    <>
      <Heading
        level="h1"
        title="Empty State"
        description="데이터가 없을 때 표시하는 빈 상태 블록"
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
              <EmptyState
                actionLabel="새로 추가"
                onAction={() => alert('새로 추가')}
                secondaryActionLabel="도움말"
                onSecondaryAction={() => alert('도움말')}
              />
            </ComponentPreview>
            <FrameworkCodeBlock
              reactCode={`import { EmptyState } from '@/components/hanui/blocks/empty-state'

<EmptyState
  actionLabel="새로 추가"
  onAction={() => console.log('새로 추가')}
  secondaryActionLabel="도움말"
  onSecondaryAction={() => console.log('도움말')}
/>`}
            />
          </Section>

          <Section level="h2">
            <Installation componentName="empty-state" />
          </Section>

          <Section level="h2">
            <Heading level="h2" id="usage" title="사용법" />
            <FrameworkCodeBlock
              reactCode={`import { EmptyState } from '@/components/hanui/blocks/empty-state'

export default function DataListPage() {
  const items = [];

  if (items.length === 0) {
    return (
      <EmptyState
        title="데이터가 없습니다"
        description="아직 등록된 데이터가 없습니다. 새로 추가해보세요."
        actionLabel="새로 추가"
        onAction={() => router.push('/create')}
      />
    );
  }

  return <DataList items={items} />;
}`}
            />
          </Section>

          <Section level="h2">
            <Heading level="h2" id="customization" title="커스터마이징" />

            <Subsection>
              <Heading level="h3" id="custom-content" title="제목/설명 변경" />
              <ComponentPreview>
                <EmptyState
                  title="검색 결과가 없습니다"
                  description="다른 검색어로 다시 시도해보세요."
                  actionLabel="검색 초기화"
                  onAction={() => alert('검색 초기화')}
                />
              </ComponentPreview>
              <FrameworkCodeBlock
                reactCode={`<EmptyState
  title="검색 결과가 없습니다"
  description="다른 검색어로 다시 시도해보세요."
  actionLabel="검색 초기화"
  onAction={() => console.log('검색 초기화')}
/>`}
              />
            </Subsection>

            <Subsection>
              <Heading level="h3" id="no-actions" title="액션 없이 사용" />
              <ComponentPreview>
                <EmptyState
                  title="알림이 없습니다"
                  description="새로운 알림이 도착하면 여기에 표시됩니다."
                />
              </ComponentPreview>
              <FrameworkCodeBlock
                reactCode={`<EmptyState
  title="알림이 없습니다"
  description="새로운 알림이 도착하면 여기에 표시됩니다."
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
                    <Code>title</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>
                    <Code>&quot;데이터가 없습니다&quot;</Code>
                  </TableCell>
                  <TableCell>빈 상태 제목</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>description</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>
                    <Code>&quot;아직 등록된 데이터가...&quot;</Code>
                  </TableCell>
                  <TableCell>빈 상태 설명 텍스트</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>icon</Code>
                  </TableCell>
                  <TableCell>
                    <Code>ReactNode</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>커스텀 아이콘 컴포넌트</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>actionLabel</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>주요 액션 버튼 텍스트</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>onAction</Code>
                  </TableCell>
                  <TableCell>
                    <Code>() =&gt; void</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>주요 액션 버튼 클릭 핸들러</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>secondaryActionLabel</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>보조 액션 버튼 텍스트</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>onSecondaryAction</Code>
                  </TableCell>
                  <TableCell>
                    <Code>() =&gt; void</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>보조 액션 버튼 클릭 핸들러</TableCell>
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

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
import { ServiceCardGrid } from '@hanui/react';

export default function ServiceCardGridPage() {
  return (
    <>
      <Heading
        level="h1"
        title="Service Card Grid"
        description="정부24 스타일 서비스 카드 그리드 블록"
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
              <ServiceCardGrid
                onCardClick={(id) => {
                  alert('서비스: ' + id);
                }}
              />
            </ComponentPreview>
            <FrameworkCodeBlock
              reactCode={`import { ServiceCardGrid } from '@/components/hanui/blocks/service-card-grid'

<ServiceCardGrid
  onCardClick={(id) => {
    console.log('서비스: ' + id);
  }}
/>`}
            />
          </Section>

          <Section level="h2">
            <Installation componentName="service-card-grid" />
          </Section>

          <Section level="h2">
            <Heading level="h2" id="usage" title="사용법" />
            <FrameworkCodeBlock
              reactCode={`import { ServiceCardGrid } from '@/components/hanui/blocks/service-card-grid'

const services = [
  {
    id: '1',
    title: '주민등록등본 발급',
    description: '주민등록등본을 온라인으로 발급받을 수 있습니다.',
    category: '민원',
  },
  {
    id: '2',
    title: '건강보험 자격확인',
    description: '건강보험 자격 및 보험료를 확인할 수 있습니다.',
    category: '복지',
  },
];

export default function ServicePage() {
  return (
    <ServiceCardGrid
      services={services}
      onCardClick={(id) => router.push(\`/service/\${id}\`)}
    />
  );
}`}
            />
          </Section>

          <Section level="h2">
            <Heading level="h2" id="customization" title="커스터마이징" />

            <Subsection>
              <Heading level="h3" id="columns" title="컬럼 수 변경" />
              <ComponentPreview>
                <ServiceCardGrid columns={2} />
              </ComponentPreview>
              <FrameworkCodeBlock
                reactCode={`<ServiceCardGrid columns={2} />`}
              />
            </Subsection>

            <Subsection>
              <Heading level="h3" id="four-columns" title="4컬럼 그리드" />
              <ComponentPreview>
                <ServiceCardGrid columns={4} />
              </ComponentPreview>
              <FrameworkCodeBlock
                reactCode={`<ServiceCardGrid columns={4} />`}
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
                    <Code>services</Code>
                  </TableCell>
                  <TableCell>
                    <Code>ServiceCardItem[]</Code>
                  </TableCell>
                  <TableCell>기본 샘플 데이터</TableCell>
                  <TableCell>
                    서비스 카드 데이터 배열. id, title, description, category
                    포함
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>onCardClick</Code>
                  </TableCell>
                  <TableCell>
                    <Code>(id: string) =&gt; void</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    카드 클릭 핸들러. 클릭된 서비스의 id 전달
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>columns</Code>
                  </TableCell>
                  <TableCell>
                    <Code>2 | 3 | 4</Code>
                  </TableCell>
                  <TableCell>
                    <Code>3</Code>
                  </TableCell>
                  <TableCell>그리드 컬럼 수</TableCell>
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

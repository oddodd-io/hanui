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
import { StatsCard } from '@hanui/react';

export default function StatsCardPage() {
  return (
    <>
      <Heading
        level="h1"
        title="Stats Card"
        description="숫자, 변화율을 표시하는 통계 카드 그리드 블록"
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
              <StatsCard />
            </ComponentPreview>
            <FrameworkCodeBlock
              reactCode={`import { StatsCard } from '@/components/hanui/blocks/stats-card'

<StatsCard />`}
            />
          </Section>

          <Section level="h2">
            <Installation componentName="stats-card" />
          </Section>

          <Section level="h2">
            <Heading level="h2" id="usage" title="사용법" />
            <FrameworkCodeBlock
              reactCode={`import { StatsCard } from '@/components/hanui/blocks/stats-card'

export default function DashboardPage() {
  const stats = [
    { label: '총 매출', value: '₩12,450,000', change: '+12.5%', trend: 'up' as const },
    { label: '신규 사용자', value: '1,234', change: '+8.2%', trend: 'up' as const },
    { label: '이탈률', value: '2.4%', change: '-0.5%', trend: 'down' as const },
    { label: '전환율', value: '3.6%', change: '+1.2%', trend: 'up' as const },
  ];

  return <StatsCard items={stats} columns={4} />;
}`}
            />
          </Section>

          <Section level="h2">
            <Heading level="h2" id="customization" title="커스터마이징" />

            <Subsection>
              <Heading level="h3" id="columns" title="컬럼 수 변경" />
              <ComponentPreview>
                <StatsCard columns={2} />
              </ComponentPreview>
              <FrameworkCodeBlock reactCode={`<StatsCard columns={2} />`} />
            </Subsection>

            <Subsection>
              <Heading level="h3" id="custom-items" title="커스텀 항목" />
              <ComponentPreview>
                <StatsCard
                  items={[
                    {
                      label: '방문자 수',
                      value: '45,231',
                      change: '+20.1%',
                      trend: 'up' as const,
                    },
                    {
                      label: '페이지뷰',
                      value: '128,430',
                      change: '+15.3%',
                      trend: 'up' as const,
                    },
                    {
                      label: '평균 체류시간',
                      value: '3분 42초',
                      change: '-2.1%',
                      trend: 'down' as const,
                    },
                  ]}
                  columns={3}
                />
              </ComponentPreview>
              <FrameworkCodeBlock
                reactCode={`<StatsCard
  items={[
    { label: '방문자 수', value: '45,231', change: '+20.1%', trend: 'up' },
    { label: '페이지뷰', value: '128,430', change: '+15.3%', trend: 'up' },
    { label: '평균 체류시간', value: '3분 42초', change: '-2.1%', trend: 'down' },
  ]}
  columns={3}
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
                    <Code>items</Code>
                  </TableCell>
                  <TableCell>
                    <Code>StatItem[]</Code>
                  </TableCell>
                  <TableCell>기본 예시 데이터</TableCell>
                  <TableCell>
                    통계 항목 배열. 각 항목은 label, value, change, trend 포함
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>columns</Code>
                  </TableCell>
                  <TableCell>
                    <Code>1 | 2 | 3 | 4</Code>
                  </TableCell>
                  <TableCell>
                    <Code>4</Code>
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

          <Section level="h2">
            <Heading level="h2" id="stat-item" title="StatItem" />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Code>label</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>통계 항목 레이블</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>value</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>표시할 값</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>change</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>변화율 텍스트 (예: &quot;+12.5%&quot;)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>trend</Code>
                  </TableCell>
                  <TableCell>
                    <Code>&quot;up&quot; | &quot;down&quot;</Code>
                  </TableCell>
                  <TableCell>변화 방향 (상승/하락)</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Section>
        </TabsContent>
      </Tabs>
    </>
  );
}

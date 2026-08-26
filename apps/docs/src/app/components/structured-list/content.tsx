'use client';

import React from 'react';

// Docs layout components
import {
  PageSection as Section,
  Heading,
  Subsection,
  PageNavigation,
  PlannedNotice,
} from '@/components/content';

// UI components - from @hanui/react
import {
  List,
  ListItem,
  Code,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@hanui/react';
import { ComponentPreview } from '@/components/content/ComponentPreview';

// 아직 @hanui/react에 포함되지 않은 컴포넌트라 미리보기 자리표시자를 쓴다.
const StructuredList: React.FC<{
  items: StructuredListItem[];
  variant?: 'default' | 'full';
  size?: 'sm' | 'md' | 'lg';
}> = () => (
  <div className="text-center py-8 text-krds-gray-60">
    StructuredList 미리보기 (구현 예정)
  </div>
);

interface StructuredListItem {
  id: string;
  badge?: { text: string; variant?: 'primary' | 'success' | 'secondary' };
  title: string;
  description: string;
  date?: { label: string; value: string };
  tags?: string[];
  href: string;
  action?: { label: string; onClick?: () => void };
  showShare?: boolean;
  showLike?: boolean;
}

export default function StructuredListPage() {
  const basicItems: StructuredListItem[] = [
    {
      id: '1',
      badge: { text: '진행중', variant: 'primary' },
      title: '청년 주거 지원 사업',
      description:
        '만 19세~34세 무주택 청년에게 월세를 지원합니다. 소득 및 자산 요건을 충족하는 경우 최대 20만원까지 지원받을 수 있습니다.',
      date: { label: '신청 기간', value: '2024.01.01-2024.12.31' },
      tags: ['청년', '주거지원', '복지'],
      href: '#',
      action: { label: '신청하기' },
      showShare: true,
      showLike: true,
    },
    {
      id: '2',
      badge: { text: '마감임박', variant: 'success' },
      title: '중소기업 지원 프로그램',
      description:
        '중소기업의 기술 개발과 사업화를 지원하는 프로그램입니다. R&D 비용, 인력 채용, 마케팅 등 다양한 분야에서 지원을 받으실 수 있습니다.',
      date: { label: '신청 기간', value: '2024.03.01-2024.03.31' },
      tags: ['중소기업', '기술개발'],
      href: '#',
      action: { label: '신청하기' },
      showShare: true,
      showLike: true,
    },
  ];

  return (
    <>
      <Heading
        level="h1"
        title="Structured List"
        description="복잡한 콘텐츠를 카드 형식으로 정리하여 표시하는 구조화 목록 컴포넌트입니다."
      />

      <PlannedNotice
        name="Structured List"
        note="원본 구현은 packages/registry/components/structured-list.tsx에 있으나 .module.scss 기반이라 Tailwind 아키텍처로 옮기는 작업이 남아 있습니다."
      />

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="api">API 레퍼런스</TabsTrigger>
        </TabsList>

        {/* 개요 탭 */}
        <TabsContent value="overview">
          {/* 1. 개요 */}
          <Section level="h2">
            <Heading
              level="h2"
              id="overview"
              title="개요"
              description="배지, 타이틀, 설명, 날짜, 태그, 액션 버튼 등 다양한 정보를 포함하는 복잡한 콘텐츠를 카드 형식으로 표시합니다."
              className="sr-only"
            />
            <ComponentPreview>
              <StructuredList items={basicItems} variant="default" />
            </ComponentPreview>
            <Code variant="block" language="tsx">
              {`<StructuredList
  items={[
    {
      id: '1',
      badge: { text: '진행중', variant: 'primary' },
      title: '청년 주거 지원 사업',
      description: '만 19세~34세 무주택 청년에게 월세를 지원합니다.',
      date: { label: '신청 기간', value: '2024.01.01-2024.12.31' },
      tags: ['청년', '주거지원'],
      href: '#',
      action: { label: '신청하기' },
    }
  ]}
/>`}
            </Code>
          </Section>

          {/* 3. 사용법 */}
          <Section level="h2">
            <Heading
              level="h2"
              id="usage"
              title="사용법"
              description="StructuredList 컴포넌트를 import하고 items 배열을 전달하여 사용합니다."
            />
            <Code variant="block" language="tsx">
              {`import { StructuredList } from '@/components/hanui/structured-list'

const items = [
  {
    id: '1',
    badge: { text: '진행중', variant: 'primary' },
    title: '청년 주거 지원 사업',
    description: '만 19세~34세 무주택 청년에게 월세를 지원합니다.',
    date: { label: '신청 기간', value: '2024.01.01-2024.12.31' },
    tags: ['청년', '주거지원', '복지'],
    href: '/programs/youth-housing',
    action: { label: '신청하기' },
    showShare: true,
    showLike: true,
  },
]

<StructuredList items={items} />`}
            </Code>
          </Section>

          {/* 4. 예제 */}
          <Section level="h2">
            <Heading level="h2" id="examples" title="예제" />

            <Subsection level="h3">
              <Heading
                level="h3"
                title="레이아웃"
                description="variant prop으로 세로형(default)과 가로형(full) 레이아웃을 선택할 수 있습니다."
              />
              <Code variant="block" language="tsx">
                {`// 세로형 (기본)
<StructuredList items={items} variant="default" />

// 가로형
<StructuredList items={items} variant="full" />`}
              </Code>
            </Subsection>

            <Subsection level="h3">
              <Heading
                level="h3"
                title="크기"
                description="size prop으로 카드 크기를 조절할 수 있습니다."
              />
              <Code variant="block" language="tsx">
                {`<StructuredList items={items} size="sm" />
<StructuredList items={items} size="md" />
<StructuredList items={items} size="lg" />`}
              </Code>
            </Subsection>

            <Subsection level="h3">
              <Heading
                level="h3"
                title="배지 스타일"
                description="badge.variant로 primary, success, secondary 스타일을 지정합니다."
              />
              <Code variant="block" language="tsx">
                {`const items = [
  { badge: { text: '진행중', variant: 'primary' }, ... },
  { badge: { text: '마감임박', variant: 'success' }, ... },
  { badge: { text: '상시모집', variant: 'secondary' }, ... },
]`}
              </Code>
            </Subsection>

            <Subsection level="h3">
              <Heading
                level="h3"
                title="공유/찜 기능"
                description="showShare, showLike prop과 onShare, onLike 핸들러로 공유/찜 기능을 구현합니다."
              />
              <Code variant="block" language="tsx">
                {`<StructuredList
  items={[{ ..., showShare: true, showLike: true }]}
  onShare={(item) => console.log('공유:', item.title)}
  onLike={(item) => console.log('찜:', item.title)}
/>`}
              </Code>
            </Subsection>
          </Section>

          {/* 5. 접근성 */}
          <Section level="h2">
            <Heading
              level="h2"
              id="accessibility"
              title="접근성"
              description="StructuredList는 WCAG 2.1 / KWCAG 2.2 Level AA 기준을 준수합니다."
            />
            <List variant="check">
              <ListItem>
                <strong>Semantic HTML:</strong> &lt;ul&gt;, &lt;li&gt; 요소를
                사용한 시맨틱 마크업
              </ListItem>
              <ListItem>
                <strong>키보드 접근성:</strong> 모든 링크와 버튼에 Tab으로 접근
                가능
              </ListItem>
              <ListItem>
                <strong>포커스 표시:</strong> 키보드 포커스 시 명확한 아웃라인
                표시
              </ListItem>
              <ListItem>
                <strong>명도 대비:</strong> WCAG AA 기준 색상 대비 준수
              </ListItem>
              <ListItem>
                <strong>반응형:</strong> 모바일 환경에서 터치 친화적인 레이아웃
              </ListItem>
              <ListItem>
                버튼에 title 속성으로 스크린리더 사용자를 위한 컨텍스트 제공
              </ListItem>
            </List>
          </Section>
        </TabsContent>

        {/* API 탭 */}
        <TabsContent value="api">
          <Section level="h2">
            <Heading level="h2" id="api" title="API 레퍼런스" />

            <Subsection level="h3">
              <Heading level="h3" title="StructuredList Props" />
              <Table small>
                <TableHeader>
                  <TableRow>
                    <TableHead>Prop</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Default</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-mono">
                      <Code>items</Code>
                    </TableCell>
                    <TableCell>
                      <Code className="text-xs">StructuredListItem[]</Code>
                    </TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>표시할 아이템 배열</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">
                      <Code>variant</Code>
                    </TableCell>
                    <TableCell>
                      <Code className="text-xs">'default' | 'full'</Code>
                    </TableCell>
                    <TableCell>'default'</TableCell>
                    <TableCell>레이아웃 타입</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">
                      <Code>size</Code>
                    </TableCell>
                    <TableCell>
                      <Code className="text-xs">'sm' | 'md' | 'lg'</Code>
                    </TableCell>
                    <TableCell>'md'</TableCell>
                    <TableCell>카드 크기</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">
                      <Code>onShare</Code>
                    </TableCell>
                    <TableCell>
                      <Code className="text-xs">
                        (item: StructuredListItem) =&gt; void
                      </Code>
                    </TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>공유 버튼 클릭 핸들러</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">
                      <Code>onLike</Code>
                    </TableCell>
                    <TableCell>
                      <Code className="text-xs">
                        (item: StructuredListItem) =&gt; void
                      </Code>
                    </TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>찜 버튼 클릭 핸들러</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">
                      <Code>className</Code>
                    </TableCell>
                    <TableCell>
                      <Code className="text-xs">string</Code>
                    </TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>추가 CSS 클래스</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Subsection>

            <Subsection level="h3">
              <Heading level="h3" title="StructuredListItem Type" />
              <Code variant="block" language="tsx">
                {`interface StructuredListItem {
  id: string
  badge?: {
    text: string
    variant?: 'primary' | 'success' | 'secondary'
  }
  title: string
  description: string
  date?: {
    label: string   // 예: "신청 기간"
    value: string   // 예: "2024.01.01-2024.12.31"
  }
  tags?: string[]
  href: string
  action?: {
    label: string
    onClick?: () => void
  }
  showShare?: boolean
  showLike?: boolean
}`}
              </Code>
            </Subsection>
          </Section>
        </TabsContent>
      </Tabs>

      <PageNavigation
        prev={{ title: 'Stack', href: '/components/stack' }}
        next={{ title: 'Switch', href: '/components/switch' }}
      />
    </>
  );
}

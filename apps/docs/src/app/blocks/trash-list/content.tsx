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
import { TrashList } from '@hanui/react';
import type { TrashItemData } from '@hanui/react';

const DEMO_ITEMS: TrashItemData[] = [
  {
    id: 1,
    title: '개인정보처리방침',
    type: 'PAGE',
    deletedBy: '홍길동',
    deletedAt: '2026-03-08',
    daysLeft: 25,
  },
  {
    id: 2,
    title: '2026년 업무 계획',
    type: 'POST',
    deletedBy: '김철수',
    deletedAt: '2026-03-05',
    daysLeft: 22,
  },
  {
    id: 3,
    title: 'banner-image.jpg',
    type: 'MEDIA',
    deletedBy: '이영희',
    deletedAt: '2026-03-01',
    daysLeft: 5,
  },
  {
    id: 4,
    title: '공지사항 게시판',
    type: 'MENU',
    deletedBy: '홍길동',
    deletedAt: '2026-02-28',
    daysLeft: 3,
  },
  {
    id: 5,
    title: '조직도 페이지',
    type: 'PAGE',
    deletedBy: '김철수',
    deletedAt: '2026-03-07',
    daysLeft: 24,
  },
];

export default function TrashListPage() {
  return (
    <>
      <Heading
        level="h1"
        title="Trash List"
        description="삭제된 항목을 목록으로 표시하고 복구/영구삭제 기능을 제공하는 블록"
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
              <TrashList
                items={DEMO_ITEMS}
                onRestore={(ids) => alert(`복구: ${ids.join(', ')}`)}
                onPermanentDelete={(ids) =>
                  alert(`영구삭제: ${ids.join(', ')}`)
                }
              />
            </ComponentPreview>
            <FrameworkCodeBlock
              reactCode={`import { TrashList } from '@hanui/react'

<TrashList
  items={trashItems}
  onRestore={(ids) => restoreItems(ids)}
  onPermanentDelete={(ids) => permanentDelete(ids)}
/>`}
            />
          </Section>

          <Section level="h2">
            <Installation componentName="trash-list" />
          </Section>

          <Section level="h2">
            <Heading level="h2" id="usage" title="사용법" />
            <FrameworkCodeBlock
              reactCode={`import { TrashList } from '@hanui/react'
import type { TrashItemData } from '@hanui/react'

export default function TrashPage() {
  const [items, setItems] = useState<TrashItemData[]>([]);

  const handleRestore = async (ids: number[]) => {
    await api.restoreItems(ids);
    setItems((prev) => prev.filter((item) => !ids.includes(item.id)));
    toast.success(\`\${ids.length}개 항목이 복구되었습니다.\`);
  };

  const handlePermanentDelete = async (ids: number[]) => {
    if (confirm('영구 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      await api.permanentDelete(ids);
      setItems((prev) => prev.filter((item) => !ids.includes(item.id)));
    }
  };

  return (
    <TrashList
      items={items}
      onRestore={handleRestore}
      onPermanentDelete={handlePermanentDelete}
    />
  );
}`}
            />
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
                    <Code>TrashItemData[]</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>삭제된 항목 목록 (필수)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>onRestore</Code>
                  </TableCell>
                  <TableCell>
                    <Code>(ids: number[]) =&gt; void</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>복구 핸들러 (선택된 ID 배열)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>onPermanentDelete</Code>
                  </TableCell>
                  <TableCell>
                    <Code>(ids: number[]) =&gt; void</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>영구삭제 핸들러 (선택된 ID 배열)</TableCell>
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
            <Heading level="h2" id="types" title="타입" />
            <Subsection>
              <Heading level="h3" id="trash-item-data" title="TrashItemData" />
              <Code variant="block" language="tsx">{`interface TrashItemData {
  id: number;
  title: string;
  type: 'PAGE' | 'POST' | 'MEDIA' | 'MENU';
  deletedBy: string;
  deletedAt: string;
  daysLeft?: number;
}`}</Code>
            </Subsection>
          </Section>
        </TabsContent>
      </Tabs>
    </>
  );
}

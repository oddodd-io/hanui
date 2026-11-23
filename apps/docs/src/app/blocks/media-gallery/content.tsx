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
import { MediaGallery } from '@hanui/react';
import type { MediaFileData } from '@hanui/react';

const DEMO_ITEMS: MediaFileData[] = [
  {
    id: 1,
    fileName: 'hero-banner.jpg',
    url: '/placeholder.jpg',
    thumbnailUrl: '/placeholder.jpg',
    type: 'IMAGE',
    size: 1024 * 512,
    uploadedAt: '2026-03-09',
    uploadedBy: '홍길동',
  },
  {
    id: 2,
    fileName: 'logo-dark.png',
    url: '/placeholder.png',
    thumbnailUrl: '/placeholder.png',
    type: 'IMAGE',
    size: 1024 * 128,
    uploadedAt: '2026-03-08',
    uploadedBy: '김철수',
  },
  {
    id: 3,
    fileName: '업무보고서.pdf',
    url: '/report.pdf',
    type: 'DOCUMENT',
    size: 1024 * 1024 * 2.5,
    uploadedAt: '2026-03-07',
    uploadedBy: '이영희',
  },
  {
    id: 4,
    fileName: '홍보영상.mp4',
    url: '/video.mp4',
    type: 'VIDEO',
    size: 1024 * 1024 * 50,
    uploadedAt: '2026-03-06',
    uploadedBy: '홍길동',
  },
  {
    id: 5,
    fileName: 'icon-set.svg',
    url: '/icons.svg',
    thumbnailUrl: '/icons.svg',
    type: 'IMAGE',
    size: 1024 * 32,
    uploadedAt: '2026-03-05',
  },
  {
    id: 6,
    fileName: '이용약관.hwp',
    url: '/terms.hwp',
    type: 'DOCUMENT',
    size: 1024 * 256,
    uploadedAt: '2026-03-04',
  },
];

export default function MediaGalleryPage() {
  return (
    <>
      <Heading
        level="h1"
        title="Media Gallery"
        description="미디어 파일을 그리드/리스트로 관리하고 업로드/삭제/상세보기를 제공하는 블록"
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
              <MediaGallery
                items={DEMO_ITEMS}
                onUpload={(files) =>
                  alert(`업로드: ${files.map((f) => f.name).join(', ')}`)
                }
                onDelete={(id) => alert(`삭제: #${id}`)}
              />
            </ComponentPreview>
            <FrameworkCodeBlock
              reactCode={`import { MediaGallery } from '@hanui/react'

<MediaGallery
  items={mediaFiles}
  onUpload={(files) => uploadFiles(files)}
  onDelete={(id) => deleteFile(id)}
/>`}
            />
          </Section>

          <Section level="h2">
            <Installation componentName="media-gallery" />
          </Section>

          <Section level="h2">
            <Heading level="h2" id="usage" title="사용법" />
            <FrameworkCodeBlock
              reactCode={`import { MediaGallery } from '@hanui/react'
import type { MediaFileData } from '@hanui/react'

export default function MediaPage() {
  const [files, setFiles] = useState<MediaFileData[]>([]);

  const handleUpload = async (newFiles: File[]) => {
    const uploaded = await api.uploadFiles(newFiles);
    setFiles((prev) => [...uploaded, ...prev]);
  };

  const handleDelete = async (id: number) => {
    if (confirm('삭제하시겠습니까?')) {
      await api.deleteFile(id);
      setFiles((prev) => prev.filter((f) => f.id !== id));
    }
  };

  return (
    <MediaGallery
      items={files}
      onUpload={handleUpload}
      onDelete={handleDelete}
    />
  );
}`}
            />
          </Section>

          <Section level="h2">
            <Heading level="h2" id="customization" title="커스터마이징" />

            <Subsection>
              <Heading
                level="h3"
                id="selector-mode"
                title="미디어 선택기 모드"
              />
              <FrameworkCodeBlock
                reactCode={`// onSelect를 제공하면 미디어 선택기로 동작합니다.
// 파일 클릭 시 상세 모달 대신 onSelect 콜백이 호출됩니다.
<MediaGallery
  items={files}
  onSelect={(item) => {
    setSelectedImage(item.url);
    closeModal();
  }}
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
                    <Code>MediaFileData[]</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>미디어 파일 목록 (필수)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>onUpload</Code>
                  </TableCell>
                  <TableCell>
                    <Code>(files: File[]) =&gt; void</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>파일 업로드 핸들러</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>onDelete</Code>
                  </TableCell>
                  <TableCell>
                    <Code>(id: number) =&gt; void</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>파일 삭제 핸들러</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>onSelect</Code>
                  </TableCell>
                  <TableCell>
                    <Code>(item: MediaFileData) =&gt; void</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>파일 선택 핸들러 (선택기 모드)</TableCell>
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
              <Heading level="h3" id="media-file-data" title="MediaFileData" />
              <Code variant="block" language="tsx">{`interface MediaFileData {
  id: number;
  fileName: string;
  url: string;
  thumbnailUrl?: string;
  type: 'IMAGE' | 'DOCUMENT' | 'VIDEO' | 'OTHER';
  size: number;
  uploadedAt: string;
  uploadedBy?: string;
}`}</Code>
            </Subsection>
          </Section>
        </TabsContent>
      </Tabs>
    </>
  );
}

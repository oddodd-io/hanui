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
import { BoardManagement } from '@hanui/react';
import type { BoardData, PostData } from '@hanui/react';

const DEMO_BOARDS: BoardData[] = [
  { id: 1, name: '공지사항', slug: 'notice', postCount: 3 },
  { id: 2, name: '보도자료', slug: 'press', postCount: 2 },
  { id: 3, name: '자유게시판', slug: 'free', postCount: 1 },
];

const DEMO_POSTS: PostData[] = [
  {
    id: 1,
    title: '2026년 업무 계획 안내',
    author: '홍길동',
    boardId: 1,
    status: 'PUBLISHED',
    isPinned: true,
    views: 342,
    createdAt: '2026-03-09',
  },
  {
    id: 2,
    title: '시스템 점검 안내 (3/15)',
    author: '김철수',
    boardId: 1,
    status: 'PUBLISHED',
    isPinned: false,
    views: 128,
    createdAt: '2026-03-08',
  },
  {
    id: 3,
    title: '신규 서비스 오픈 예정',
    author: '이영희',
    boardId: 1,
    status: 'DRAFT',
    isPinned: false,
    views: 0,
    createdAt: '2026-03-07',
  },
  {
    id: 4,
    title: '기관장 신년 인사',
    author: '홍길동',
    boardId: 2,
    status: 'PUBLISHED',
    isPinned: true,
    views: 567,
    createdAt: '2026-01-02',
  },
  {
    id: 5,
    title: '보도자료 초안',
    author: '김철수',
    boardId: 2,
    status: 'HIDDEN',
    isPinned: false,
    views: 12,
    createdAt: '2026-03-05',
  },
  {
    id: 6,
    title: '점심 메뉴 추천',
    author: '이영희',
    boardId: 3,
    status: 'PUBLISHED',
    isPinned: false,
    views: 45,
    createdAt: '2026-03-09',
  },
];

export default function BoardManagementPage() {
  return (
    <>
      <Heading
        level="h1"
        title="Board Management"
        description="게시판별 탭으로 게시글을 관리하고 상태 필터, 일괄 작업, 고정 기능을 제공하는 블록"
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
              <BoardManagement
                boards={DEMO_BOARDS}
                posts={DEMO_POSTS}
                onNewPost={(boardId) =>
                  alert(`새 글 작성 (게시판 #${boardId})`)
                }
                onEditPost={(postId) => alert(`수정: #${postId}`)}
                onDeletePost={(ids) => alert(`삭제: ${ids.join(', ')}`)}
                onTogglePin={(id, pinned) =>
                  alert(`${pinned ? '고정' : '해제'}: #${id}`)
                }
              />
            </ComponentPreview>
            <FrameworkCodeBlock
              reactCode={`import { BoardManagement } from '@hanui/react'

<BoardManagement
  boards={boards}
  posts={posts}
  onNewPost={(boardId) => router.push(\`/admin/posts/new?board=\${boardId}\`)}
  onEditPost={(postId) => router.push(\`/admin/posts/\${postId}/edit\`)}
  onDeletePost={(ids) => deletePosts(ids)}
  onTogglePin={(id, pinned) => togglePin(id, pinned)}
/>`}
            />
          </Section>

          <Section level="h2">
            <Installation componentName="board-management" />
          </Section>

          <Section level="h2">
            <Heading level="h2" id="usage" title="사용법" />
            <FrameworkCodeBlock
              reactCode={`import { BoardManagement } from '@hanui/react'
import type { BoardData, PostData } from '@hanui/react'

export default function PostsPage() {
  const [boards, setBoards] = useState<BoardData[]>([]);
  const [posts, setPosts] = useState<PostData[]>([]);

  const handleDeletePosts = async (ids: number[]) => {
    if (confirm(\`\${ids.length}개 게시글을 삭제하시겠습니까?\`)) {
      await api.deletePosts(ids);
      setPosts((prev) => prev.filter((p) => !ids.includes(p.id)));
    }
  };

  const handleTogglePin = async (id: number, pinned: boolean) => {
    await api.updatePost(id, { isPinned: pinned });
    setPosts((prev) =>
      prev.map((p) => p.id === id ? { ...p, isPinned: pinned } : p)
    );
  };

  return (
    <BoardManagement
      boards={boards}
      posts={posts}
      onNewPost={(boardId) => router.push(\`/admin/posts/new?board=\${boardId}\`)}
      onEditPost={(id) => router.push(\`/admin/posts/\${id}/edit\`)}
      onDeletePost={handleDeletePosts}
      onTogglePin={handleTogglePin}
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
                    <Code>boards</Code>
                  </TableCell>
                  <TableCell>
                    <Code>BoardData[]</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>게시판 목록 (필수)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>posts</Code>
                  </TableCell>
                  <TableCell>
                    <Code>PostData[]</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>게시글 목록 (필수)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>onNewPost</Code>
                  </TableCell>
                  <TableCell>
                    <Code>(boardId: number) =&gt; void</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>새 글 작성 핸들러</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>onEditPost</Code>
                  </TableCell>
                  <TableCell>
                    <Code>(postId: number) =&gt; void</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>게시글 수정 핸들러</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>onDeletePost</Code>
                  </TableCell>
                  <TableCell>
                    <Code>(postIds: number[]) =&gt; void</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>게시글 삭제 핸들러 (일괄 지원)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>onTogglePin</Code>
                  </TableCell>
                  <TableCell>
                    <Code>(postId: number, pinned: boolean) =&gt; void</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>게시글 고정/해제 핸들러</TableCell>
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
              <Heading level="h3" id="board-data" title="BoardData" />
              <Code variant="block" language="tsx">{`interface BoardData {
  id: number;
  name: string;
  slug: string;
  postCount: number;
}`}</Code>
            </Subsection>
            <Subsection>
              <Heading level="h3" id="post-data" title="PostData" />
              <Code variant="block" language="tsx">{`interface PostData {
  id: number;
  title: string;
  author: string;
  boardId: number;
  status: 'DRAFT' | 'PUBLISHED' | 'HIDDEN';
  isPinned: boolean;
  views: number;
  createdAt: string;
}`}</Code>
            </Subsection>
          </Section>
        </TabsContent>
      </Tabs>
    </>
  );
}

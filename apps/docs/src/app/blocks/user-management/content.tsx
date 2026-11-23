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
import { UserManagement } from '@hanui/react';
import type { AdminUserData } from '@hanui/react';

const DEMO_USERS: AdminUserData[] = [
  {
    id: 1,
    name: '홍길동',
    username: 'admin',
    role: 'SUPER_ADMIN',
    lastLoginAt: '2026-03-09 10:30',
    isActive: true,
  },
  {
    id: 2,
    name: '김철수',
    username: 'editor1',
    role: 'EDITOR',
    lastLoginAt: '2026-03-08 14:20',
    isActive: true,
  },
  {
    id: 3,
    name: '이영희',
    username: 'viewer1',
    role: 'VIEWER',
    lastLoginAt: '2026-03-07 09:15',
    isActive: true,
  },
  {
    id: 4,
    name: '박민수',
    username: 'editor2',
    role: 'EDITOR',
    isActive: false,
  },
];

export default function UserManagementPage() {
  return (
    <>
      <Heading
        level="h1"
        title="User Management"
        description="관리자 계정을 목록으로 표시하고 추가/수정/삭제 기능을 제공하는 블록"
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
              <UserManagement
                users={DEMO_USERS}
                currentUserId={1}
                onAdd={(data) => alert(`추가: ${JSON.stringify(data)}`)}
                onEdit={(id, data) =>
                  alert(`수정 #${id}: ${JSON.stringify(data)}`)
                }
                onDelete={(id) => alert(`삭제: #${id}`)}
              />
            </ComponentPreview>
            <FrameworkCodeBlock
              reactCode={`import { UserManagement } from '@hanui/react'

<UserManagement
  users={users}
  currentUserId={currentUser.id}
  onAdd={(data) => createUser(data)}
  onEdit={(id, data) => updateUser(id, data)}
  onDelete={(id) => deleteUser(id)}
/>`}
            />
          </Section>

          <Section level="h2">
            <Installation componentName="user-management" />
          </Section>

          <Section level="h2">
            <Heading level="h2" id="usage" title="사용법" />
            <FrameworkCodeBlock
              reactCode={`import { UserManagement } from '@hanui/react'
import type { AdminUserData, UserFormData } from '@hanui/react'

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUserData[]>([]);

  const handleAdd = async (data: UserFormData) => {
    const newUser = await api.createUser(data);
    setUsers((prev) => [...prev, newUser]);
  };

  const handleEdit = async (id: number, data: UserFormData) => {
    await api.updateUser(id, data);
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, ...data } : u));
  };

  const handleDelete = async (id: number) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      await api.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  return (
    <UserManagement
      users={users}
      currentUserId={session.user.id}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
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
                    <Code>users</Code>
                  </TableCell>
                  <TableCell>
                    <Code>AdminUserData[]</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>사용자 목록 (필수)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>onAdd</Code>
                  </TableCell>
                  <TableCell>
                    <Code>(data: UserFormData) =&gt; void</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>사용자 추가 핸들러</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>onEdit</Code>
                  </TableCell>
                  <TableCell>
                    <Code>(id: number, data: UserFormData) =&gt; void</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>사용자 수정 핸들러</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>onDelete</Code>
                  </TableCell>
                  <TableCell>
                    <Code>(id: number) =&gt; void</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>사용자 삭제 핸들러</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>currentUserId</Code>
                  </TableCell>
                  <TableCell>
                    <Code>number</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    현재 로그인한 사용자 ID (자기 삭제 방지)
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
              </TableBody>
            </Table>
          </Section>

          <Section level="h2">
            <Heading level="h2" id="types" title="타입" />
            <Subsection>
              <Heading level="h3" id="admin-user-data" title="AdminUserData" />
              <Code variant="block" language="tsx">{`interface AdminUserData {
  id: number;
  name: string;
  username: string;
  role: 'SUPER_ADMIN' | 'EDITOR' | 'VIEWER';
  lastLoginAt?: string;
  isActive: boolean;
}`}</Code>
            </Subsection>
            <Subsection>
              <Heading level="h3" id="user-form-data" title="UserFormData" />
              <Code variant="block" language="tsx">{`interface UserFormData {
  name: string;
  username: string;
  password?: string;
  role: 'SUPER_ADMIN' | 'EDITOR' | 'VIEWER';
}`}</Code>
            </Subsection>
          </Section>
        </TabsContent>
      </Tabs>
    </>
  );
}

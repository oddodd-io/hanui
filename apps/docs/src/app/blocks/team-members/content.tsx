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
import { TeamMembers } from '@hanui/react';

export default function TeamMembersPage() {
  return (
    <>
      <Heading
        level="h1"
        title="Team Members"
        description="팀원 목록을 관리하고 새 멤버를 초대하는 블록"
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
              <TeamMembers
                onInvite={() => alert('멤버 초대')}
                onRemove={(id) => alert('제거: ' + id)}
              />
            </ComponentPreview>
            <FrameworkCodeBlock
              reactCode={`import { TeamMembers } from '@/components/hanui/blocks/team-members'

<TeamMembers
  onInvite={() => alert('멤버 초대')}
  onRemove={(id) => alert('제거: ' + id)}
/>`}
            />
          </Section>

          <Section level="h2">
            <Installation componentName="team-members" />
          </Section>

          <Section level="h2">
            <Heading level="h2" id="usage" title="사용법" />
            <FrameworkCodeBlock
              reactCode={`import { TeamMembers } from '@/components/hanui/blocks/team-members'

export default function SettingsPage() {
  const members = [
    { id: '1', name: '김미아', email: 'mia@example.com', role: '관리자', avatar: '/avatars/mia.png' },
    { id: '2', name: '이수진', email: 'sujin@example.com', role: '편집자', avatar: '/avatars/sujin.png' },
    { id: '3', name: '박지훈', email: 'jihun@example.com', role: '뷰어', avatar: '/avatars/jihun.png' },
  ];

  return (
    <TeamMembers
      members={members}
      onInvite={() => console.log('초대 다이얼로그 열기')}
      onRemove={(id) => console.log('멤버 제거:', id)}
    />
  );
}`}
            />
          </Section>

          <Section level="h2">
            <Heading level="h2" id="customization" title="커스터마이징" />

            <Subsection>
              <Heading level="h3" id="custom-title" title="제목/설명 변경" />
              <ComponentPreview>
                <TeamMembers
                  title="프로젝트 참여자"
                  description="이 프로젝트에 참여 중인 팀원입니다."
                  onInvite={() => alert('멤버 초대')}
                  onRemove={(id) => alert('제거: ' + id)}
                />
              </ComponentPreview>
              <FrameworkCodeBlock
                reactCode={`<TeamMembers
  title="프로젝트 참여자"
  description="이 프로젝트에 참여 중인 팀원입니다."
  onInvite={() => console.log('초대')}
  onRemove={(id) => console.log('제거:', id)}
/>`}
              />
            </Subsection>

            <Subsection>
              <Heading
                level="h3"
                id="custom-members"
                title="커스텀 멤버 데이터"
              />
              <ComponentPreview>
                <TeamMembers
                  members={[
                    {
                      id: '1',
                      name: '홍길동',
                      email: 'hong@example.com',
                      role: '관리자',
                    },
                    {
                      id: '2',
                      name: '김철수',
                      email: 'kim@example.com',
                      role: '개발자',
                    },
                  ]}
                  onInvite={() => alert('멤버 초대')}
                  onRemove={(id) => alert('제거: ' + id)}
                />
              </ComponentPreview>
              <FrameworkCodeBlock
                reactCode={`<TeamMembers
  members={[
    { id: '1', name: '홍길동', email: 'hong@example.com', role: '관리자' },
    { id: '2', name: '김철수', email: 'kim@example.com', role: '개발자' },
  ]}
  onInvite={() => console.log('초대')}
  onRemove={(id) => console.log('제거:', id)}
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
                    <Code>members</Code>
                  </TableCell>
                  <TableCell>
                    <Code>TeamMember[]</Code>
                  </TableCell>
                  <TableCell>기본 예시 데이터</TableCell>
                  <TableCell>팀원 목록 배열</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>onInvite</Code>
                  </TableCell>
                  <TableCell>
                    <Code>() =&gt; void</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>멤버 초대 버튼 클릭 핸들러</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>onRemove</Code>
                  </TableCell>
                  <TableCell>
                    <Code>(id: string) =&gt; void</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    멤버 제거 핸들러. 해당 멤버 id를 인자로 전달
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
                    <Code>&quot;팀 멤버&quot;</Code>
                  </TableCell>
                  <TableCell>카드 제목</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>description</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>
                    <Code>&quot;팀원을 관리하고...&quot;</Code>
                  </TableCell>
                  <TableCell>카드 설명 텍스트</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Section>

          <Section level="h2">
            <Heading level="h2" id="team-member" title="TeamMember" />
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
                    <Code>id</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>멤버 고유 식별자</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>name</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>멤버 이름</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>email</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>멤버 이메일</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>role</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>멤버 역할 (예: 관리자, 편집자, 뷰어)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>avatar</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>아바타 이미지 URL (선택)</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Section>
        </TabsContent>
      </Tabs>
    </>
  );
}

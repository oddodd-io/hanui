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
import { ProfileCard } from '@hanui/react';

export default function ProfileCardPage() {
  return (
    <>
      <Heading
        level="h1"
        title="Profile Card"
        description="아바타, 이름, 역할, 연락처를 표시하는 프로필 카드 블록"
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
              <ProfileCard
                name="김미아"
                role="프론트엔드 개발자"
                email="mia@example.com"
                phone="010-1234-5678"
                department="개발팀"
                badgeText="관리자"
                onEdit={() => alert('프로필 편집')}
              />
            </ComponentPreview>
            <FrameworkCodeBlock
              reactCode={`import { ProfileCard } from '@/components/hanui/blocks/profile-card'

<ProfileCard
  name="김미아"
  role="프론트엔드 개발자"
  email="mia@example.com"
  phone="010-1234-5678"
  department="개발팀"
  badgeText="관리자"
  onEdit={() => alert('프로필 편집')}
/>`}
              vueCode={`<!-- Coming Soon -->`}
            />
          </Section>

          <Section level="h2">
            <Installation componentName="profile-card" />
          </Section>

          <Section level="h2">
            <Heading level="h2" id="usage" title="사용법" />
            <FrameworkCodeBlock
              reactCode={`import { ProfileCard } from '@/components/hanui/blocks/profile-card'

export default function ProfilePage() {
  return (
    <ProfileCard
      name="김미아"
      role="프론트엔드 개발자"
      email="mia@example.com"
      phone="010-1234-5678"
      department="개발팀"
      badgeText="관리자"
      onEdit={() => console.log('편집')}
    />
  );
}`}
              vueCode={`<!-- Coming Soon -->`}
            />
          </Section>

          <Section level="h2">
            <Heading level="h2" id="customization" title="커스터마이징" />

            <Subsection>
              <Heading level="h3" id="with-avatar" title="아바타 이미지" />
              <ComponentPreview>
                <ProfileCard
                  name="김미아"
                  role="프론트엔드 개발자"
                  avatarUrl="https://github.com/shadcn.png"
                />
              </ComponentPreview>
              <FrameworkCodeBlock
                reactCode={`<ProfileCard
  name="김미아"
  role="프론트엔드 개발자"
  avatarUrl="https://github.com/shadcn.png"
/>`}
                vueCode={`<!-- Coming Soon -->`}
              />
            </Subsection>

            <Subsection>
              <Heading level="h3" id="with-initials" title="이니셜 아바타" />
              <ComponentPreview>
                <ProfileCard
                  name="김미아"
                  role="디자이너"
                  avatarInitials="김"
                  department="디자인팀"
                />
              </ComponentPreview>
              <FrameworkCodeBlock
                reactCode={`<ProfileCard
  name="김미아"
  role="디자이너"
  avatarInitials="김"
  department="디자인팀"
/>`}
                vueCode={`<!-- Coming Soon -->`}
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
                    <Code>name</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>사용자 이름 (필수)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>role</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>직책/역할</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>email</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>이메일 주소</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>phone</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>전화번호</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>department</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>소속 부서</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>avatarUrl</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>아바타 이미지 URL</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>avatarInitials</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>아바타 이니셜 (이미지 없을 때 표시)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>badgeText</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>배지 텍스트 (예: &quot;관리자&quot;)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>badgeVariant</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>
                    <Code>&quot;default&quot;</Code>
                  </TableCell>
                  <TableCell>배지 스타일 변형</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>onEdit</Code>
                  </TableCell>
                  <TableCell>
                    <Code>() =&gt; void</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>편집 버튼 클릭 핸들러</TableCell>
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

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
import { SettingsSection } from '@hanui/react';

export default function SettingsSectionPage() {
  return (
    <>
      <Heading
        level="h1"
        title="Settings Section"
        description="토글 스위치로 설정을 관리하는 설정 패널 블록"
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
              <SettingsSection />
            </ComponentPreview>
            <FrameworkCodeBlock
              reactCode={`import { SettingsSection } from '@/components/hanui/blocks/settings-section'

<SettingsSection />`}
            />
          </Section>

          <Section level="h2">
            <Installation componentName="settings-section" />
          </Section>

          <Section level="h2">
            <Heading level="h2" id="usage" title="사용법" />
            <FrameworkCodeBlock
              reactCode={`import { SettingsSection } from '@/components/hanui/blocks/settings-section'

export default function SettingsPage() {
  const handleChange = (id: string, enabled: boolean) => {
    console.log(\`Setting \${id}: \${enabled}\`);
  };

  return <SettingsSection onChange={handleChange} />;
}`}
            />
          </Section>

          <Section level="h2">
            <Heading level="h2" id="customization" title="커스터마이징" />

            <Subsection>
              <Heading level="h3" id="custom-title" title="제목/설명 변경" />
              <ComponentPreview>
                <SettingsSection
                  title="보안 설정"
                  description="계정 보안과 관련된 설정을 관리합니다."
                />
              </ComponentPreview>
              <FrameworkCodeBlock
                reactCode={`<SettingsSection
  title="보안 설정"
  description="계정 보안과 관련된 설정을 관리합니다."
/>`}
              />
            </Subsection>

            <Subsection>
              <Heading level="h3" id="custom-items" title="커스텀 항목" />
              <ComponentPreview>
                <SettingsSection
                  title="접근성 설정"
                  items={[
                    {
                      id: 'high-contrast',
                      label: '고대비 모드',
                      description: '화면의 대비를 높여 가독성을 향상시킵니다.',
                      enabled: false,
                    },
                    {
                      id: 'large-text',
                      label: '큰 글씨',
                      description: '텍스트 크기를 크게 표시합니다.',
                      enabled: true,
                    },
                    {
                      id: 'reduce-motion',
                      label: '애니메이션 줄이기',
                      description: '화면 전환 시 애니메이션 효과를 줄입니다.',
                      enabled: false,
                    },
                  ]}
                />
              </ComponentPreview>
              <FrameworkCodeBlock
                reactCode={`<SettingsSection
  title="접근성 설정"
  items={[
    {
      id: 'high-contrast',
      label: '고대비 모드',
      description: '화면의 대비를 높여 가독성을 향상시킵니다.',
      enabled: false,
    },
    {
      id: 'large-text',
      label: '큰 글씨',
      description: '텍스트 크기를 크게 표시합니다.',
      enabled: true,
    },
    {
      id: 'reduce-motion',
      label: '애니메이션 줄이기',
      description: '화면 전환 시 애니메이션 효과를 줄입니다.',
      enabled: false,
    },
  ]}
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
                    <Code>SettingItem[]</Code>
                  </TableCell>
                  <TableCell>기본 설정 항목</TableCell>
                  <TableCell>
                    설정 항목 배열. 각 항목은 id, label, description, enabled를
                    포함
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>onChange</Code>
                  </TableCell>
                  <TableCell>
                    <Code>(id: string, enabled: boolean) =&gt; void</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>설정 변경 시 호출되는 핸들러</TableCell>
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
                    <Code>&quot;설정&quot;</Code>
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
                    <Code>&quot;환경 설정을 관리합니다.&quot;</Code>
                  </TableCell>
                  <TableCell>카드 설명 텍스트</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Section>

          <Section level="h2">
            <Heading level="h2" id="setting-item" title="SettingItem" />
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
                  <TableCell>설정 항목의 고유 식별자</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>label</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>설정 항목의 라벨</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>description</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>설정 항목의 설명</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>enabled</Code>
                  </TableCell>
                  <TableCell>
                    <Code>boolean</Code>
                  </TableCell>
                  <TableCell>설정 활성화 여부</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Section>
        </TabsContent>
      </Tabs>
    </>
  );
}

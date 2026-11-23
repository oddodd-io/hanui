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
import { SiteSettings } from '@hanui/react';

export default function SiteSettingsPage() {
  return (
    <>
      <Heading
        level="h1"
        title="Site Settings"
        description="CMS 사이트 기본 정보 설정 폼 — 기관명, 로고, 주소, 전화번호, 이메일, 저작권 문구"
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
              <SiteSettings
                onSubmit={(data) => {
                  alert(JSON.stringify(data, null, 2));
                }}
                defaultValues={{
                  siteName: 'OO기관',
                  address: '서울특별시 종로구 세종대로 209',
                  phone: '02-1234-5678',
                  email: 'admin@example.go.kr',
                  copyright: '© 2026 OO기관. All rights reserved.',
                }}
              />
            </ComponentPreview>
            <FrameworkCodeBlock
              reactCode={`import { SiteSettings } from '@hanui/react'

<SiteSettings
  onSubmit={(data) => {
    console.log(data);
    // { siteName, logoUrl, address, phone, email, copyright }
  }}
  defaultValues={{
    siteName: 'OO기관',
    phone: '02-1234-5678',
  }}
/>`}
            />
          </Section>

          <Section level="h2">
            <Installation componentName="site-settings" />
          </Section>

          <Section level="h2">
            <Heading level="h2" id="usage" title="사용법" />
            <FrameworkCodeBlock
              reactCode={`import { SiteSettings } from '@hanui/react'

export default function SettingsPage() {
  const handleSave = async (data: SiteSettingsData) => {
    await api.updateSiteSettings(data);
    toast.success('설정이 저장되었습니다.');
  };

  const handleLogoChange = async (file: File) => {
    const url = await api.uploadLogo(file);
    // logoUrl은 폼 데이터에 포함됨
  };

  return (
    <SiteSettings
      onSubmit={handleSave}
      onLogoChange={handleLogoChange}
      defaultValues={currentSettings}
      loading={isSaving}
    />
  );
}`}
            />
          </Section>

          <Section level="h2">
            <Heading level="h2" id="customization" title="커스터마이징" />

            <Subsection>
              <Heading level="h3" id="empty-form" title="빈 폼" />
              <ComponentPreview>
                <SiteSettings
                  onSubmit={(data) => alert(JSON.stringify(data, null, 2))}
                />
              </ComponentPreview>
              <FrameworkCodeBlock
                reactCode={`<SiteSettings onSubmit={handleSave} />`}
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
                    <Code>onSubmit</Code>
                  </TableCell>
                  <TableCell>
                    <Code>(data: SiteSettingsData) =&gt; void</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>폼 제출 핸들러</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>onLogoChange</Code>
                  </TableCell>
                  <TableCell>
                    <Code>(file: File) =&gt; void</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>로고 파일 변경 핸들러</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>defaultValues</Code>
                  </TableCell>
                  <TableCell>
                    <Code>Partial&lt;SiteSettingsData&gt;</Code>
                  </TableCell>
                  <TableCell>
                    <Code>{'{}'}</Code>
                  </TableCell>
                  <TableCell>폼 초기값</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>loading</Code>
                  </TableCell>
                  <TableCell>
                    <Code>boolean</Code>
                  </TableCell>
                  <TableCell>
                    <Code>false</Code>
                  </TableCell>
                  <TableCell>저장 중 상태</TableCell>
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
              <Heading
                level="h3"
                id="site-settings-data"
                title="SiteSettingsData"
              />
              <Code
                variant="block"
                language="tsx"
              >{`interface SiteSettingsData {
  siteName: string;
  logoUrl?: string;
  address?: string;
  phone?: string;
  email?: string;
  copyright?: string;
}`}</Code>
            </Subsection>
          </Section>
        </TabsContent>
      </Tabs>
    </>
  );
}

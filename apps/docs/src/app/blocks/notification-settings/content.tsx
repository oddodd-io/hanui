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
import { NotificationSettings } from '@hanui/react';

export default function NotificationSettingsPage() {
  return (
    <>
      <Heading
        level="h1"
        title="Notification Settings"
        description="이메일, SMS, 푸시 알림 수신을 설정하는 블록"
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
              <NotificationSettings />
            </ComponentPreview>
            <FrameworkCodeBlock
              reactCode={`import { NotificationSettings } from '@/components/hanui/blocks/notification-settings'

<NotificationSettings />`}
            />
          </Section>

          <Section level="h2">
            <Installation componentName="notification-settings" />
          </Section>

          <Section level="h2">
            <Heading level="h2" id="usage" title="사용법" />
            <FrameworkCodeBlock
              reactCode={`import { NotificationSettings } from '@/components/hanui/blocks/notification-settings'

export default function NotificationsPage() {
  const handleChange = (channelId: string, enabled: boolean) => {
    console.log(\`Channel \${channelId}: \${enabled}\`);
  };

  return <NotificationSettings onChange={handleChange} />;
}`}
            />
          </Section>

          <Section level="h2">
            <Heading level="h2" id="customization" title="커스터마이징" />

            <Subsection>
              <Heading level="h3" id="custom-title" title="제목/설명 변경" />
              <ComponentPreview>
                <NotificationSettings
                  title="마케팅 알림"
                  description="프로모션 및 이벤트 알림 수신을 설정합니다."
                />
              </ComponentPreview>
              <FrameworkCodeBlock
                reactCode={`<NotificationSettings
  title="마케팅 알림"
  description="프로모션 및 이벤트 알림 수신을 설정합니다."
/>`}
              />
            </Subsection>

            <Subsection>
              <Heading level="h3" id="custom-channels" title="커스텀 채널" />
              <ComponentPreview>
                <NotificationSettings
                  title="시스템 알림"
                  channels={[
                    {
                      id: 'slack',
                      label: 'Slack',
                      description: 'Slack 채널로 알림을 받습니다.',
                      enabled: true,
                    },
                    {
                      id: 'discord',
                      label: 'Discord',
                      description: 'Discord 채널로 알림을 받습니다.',
                      enabled: false,
                    },
                    {
                      id: 'webhook',
                      label: 'Webhook',
                      description: '지정한 URL로 알림을 전송합니다.',
                      enabled: false,
                    },
                  ]}
                />
              </ComponentPreview>
              <FrameworkCodeBlock
                reactCode={`<NotificationSettings
  title="시스템 알림"
  channels={[
    {
      id: 'slack',
      label: 'Slack',
      description: 'Slack 채널로 알림을 받습니다.',
      enabled: true,
    },
    {
      id: 'discord',
      label: 'Discord',
      description: 'Discord 채널로 알림을 받습니다.',
      enabled: false,
    },
    {
      id: 'webhook',
      label: 'Webhook',
      description: '지정한 URL로 알림을 전송합니다.',
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
                    <Code>channels</Code>
                  </TableCell>
                  <TableCell>
                    <Code>NotificationChannel[]</Code>
                  </TableCell>
                  <TableCell>기본 알림 채널</TableCell>
                  <TableCell>
                    알림 채널 배열. 각 채널은 id, label, description, enabled를
                    포함
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>onChange</Code>
                  </TableCell>
                  <TableCell>
                    <Code>
                      (channelId: string, enabled: boolean) =&gt; void
                    </Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>알림 설정 변경 시 호출되는 핸들러</TableCell>
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
                    <Code>&quot;알림 설정&quot;</Code>
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
                    <Code>&quot;알림 수신 방법을 설정합니다.&quot;</Code>
                  </TableCell>
                  <TableCell>카드 설명 텍스트</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Section>

          <Section level="h2">
            <Heading
              level="h2"
              id="notification-channel"
              title="NotificationChannel"
            />
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
                  <TableCell>알림 채널의 고유 식별자</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>label</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>
                    알림 채널의 라벨 (예: &quot;이메일&quot;)
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>description</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>알림 채널의 설명</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>enabled</Code>
                  </TableCell>
                  <TableCell>
                    <Code>boolean</Code>
                  </TableCell>
                  <TableCell>알림 채널 활성화 여부</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Section>
        </TabsContent>
      </Tabs>
    </>
  );
}

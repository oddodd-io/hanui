'use client';

import { Heading, PageNavigation, PlannedNotice } from '@/components/content';
import { FrameworkContent } from '@/components/content/FrameworkCodeBlock';
import { ReactNotificationContent } from './_react';
import { VueNotificationContent } from './_vue';

export default function NotificationKitPage() {
  return (
    <>
      <Heading
        level="h1"
        title="Notification Kit"
        description="알림 기능 키트. 알림 센터, 토스트, 실시간 알림, 푸시 알림을 포함합니다."
      />

      <PlannedNotice name="Notification Kit" />

      <FrameworkContent
        react={<ReactNotificationContent />}
        vue={<VueNotificationContent />}
      />

      <PageNavigation
        prev={{ title: 'Search Kit', href: '/kits/search' }}
        next={{ title: 'Settings Kit', href: '/kits/settings' }}
      />
    </>
  );
}

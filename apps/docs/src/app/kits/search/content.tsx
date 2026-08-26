'use client';

import { Heading, PageNavigation, PlannedNotice } from '@/components/content';
import { FrameworkContent } from '@/components/content/FrameworkCodeBlock';
import { ReactSearchContent } from './_react';
import { VueSearchContent } from './_vue';

export default function SearchKitPage() {
  return (
    <>
      <Heading
        level="h1"
        title="Search Kit"
        description="검색 기능 키트. 검색바, 자동완성, 인기검색어, 최근검색어를 포함합니다."
      />

      <PlannedNotice name="Search Kit" />

      <FrameworkContent
        react={<ReactSearchContent />}
        vue={<VueSearchContent />}
      />

      <PageNavigation
        prev={{ title: 'Dashboard Kit', href: '/kits/dashboard' }}
        next={{ title: 'Notification Kit', href: '/kits/notification' }}
      />
    </>
  );
}

'use client';

import { Heading, PageNavigation, PlannedNotice } from '@/components/content';
import { FrameworkContent } from '@/components/content/FrameworkCodeBlock';
import { ReactTableContent } from './_react';
import { VueTableContent } from './_vue';

export default function TableKitPage() {
  return (
    <>
      <Heading
        level="h1"
        title="Table Kit"
        description="데이터 테이블 키트. 정렬, 필터, 페이지네이션, CSV 내보내기를 지원합니다."
      />

      <PlannedNotice name="Table Kit" />

      <FrameworkContent
        react={<ReactTableContent />}
        vue={<VueTableContent />}
      />

      <PageNavigation
        prev={{ title: 'Auth Kit', href: '/kits/auth' }}
        next={{ title: 'Form Kit', href: '/kits/form' }}
      />
    </>
  );
}

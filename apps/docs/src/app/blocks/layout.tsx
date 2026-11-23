import type { ReactNode } from 'react';
import { DocsContentLayout } from '@/components/layout/DocsContentLayout';
import { VueDocSupplement } from '@/components/content/VueDocSupplement';

export default function BlocksLayout({ children }: { children: ReactNode }) {
  return (
    <DocsContentLayout>
      {/* 블록 문서 28개를 한 곳에서 처리한다. 페이지마다 넣으면 새 문서에서 빠뜨린다. */}
      <VueDocSupplement section="blocks" />
      {children}
    </DocsContentLayout>
  );
}

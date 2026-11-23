'use client';

import Link from 'next/link';
import { Body, Card, CardBody } from '@hanui/react';
import { useFramework } from '../FrameworkTabs';

/**
 * Vue에만 있는 컴포넌트 문서 맨 위에 붙는 안내.
 *
 * React 주소에서 이 문서에 닿았을 때 "예제가 왜 전부 Vue냐"를 설명한다.
 * 목록·사이드바에서는 걸러지지만 직접 주소나 검색으로는 닿는다.
 *
 * Vue 주소에서는 아무것도 띄우지 않는다 — 거기서는 Vue 코드가 당연하고,
 * props 표는 VueDocSupplement가 따로 붙인다.
 */
export function VueOnlyNotice({ name }: { name: string }) {
  const { framework } = useFramework();
  if (framework !== 'react') return null;

  return (
    <Card variant="filled" className="mb-8">
      <CardBody>
        {/* 조사(은/는)는 이름에 따라 달라지는데 컴포넌트 이름이 영문이라
            규칙으로 고를 수 없다. 대시로 끊어 조사를 쓰지 않는다. */}
        <Body>
          <strong>{name} — Vue 전용 컴포넌트입니다.</strong> React 버전이 없어
          아래 예제는 모두 Vue 코드입니다.
        </Body>
        <Body className="mt-3">
          React에서 쓸 수 있는 컴포넌트는{' '}
          <Link href="/components" className="underline">
            컴포넌트 목록
          </Link>
          에서 확인하세요.
        </Body>
      </CardBody>
    </Card>
  );
}

'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Body,
  Card,
  CardBody,
  Code,
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from '@hanui/react';
import { useFramework } from '../FrameworkTabs';
import { CodeBlock } from './CodeBlock';
import { vueDocMode } from '@/lib/vue-availability.mjs';
import vueApi from '@/lib/vue-api.json';
import vueBlocks from '@/lib/vue-blocks.json';

type VueProp = {
  name: string;
  type: string;
  required: boolean;
  description: string;
  default: string | null;
};
type VueEmit = { name: string; payload: string; description: string };
type VueComponentApi = {
  component: string;
  install: string;
  description: string;
  props: VueProp[];
  emits: VueEmit[];
  slots: string[];
};

/**
 * Vue 주소에서 컴포넌트 문서를 볼 때 맨 위에 붙는 보충 설명.
 *
 * 이 사이트의 컴포넌트 문서는 거의 전부 React 기준으로 쓰여 있는데, 같은 빌드가
 * vue.hanui.io에도 나간다. 그래서 Vue 사용자가 **React 코드를 React라는 표시 없이**
 * 읽게 된다. 문서 63개를 손으로 고치는 대신, 공통 레이아웃 한 곳에서 보충한다 —
 * 페이지마다 넣으면 새 문서에서 빠뜨린다.
 *
 * 표에 쓰는 API는 `scripts/build-vue-docs-meta.mjs`가 `.vue` 소스에서 **생성**한다.
 * 손으로 적으면 컴포넌트가 바뀔 때 조용히 어긋난다(이 저장소에서 이미 두 번 겪었다).
 */
export function VueDocSupplement({
  section = 'components',
}: {
  section?: 'components' | 'blocks';
}) {
  const { framework } = useFramework();
  const pathname = usePathname();
  const source = (section === 'blocks' ? vueBlocks : vueApi) as Record<
    string,
    VueComponentApi
  >;
  const result = vueDocMode(framework, pathname, source, section);

  if (result.mode === 'none') return null;

  if (result.mode === 'unsupported') {
    const isBlock = section === 'blocks';
    return (
      <Card variant="filled" className="mb-8">
        <CardBody>
          <Body>
            <strong>
              이 {isBlock ? '블록은' : '컴포넌트는'} Vue 버전이 없습니다.
            </strong>{' '}
            아래 예제는 React 기준이라 그대로 옮겨 쓸 수 없습니다.
          </Body>
          <Body className="mt-3">
            {isBlock ? (
              <>
                블록은 현재 React로만 제공됩니다. Vue에서는{' '}
                <Link href="/components" className="underline">
                  Vue 컴포넌트
                </Link>
                를 직접 엮어 같은 화면을 만드셔야 합니다 — 아래 React 예제가
                어떤 부품으로 짰는지는 참고가 됩니다.
              </>
            ) : (
              <>
                Vue 패키지는 KRDS 표준 부품을 기준으로 다시 만들어 React 쪽과
                구성이 다릅니다. 쓸 수 있는 Vue 컴포넌트는{' '}
                <Link href="/components" className="underline">
                  컴포넌트 목록
                </Link>
                에서 확인하세요.
              </>
            )}
          </Body>
        </CardBody>
      </Card>
    );
  }

  const api = source[result.slug];

  return (
    <Card variant="filled" className="mb-8">
      <CardBody>
        <Body>
          <strong>Vue에서 쓰기 — {api.component}</strong>
        </Body>
        {api.description && (
          <Body className="mt-2 text-krds-gray-70">{api.description}</Body>
        )}

        <Body className="mt-4">설치</Body>
        <CodeBlock
          code={`npx hanui add ${api.install} --framework vue`}
          language="bash"
          showLineNumbers={false}
        />

        {api.props.length > 0 && (
          <>
            <Body className="mt-6">Props</Body>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>이름</TableHeader>
                  <TableHeader>타입</TableHeader>
                  <TableHeader>기본값</TableHeader>
                  <TableHeader>설명</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {api.props.map((p) => (
                  <TableRow key={p.name}>
                    <TableCell>
                      <Code>{p.name}</Code>
                      {p.required && (
                        <span className="ml-1 text-krds-danger-base">*</span>
                      )}
                    </TableCell>
                    <TableCell className="break-all">
                      <Code>{p.type}</Code>
                    </TableCell>
                    <TableCell>
                      {p.default ? <Code>{p.default}</Code> : '—'}
                    </TableCell>
                    <TableCell>{p.description || '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}

        {api.emits.length > 0 && (
          <>
            <Body className="mt-6">이벤트</Body>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>이름</TableHeader>
                  <TableHeader>페이로드</TableHeader>
                  <TableHeader>설명</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {api.emits.map((e) => (
                  <TableRow key={e.name}>
                    <TableCell>
                      <Code>{e.name}</Code>
                    </TableCell>
                    <TableCell>
                      <Code>{e.payload || '—'}</Code>
                    </TableCell>
                    <TableCell>{e.description || '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}

        {api.slots.length > 0 && (
          <Body className="mt-6">
            슬롯:{' '}
            {api.slots.map((s, i) => (
              <span key={s}>
                {i > 0 && ', '}
                <Code>{s}</Code>
              </span>
            ))}
          </Body>
        )}

        <Body className="mt-6 text-krds-gray-70">
          아래 예제와 코드는 <strong>React 기준</strong>입니다. Vue에서는 위
          표의 props를 쓰세요.
        </Body>
      </CardBody>
    </Card>
  );
}

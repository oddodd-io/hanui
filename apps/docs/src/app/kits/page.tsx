'use client';

import { PageSection as Section, Heading } from '@/components/content';
import { Body, Card, CardBody, List, ListItem } from '@hanui/react';
import Link from 'next/link';

/**
 * Kit 안내 페이지 (묘비).
 *
 * Kit 문서는 2026-11-23에 내렸다. 이 페이지만 남긴 이유는 발행된 블로그 글
 * (`hanui-kits.mdx`)이 `/kits`와 `/kits/board`로 링크하고 있어서다. 통째로 지우면
 * 그 링크들이 404가 된다. `/kits/*`는 next.config에서 이 페이지로 보낸다.
 */
export default function KitsPage() {
  return (
    <>
      <Heading
        level="h1"
        title="Kit은 정리했습니다"
        description="2026년 11월, Kit 묶음을 문서와 설치 목록에서 내렸습니다. 왜 그랬는지와 대신 무엇을 쓰면 되는지 적어둡니다."
      />

      <Section>
        <Body className="leading-relaxed">
          Kit은 게시판·인증 같은 도메인 기능을 API 통신·전역 상태까지 묶어
          제공하려던 묶음이었습니다. 접은 이유는 셋입니다.
        </Body>
        <List className="mt-4">
          <ListItem>
            <strong>스택을 강요합니다.</strong> Kit을 쓰려면 axios, React Query,
            Zustand, React Hook Form, Zod를 같이 받아야 했습니다. 납품처마다
            스택이 다른데 이걸 맞춰 유지하는 건 지는 싸움이었습니다.
          </ListItem>
          <ListItem>
            <strong>설치가 되지 않았습니다.</strong> 소스 폴더 구조가 바뀐 뒤로
            설치 목록의 경로가 전부 어긋나 있었고, 그 사이 문의가 한 건도
            없었습니다.
          </ListItem>
          <ListItem>
            <strong>쓰는 곳이 없었습니다.</strong> 저희 CMS도, 이 사이트의
            쇼케이스도 Kit이 아니라 Component와 Block으로 만들어져 있습니다.
          </ListItem>
        </List>
      </Section>

      <Section>
        <Heading level="h2" id="instead" title="대신 쓸 것" />
        <Card variant="filled">
          <CardBody>
            <Body>
              화면 단위가 필요하면{' '}
              <Link href="/blocks" className="underline">
                Block
              </Link>
              을 보세요. 로그인 폼, 검색창, 빈 상태 화면처럼 완성된 UI 패턴이
              있습니다. Block은 Component를 조합한 단일 파일이라 상태 관리나
              통신 방식을 강요하지 않습니다 — 데이터는 props로 넣고 제출은
              콜백으로 받습니다.
            </Body>
            <Body className="mt-3">
              더 작은 단위는{' '}
              <Link href="/components" className="underline">
                Component
              </Link>
              입니다.
            </Body>
          </CardBody>
        </Card>
      </Section>

      <Section>
        <Heading level="h2" id="source" title="코드는 남아 있습니다" />
        <Body className="leading-relaxed">
          Kit 소스는 저장소에 그대로 있습니다. 지금 쓰고 계시다면 동작이
          멈추지는 않지만, 더 이상 손보지 않습니다. 필요하시면 복사해서 쓰시고,
          저장소 이슈로 알려주시면 판단에 참고하겠습니다.
        </Body>
      </Section>
    </>
  );
}

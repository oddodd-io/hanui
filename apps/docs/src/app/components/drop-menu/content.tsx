'use client';

import {
  PageSection as Section,
  Heading,
  Subsection,
} from '@/components/content';
import { CodeBlock } from '@/components/content/CodeBlock';
import { Body, Card, CardBody, Code, List, ListItem } from '@hanui/react';
import { VueOnlyNotice } from '@/components/content/VueOnlyNotice';

/**
 * DropMenu는 Vue에만 있다. React 쪽에는 대응 컴포넌트가 없다
 * (React의 DropdownMenu는 Radix 기반의 다른 컴포넌트다).
 *
 * 예제 코드는 `packages/vue/src/components/DropMenu/DropMenu.vue`의 props·슬롯에서
 * 그대로 끌어왔다. props 표는 Vue 주소에서 자동으로 붙는다(VueDocSupplement).
 */
export default function DropMenuPage() {
  return (
    <>
      <VueOnlyNotice name="DropMenu" />

      <Heading
        level="h1"
        title="DropMenu"
        description="KRDS 드롭다운(.krds-drop-wrap). 헤더 유틸 메뉴, 나의 GOV, 페이지 타이틀 메뉴에 씁니다."
      />

      <Section>
        <Heading level="h2" id="overview" title="개요" />
        <Body className="leading-relaxed">
          버튼을 누르면 목록이 펼쳐지는 KRDS 드롭다운입니다. 헤더 오른쪽 위의
          유틸 메뉴처럼 <strong>항목 수가 적고 바로 이동하는</strong> 메뉴에
          씁니다. 복잡한 2depth 구조에는 <Code>MainMenu</Code>를, 모바일 전체
          메뉴에는 <Code>MobileMenu</Code>를 쓰세요.
        </Body>
      </Section>

      <Section>
        <Heading level="h2" id="usage" title="사용법" />
        <Body className="leading-relaxed mb-4">
          <Code>items</Code>로 목록을 넘기고 <Code>select</Code> 이벤트로 선택을
          받습니다.
        </Body>
        <CodeBlock
          language="vue"
          code={`<script setup lang="ts">
import DropMenu from '@/components/hanui/DropMenu/DropMenu.vue';

const items = [
  { label: '로그인', href: '/login' },
  { label: '회원가입', href: '/signup' },
];

const onSelect = (item, index) => {
  console.log(item, index);
};
</script>

<template>
  <DropMenu label="전체 서비스" :items="items" @select="onSelect" />
</template>`}
        />
      </Section>

      <Section>
        <Heading level="h2" id="variants" title="쓰임새별 설정" />

        <Subsection level="h3">
          <Heading level="h3" title="나의 GOV 메뉴" />
          <Body className="leading-relaxed mb-3">
            <Code>wrapClass</Code>에 KRDS 래퍼 클래스를 넘겨 모양을 바꿉니다.
          </Body>
          <CodeBlock
            language="vue"
            code={`<DropMenu label="나의 GOV" :items="items" wrap-class="my-drop" />`}
          />
        </Subsection>

        <Subsection level="h3">
          <Heading level="h3" title="버튼 모양 바꾸기" />
          <Body className="leading-relaxed mb-3">
            기본 버튼 클래스는 헤더 유틸 메뉴용 <Code>krds-btn small text</Code>
            입니다. 다른 자리에 쓸 때는 <Code>buttonClass</Code>로 바꾸고, 토글
            아이콘이 필요 없으면 <Code>:toggle-icon=&quot;false&quot;</Code>를
            줍니다.
          </Body>
          <CodeBlock
            language="vue"
            code={`<DropMenu
  label="정렬"
  :items="items"
  button-class="krds-btn medium secondary"
  :toggle-icon="false"
/>`}
          />
        </Subsection>

        <Subsection level="h3">
          <Heading level="h3" title="목록 위아래에 내용 넣기" />
          <Body className="leading-relaxed mb-3">
            <Code>top</Code>·<Code>bottom</Code> 슬롯으로 목록 바깥에 내용을
            붙입니다. 버튼 자체를 바꾸려면 <Code>button</Code> 슬롯을 씁니다.
          </Body>
          <CodeBlock
            language="vue"
            code={`<DropMenu label="나의 GOV" :items="items">
  <template #top>
    <p class="drop-title">홍길동님</p>
  </template>
  <template #bottom>
    <button type="button" class="krds-btn small text">로그아웃</button>
  </template>
</DropMenu>`}
          />
        </Subsection>
      </Section>

      <Section>
        <Heading level="h2" id="accessibility" title="접근성" />
        <Card variant="filled">
          <CardBody>
            <List>
              <ListItem>
                <strong>버튼에 상태를 싣습니다.</strong> 펼침 여부가{' '}
                <Code>aria-expanded</Code>로 전달됩니다.
              </ListItem>
              <ListItem>
                <strong>키보드로 닫힙니다.</strong> Esc로 닫고 초점이 버튼으로
                돌아옵니다.
              </ListItem>
              <ListItem>
                <strong>바깥을 누르면 닫힙니다.</strong> 열린 채로 초점만
                빠져나가는 상태를 만들지 않습니다.
              </ListItem>
            </List>
          </CardBody>
        </Card>
      </Section>
    </>
  );
}

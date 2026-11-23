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
 * MobileMenu는 Vue에만 있다. React 쪽에는 대응 컴포넌트가 없다.
 *
 * 예제와 설명은 `packages/vue/src/components/MobileMenu/MobileMenu.vue`의
 * props·슬롯·헤더 주석에서 끌어왔다. props 표는 Vue 주소에서 자동으로 붙는다.
 */
export default function MobileMenuPage() {
  return (
    <>
      <VueOnlyNotice name="MobileMenu" />

      <Heading
        level="h1"
        title="MobileMenu"
        description="KRDS 모바일 전체메뉴(.krds-main-menu-mobile). 왼쪽 1depth 탭과 오른쪽 목록으로 구성된 기본형입니다."
      />

      <Section>
        <Heading level="h2" id="overview" title="개요" />
        <Body className="leading-relaxed">
          모바일에서 햄버거 버튼으로 여는 전체메뉴입니다. 마크업과 클래스는 KRDS{' '}
          <Code>main_menu_mobile.html</Code> 그대로이고, 동작은{' '}
          <Code>ui-script.js</Code>의 <Code>krds_mainMenuMobile</Code>을
          따릅니다. PC 폭(1024px 이상)이 되면 스스로 닫힙니다.
        </Body>
      </Section>

      <Section>
        <Heading level="h2" id="usage" title="사용법" />
        <Body className="leading-relaxed mb-4">
          여는 버튼의 <Code>aria-controls</Code>를 <Code>id</Code>와 맞춰야
          합니다.
        </Body>
        <CodeBlock
          language="vue"
          code={`<script setup lang="ts">
import { ref } from 'vue';
import MobileMenu from '@/components/hanui/MobileMenu/MobileMenu.vue';

const open = ref(false);

const items = [
  {
    label: '민원·서비스',
    children: [
      { label: '증명서 발급', href: '/certificate' },
      { label: '민원 신청', href: '/apply', selected: true },
    ],
  },
  {
    label: '정보공개',
    children: [{ label: '사전정보공표', href: '/open-info' }],
  },
];
</script>

<template>
  <button
    type="button"
    class="krds-btn"
    aria-controls="mobile-nav"
    :aria-expanded="open"
    @click="open = true"
  >
    전체메뉴
  </button>

  <MobileMenu id="mobile-nav" v-model:open="open" :items="items" />
</template>`}
        />
      </Section>

      <Section>
        <Heading level="h2" id="items" title="목록 구조" />
        <Body className="leading-relaxed mb-4">
          <Code>items</Code>는 트리입니다. <Code>selected</Code>를 준 항목은{' '}
          <Code>aria-current</Code>가 붙고{' '}
          <strong>상위 depth가 펼쳐진 채</strong> 열립니다.
        </Body>
        <CodeBlock
          language="ts"
          code={`interface MobileMenuNode {
  label: string;
  href?: string;
  external?: boolean;
  /** 현재 위치 — 상위 depth는 펼친 채 시작 */
  selected?: boolean;
  children?: MobileMenuNode[];
}`}
        />
      </Section>

      <Section>
        <Heading level="h2" id="slots" title="슬롯" />
        <Body className="leading-relaxed mb-4">
          메뉴 위아래에 들어가는 영역을 슬롯으로 채웁니다.
        </Body>
        <CodeBlock
          language="vue"
          code={`<MobileMenu id="mobile-nav" v-model:open="open" :items="items">
  <template #login>
    <a href="/login" class="krds-btn primary">로그인</a>
  </template>
  <template #search>
    <!-- 검색창 -->
  </template>
  <template #utils>
    <!-- 언어 선택 등 -->
  </template>
  <template #bottom>
    <!-- 관련 사이트 -->
  </template>
</MobileMenu>`}
        />
        <Body className="mt-4 text-krds-gray-70">
          쓸 수 있는 슬롯: <Code>utils</Code>, <Code>login</Code>,{' '}
          <Code>service</Code>, <Code>search</Code>, <Code>bottom</Code>
        </Body>
      </Section>

      <Section>
        <Heading level="h2" id="accessibility" title="접근성" />

        <Subsection level="h3">
          <Heading level="h3" title="KRDS 원본에서 보완한 것" />
          <Body className="leading-relaxed mb-3">
            원본 스크립트에 없던 것들을 채웠습니다.
          </Body>
          <Card variant="filled">
            <CardBody>
              <List>
                <ListItem>
                  <strong>대화상자 역할</strong> —{' '}
                  <Code>role=&quot;dialog&quot;</Code>와 <Code>aria-modal</Code>
                  을 붙였습니다.
                </ListItem>
                <ListItem>
                  <strong>Esc로 닫기</strong> — 4depth 패널이 열려 있으면
                  그것부터 닫습니다.
                </ListItem>
                <ListItem>
                  <strong>바깥 요소를 inert로</strong> — 원본은{' '}
                  <Code>#footer</Code>를 찾는데 KRDS 푸터 id는{' '}
                  <Code>krds-footer</Code>라 적용되지 않았습니다. 전체에
                  적용하도록 바꿨습니다.
                </ListItem>
                <ListItem>
                  <strong>Tab마다 초점 대상 재계산</strong> — 펼침 상태가 바뀌면
                  초점 순서도 따라 바뀝니다.
                </ListItem>
                <ListItem>
                  <strong>탭 방향키·Home·End와 roving tabindex</strong>
                </ListItem>
                <ListItem>
                  <strong>펼침 요소를 button으로</strong> — 원본의{' '}
                  <Code>a[href=&quot;#&quot;]</Code>는 링크가 아닌데 링크로
                  읽힙니다.
                </ListItem>
                <ListItem>
                  <strong>
                    4depth의 &quot;전체메뉴 닫기&quot;가 실제로 닫습니다.
                  </strong>
                </ListItem>
                <ListItem>
                  <strong>
                    <Code>ul</Code> 안의 <Code>h4</Code>를 <Code>div</Code>로
                  </strong>{' '}
                  — HTML 규칙 위반이었습니다.
                </ListItem>
              </List>
            </CardBody>
          </Card>
        </Subsection>

        <Subsection level="h3">
          <Heading level="h3" title="닫힐 때" />
          <Body className="leading-relaxed">
            닫으면 초점이 <strong>여는 버튼으로 돌아갑니다.</strong> 배경을
            누르면 메뉴 영역으로 초점을 옮깁니다(KRDS 기본 동작).
          </Body>
        </Subsection>
      </Section>
    </>
  );
}

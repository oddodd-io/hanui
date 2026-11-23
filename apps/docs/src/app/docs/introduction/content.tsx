'use client';

// Docs content components
import {
  PageSection as Section,
  Heading,
  Subsection,
  PageNavigation,
} from '@/components/content';

// UI components from @hanui/react
import { Body, Card, Code, List, ListItem } from '@hanui/react';
import { useFramework } from '@/components/FrameworkTabs';

export default function IntroductionPage() {
  const { framework } = useFramework();
  const isVue = framework === 'vue';

  return (
    <>
      <Heading
        level="h1"
        title="Introduction"
        description="공공기관 웹사이트 만들 때마다 KRDS 가이드 찾아보고, 접근성 체크하고, 디자인 시스템 구축하느라 지치셨죠? HANUI가 대신 해드립니다."
      />

      {/* 문제 제기 */}
      <Section>
        <Heading
          level="h2"
          id="the-problem"
          title="공공기관 웹 개발, 뭐가 문제인가요?"
        />

        <Card variant="filled">
          <List variant="dash" className="text-krds-gray-90">
            <ListItem>KRDS 가이드 읽다가 하루가 끝남</ListItem>
            <ListItem>색상, 타이포그래피, 간격... 매번 처음부터 설정</ListItem>
            <ListItem>
              &quot;이거 접근성 통과해요?&quot; 불안한 마음으로 납품
            </ListItem>
            <ListItem>프로젝트마다 똑같은 컴포넌트 또 만들기</ListItem>
            <ListItem>
              디자이너: &quot;KRDS 따라 해주세요&quot; / 개발자:
              &quot;...네&quot;
            </ListItem>
          </List>
        </Card>
      </Section>

      {/* HANUI 소개 */}
      <Section>
        <Heading
          level="h2"
          id="what-is-hanui"
          title="HANUI가 뭔데요?"
          description={`KRDS 표준 + KWCAG 2.2 접근성이 기본 탑재된 ${isVue ? 'Vue' : 'React'} 컴포넌트 라이브러리입니다. 그냥 가져다 쓰면 됩니다.`}
        />

        <Subsection level="h3">
          <Heading level="h3" title="핵심만 말하면" />

          <List variant="check">
            <ListItem>
              <strong>KRDS 2.2 표준 준수</strong> — 색상, 타이포, 간격, 컴포넌트
              다 맞춰놨음
            </ListItem>
            <ListItem>
              <strong>KWCAG 2.2 접근성 기본 탑재</strong> — 키보드 네비게이션,
              ARIA, 포커스 관리 자동
            </ListItem>
            <ListItem>
              <strong>소스 코드 복사 방식</strong> — npm 의존성 걱정 없이 내
              프로젝트에 복사해서 자유롭게 수정
            </ListItem>
            <ListItem>
              <strong>TypeScript + Tailwind</strong> — 요즘 프론트엔드 스택
              그대로
            </ListItem>
          </List>
        </Subsection>
      </Section>

      {/* 왜 만들었나 */}
      <Section>
        <Heading level="h2" id="why-hanui" title="왜 만들었나요?" />

        <Body className="leading-relaxed mb-4">
          공공기관 SI 프로젝트 해본 분들은 아실 거예요. 매번 KRDS 가이드 뒤지고,
          접근성 체크리스트 확인하고, 비슷한 컴포넌트 또 만들고... 이 반복
          작업이 너무 비효율적이었습니다.
        </Body>

        <Body className="leading-relaxed mb-4">
          그래서 만들었습니다.{' '}
          <strong>한 번 제대로 만들어서, 다 같이 쓰자.</strong>
        </Body>

        <Card variant="filled">
          <Body>
            <strong>솔직히 말하면:</strong> 아직 베타입니다. 모든 KRDS
            컴포넌트가 완성된 건 아니에요. 하지만 있는 것들은 제대로 만들었고,
            계속 추가하고 있습니다.
          </Body>
        </Card>
      </Section>

      {/* 기술 스택 */}
      <Section>
        <Heading level="h2" id="tech-stack" title="기술 스택" />

        <Subsection level="h3">
          <Heading
            level="h3"
            title={isVue ? 'Vue 3 + TypeScript' : 'React + TypeScript'}
          />
          <Body className="leading-relaxed">
            타입 안정성과 자동완성으로 개발 생산성을 높입니다. 모든 컴포넌트에
            완벽한 타입 정의가 제공됩니다.
          </Body>
          {/* 주소별 분기 없이 두 프레임워크를 함께 안내한다.
              hanui.io는 인트로·블로그 전용이라 문서 주소로 쓰지 않는다. */}
          <Card variant="filled" className="mt-4">
            <Body>
              <strong>React와 Vue 3를 모두 지원합니다.</strong> React 문서는{' '}
              <a
                href="https://react.hanui.io/docs/introduction"
                className="underline"
              >
                react.hanui.io
              </a>
              , Vue 문서는{' '}
              <a
                href="https://vue.hanui.io/docs/introduction"
                className="underline"
              >
                vue.hanui.io
              </a>
              에서 확인하세요.
            </Body>
          </Card>
        </Subsection>

        <Subsection level="h3">
          <Heading level="h3" title="Tailwind CSS" />
          <Body className="leading-relaxed">
            KRDS 색상, 타이포그래피, 간격 시스템이 Tailwind 설정에 녹아
            있습니다.
            <Code>text-krds-primary-60</Code>, <Code>bg-krds-gray-10</Code> 같은
            클래스로 바로 사용 가능합니다.
          </Body>
        </Subsection>

        <Subsection level="h3">
          <Heading
            level="h3"
            title={
              isVue ? 'Reka UI (일부 컴포넌트)' : 'Radix UI (일부 컴포넌트)'
            }
          />
          <Body className="leading-relaxed">
            {isVue ? (
              <>
                Dialog, Tabs 같은 복잡한 인터랙션이 필요한 컴포넌트는 Reka UI
                (Radix Vue)를 기반으로 만들었습니다. 접근성 로직이 자동으로
                처리되어 ARIA, 키보드 네비게이션을 신경 쓸 필요가 없습니다.
              </>
            ) : (
              <>
                Dialog, Tabs 같은 복잡한 인터랙션이 필요한 컴포넌트는 Radix UI
                Primitives를 기반으로 만들었습니다. 접근성 로직이 자동으로
                처리되어 ARIA, 키보드 네비게이션을 신경 쓸 필요가 없습니다.
              </>
            )}
          </Body>
        </Subsection>

        <Subsection level="h3">
          <Heading level="h3" title="소스 코드 복사 방식" />
          <Body className="leading-relaxed mb-4">
            shadcn/ui 스타일입니다. CLI로 컴포넌트를 내 프로젝트에 복사해서
            사용합니다.
          </Body>
          <Card variant="filled">
            <List variant="check" className="text-krds-gray-90">
              <ListItem>npm 패키지 버전 충돌 걱정 없음</ListItem>
              <ListItem>내 프로젝트에 맞게 자유롭게 수정 가능</ListItem>
              <ListItem>필요한 컴포넌트만 가져가서 번들 사이즈 최적화</ListItem>
            </List>
          </Card>
        </Subsection>
      </Section>

      {/* 누가 쓰면 좋나 */}
      <Section>
        <Heading level="h2" id="who-should-use" title="이런 분들에게 추천" />

        <List variant="check">
          <ListItem>
            <strong>공공기관 SI 프로젝트</strong>를 진행하는 개발팀
          </ListItem>
          <ListItem>
            <strong>KRDS 준수</strong>가 필수인 정부/지자체 웹사이트 개발
          </ListItem>
          <ListItem>
            <strong>웹 접근성</strong>을 제대로 지원해야 하는 프로젝트
          </ListItem>
          <ListItem>
            매번 똑같은 컴포넌트 만들기 <strong>지친</strong> 프론트엔드 개발자
          </ListItem>
        </List>
      </Section>

      {/* 브라우저 지원 */}
      <Section>
        <Heading level="h2" id="browser-support" title="브라우저 지원" />

        <Body className="mb-4">
          최신 브라우저를 지원합니다. IE는 지원하지 않습니다. (2025년이니까요)
        </Body>

        <List variant="dash">
          <ListItem>Chrome, Edge, Safari, Firefox — 최신 2개 버전</ListItem>
        </List>
      </Section>

      {/* Next Steps */}
      <PageNavigation
        next={{ title: 'Installation', href: '/docs/installation' }}
      />
    </>
  );
}

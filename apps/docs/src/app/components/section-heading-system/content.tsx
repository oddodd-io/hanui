'use client';

// Docs layout components
import {
  PageSection as Section,
  Heading,
  Subsection,
  PageNavigation,
} from '@/components/content';

// UI components - from @hanui/react
import {
  Body,
  Stack,
  Card,
  Code,
  List,
  ListItem,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@hanui/react';

export default function HeadingSystemPage() {
  return (
    <>
      <Heading
        level="h1"
        title="Section Heading System"
        description="KRDS Gap-layout을 자동으로 준수하는 섹션 헤딩 시스템입니다. 헤딩 간 간격, 헤딩-본문 간격을 CSS 인접 선택자를 통해 자동으로 관리합니다."
      />

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="api">API 레퍼런스</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {/* 1. 개요 */}
          <Section level="h2">
            <Heading
              level="h2"
              id="overview"
              title="개요"
              className="sr-only"
            />
            <Body className="mb-3">
              Section Heading System은 KRDS Gap-layout 명세를 자동으로
              준수하도록 설계된 섹션 구조 시스템입니다.
            </Body>
            <Card variant="filled" className="mb-4">
              <List variant="unordered" spacing="tight">
                <ListItem>
                  <strong>자동 CSS 주입:</strong> 컴포넌트 import 시 필요한
                  CSS가 자동으로 주입됩니다.
                </ListItem>
                <ListItem>
                  <strong>자동 간격 관리:</strong> CSS 인접 선택자를 통해 헤딩
                  간 간격을 자동으로 적용합니다.
                </ListItem>
                <ListItem>
                  <strong>시맨틱 구조:</strong> Section, Subsection으로 명확한
                  문서 계층 구조를 표현합니다.
                </ListItem>
                <ListItem>
                  <strong>KRDS 준수:</strong> 공식 KRDS Gap-layout 명세(헤딩 간
                  간격, 헤딩-본문 간격)를 100% 준수합니다.
                </ListItem>
              </List>
            </Card>
            <Code variant="block" language="tsx">
              {`<Section level="h2">
  <Heading level="h2" title="제목" description="설명" />
  <Body>본문 내용...</Body>
</Section>`}
            </Code>
          </Section>

          {/* 3. 사용법 */}
          <Section level="h2">
            <Heading level="h2" id="usage" title="사용법" />
            <Body className="mb-3">
              Section Heading System을 import하여 사용합니다. CSS는 컴포넌트
              import 시 자동으로 주입됩니다.
            </Body>
            <Code variant="block" language="tsx">
              {`import {
  PageSection as Section,
  Heading,
  Subsection
} from '@/components/content'

<Section level="h2">
  <Heading
    level="h2"
    title="소개"
    description="이 섹션에 대한 설명입니다."
  />

  <Subsection level="h3">
    <Heading level="h3" title="서브 섹션" />
    <Body>본문 내용...</Body>
  </Subsection>
</Section>`}
            </Code>
          </Section>

          {/* 4. 예제 */}
          <Section level="h2">
            <Heading level="h2" id="examples" title="예제" />

            {/* 컴포넌트 구성 */}
            <Subsection level="h3">
              <Heading level="h3" title="컴포넌트 구성" />
              <Body className="mb-4">
                Section Heading System은 다음 컴포넌트들로 구성됩니다:
              </Body>

              <Card variant="outlined" className="mb-3">
                <div className="p-4">
                  <Body weight="bold" className="mb-1">
                    Heading
                  </Body>
                  <Body size="sm" className="text-krds-gray-70">
                    헤딩과 설명을 포함하는 헤더 컴포넌트입니다. title과
                    description prop을 통해 사용하거나, children을 통해 커스텀
                    콘텐츠를 제공할 수 있습니다.
                  </Body>
                </div>
              </Card>

              <Card variant="outlined" className="mb-3">
                <div className="p-4">
                  <Body weight="bold" className="mb-1">
                    Section
                  </Body>
                  <Body size="sm" className="text-krds-gray-70">
                    h2 또는 h3 레벨의 주요 섹션을 감싸는 컨테이너입니다. CSS
                    인접 선택자를 통해 섹션 간 간격이 자동으로 조정됩니다.
                  </Body>
                </div>
              </Card>

              <Card variant="outlined" className="mb-3">
                <div className="p-4">
                  <Body weight="bold" className="mb-1">
                    Subsection
                  </Body>
                  <Body size="sm" className="text-krds-gray-70">
                    h3 또는 h4 레벨의 하위 섹션을 감싸는 컨테이너입니다.
                    Subsection 간 40px 간격이 자동으로 적용됩니다.
                  </Body>
                </div>
              </Card>

              <Code variant="block" language="tsx">
                {`// Heading 컴포넌트
<Heading level="h2" title="제목" description="설명" />

// Section 컴포넌트
<Section level="h2">
  <Heading level="h2" title="섹션 제목" />
  {/* 콘텐츠 */}
</Section>

// Subsection 컴포넌트
<Subsection level="h3">
  <Heading level="h3" title="서브섹션" />
  {/* 콘텐츠 */}
</Subsection>`}
              </Code>
            </Subsection>

            {/* 기본 사용법 */}
            <Subsection level="h3">
              <Heading level="h3" title="기본 사용법" />
              <Body className="mb-3">
                title과 description prop을 사용한 가장 간단한 형태입니다:
              </Body>
              <Code variant="block" language="tsx">
                {`<Section level="h2">
  <Heading
    level="h2"
    title="소개"
    description="이 섹션에 대한 설명입니다."
  />

  <Subsection level="h3">
    <Heading level="h3" title="서브 섹션" />
    <Body>본문 내용...</Body>
  </Subsection>
</Section>`}
              </Code>
            </Subsection>

            {/* 커스텀 설명 콘텐츠 */}
            <Subsection level="h3">
              <Heading level="h3" title="커스텀 설명 콘텐츠" />
              <Body className="mb-3">
                children을 통해 설명 영역을 자유롭게 커스터마이징할 수 있습니다:
              </Body>
              <Code variant="block" language="tsx">
                {`<Heading level="h2" title="고급 기능">
  <Body className="leading-relaxed">
    <strong>Radix UI Primitives</strong>를 기반으로
    접근성이 자동으로 보장됩니다.
  </Body>
</Heading>`}
              </Code>
            </Subsection>

            {/* 복잡한 구조 */}
            <Subsection level="h3">
              <Heading level="h3" title="복잡한 구조" />
              <Body className="mb-3">
                h1부터 시작하여 Section, Subsection을 중첩한 복잡한 문서 구조를
                표현할 수 있습니다:
              </Body>
              <Code variant="block" language="tsx">
                {`{/* 페이지 제목 (h1) */}
<Heading
  level="h1"
  title="컴포넌트 가이드"
  description="HANUI 컴포넌트 사용 가이드입니다."
/>

{/* 첫 번째 주요 섹션 (h2) */}
<Section level="h2">
  <Heading level="h2" title="주요 기능" />

  <Subsection level="h3">
    <Heading level="h3" title="접근성" />
    <Body>모든 키보드 조작 지원...</Body>
  </Subsection>

  <Subsection level="h3">
    <Heading level="h3" title="성능" />
    <Body>최적화된 렌더링...</Body>
  </Subsection>
</Section>

{/* 두 번째 주요 섹션 (h2) */}
<Section level="h2">
  <Heading level="h2" title="설치 방법" />
  <Body>본문...</Body>
</Section>`}
              </Code>
            </Subsection>

            {/* KRDS Gap-layout 명세 */}
            <Subsection level="h3">
              <Heading level="h3" title="KRDS Gap-layout 명세" />
              <Body className="mb-4">
                Section Heading System은 다음 KRDS 간격 명세를 자동으로
                적용합니다:
              </Body>

              <Card variant="outlined" className="mb-4">
                <div className="p-4">
                  <Body weight="bold" className="mb-2">
                    헤딩 간 간격 (Heading-to-Heading)
                  </Body>
                  <Stack gap="xs">
                    <Stack direction="row" align="center" gap="md">
                      <Body className="w-24 font-medium" size="sm">
                        h1 → h2:
                      </Body>
                      <Body size="sm" className="text-krds-gray-70">
                        48px
                      </Body>
                    </Stack>
                    <Stack direction="row" align="center" gap="md">
                      <Body className="w-24 font-medium" size="sm">
                        h2 → h3:
                      </Body>
                      <Body size="sm" className="text-krds-gray-70">
                        40px
                      </Body>
                    </Stack>
                    <Stack direction="row" align="center" gap="md">
                      <Body className="w-24 font-medium" size="sm">
                        h3 → h4:
                      </Body>
                      <Body size="sm" className="text-krds-gray-70">
                        24px
                      </Body>
                    </Stack>
                    <Stack direction="row" align="center" gap="md">
                      <Body className="w-24 font-medium" size="sm">
                        h4 → h5:
                      </Body>
                      <Body size="sm" className="text-krds-gray-70">
                        16px
                      </Body>
                    </Stack>
                  </Stack>
                </div>
              </Card>

              <Card variant="outlined" className="mb-4">
                <div className="p-4">
                  <Body weight="bold" className="mb-2">
                    헤딩-본문 간격 (Title-Body Gap)
                  </Body>
                  <Stack gap="xs">
                    <Stack direction="row" align="center" gap="md">
                      <Body className="w-24 font-medium" size="sm">
                        h1 → body:
                      </Body>
                      <Body size="sm" className="text-krds-gray-70">
                        24px (title-body-large)
                      </Body>
                    </Stack>
                    <Stack direction="row" align="center" gap="md">
                      <Body className="w-24 font-medium" size="sm">
                        h2 → body:
                      </Body>
                      <Body size="sm" className="text-krds-gray-70">
                        20px (title-body-medium)
                      </Body>
                    </Stack>
                    <Stack direction="row" align="center" gap="md">
                      <Body className="w-24 font-medium" size="sm">
                        h3 → body:
                      </Body>
                      <Body size="sm" className="text-krds-gray-70">
                        20px (title-body-medium)
                      </Body>
                    </Stack>
                    <Stack direction="row" align="center" gap="md">
                      <Body className="w-24 font-medium" size="sm">
                        h4 → body:
                      </Body>
                      <Body size="sm" className="text-krds-gray-70">
                        20px (title-body-medium)
                      </Body>
                    </Stack>
                    <Stack direction="row" align="center" gap="md">
                      <Body className="w-24 font-medium" size="sm">
                        h5 → body:
                      </Body>
                      <Body size="sm" className="text-krds-gray-70">
                        16px (title-body-small)
                      </Body>
                    </Stack>
                  </Stack>
                </div>
              </Card>

              <Card variant="outlined">
                <div className="p-4">
                  <Body weight="bold" className="mb-2">
                    래퍼 간 간격 (Wrapper Spacing)
                  </Body>
                  <Stack gap="xs">
                    <Stack direction="row" align="center" gap="md">
                      <Body className="w-32 font-medium" size="sm">
                        Section ↔ Section:
                      </Body>
                      <Body size="sm" className="text-krds-gray-70">
                        32px (모바일) / 48px (PC)
                      </Body>
                    </Stack>
                    <Stack direction="row" align="center" gap="md">
                      <Body className="w-32 font-medium" size="sm">
                        Subsection ↔ Subsection:
                      </Body>
                      <Body size="sm" className="text-krds-gray-70">
                        40px
                      </Body>
                    </Stack>
                  </Stack>
                </div>
              </Card>
            </Subsection>
          </Section>

          {/* 5. 접근성 */}
          <Section level="h2">
            <Heading
              level="h2"
              id="accessibility"
              title="접근성"
              description="Section Heading System은 웹 접근성을 자동으로 보장합니다."
            />
            <List variant="check">
              <ListItem>
                <strong>시맨틱 HTML:</strong> 모든 헤딩은 올바른 시맨틱 HTML
                요소(h1, h2, h3, h4, h5)를 사용합니다.
              </ListItem>
              <ListItem>
                <strong>명확한 문서 구조:</strong> Section, Subsection 등의
                wrapper 컴포넌트는 명확한 문서 계층 구조를 제공하여 스크린
                리더가 페이지 구조를 정확히 파악할 수 있습니다.
              </ListItem>
              <ListItem>
                <strong>앵커 링크:</strong> 자동 생성된 ID를 통해 페이지 내
                네비게이션이 가능하며, 키보드 사용자가 특정 섹션으로 빠르게
                이동할 수 있습니다.
              </ListItem>
              <ListItem>
                <strong>올바른 헤딩 순서:</strong> h1 → h2 → h3 순서를 준수하여
                스크린 리더 사용자가 문서 구조를 쉽게 탐색할 수 있습니다.
              </ListItem>
              <ListItem>
                CSS 인접 선택자를 통한 자동 간격 관리로 일관된 시각적 계층
                구조를 제공합니다.
              </ListItem>
            </List>
          </Section>
        </TabsContent>

        <TabsContent value="api">
          <Section level="h2">
            <Heading level="h2" id="api" title="API Reference" />

            <Subsection level="h3">
              <Heading level="h3" title="Heading Props" />
              <Table small>
                <TableHeader>
                  <TableRow>
                    <TableHead>속성</TableHead>
                    <TableHead>타입</TableHead>
                    <TableHead>기본값</TableHead>
                    <TableHead>설명</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Code>level</Code>
                    </TableCell>
                    <TableCell>
                      <Code className="text-xs">
                        &apos;h1&apos; | &apos;h2&apos; | &apos;h3&apos; |
                        &apos;h4&apos; | &apos;h5&apos;
                      </Code>
                    </TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>헤딩 레벨 (필수)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Code>title</Code>
                    </TableCell>
                    <TableCell>
                      <Code className="text-xs">string</Code>
                    </TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>제목 텍스트 (필수)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Code>description</Code>
                    </TableCell>
                    <TableCell>
                      <Code className="text-xs">string</Code>
                    </TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>설명 텍스트</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Code>id</Code>
                    </TableCell>
                    <TableCell>
                      <Code className="text-xs">string</Code>
                    </TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>
                      HTML id (미제공 시 title에서 자동 생성)
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Code>className</Code>
                    </TableCell>
                    <TableCell>
                      <Code className="text-xs">string</Code>
                    </TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>추가 CSS 클래스</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Code>children</Code>
                    </TableCell>
                    <TableCell>
                      <Code className="text-xs">ReactNode</Code>
                    </TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>커스텀 설명 콘텐츠</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Subsection>

            <Subsection level="h3">
              <Heading level="h3" title="Section / Subsection Props" />
              <Table small>
                <TableHeader>
                  <TableRow>
                    <TableHead>속성</TableHead>
                    <TableHead>타입</TableHead>
                    <TableHead>기본값</TableHead>
                    <TableHead>설명</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Code>level</Code>
                    </TableCell>
                    <TableCell>
                      <Code className="text-xs">
                        &apos;h2&apos; | &apos;h3&apos; | &apos;h4&apos; |
                        &apos;h5&apos;
                      </Code>
                    </TableCell>
                    <TableCell>
                      <Code className="text-xs">
                        &apos;h2&apos; (Section)
                        <br />
                        &apos;h3&apos; (Subsection)
                      </Code>
                    </TableCell>
                    <TableCell>섹션 레벨</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Code>children</Code>
                    </TableCell>
                    <TableCell>
                      <Code className="text-xs">ReactNode</Code>
                    </TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>섹션 콘텐츠 (필수)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Code>className</Code>
                    </TableCell>
                    <TableCell>
                      <Code className="text-xs">string</Code>
                    </TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>추가 CSS 클래스</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Subsection>
          </Section>
        </TabsContent>
      </Tabs>

      <PageNavigation
        prev={{ title: 'Radio', href: '/components/radio' }}
        next={{ title: 'Select', href: '/components/select' }}
      />
    </>
  );
}

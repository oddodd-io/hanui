'use client';

import Link from 'next/link';
import { SquareArrowOutUpRight } from 'lucide-react';
import { useFramework } from '@/components/FrameworkTabs';
import { filterByFramework, hideVueOnly } from '@/lib/vue-availability.mjs';
import vueApi from '@/lib/vue-api.json';
import vueOnly from '@/lib/vue-only.json';
// Docs layout components
import { PageSection as Section, Heading } from '@/components/content';

// Docs helper components
import { Wrap } from '@/components/helpers';

// UI components - from @hanui/react
import { Body } from '@hanui/react';

// KRDS 분류 체계에 따른 컴포넌트 정리

// 타이포그래피 (HANUI 독자 분류) - 알파벳 순
const typographyComponents = [
  {
    name: 'Body',
    description: '본문 텍스트',
    href: '/components/body',
  },
  {
    name: 'Display',
    description: '대형 텍스트',
    href: '/components/display',
  },
  {
    name: 'Heading',
    description: '제목',
    href: '/components/heading',
  },
];

// 1. 아이덴티티 (Identity) - 알파벳 순
const identityComponents = [
  {
    name: 'Footer',
    description: '푸터',
    href: '/components/footer',
  },
  {
    name: 'Header',
    description: '헤더',
    href: '/components/header',
  },
  {
    name: 'Identifier',
    description: '운영기관 식별자',
    href: '/components/identifier',
  },
  {
    name: 'Masthead',
    description: '공식 배너',
    href: '/components/masthead',
  },
];

// 2. 탐색 (Navigation) - 하위 분류
const navigationMainComponents = [
  {
    name: 'Main Menu',
    description: '주 메뉴',
    // 라우트는 `main-menu`다. `mainmenu`로 적혀 있어 줄곧 404였다.
    href: '/components/main-menu',
  },
  {
    name: 'Mobile Menu',
    description: '모바일 전체메뉴 (Vue 전용)',
    href: '/components/mobile-menu',
  },
  {
    name: 'Drop Menu',
    description: '헤더 유틸 드롭다운 (Vue 전용)',
    href: '/components/drop-menu',
  },
  {
    name: 'Side Navigation',
    description: '사이드 메뉴',
    href: '/components/side-navigation',
  },
  {
    name: 'Sidebar',
    description: '어드민/대시보드 좌측 사이드바',
    href: '/components/sidebar',
  },
  {
    name: 'Tab Bars',
    description: '하단 고정 탭바',
    href: '/components/tabbars',
  },
];

const navigationContentComponents = [
  {
    name: 'Breadcrumb',
    description: '브레드크럼',
    href: '/components/breadcrumb',
  },
  {
    name: 'In-page Navigation',
    description: '콘텐츠 내 탐색',
    href: '/components/in-page-navigation',
  },
  {
    name: 'Pagination',
    description: '페이지네이션',
    href: '/components/pagination',
  },
];

const navigationLinkComponents = [
  {
    name: 'Link',
    description: 'Next.js 통합 링크',
    href: '/components/link',
  },
  {
    name: 'SkipLink',
    description: '건너뛰기 링크 (접근성)',
    href: '/components/skiplink',
  },
];

// 3. 레이아웃 및 표현 (Layout & Presentation)
const presentationComponents = [
  // Layout 컴포넌트들
  {
    name: 'AspectRatio',
    description: '종횡비 유지 컨테이너',
    href: '/components/aspect-ratio',
  },
  {
    name: 'Critical Alerts',
    description: '긴급 공지 배너',
    href: '/components/critical-alerts',
  },
  {
    name: 'Disclosure',
    description: '디스클로저',
    href: '/components/disclosure',
  },
  {
    name: 'Center',
    description: '중앙 정렬 컨테이너',
    href: '/components/center',
  },
  {
    name: 'Container',
    description: '컨테이너',
    href: '/components/container',
  },
  {
    name: 'Stack',
    description: '스택 레이아웃',
    href: '/components/stack',
  },
  {
    name: 'Flex',
    description: 'Flexbox 레이아웃',
    href: '/components/flex',
  },
  {
    name: 'Grid',
    description: 'Grid 레이아웃',
    href: '/components/grid',
  },
  {
    name: 'Wrap',
    description: '자동 줄바꿈 레이아웃',
    href: '/components/wrap',
  },
  {
    name: 'SimpleGrid',
    description: '간단한 그리드 레이아웃',
    href: '/components/simple-grid',
  },
  {
    name: 'Section Heading System',
    description: 'KRDS Gap-layout 자동 간격 시스템',
    href: '/components/section-heading-system',
  },
  {
    name: 'List',
    description: '리스트',
    href: '/components/list',
  },
  {
    name: 'Code',
    description: '인라인/블록 코드',
    href: '/components/code',
  },
  {
    name: 'Image',
    description: '이미지',
    href: '/components/image',
  },
  // Presentation 컴포넌트들
  {
    name: 'DataTable',
    description: '데이터 테이블',
    href: '/components/data-table',
  },
  {
    name: 'Modal',
    description: '모달',
    href: '/components/modal',
  },
  {
    name: 'Accordion',
    description: '아코디언',
    href: '/components/accordion',
  },
  { name: 'Tabs', description: '탭', href: '/components/tabs' },
  {
    name: 'Table',
    description: '표',
    href: '/components/table',
  },
  {
    name: 'Card',
    description: '카드',
    href: '/components/card',
  },
  {
    name: 'Carousel',
    description: '캐러셀/슬라이드 배너',
    href: '/components/carousel',
  },
];

// 4. 액션 (Action)
const actionComponents = [
  {
    name: 'Button',
    description: '버튼',
    href: '/components/button',
  },
  {
    name: 'DropdownMenu',
    description: '드롭다운 메뉴',
    href: '/components/dropdown-menu',
  },
];

// 5. 선택 (Selection)
const selectionComponents = [
  {
    name: 'Combobox',
    description: '검색 가능한 드롭다운',
    href: '/components/combobox',
  },
  {
    name: 'Checkbox',
    description: '체크박스 (단일/그룹)',
    href: '/components/checkbox',
  },
  {
    name: 'Radio',
    description: '라디오 버튼',
    href: '/components/radio',
  },
  {
    name: 'Select',
    description: '셀렉트',
    href: '/components/select',
  },
  {
    name: 'Slider',
    description: '범위 선택 슬라이더',
    href: '/components/slider',
  },
  {
    name: 'Switch',
    description: '토글 스위치',
    href: '/components/switch',
  },
  {
    name: 'Tag',
    description: '태그/필터 라벨',
    href: '/components/tag',
  },
];

// 6. 피드백 (Feedback)
const feedbackComponents = [
  {
    name: 'Badge',
    description: '상태/알림 뱃지',
    href: '/components/badge',
  },
  {
    name: 'Step Indicator',
    description: '단계 표시기',
    href: '/components/step-indicator',
  },
  {
    name: 'Alert',
    description: '정적 알림 메시지',
    href: '/components/alert',
  },
  {
    name: 'AlertDialog',
    description: '확인/취소 다이얼로그',
    href: '/components/alert-dialog',
  },
  {
    name: 'Progress',
    description: '진행률 표시',
    href: '/components/progress',
  },
  {
    name: 'Skeleton',
    description: '로딩 플레이스홀더',
    href: '/components/skeleton',
  },
  {
    name: 'Spinner',
    description: '로딩 스피너',
    href: '/components/spinner',
  },
  {
    name: 'Toast',
    description: '일시적 알림',
    href: '/components/toast',
  },
];

// 7. 도움 (Help)
const helpComponents = [
  {
    name: 'Tooltip',
    description: '툴팁',
    href: '/components/tooltip',
  },
];

// 8. 입력 (Input)
const inputComponents = [
  {
    name: 'Date Input',
    description: '날짜 입력 필드',
    href: '/components/date-input',
  },
  {
    name: 'FormField',
    description: '폼 필드 그룹 (Label, Input, Error, Helper)',
    href: '/components/form-field',
  },
  {
    name: 'Label',
    description: '라벨',
    href: '/components/label',
  },
  {
    name: 'Text Input',
    description: '텍스트 입력 필드',
    href: '/components/input',
  },
  {
    name: 'Textarea',
    description: '여러 줄 텍스트 입력',
    href: '/components/textarea',
  },
  {
    name: 'File Upload',
    description: '파일 업로드',
    href: '/components/file-upload',
  },
];

// 9. 설정 (Settings)
const settingsComponents: Array<{
  name: string;
  description?: string;
  href: string;
  updated?: boolean;
}> = [];

// 10. 콘텐츠 (Content)
const contentComponents: Array<{
  name: string;
  description?: string;
  href: string;
  updated?: boolean;
}> = [
  {
    name: 'Structured List',
    description: '구조화 목록 (카드 형식)',
    href: '/components/structured-list',
  },
  {
    name: 'Visually Hidden',
    description: '스크린리더 전용 숨김 콘텐츠',
    href: '/components/visually-hidden',
  },
];

// 컴포넌트 섹션 렌더링 함수
function ComponentSection({
  title,
  description,
  components,
  id,
}: {
  title: string;
  description?: string;
  components: Array<{
    name: string;
    description?: string;
    href: string;
    updated?: boolean;
  }>;
  id: string;
}) {
  // Vue 주소에서는 Vue에 있는 것만 남긴다. 다 비면 그 묶음은 통째로 사라진다.
  const { framework } = useFramework();
  // Vue에서는 Vue에 있는 것만, React에서는 Vue 전용을 뺀다.
  const visible = hideVueOnly(
    filterByFramework(components, framework, vueApi),
    framework,
    vueOnly
  );
  if (visible.length === 0) return null;

  return (
    <Section>
      <Heading level="h2" id={id} title={title}>
        {description && (
          <Body className="text-krds-gray-70">{description}</Body>
        )}
      </Heading>

      <Wrap gap="lg">
        {visible.map((component) => (
          <Link
            key={component.name}
            href={component.href}
            className="relative rounded-lg transition-all group flex items-center gap-2 min-w-[200px]"
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-base font-medium text-krds-gray-95 group-hover:underline transition-all">
                  {component.name}
                </span>
                {component.updated && (
                  <span className="w-2 h-2 rounded-full bg-krds-primary-base" />
                )}
              </div>
              {component.description && (
                <span className="text-sm text-krds-gray-70">
                  {component.description}
                </span>
              )}
            </div>
          </Link>
        ))}
      </Wrap>
    </Section>
  );
}

export default function ComponentsPage() {
  const { framework } = useFramework();
  // Vue에서는 목록을 거르므로 "모든"이 사실이 아니다. 편수를 세어 적는다.
  //
  // vueApi의 키 수(23)를 쓰면 안 된다 — DropMenu·MobileMenu는 Vue에 있지만 문서
  // 페이지가 없어서 목록에 뜨지 않는다. **화면에 실제로 보이는 수**를 센다.
  const vueCount = filterByFramework(
    [
      ...typographyComponents,
      ...identityComponents,
      ...navigationMainComponents,
      ...navigationContentComponents,
      ...navigationLinkComponents,
      ...presentationComponents,
      ...actionComponents,
      ...selectionComponents,
      ...feedbackComponents,
      ...helpComponents,
      ...inputComponents,
      ...contentComponents,
    ],
    'vue',
    vueApi
  ).length;

  return (
    <>
      <Heading
        level="h1"
        title="Components"
        description={
          framework === 'vue'
            ? `Vue에서 쓸 수 있는 컴포넌트 ${vueCount}개를 KRDS(Korean Design System) 분류 체계에 따라 정리했습니다. React 쪽에는 레이아웃 프리미티브 등이 더 있습니다.`
            : 'HANUI 라이브러리에서 제공하는 모든 컴포넌트를 KRDS(Korean Design System) 분류 체계에 따라 정리했습니다.'
        }
      />

      {/* 플레이그라운드 링크 */}
      <Link
        href="/playground"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between p-4 mb-8 border border-krds-gray-20 rounded-lg hover:border-krds-gray-40 transition-colors group"
      >
        <div>
          <span className="text-base font-medium text-krds-gray-90">
            컴포넌트 플레이그라운드
          </span>
          <Body className="text-sm text-krds-gray-60 mt-0.5">
            모든 컴포넌트를 한 페이지에서 확인해보세요
          </Body>
        </div>
        <SquareArrowOutUpRight className="w-4 h-4 text-krds-gray-50 group-hover:text-krds-gray-70 transition-colors" />
      </Link>

      {/* 타이포그래피 */}
      <ComponentSection
        title="타이포그래피"
        description="텍스트 스타일링을 위한 컴포넌트"
        components={typographyComponents}
        id="typography"
      />

      {/* KRDS 분류 체계 */}
      <ComponentSection
        title="아이덴티티"
        description="정부/공공기관의 공식 아이덴티티를 표현하는 컴포넌트"
        components={identityComponents}
        id="identity"
      />

      {/* 탐색은 하위 분류 셋을 합쳐 한 묶음으로 보여준다.
          직접 렌더하던 걸 ComponentSection으로 바꿔 프레임워크 거르기를 공유한다. */}
      <ComponentSection
        title="탐색"
        description="사용자가 콘텐츠를 탐색하고 이동하는 데 사용하는 컴포넌트"
        components={[
          ...navigationMainComponents,
          ...navigationContentComponents,
          ...navigationLinkComponents,
        ]}
        id="navigation"
      />

      <ComponentSection
        title="레이아웃 및 표현"
        description="콘텐츠를 구조화하고 표현하는 컴포넌트"
        components={presentationComponents}
        id="presentation"
      />

      <ComponentSection
        title="액션"
        description="사용자 행동을 유도하는 상호작용 컴포넌트"
        components={actionComponents}
        id="action"
      />

      <ComponentSection
        title="선택"
        description="사용자가 옵션을 선택하는 데 사용하는 입력 컴포넌트"
        components={selectionComponents}
        id="selection"
      />

      <ComponentSection
        title="피드백"
        description="사용자에게 상태와 결과를 알려주는 컴포넌트"
        components={feedbackComponents}
        id="feedback"
      />

      <ComponentSection
        title="도움"
        description="사용자에게 도움말과 가이드를 제공하는 컴포넌트"
        components={helpComponents}
        id="help"
      />

      <ComponentSection
        title="입력"
        description="사용자로부터 데이터를 입력받는 폼 컴포넌트"
        components={inputComponents}
        id="input"
      />

      <ComponentSection
        title="콘텐츠"
        description="접근성 및 콘텐츠 관련 컴포넌트"
        components={contentComponents}
        id="content"
      />
    </>
  );
}

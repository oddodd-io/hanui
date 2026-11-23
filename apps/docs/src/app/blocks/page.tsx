'use client';

import Link from 'next/link';
// Docs layout components
import { PageSection as Section, Heading } from '@/components/content';

// Docs helper components
import { Wrap } from '@/components/helpers';

// UI components - from @hanui/react
import { Body, Card, CardBody } from '@hanui/react';

import { useFramework } from '@/components/FrameworkTabs';
import { filterByFramework } from '@/lib/vue-availability.mjs';
import vueBlocks from '@/lib/vue-blocks.json';

// 인증 (Authentication)
const authBlocks = [
  {
    name: 'Login Form',
    description: '로그인 폼',
    href: '/blocks/login-form',
  },
  {
    name: 'Signup Form',
    description: '회원가입 폼',
    href: '/blocks/signup-form',
  },
  {
    name: 'Account Recovery',
    description: '아이디 찾기 / 비밀번호 찾기',
    href: '/blocks/account-recovery',
  },
  {
    name: 'OTP Verify',
    description: '인증번호 입력',
    href: '/blocks/otp-verify',
  },
];

// 결제 / 폼 (Payment & Forms)
const formBlocks = [
  {
    name: 'Payment Card',
    description: '카드 결제 폼',
    href: '/blocks/payment-card',
  },
  {
    name: 'Billing Address',
    description: '청구지/배송지 주소',
    href: '/blocks/billing-address',
  },
  {
    name: 'Contact Form',
    description: '문의 폼',
    href: '/blocks/contact-form',
  },
];

// 설정 / 프로필 (Settings & Profile)
const settingsBlocks = [
  {
    name: 'Profile Card',
    description: '프로필 카드',
    href: '/blocks/profile-card',
  },
  {
    name: 'Settings Section',
    description: '설정 패널',
    href: '/blocks/settings-section',
  },
  {
    name: 'Notification Settings',
    description: '알림 설정',
    href: '/blocks/notification-settings',
  },
];

// 데이터 / 정보 (Data Display)
const dataBlocks = [
  {
    name: 'Area Chart',
    description: '영역 차트',
    href: '/blocks/area-chart',
  },
  {
    name: 'Bar Chart',
    description: '막대 차트',
    href: '/blocks/bar-chart',
  },
  {
    name: 'Line Chart',
    description: '선 차트',
    href: '/blocks/line-chart',
  },
  {
    name: 'Pie Chart',
    description: '원형 차트',
    href: '/blocks/pie-chart',
  },
  {
    name: 'Stats Card',
    description: '통계 카드 그리드',
    href: '/blocks/stats-card',
  },
  {
    name: 'Team Members',
    description: '팀원 목록/초대',
    href: '/blocks/team-members',
  },
  {
    name: 'Pricing Table',
    description: '가격표',
    href: '/blocks/pricing-table',
  },
];

// 검색 / 네비게이션 (Search & Navigation)
const navBlocks = [
  {
    name: 'Search Bar',
    description: '검색 바 + 필터',
    href: '/blocks/search-bar',
  },
  {
    name: 'Empty State',
    description: '빈 상태 화면',
    href: '/blocks/empty-state',
  },
  {
    name: 'Error Page',
    description: '에러 페이지 (404, 500)',
    href: '/blocks/error-page',
  },
];

// 공공기관 특화 (Government / KRDS)
const govBlocks = [
  {
    name: 'Gov Login',
    description: '정부24 스타일 로그인',
    href: '/blocks/gov-login',
  },
  {
    name: 'Application Form',
    description: '민원신청 폼',
    href: '/blocks/application-form',
  },
  {
    name: 'Service Card Grid',
    description: '서비스 카드 그리드',
    href: '/blocks/service-card-grid',
  },
];

// CMS 관리 — 사이드바에는 있었는데 이 목록에만 통째로 빠져 있었다
const cmsBlocks = [
  {
    name: 'Site Settings',
    description: '사이트 설정',
    href: '/blocks/site-settings',
  },
  {
    name: 'User Management',
    description: '사용자 관리',
    href: '/blocks/user-management',
  },
  {
    name: 'Board Management',
    description: '게시판 관리',
    href: '/blocks/board-management',
  },
  {
    name: 'Media Gallery',
    description: '미디어 갤러리',
    href: '/blocks/media-gallery',
  },
  {
    name: 'Trash List',
    description: '휴지통',
    href: '/blocks/trash-list',
  },
];

function BlockSection({
  title,
  description,
  blocks,
  id,
}: {
  title: string;
  description?: string;
  blocks: Array<{
    name: string;
    description?: string;
    href: string;
    updated?: boolean;
  }>;
  id: string;
}) {
  const { framework } = useFramework();
  const visible = filterByFramework(blocks, framework, vueBlocks, 'blocks');
  if (visible.length === 0) return null;

  return (
    <Section>
      <Heading level="h2" id={id} title={title}>
        {description && (
          <Body className="text-krds-gray-70">{description}</Body>
        )}
      </Heading>

      <Wrap gap="lg">
        {visible.map((block) => (
          <Link
            key={block.name}
            href={block.href}
            className="relative rounded-lg transition-all group flex items-center gap-2 min-w-[200px]"
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-base font-medium text-krds-gray-95 group-hover:underline transition-all">
                  {block.name}
                </span>
                {block.updated && (
                  <span className="w-2 h-2 rounded-full bg-krds-primary-base" />
                )}
              </div>
              {block.description && (
                <span className="text-sm text-krds-gray-70">
                  {block.description}
                </span>
              )}
            </div>
          </Link>
        ))}
      </Wrap>
    </Section>
  );
}

export default function BlocksPage() {
  const { framework } = useFramework();
  const vueBlockCount = Object.keys(vueBlocks).length;

  return (
    <>
      <Heading
        level="h1"
        title="Blocks"
        description="HANUI 컴포넌트를 조합한 복사-붙여넣기용 UI 섹션. 로그인 폼, 결제 폼, 설정 패널 등 자주 사용하는 UI를 바로 가져다 쓰세요."
      />

      {/* Vue 블록이 하나도 없으면 아래 묶음이 전부 사라져 빈 화면이 된다.
          빈 화면만 두지 않고 왜 비었는지 적는다. 블록이 생기면 이 카드는 사라진다. */}
      {framework === 'vue' && vueBlockCount === 0 && (
        <Card variant="filled" className="mb-8">
          <CardBody>
            <Body>
              <strong>Vue 블록은 아직 없습니다.</strong> 블록은 현재 React로만
              제공됩니다.
            </Body>
            <Body className="mt-3">
              Vue 패키지는 KRDS 표준 부품을 다시 만드는 쪽을 먼저 했습니다. 지금
              쓸 수 있는 것은{' '}
              <Link href="/components" className="underline">
                Vue 컴포넌트
              </Link>
              이고, 블록이 하던 화면 단위 조합은 그 컴포넌트를 직접 엮어
              만드셔야 합니다.
            </Body>
            <Body className="mt-3 text-krds-gray-70">
              React 블록의 구성이 참고가 되신다면 프레임워크를 React로 바꿔
              보세요 — 같은 화면을 어떤 부품으로 짰는지 볼 수 있습니다.
            </Body>
          </CardBody>
        </Card>
      )}

      <BlockSection
        title="인증"
        description="로그인, 회원가입 등 인증 관련 UI 블록"
        blocks={authBlocks}
        id="authentication"
      />

      <BlockSection
        title="결제 / 폼"
        description="결제, 주소 입력, 문의 등 폼 UI 블록"
        blocks={formBlocks}
        id="forms"
      />

      <BlockSection
        title="설정 / 프로필"
        description="프로필 카드, 설정 패널, 알림 설정 등 UI 블록"
        blocks={settingsBlocks}
        id="settings"
      />

      <BlockSection
        title="데이터 / 정보"
        description="통계 카드, 팀원 목록, 가격표 등 정보 표시 UI 블록"
        blocks={dataBlocks}
        id="data"
      />

      <BlockSection
        title="검색 / 네비게이션"
        description="검색, 빈 상태, 에러 페이지 등 UI 블록"
        blocks={navBlocks}
        id="navigation"
      />

      <BlockSection
        title="공공기관 특화"
        description="정부24 스타일 로그인, 민원신청 폼 등 공공기관용 UI 블록"
        blocks={govBlocks}
        id="government"
      />

      <BlockSection
        title="CMS 관리"
        description="사이트 설정, 사용자·게시판 관리 등 운영 화면 UI 블록"
        blocks={cmsBlocks}
        id="cms"
      />
    </>
  );
}

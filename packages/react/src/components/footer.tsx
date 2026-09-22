'use client';

import { useState, type ComponentType } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ChevronRight, X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { List, ListItem } from './list';

/** 관련 사이트 링크 */
export interface FooterRelatedSiteLink {
  name: string;
  url: string;
}

/** 관련 사이트 그룹 */
export interface FooterRelatedSite {
  id: string;
  title: string;
  links: FooterRelatedSiteLink[];
}

/** 연락처 정보 */
export interface FooterContactInfo {
  label: string;
  description: string;
}

/** SNS 링크 */
export interface FooterSnsLink {
  name: string;
  icon: ComponentType;
  href: string;
}

/** 하단 메뉴 */
export interface FooterMenuItem {
  label: string;
  href: string;
  highlighted?: boolean;
}

/** 바로가기 링크 */
export interface FooterQuickLink {
  label: string;
  href: string;
}

export interface FooterProps {
  className?: string;
  logo?: string;
  logoAlt?: string;
  logoHref?: string;
  /** 관련 사이트 그룹 (모달 형태) */
  relatedSites?: FooterRelatedSite[];
  /** 기관 주소 */
  address?: string;
  /** 연락처 정보 */
  contactInfo?: FooterContactInfo[];
  /** 바로가기 링크 */
  quickLinks?: FooterQuickLink[];
  /** SNS 링크 */
  snsLinks?: FooterSnsLink[];
  /** 하단 메뉴 (개인정보처리방침 등) */
  footerMenu?: FooterMenuItem[];
  /** 저작권 텍스트 */
  copyright?: string;
  /** footer id */
  id?: string;
}

// SNS Icon Components
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const BlogIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
  </svg>
);

// 관련 사이트 (일반 직장인 시리즈)
const RELATED_SITES = [
  {
    id: 'family-sites',
    title: '출근길 사이트',
    links: [
      { name: '지하철 환승 마스터', url: '#' },
      { name: '버스 빈자리 예측기', url: '#' },
      { name: '출근 5분전 알람 무시자 모임', url: '#' },
      { name: '엘리베이터 버튼 먼저 누르기 협회', url: '#' },
      { name: '지각 변명 생성기', url: '#' },
      { name: '출근길 커피 할인 정보', url: '#' },
      { name: '월요일이 싫은 사람들', url: '#' },
      { name: '9시 출근 8시 59분 도착 클럽', url: '#' },
      { name: '졸린 눈 비비기 연구소', url: '#' },
      { name: '출퇴근 시간 가장 짧은 회사 찾기', url: '#' },
      { name: '재택근무 꿈꾸는 사람들', url: '#' },
      { name: '아침밥 포기한 직장인 연합', url: '#' },
      { name: '출근하기 싫을 때 보는 사이트', url: '#' },
    ],
  },
  {
    id: 'service-sites',
    title: '점심시간 사이트',
    links: [
      { name: '오늘 뭐 먹지 결정기', url: '#' },
      { name: '회사 근처 맛집 비밀 지도', url: '#' },
      { name: '점심값 아끼는 도시락 레시피', url: '#' },
      { name: '배달앱 쿠폰 알리미', url: '#' },
      { name: '점심 메뉴 투표 시스템', url: '#' },
      { name: '빠른 식사 챌린지', url: '#' },
      { name: '혼밥러 맛집 가이드', url: '#' },
      { name: '점심시간에 낮잠 자기', url: '#' },
      { name: '식후 커피 타임 지키기 운동', url: '#' },
      { name: '메뉴 고르다 점심시간 다 가는 사람들', url: '#' },
      { name: '월급날 점심 플렉스 모임', url: '#' },
      { name: '다이어트 내일부터 하는 사람들', url: '#' },
      { name: '점심약속 없는 날 우울한 직장인', url: '#' },
    ],
  },
  {
    id: 'info-sites',
    title: '야근 사이트',
    links: [
      { name: '야근 시 먹을 것 배달 가이드', url: '#' },
      { name: '퇴근 버튼 누르기 타이밍 연구소', url: '#' },
      { name: '야근수당 계산기', url: '#' },
      { name: '상사보다 먼저 퇴근하는 용기', url: '#' },
      { name: '야근할 때 듣는 플레이리스트', url: '#' },
      { name: '6시 칼퇴 성공 후기', url: '#' },
      { name: '퇴근 후 치맥 동호회', url: '#' },
      { name: '야근 핑계 만들기 대회', url: '#' },
      { name: '회사 에어컨 온도 전쟁 중재', url: '#' },
      { name: '퇴근 알림 설정하기', url: '#' },
      { name: '야근하는 척 하기 스킬', url: '#' },
      { name: '금요일 저녁 6시의 행복', url: '#' },
      { name: '막차 시간 알리미', url: '#' },
    ],
  },
  {
    id: 'external-sites',
    title: '월급날 사이트',
    links: [
      { name: '월급 들어오자마자 사라지는 이유', url: '#' },
      { name: '월급날 플렉스 후회 모음', url: '#' },
      { name: '통장 잔고 보지 않기 챌린지', url: '#' },
      { name: '25일까지 버티기 서바이벌', url: '#' },
      { name: '짠테크 꿀팁 공유', url: '#' },
      { name: '급여명세서 해독 가이드', url: '#' },
      { name: '세금 어디로 가는지 추적기', url: '#' },
      { name: '월급 오르면 하고 싶은 것 리스트', url: '#' },
      { name: '로또 당첨 시 퇴사 시뮬레이션', url: '#' },
      { name: '월급 루팡이 되고 싶은 직장인', url: '#' },
      { name: '저축 좀 해야겠다 생각만 하는 모임', url: '#' },
      { name: '퇴직금 계산기 (수시로 확인용)', url: '#' },
      { name: '연봉 협상 한마디도 못하는 사람들', url: '#' },
    ],
  },
];

// 연락처 정보
const CONTACT_INFO = [
  {
    label: '대표전화',
    description: '1577-1000 (유료, 평일 09시~18시)',
  },
  {
    label: '해외이용',
    description: '82-33-811-2001 (유료, 평일 09시~18시)',
  },
];

// 바로가기 링크
const QUICK_LINKS = [
  { label: '이용안내', href: '#' },
  { label: '찾아오시는 길', href: '#' },
];

// SNS 링크
const SNS_LINKS = [
  { name: '인스타그램', icon: InstagramIcon, href: '#' },
  { name: '유튜브', icon: YoutubeIcon, href: '#' },
  { name: 'X (트위터)', icon: XIcon, href: '#' },
  { name: '페이스북', icon: FacebookIcon, href: '#' },
  { name: '블로그', icon: BlogIcon, href: '#' },
];

// 하단 메뉴
const FOOTER_MENU = [
  { label: '이용안내', href: '#', highlighted: true },
  { label: '개인정보처리방침', href: '#' },
  { label: '저작권 정책', href: '#' },
  { label: '웹 접근성 품질인증 마크 획득', href: '#' },
];

export function Footer({
  className,
  logo = 'https://www.krds.go.kr/resources/img/pattern/layout/head_logo.svg',
  logoAlt = '대한민국정부',
  logoHref = '/',
  relatedSites = RELATED_SITES,
  address = '(26464) 강원특별자치도 원주시 건강로 32(반곡동) 국민건강보험공단',
  contactInfo = CONTACT_INFO,
  quickLinks = QUICK_LINKS,
  snsLinks = SNS_LINKS,
  footerMenu = FOOTER_MENU,
  copyright = '© 2023 National Health Insurance Service. All rights reserved. The Government of the Republic of Korea. All rights reserved.',
  id = 'krds-footer',
}: FooterProps) {
  const [openModal, setOpenModal] = useState<string | null>(null);

  return (
    <footer id={id} className={cn('relative z-50 bg-krds-gray-5', className)}>
      {/* Quick Links Section */}
      {relatedSites.length > 0 && (
        <div className="border-y border-krds-gray-10 bg-white">
          <div className="max-w-[var(--krds-container-2xl,1440px)] mx-auto px-[var(--krds-container-padding-mobile,1rem)] sm:px-[var(--krds-container-padding-tablet,1.5rem)] lg:px-[var(--krds-container-padding-desktop,2rem)] flex flex-col lg:flex-row">
            <nav
              className="flex flex-col lg:flex-row w-full border-x border-krds-gray-10 border-l-0 md:border-l divide-x divide-krds-gray-10"
              aria-label="관련 사이트"
            >
              {relatedSites.map((site, index) => (
                <Dialog.Root
                  key={site.id}
                  open={openModal === site.id}
                  onOpenChange={(open) => setOpenModal(open ? site.id : null)}
                >
                  <Dialog.Trigger asChild>
                    <Button
                      variant="ghost"
                      iconRight={<Plus className="w-5 h-5" />}
                      className={cn(
                        'justify-between w-full h-14 px-6 rounded-none font-normal text-krds-gray-90',
                        'hover:bg-krds-primary-5 active:bg-krds-primary-10',
                        'text-sm min-h-[calc(3.5rem-2px)] md:text-base md:min-h-14',
                        index !== 0 &&
                          'border-t border-t-krds-gray-10 md:border-t-0'
                      )}
                      title={`${site.title} 메뉴`}
                    >
                      {site.title}
                    </Button>
                  </Dialog.Trigger>

                  <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-krds-black/50 z-[1000] animate-in fade-in-0" />
                    <Dialog.Content className="fixed inset-0 bg-krds-gray-5 z-[1001] animate-in fade-in-0 slide-in-from-bottom-4 flex flex-col">
                      {/* Header */}
                      <div className="flex justify-between items-center py-5 px-6 md:px-8 md:py-0">
                        <Dialog.Title className="text-lg font-bold text-krds-gray-90 mt-40 md:text-krds-heading-md">
                          {site.title}
                        </Dialog.Title>
                        <Dialog.Close asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            iconLeft={<X className="w-10 h-10" />}
                            aria-label="닫기"
                          />
                        </Dialog.Close>
                      </div>

                      <Dialog.Description className="sr-only">
                        {site.title} 관련 사이트 목록
                      </Dialog.Description>

                      {/* Content */}
                      <div className="flex-1 overflow-y-auto">
                        <div className="max-w-[var(--krds-container-2xl,1440px)] mx-auto px-6 py-8 md:px-8 md:py-10">
                          <List className="grid grid-cols-1 gap-x-2 gap-y-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 space-y-0">
                            {site.links.map((link) => (
                              <ListItem
                                key={link.name}
                                className="m-0 before:top-[21px]"
                              >
                                <a
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="relative flex items-center gap-2 py-3 px-2 -mx-2 no-underline transition-colors focus:outline-none focus:ring-2 focus:ring-krds-primary-base focus:ring-offset-2 rounded before:content-[''] before:absolute before:inset-y-0 before:-left-6 before:right-4 before:rounded before:bg-krds-gray-10 before:opacity-0 before:transition-opacity hover:before:opacity-100 before:-z-10"
                                >
                                  {link.name}
                                  <span className="sr-only"> (새 창 열기)</span>
                                </a>
                              </ListItem>
                            ))}
                          </List>
                        </div>
                      </div>
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main Footer Content */}
      <div className="max-w-[var(--krds-container-2xl,1440px)] mx-auto px-[var(--krds-container-padding-mobile,1rem)] sm:px-[var(--krds-container-padding-tablet,1.5rem)] lg:px-[var(--krds-container-padding-desktop,2rem)] flex flex-col py-6 gap-8 md:py-8 lg:py-10 lg:gap-12">
        {/* Logo */}
        <div className="flex items-center">
          <a
            href={logoHref}
            className="inline-flex h-8 md:h-12"
            aria-label={`${logoAlt} 홈으로 이동`}
          >
            <img
              src={logo}
              alt={logoAlt}
              className="w-full h-full object-contain"
            />
          </a>
        </div>

        {/* Content Section */}
        <div className="flex flex-col gap-5 md:flex-row md:gap-8 lg:justify-between lg:flex-1">
          {/* Info Section */}
          <div className="flex flex-col flex-1 gap-5 text-sm md:text-base lg:flex-[3]">
            <p className="m-0">{address}</p>
            <ul className="list-none m-0 p-0 flex flex-col gap-3">
              {contactInfo.map((contact) => (
                <li
                  key={contact.label}
                  className="flex flex-col items-start flex-wrap break-all md:flex-row md:flex-nowrap md:break-normal lg:items-center"
                >
                  <strong className="font-bold">{contact.label}</strong>
                  <span className="font-normal ml-0 lg:ml-2">
                    {contact.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Section */}
          <div className="flex flex-col flex-shrink-0 gap-10 md:gap-12 lg:w-[23.5%]">
            {/* Quick Links */}
            <nav className="flex flex-col gap-2" aria-label="바로가기">
              {quickLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="inline-flex items-center gap-2 text-sm text-krds-gray-90 font-medium no-underline hover:underline hover:text-krds-primary-50 md:text-base transition-colors"
                >
                  {link.label}
                  <ChevronRight className="w-5 h-5" aria-hidden="true" />
                </a>
              ))}
            </nav>

            {/* SNS Links */}
            {snsLinks.length > 0 && (
              <nav className="flex flex-wrap gap-2" aria-label="소셜 미디어">
                {snsLinks.map((sns) => {
                  const IconComponent = sns.icon;
                  return (
                    <a
                      key={sns.name}
                      href={sns.href}
                      className="inline-flex items-center justify-center w-10 h-10 border border-krds-gray-20 rounded-full bg-white no-underline transition-all duration-200 hover:bg-krds-gray-5 hover:border-krds-gray-30 active:bg-krds-gray-10 focus:bg-krds-gray-10 [&>svg]:w-[51%]"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${sns.name} (새 창 열기)`}
                    >
                      <IconComponent />
                    </a>
                  );
                })}
              </nav>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col pt-6 gap-12 border-t border-krds-gray-10 text-sm md:text-base">
          <div className="flex flex-col items-start gap-6 w-full md:flex-row md:items-center md:justify-between md:gap-0">
            {/* Footer Menu */}
            <nav
              className="inline-flex flex-wrap gap-3"
              aria-label="사이트 정책"
            >
              {footerMenu.map((menu) => (
                <a
                  key={menu.label}
                  href={menu.href}
                  className={cn(
                    'text-krds-body-sm text-krds-gray-90 no-underline hover:underline font-medium transition-colors',
                    menu.highlighted && 'text-krds-error font-bold'
                  )}
                >
                  {menu.label}
                </a>
              ))}
            </nav>

            {/* Copyright */}
            <p className="text-krds-body-sm text-krds-gray-70 m-0">
              {copyright}
            </p>
          </div>

          {/* KRDS Identifier */}
          <div className="flex items-center gap-3 py-2 px-4 bg-krds-white">
            <span
              className="w-16 h-6 bg-center bg-contain bg-no-repeat"
              style={{
                backgroundImage:
                  "url('https://www.krds.go.kr/resources/img/pattern/layout/head_logo.svg')",
              }}
            >
              <span className="sr-only">대한민국정부</span>
            </span>
            <span className="text-krds-body-sm text-krds-gray-90 whitespace-nowrap">
              이 누리집은 정부 누리집입니다.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

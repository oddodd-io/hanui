'use client';

import * as React from 'react';
import { Body } from '../body';
import { cn } from '@/lib/utils';

export interface FooterLink {
  /** 링크 텍스트 */
  label: string;
  /** URL */
  href: string;
  /** 새 창 열기 */
  external?: boolean;
}

export interface PublicFooterProps {
  /** 기관명 */
  orgName?: string;
  /** 주소 */
  address?: string;
  /** 전화번호 */
  tel?: string;
  /** 팩스 */
  fax?: string;
  /** 이메일 */
  email?: string;
  /** 저작권 표시 */
  copyright?: string;
  /** 하단 정책 링크 (개인정보처리방침, 이용약관 등) */
  policyLinks?: FooterLink[];
  /** 관련 사이트 링크 */
  relatedLinks?: FooterLink[];
  /** 로고 */
  logo?: React.ReactNode;
  /** 추가 className */
  className?: string;
}

/**
 * PublicFooter 블록
 *
 * 공공 웹사이트 하단 영역. 기관 정보, 정책 링크, 관련 사이트를 표시합니다.
 * KWCAG 요구사항에 따라 연락처 정보와 개인정보처리방침 링크를 포함합니다.
 */
export function PublicFooter({
  orgName = '○○기관',
  address = '서울특별시 종로구 세종대로 209',
  tel = '02-1234-5678',
  fax = '02-1234-5679',
  email = 'admin@example.go.kr',
  copyright,
  policyLinks = [
    { label: '개인정보처리방침', href: '/privacy' },
    { label: '이용약관', href: '/terms' },
    { label: '저작권정책', href: '/copyright-policy' },
    { label: '이메일무단수집거부', href: '/email-policy' },
  ],
  relatedLinks = [],
  logo,
  className,
}: PublicFooterProps) {
  const year = new Date().getFullYear();
  const copyrightText =
    copyright ?? `© ${year} ${orgName}. All rights reserved.`;

  return (
    <footer
      className={cn(
        'border-t border-krds-gray-20 bg-krds-gray-5 py-10',
        className
      )}
      role="contentinfo"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 정책 링크 */}
        {policyLinks.length > 0 && (
          <nav aria-label="정책 링크">
            <ul className="flex flex-wrap gap-4 border-b border-krds-gray-20 pb-6 mb-6">
              {policyLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={cn(
                      'text-sm text-krds-gray-70 hover:text-krds-gray-90 hover:underline',
                      link.label === '개인정보처리방침' &&
                        'font-bold text-krds-gray-90'
                    )}
                    {...(link.external
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          {/* 기관 정보 */}
          <div className="space-y-2">
            {logo && <div className="mb-3">{logo}</div>}
            <Body size="md" className="font-semibold text-krds-gray-90">
              {orgName}
            </Body>
            <address className="not-italic space-y-1">
              <Body size="sm" className="text-krds-gray-60">
                {address}
              </Body>
              <Body size="sm" className="text-krds-gray-60">
                전화 {tel}
                {fax && <> · 팩스 {fax}</>}
              </Body>
              {email && (
                <Body size="sm" className="text-krds-gray-60">
                  이메일{' '}
                  <a
                    href={`mailto:${email}`}
                    className="underline text-krds-gray-90 hover:text-krds-primary-70"
                  >
                    {email}
                  </a>
                </Body>
              )}
            </address>
          </div>

          {/* 관련 사이트 */}
          {relatedLinks.length > 0 && (
            <nav aria-label="관련 사이트">
              <Body size="sm" className="font-semibold text-krds-gray-70 mb-2">
                관련 사이트
              </Body>
              <ul className="space-y-1">
                {relatedLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-krds-gray-60 hover:text-krds-gray-90 hover:underline"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>

        {/* 저작권 */}
        <Body size="xs" className="text-krds-gray-60 mt-6">
          {copyrightText}
        </Body>
      </div>
    </footer>
  );
}

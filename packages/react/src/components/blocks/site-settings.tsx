'use client';

import * as React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
} from '../card';
import { Input } from '../input';
import { Textarea } from '../textarea';
import { Button } from '../button';
import { Label } from '../label';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

/** 사이트 설정 데이터 */
export interface SiteSettingsData {
  /** 기관명 */
  siteName: string;
  /** 로고 URL */
  logoUrl?: string;
  /** 주소 */
  address?: string;
  /** 전화번호 */
  phone?: string;
  /** 이메일 */
  email?: string;
  /** 저작권 문구 */
  copyright?: string;
}

// ============================================================================
// SiteSettings Props
// ============================================================================

export interface SiteSettingsProps {
  /** 폼 제출 핸들러 */
  onSubmit?: (data: SiteSettingsData) => void;
  /** 로고 파일 변경 핸들러 */
  onLogoChange?: (file: File) => void;
  /** 초기값 */
  defaultValues?: Partial<SiteSettingsData>;
  /** 저장 중 상태 */
  loading?: boolean;
  /** 추가 className */
  className?: string;
}

// ============================================================================
// SiteSettings Component
// ============================================================================

/**
 * 사이트 설정 폼 블록
 *
 * CMS 사이트 기본 정보를 설정하는 폼.
 * - 기관명, 로고, 주소, 전화번호, 이메일, 저작권 문구
 * - 로고 이미지 업로드 및 미리보기
 */
export function SiteSettings({
  onSubmit,
  onLogoChange,
  defaultValues = {},
  loading = false,
  className,
}: SiteSettingsProps) {
  const [formData, setFormData] = React.useState<SiteSettingsData>({
    siteName: defaultValues.siteName || '',
    logoUrl: defaultValues.logoUrl || '',
    address: defaultValues.address || '',
    phone: defaultValues.phone || '',
    email: defaultValues.email || '',
    copyright: defaultValues.copyright || '',
  });

  const [logoPreview, setLogoPreview] = React.useState<string | undefined>(
    defaultValues.logoUrl
  );

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof SiteSettingsData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onLogoChange?.(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <Card variant="outlined" className={cn('w-full max-w-2xl', className)}>
      <CardHeader>
        <CardTitle>사이트 설정</CardTitle>
        <CardDescription>
          사이트 기본 정보를 설정합니다. 변경사항은 저장 후 즉시 반영됩니다.
        </CardDescription>
      </CardHeader>

      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 기관명 */}
          <div className="space-y-2">
            <Label htmlFor="site-name">
              기관명 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="site-name"
              placeholder="기관명을 입력하세요"
              value={formData.siteName}
              onChange={(e) => handleChange('siteName', e.target.value)}
              required
            />
          </div>

          {/* 로고 */}
          <div className="space-y-2">
            <Label htmlFor="site-logo">로고</Label>
            <div className="flex items-center gap-4">
              {logoPreview ? (
                <div className="w-24 h-24 rounded-md border border-krds-gray-20 flex items-center justify-center overflow-hidden bg-krds-gray-5">
                  <img
                    src={logoPreview}
                    alt="로고 미리보기"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-md border border-dashed border-krds-gray-30 flex items-center justify-center bg-krds-gray-5">
                  <span className="text-xs text-krds-gray-60">로고 없음</span>
                </div>
              )}
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  이미지 선택
                </Button>
                <input
                  ref={fileInputRef}
                  id="site-logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  aria-label="로고 이미지 업로드"
                />
                <p className="text-xs text-krds-gray-50">
                  PNG, JPG, SVG (권장: 200x200px)
                </p>
              </div>
            </div>
          </div>

          {/* 주소 */}
          <div className="space-y-2">
            <Label htmlFor="site-address">주소</Label>
            <Input
              id="site-address"
              placeholder="기관 주소를 입력하세요"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
            />
          </div>

          {/* 전화번호 & 이메일 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="site-phone">전화번호</Label>
              <Input
                id="site-phone"
                type="tel"
                placeholder="02-1234-5678"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="site-email">이메일</Label>
              <Input
                id="site-email"
                type="email"
                placeholder="admin@example.go.kr"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>
          </div>

          {/* 저작권 문구 */}
          <div className="space-y-2">
            <Label htmlFor="site-copyright">저작권 문구</Label>
            <Textarea
              id="site-copyright"
              placeholder="© 2026 OOO기관. All rights reserved."
              value={formData.copyright}
              onChange={(e) => handleChange('copyright', e.target.value)}
              rows={2}
            />
          </div>

          {/* 저장 버튼 */}
          <div className="flex justify-end pt-4 border-t border-krds-gray-20">
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={!formData.siteName}
            >
              저장
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

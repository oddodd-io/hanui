'use client';

import * as React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
  CardFooter,
} from '../card';
import { Input } from '../input';
import { Button } from '../button';
import { Label } from '../label';
import { Link } from '../link';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../tabs';
import { cn } from '@/lib/utils';

// ============================================================================
// 아이디 찾기 / 비밀번호 찾기 통합 블록
// ============================================================================

export interface AccountRecoveryProps {
  /** 아이디 찾기 제출 핸들러 */
  onFindId?: (data: { name: string; phone: string }) => void;
  /** 비밀번호 찾기 제출 핸들러 */
  onResetPassword?: (data: { email: string }) => void;
  /** 추가 className */
  className?: string;
  /** 카드 제목 */
  title?: string;
  /** 기본 탭 ('find-id' | 'reset-password') */
  defaultTab?: 'find-id' | 'reset-password';
  /** 로그인으로 돌아가기 링크 표시 */
  showBackToLogin?: boolean;
  /** 로그인 href */
  loginHref?: string;
  /** 회원가입 링크 표시 */
  showSignupLink?: boolean;
  /** 회원가입 href */
  signupHref?: string;
}

// ============================================================================
// 아이디 찾기 폼
// ============================================================================
function FindIdForm({
  onFindId,
}: {
  onFindId?: (data: { name: string; phone: string }) => void;
}) {
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const uid = React.useId();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 숫자만 입력, 자동 하이픈
    const digits = e.target.value.replace(/\D/g, '').slice(0, 11);
    let formatted = digits;
    if (digits.length > 7) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
    } else if (digits.length > 3) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
    }
    setPhone(formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFindId?.({ name, phone });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`${uid}-name`}>이름</Label>
        <Input
          id={`${uid}-name`}
          type="text"
          placeholder="이름을 입력하세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
          clearable
          autoComplete="name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${uid}-phone`}>휴대폰 번호</Label>
        <Input
          id={`${uid}-phone`}
          type="tel"
          placeholder="010-0000-0000"
          value={phone}
          onChange={handlePhoneChange}
          clearable
          autoComplete="tel"
          required
          minLength={13}
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={!name || phone.length < 13}
      >
        아이디 찾기
      </Button>
    </form>
  );
}

// ============================================================================
// 비밀번호 찾기 폼
// ============================================================================
function ResetPasswordForm({
  onResetPassword,
}: {
  onResetPassword?: (data: { email: string }) => void;
}) {
  const [email, setEmail] = React.useState('');
  const uid = React.useId();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onResetPassword?.({ email });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`${uid}-email`}>이메일 (아이디)</Label>
        <Input
          id={`${uid}-email`}
          type="email"
          placeholder="가입한 이메일을 입력하세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          clearable
          autoComplete="email"
          required
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={!email}
      >
        재설정 링크 보내기
      </Button>
    </form>
  );
}

// ============================================================================
// AccountRecovery 메인 컴포넌트
// ============================================================================
export function AccountRecovery({
  onFindId,
  onResetPassword,
  className,
  title = '계정 찾기',
  defaultTab = 'find-id',
  showBackToLogin = true,
  loginHref = '/login',
  showSignupLink = true,
  signupHref = '/signup',
}: AccountRecoveryProps) {
  return (
    <Card variant="outlined" className={cn('w-full max-w-md', className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          아이디 또는 비밀번호를 찾을 수 있습니다.
        </CardDescription>
      </CardHeader>

      <CardBody>
        <Tabs defaultValue={defaultTab}>
          <TabsList className="w-full mb-6">
            <TabsTrigger value="find-id" className="flex-1">
              아이디 찾기
            </TabsTrigger>
            <TabsTrigger value="reset-password" className="flex-1">
              비밀번호 찾기
            </TabsTrigger>
          </TabsList>

          <TabsContent value="find-id">
            <FindIdForm onFindId={onFindId} />
          </TabsContent>

          <TabsContent value="reset-password">
            <ResetPasswordForm onResetPassword={onResetPassword} />
          </TabsContent>
        </Tabs>
      </CardBody>

      {(showBackToLogin || showSignupLink) && (
        <CardFooter className="justify-center text-sm gap-3">
          {showBackToLogin && (
            <Link href={loginHref} variant="primary" size="sm">
              로그인으로 돌아가기
            </Link>
          )}
          {showBackToLogin && showSignupLink && (
            <span className="text-krds-gray-60" aria-hidden>
              |
            </span>
          )}
          {showSignupLink && (
            <Link href={signupHref} variant="primary" size="sm">
              회원가입
            </Link>
          )}
        </CardFooter>
      )}
    </Card>
  );
}

/** @deprecated AccountRecovery를 사용하세요 */
export const ForgotPassword = AccountRecovery;

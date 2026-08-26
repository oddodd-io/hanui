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
import { Checkbox } from '../checkbox';
import { Label } from '../label';
import { Link } from '../link';
import { Body } from '../body';
import { Progress } from '../progress';
import { StepIndicator, useSteps } from '../step-indicator';
import type { StepItem } from '../step-indicator';
import { cn } from '@/lib/utils';

export type SnsProvider = 'kakao' | 'naver' | 'google' | 'apple';

export interface SignupFormProps {
  /** 폼 제출 핸들러 */
  onSubmit?: (data: {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
    agreeTerms: boolean;
    agreePrivacy: boolean;
  }) => void;
  /** 추가 className */
  className?: string;
  /** 카드 제목 */
  title?: string;
  /** 카드 설명 */
  description?: string;
  /** 로그인 링크 표시 */
  showLoginLink?: boolean;
  /** 로그인 href */
  loginHref?: string;
  /** 이용약관 href */
  termsHref?: string;
  /** 개인정보처리방침 href */
  privacyHref?: string;
  /** SNS 로그인 표시 */
  showSnsLogin?: boolean;
  /** SNS 제공자 목록 */
  snsProviders?: SnsProvider[];
  /** SNS 로그인 핸들러 */
  onSnsLogin?: (provider: SnsProvider) => void;
  /** 폼 변형 (default: 한 페이지, stepped: 스텝 방식) */
  variant?: 'default' | 'stepped';
}

const snsConfig: Record<
  SnsProvider,
  { label: string; bg: string; text: string; icon: React.ReactNode }
> = {
  kakao: {
    label: '카카오',
    bg: 'bg-[#FEE500] hover:bg-[#FDD835]',
    text: 'text-[#191919]',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M9 1C4.58 1 1 3.79 1 7.21c0 2.17 1.45 4.08 3.64 5.18l-.93 3.44c-.08.3.26.54.52.37l4.1-2.72c.22.02.44.03.67.03 4.42 0 8-2.79 8-6.21S13.42 1 9 1z"
          fill="#191919"
        />
      </svg>
    ),
  },
  naver: {
    label: '네이버',
    bg: 'bg-[#03C75A] hover:bg-[#02B04E]',
    text: 'text-white',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M12.13 9.59L5.59 1H1v16h4.87V9.41L12.41 18H17V1h-4.87v8.59z"
          fill="white"
        />
      </svg>
    ),
  },
  google: {
    label: 'Google',
    bg: 'bg-white hover:bg-gray-50 border border-krds-gray-30',
    text: 'text-krds-gray-80',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 01-1.8 2.72v2.26h2.92A8.78 8.78 0 0017.64 9.2z"
          fill="#4285F4"
        />
        <path
          d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.33-1.58-5.04-3.71H.96v2.33A9 9 0 009 18z"
          fill="#34A853"
        />
        <path
          d="M3.96 10.71A5.41 5.41 0 013.68 9c0-.6.1-1.18.28-1.71V4.96H.96A9 9 0 000 9c0 1.45.35 2.83.96 4.04l3-2.33z"
          fill="#FBBC05"
        />
        <path
          d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59C13.46.89 11.43 0 9 0A9 9 0 00.96 4.96l3 2.33C4.67 5.16 6.66 3.58 9 3.58z"
          fill="#EA4335"
        />
      </svg>
    ),
  },
  apple: {
    label: 'Apple',
    bg: 'bg-black hover:bg-gray-900',
    text: 'text-white',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M14.94 14.46c-.38.87-.56 1.26-1.05 2.04-.68 1.09-1.64 2.44-2.83 2.45-1.06.01-1.33-.69-2.77-.68-1.44.01-1.74.7-2.8.68-1.19-.01-2.1-1.22-2.78-2.31C1.2 14.15.6 11.17 1.76 9.14c.82-1.43 2.27-2.34 3.82-2.36 1.19-.02 2.31.8 3.04.8.72 0 2.08-.99 3.5-.85.6.02 2.27.24 3.34 1.81-.09.05-2 1.16-1.97 3.47.03 2.76 2.42 3.68 2.45 3.69-.03.1-.38 1.33-1.27 2.63l.27.13zM11.18 1c.55.67.97 1.62.82 2.58-.89.06-1.93.6-2.54 1.3-.55.63-1.01 1.59-.83 2.52.97.03 1.97-.52 2.55-1.4.34-.52.59-1.19.69-1.84.07-.46.05-.9-.06-1.28A3.3 3.3 0 0011.18 1z"
          fill="white"
        />
      </svg>
    ),
  },
};

// 스텝 정의
const signupSteps: StepItem[] = [
  { label: '기본 정보' },
  { label: '비밀번호' },
  { label: '약관 동의' },
];

// ============================================================================
// 비밀번호 강도 계산
// ============================================================================
type PasswordStrength = {
  score: number; // 0~4
  label: string;
  variant: 'error' | 'warning' | 'success';
};

function getPasswordStrength(pw: string): PasswordStrength {
  if (!pw) return { score: 0, label: '', variant: 'error' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score: 1, label: '약함', variant: 'error' };
  if (score <= 2) return { score: 2, label: '보통', variant: 'warning' };
  if (score <= 3) return { score: 3, label: '강함', variant: 'success' };
  return { score: 4, label: '매우 강함', variant: 'success' };
}

// ============================================================================
// 비밀번호 강도 표시기
// ============================================================================
function PasswordStrengthBar({ password }: { password: string }) {
  const strength = getPasswordStrength(password);
  if (!password) return null;

  return (
    <div className="space-y-1">
      <Progress
        value={(strength.score / 4) * 100}
        size="sm"
        variant={strength.variant}
        aria-label="비밀번호 강도"
      />
      <span
        className={cn(
          'text-krds-body-xs leading-[150%]',
          strength.variant === 'error' && 'text-krds-danger-60',
          strength.variant === 'warning' && 'text-krds-warning-60',
          strength.variant === 'success' && 'text-krds-success-60'
        )}
      >
        {strength.label}
      </span>
    </div>
  );
}

// ============================================================================
// 비밀번호 불일치 메시지
// ============================================================================
function PasswordMismatchMessage({
  password,
  passwordConfirm,
}: {
  password: string;
  passwordConfirm: string;
}) {
  if (!passwordConfirm || password === passwordConfirm) return null;
  return (
    <p className="text-krds-body-xs leading-[150%] text-krds-danger-60">
      비밀번호가 일치하지 않습니다
    </p>
  );
}

// ============================================================================
// 모두 동의 + 개별 동의 체크박스
// ============================================================================
function AgreementCheckboxes({
  agreeTerms,
  setAgreeTerms,
  agreePrivacy,
  setAgreePrivacy,
  termsHref,
  privacyHref,
  idPrefix,
}: {
  agreeTerms: boolean;
  setAgreeTerms: (v: boolean) => void;
  agreePrivacy: boolean;
  setAgreePrivacy: (v: boolean) => void;
  termsHref: string;
  privacyHref: string;
  idPrefix: string;
}) {
  const allChecked = agreeTerms && agreePrivacy;

  const handleAgreeAll = (checked: boolean | 'indeterminate') => {
    const val = checked === true;
    setAgreeTerms(val);
    setAgreePrivacy(val);
  };

  return (
    <div className="space-y-3 pt-6">
      <Checkbox
        id={`${idPrefix}-agree-all`}
        size="sm"
        checked={allChecked}
        onCheckedChange={handleAgreeAll}
        label={
          <Body as="span" size="sm" weight="bold">
            모두 동의합니다
          </Body>
        }
      />
      <div className="border-t border-krds-gray-10" />
      <div className="space-y-3">
        <Checkbox
          id={`${idPrefix}-terms`}
          size="sm"
          checked={agreeTerms}
          onCheckedChange={(checked) => setAgreeTerms(checked === true)}
          label={
            <Body as="span" size="sm">
              <Link href={termsHref} variant="primary" size="sm">
                이용약관
              </Link>
              에 동의합니다{' '}
              <span className="text-krds-body-xs text-krds-danger-60">
                (필수)
              </span>
            </Body>
          }
        />
        <Checkbox
          id={`${idPrefix}-privacy`}
          size="sm"
          checked={agreePrivacy}
          onCheckedChange={(checked) => setAgreePrivacy(checked === true)}
          label={
            <Body as="span" size="sm">
              <Link href={privacyHref} variant="primary" size="sm">
                개인정보처리방침
              </Link>
              에 동의합니다{' '}
              <span className="text-krds-body-xs text-krds-danger-60">
                (필수)
              </span>
            </Body>
          }
        />
      </div>
    </div>
  );
}

// ============================================================================
// SNS 로그인 섹션 (공통)
// ============================================================================
function SnsLoginSection({
  snsProviders,
  onSnsLogin,
}: {
  snsProviders: SnsProvider[];
  onSnsLogin?: (provider: SnsProvider) => void;
}) {
  return (
    <>
      <div className="space-y-3">
        {snsProviders.map((provider) => {
          const config = snsConfig[provider];
          return (
            <button
              key={provider}
              type="button"
              onClick={() => onSnsLogin?.(provider)}
              className={cn(
                'flex w-full items-center justify-center gap-2 h-12 rounded-md font-bold transition-colors cursor-pointer',
                config.bg,
                config.text
              )}
            >
              {config.icon}
              <span>{config.label}로 시작하기</span>
            </button>
          );
        })}
      </div>

      {/* 구분선 */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-krds-gray-20" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="text-krds-body-sm leading-[150%] bg-krds-white px-4 text-krds-gray-50">
            또는 이메일로 가입
          </span>
        </div>
      </div>
    </>
  );
}

// ============================================================================
// 비밀번호 필드 섹션 (공통)
// ============================================================================
function PasswordFields({
  password,
  setPassword,
  passwordConfirm,
  setPasswordConfirm,
  idPrefix,
}: {
  password: string;
  setPassword: (v: string) => void;
  passwordConfirm: string;
  setPasswordConfirm: (v: string) => void;
  idPrefix: string;
}) {
  const mismatch = passwordConfirm.length > 0 && password !== passwordConfirm;

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-password`}>비밀번호</Label>
        <Input
          id={`${idPrefix}-password`}
          type="password"
          placeholder="비밀번호를 입력하세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          clearable
          autoComplete="new-password"
          required
          minLength={8}
        />
        <PasswordStrengthBar password={password} />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-password-confirm`}>비밀번호 확인</Label>
        <Input
          id={`${idPrefix}-password-confirm`}
          type="password"
          placeholder="비밀번호를 다시 입력하세요"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          clearable
          autoComplete="new-password"
          required
          minLength={8}
          status={mismatch ? 'error' : undefined}
        />
        <PasswordMismatchMessage
          password={password}
          passwordConfirm={passwordConfirm}
        />
      </div>
    </>
  );
}

// ============================================================================
// Default (한 페이지) 폼
// ============================================================================
function DefaultForm({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  passwordConfirm,
  setPasswordConfirm,
  agreeTerms,
  setAgreeTerms,
  agreePrivacy,
  setAgreePrivacy,
  termsHref,
  privacyHref,
  handleSubmit,
}: {
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  passwordConfirm: string;
  setPasswordConfirm: (v: string) => void;
  agreeTerms: boolean;
  setAgreeTerms: (v: boolean) => void;
  agreePrivacy: boolean;
  setAgreePrivacy: (v: boolean) => void;
  termsHref: string;
  privacyHref: string;
  handleSubmit: (e: React.FormEvent) => void;
}) {
  const uid = React.useId();
  const isComplete =
    name &&
    email &&
    password &&
    passwordConfirm &&
    password === passwordConfirm &&
    agreeTerms &&
    agreePrivacy;

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
        <Label htmlFor={`${uid}-email`}>이메일</Label>
        <Input
          id={`${uid}-email`}
          type="email"
          placeholder="이메일을 입력하세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          clearable
          autoComplete="email"
          required
        />
      </div>

      <PasswordFields
        password={password}
        setPassword={setPassword}
        passwordConfirm={passwordConfirm}
        setPasswordConfirm={setPasswordConfirm}
        idPrefix={uid}
      />

      <AgreementCheckboxes
        agreeTerms={agreeTerms}
        setAgreeTerms={setAgreeTerms}
        agreePrivacy={agreePrivacy}
        setAgreePrivacy={setAgreePrivacy}
        termsHref={termsHref}
        privacyHref={privacyHref}
        idPrefix={uid}
      />

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={!isComplete}
      >
        회원가입
      </Button>
    </form>
  );
}

// ============================================================================
// Stepped (스텝별) 폼
// ============================================================================
function SteppedForm({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  passwordConfirm,
  setPasswordConfirm,
  agreeTerms,
  setAgreeTerms,
  agreePrivacy,
  setAgreePrivacy,
  termsHref,
  privacyHref,
  onSubmit,
}: {
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  passwordConfirm: string;
  setPasswordConfirm: (v: string) => void;
  agreeTerms: boolean;
  setAgreeTerms: (v: boolean) => void;
  agreePrivacy: boolean;
  setAgreePrivacy: (v: boolean) => void;
  termsHref: string;
  privacyHref: string;
  onSubmit?: SignupFormProps['onSubmit'];
}) {
  const uid = React.useId();
  const stepper = useSteps({ count: 3 });

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirm) return;
    stepper.next();
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({
      name,
      email,
      password,
      passwordConfirm,
      agreeTerms,
      agreePrivacy,
    });
  };

  return (
    <div className="space-y-6">
      {/* 스텝 인디케이터 */}
      <StepIndicator steps={signupSteps} {...stepper.bind} size="sm" />

      {/* Step 1: 기본 정보 */}
      {stepper.currentStep === 0 && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            stepper.next();
          }}
          className="space-y-4"
        >
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
            <Label htmlFor={`${uid}-email`}>이메일</Label>
            <Input
              id={`${uid}-email`}
              type="email"
              placeholder="이메일을 입력하세요"
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
            disabled={!name || !email}
          >
            다음
          </Button>
        </form>
      )}

      {/* Step 2: 비밀번호 */}
      {stepper.currentStep === 1 && (
        <form onSubmit={handleStep2Submit} className="space-y-4">
          <PasswordFields
            password={password}
            setPassword={setPassword}
            passwordConfirm={passwordConfirm}
            setPasswordConfirm={setPasswordConfirm}
            idPrefix={uid}
          />

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={stepper.prev}
            >
              이전
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={
                !password || !passwordConfirm || password !== passwordConfirm
              }
            >
              다음
            </Button>
          </div>
        </form>
      )}

      {/* Step 3: 약관 동의 */}
      {stepper.currentStep === 2 && (
        <form onSubmit={handleFinalSubmit} className="space-y-4">
          <AgreementCheckboxes
            agreeTerms={agreeTerms}
            setAgreeTerms={setAgreeTerms}
            agreePrivacy={agreePrivacy}
            setAgreePrivacy={setAgreePrivacy}
            termsHref={termsHref}
            privacyHref={privacyHref}
            idPrefix={uid}
          />

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={stepper.prev}
            >
              이전
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={!agreeTerms || !agreePrivacy}
            >
              회원가입
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

// ============================================================================
// SignupForm 메인 컴포넌트
// ============================================================================
export function SignupForm({
  onSubmit,
  className,
  title = '회원가입',
  description = '새 계정을 만들어 서비스를 이용하세요.',
  showLoginLink = true,
  loginHref = '/login',
  termsHref = '/terms',
  privacyHref = '/privacy',
  showSnsLogin = false,
  snsProviders = ['kakao', 'naver', 'google'],
  onSnsLogin,
  variant = 'default',
}: SignupFormProps) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordConfirm, setPasswordConfirm] = React.useState('');
  const [agreeTerms, setAgreeTerms] = React.useState(false);
  const [agreePrivacy, setAgreePrivacy] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirm) return;
    onSubmit?.({
      name,
      email,
      password,
      passwordConfirm,
      agreeTerms,
      agreePrivacy,
    });
  };

  const formProps = {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    passwordConfirm,
    setPasswordConfirm,
    agreeTerms,
    setAgreeTerms,
    agreePrivacy,
    setAgreePrivacy,
    termsHref,
    privacyHref,
  };

  return (
    <Card variant="outlined" className={cn('w-full max-w-md', className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardBody>
        {/* SNS 로그인 */}
        {showSnsLogin && snsProviders.length > 0 && (
          <SnsLoginSection
            snsProviders={snsProviders}
            onSnsLogin={onSnsLogin}
          />
        )}

        {/* 폼 */}
        {variant === 'stepped' ? (
          <SteppedForm {...formProps} onSubmit={onSubmit} />
        ) : (
          <DefaultForm {...formProps} handleSubmit={handleSubmit} />
        )}
      </CardBody>

      {showLoginLink && (
        <CardFooter className="justify-center text-sm">
          <span className="text-krds-body-sm leading-[150%] text-krds-gray-60">
            이미 계정이 있으신가요?
          </span>
          <Link href={loginHref} variant="primary" size="sm" className="ml-1">
            로그인
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}

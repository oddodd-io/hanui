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
import { cn } from '@/lib/utils';

export interface LoginFormProps {
  /** 폼 제출 핸들러 */
  onSubmit?: (data: {
    username: string;
    password: string;
    rememberMe: boolean;
    autoLogin: boolean;
  }) => void;
  /** 추가 className */
  className?: string;
  /** 카드 제목 */
  title?: string;
  /** 카드 설명 */
  description?: string;
  /** 비밀번호 찾기 링크 표시 */
  showForgotPassword?: boolean;
  /** 회원가입 링크 표시 */
  showSignupLink?: boolean;
  /** 비밀번호 찾기 href */
  forgotPasswordHref?: string;
  /** 회원가입 href */
  signupHref?: string;
  /** 폼 초기값 */
  defaultValues?: {
    username?: string;
    password?: string;
  };
}

export function LoginForm({
  onSubmit,
  className,
  title = '로그인',
  description = '계정에 로그인하여 서비스를 이용하세요.',
  showForgotPassword = true,
  showSignupLink = true,
  forgotPasswordHref = '/forgot-password',
  signupHref = '/signup',
  defaultValues,
}: LoginFormProps) {
  const [username, setUsername] = React.useState(defaultValues?.username ?? '');
  const [password, setPassword] = React.useState(defaultValues?.password ?? '');
  const [rememberMe, setRememberMe] = React.useState(false);
  const [autoLogin, setAutoLogin] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ username, password, rememberMe, autoLogin });
  };

  return (
    <Card variant="outlined" className={cn('w-full max-w-md', className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-username">아이디</Label>
            <Input
              id="login-username"
              type="text"
              placeholder="아이디를 입력하세요"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              clearable
              autoComplete="username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="login-password">비밀번호</Label>
            <Input
              id="login-password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              clearable
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Checkbox
                id="login-remember"
                label="아이디 저장"
                size="sm"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
              />
              <Checkbox
                id="login-auto"
                label="자동 로그인"
                size="sm"
                checked={autoLogin}
                onCheckedChange={(checked) => setAutoLogin(checked === true)}
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={!username || !password}
          >
            로그인
          </Button>
        </form>
      </CardBody>

      {(showForgotPassword || showSignupLink) && (
        <CardFooter className="justify-center gap-4 text-sm">
          {showForgotPassword && (
            <Link href={forgotPasswordHref} variant="primary" size="sm">
              비밀번호 찾기
            </Link>
          )}
          {showForgotPassword && showSignupLink && (
            <Body as="span" size="sm" className="text-krds-gray-60">
              |
            </Body>
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

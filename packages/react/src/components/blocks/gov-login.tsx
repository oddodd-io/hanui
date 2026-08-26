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
import { Button } from '../button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../tabs';
import { Label } from '../label';
import { Checkbox } from '../checkbox';
import { Body } from '../body';
import { cn } from '@/lib/utils';

export interface GovLoginProps {
  /** 아이디/비밀번호 로그인 핸들러 */
  onLogin?: (data: {
    username: string;
    password: string;
    rememberMe: boolean;
  }) => void;
  /** 간편인증 핸들러 */
  onSimpleAuth?: (method: string) => void;
  /** 공동인증서 핸들러 */
  onCertAuth?: () => void;
  /** 추가 className */
  className?: string;
  /** 카드 제목 */
  title?: string;
  /** 카드 설명 */
  description?: string;
  /** 간편인증 방법 목록 */
  simpleAuthMethods?: Array<{ id: string; label: string }>;
}

const defaultSimpleAuthMethods = [
  { id: 'kakao', label: '카카오톡' },
  { id: 'naver', label: '네이버' },
  { id: 'pass', label: 'PASS' },
  { id: 'payco', label: 'PAYCO' },
  { id: 'samsung', label: '삼성패스' },
  { id: 'kb', label: 'KB모바일' },
];

export function GovLogin({
  onLogin,
  onSimpleAuth,
  onCertAuth,
  className,
  title = '로그인',
  description = '본인 확인 후 서비스를 이용하실 수 있습니다.',
  simpleAuthMethods = defaultSimpleAuthMethods,
}: GovLoginProps) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [rememberMe, setRememberMe] = React.useState(false);
  // 한 페이지에 폼이 여러 개여도 label↔input 연결이 깨지지 않도록 한다
  const uid = React.useId();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin?.({ username, password, rememberMe });
  };

  return (
    <Card variant="outlined" className={cn('w-full max-w-md', className)}>
      <CardHeader className="text-center">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardBody>
        <Tabs defaultValue="id-pw">
          <TabsList className="w-full">
            <TabsTrigger value="id-pw" className="flex-1">
              아이디 로그인
            </TabsTrigger>
            <TabsTrigger value="simple" className="flex-1">
              간편인증
            </TabsTrigger>
            <TabsTrigger value="cert" className="flex-1">
              공동인증서
            </TabsTrigger>
          </TabsList>

          {/* 아이디/비밀번호 로그인 */}
          <TabsContent value="id-pw">
            <form onSubmit={handleLogin} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor={`${uid}-username`}>아이디</Label>
                <Input
                  id={`${uid}-username`}
                  type="text"
                  placeholder="아이디를 입력하세요"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  clearable
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${uid}-password`}>비밀번호</Label>
                <Input
                  id={`${uid}-password`}
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>

              <Checkbox
                id={`${uid}-remember`}
                size="sm"
                label="아이디 저장"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={!username || !password}
              >
                로그인
              </Button>
            </form>
          </TabsContent>

          {/* 간편인증 */}
          <TabsContent value="simple">
            <div className="grid grid-cols-2 gap-3 pt-4">
              {simpleAuthMethods.map((method) => (
                <Button
                  key={method.id}
                  variant="outline"
                  className="h-14"
                  onClick={() => onSimpleAuth?.(method.id)}
                >
                  {method.label}
                </Button>
              ))}
            </div>
          </TabsContent>

          {/* 공동인증서 */}
          <TabsContent value="cert">
            <div className="flex flex-col items-center text-center space-y-4 pt-6 pb-2">
              <div className="w-16 h-16 rounded-full bg-krds-gray-10 flex items-center justify-center">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-krds-gray-50"
                  aria-hidden="true"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <Body size="sm" className="text-krds-gray-60">
                공동인증서(구 공인인증서)를 이용하여
                <br />
                본인 확인 후 로그인합니다.
              </Body>
              <Button variant="primary" className="w-full" onClick={onCertAuth}>
                공동인증서 로그인
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardBody>
    </Card>
  );
}

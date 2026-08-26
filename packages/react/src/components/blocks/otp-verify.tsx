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
import { Body } from '../body';
import { cn } from '@/lib/utils';

export interface OtpVerifyProps {
  /** 인증번호 제출 핸들러 */
  onSubmit?: (data: { code: string }) => void;
  /** 재전송 핸들러 */
  onResend?: () => void;
  /** 추가 className */
  className?: string;
  /** 카드 제목 */
  title?: string;
  /** 카드 설명 */
  description?: string;
  /** 인증번호 자릿수 */
  codeLength?: number;
  /** 재전송 버튼 표시 */
  showResend?: boolean;
  /** 타이머 초기값 (초 단위, 기본 180초 = 3분) */
  timerSeconds?: number;
  /** 타이머 표시 여부 */
  showTimer?: boolean;
  /** 에러 메시지 */
  error?: string;
  /** 로딩 상태 */
  loading?: boolean;
  /** 다 입력 시 자동 제출 */
  autoSubmit?: boolean;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function OtpVerify({
  onSubmit,
  onResend,
  className,
  title = '인증번호 입력',
  description = '이메일로 전송된 인증번호를 입력해주세요.',
  codeLength = 6,
  showResend = true,
  timerSeconds = 180,
  showTimer = true,
  error,
  loading = false,
  autoSubmit = false,
}: OtpVerifyProps) {
  const [codes, setCodes] = React.useState<string[]>(
    Array(codeLength).fill('')
  );
  const [remainingTime, setRemainingTime] = React.useState(timerSeconds);
  const [expired, setExpired] = React.useState(false);
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);
  const titleId = React.useId();
  const hasAutoSubmitted = React.useRef(false);

  const isComplete = codes.every((c) => c !== '');
  const isDisabled = !isComplete || loading || expired;

  // 타이머
  React.useEffect(() => {
    if (!showTimer) return;

    setRemainingTime(timerSeconds);
    setExpired(false);

    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerSeconds, showTimer]);

  // 자동 제출
  React.useEffect(() => {
    if (
      autoSubmit &&
      isComplete &&
      !expired &&
      !loading &&
      !hasAutoSubmitted.current
    ) {
      hasAutoSubmitted.current = true;
      onSubmit?.({ code: codes.join('') });
    }
  }, [autoSubmit, isComplete, expired, loading, codes, onSubmit]);

  // codes가 변경되면 자동 제출 플래그 리셋
  React.useEffect(() => {
    if (!isComplete) {
      hasAutoSubmitted.current = false;
    }
  }, [isComplete]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCodes = [...codes];
    newCodes[index] = value.slice(-1);
    setCodes(newCodes);

    if (value && index < codeLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !codes[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
    const newCodes = [...codes];
    for (let i = 0; i < Math.min(pastedData.length, codeLength); i++) {
      newCodes[i] = pastedData[i];
    }
    setCodes(newCodes);
    const focusIndex = Math.min(pastedData.length, codeLength - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isDisabled) return;
    onSubmit?.({ code: codes.join('') });
  };

  const handleResend = () => {
    setCodes(Array(codeLength).fill(''));
    setRemainingTime(timerSeconds);
    setExpired(false);
    hasAutoSubmitted.current = false;
    inputRefs.current[0]?.focus();
    onResend?.();
  };

  return (
    <Card variant="outlined" className={cn('w-full max-w-md', className)}>
      <CardHeader className="text-center">
        <CardTitle id={titleId}>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div
            role="group"
            aria-labelledby={titleId}
            className="flex justify-center gap-3"
            onPaste={handlePaste}
          >
            {codes.map((code, index) => (
              <Input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? 'one-time-code' : 'off'}
                maxLength={1}
                value={code}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={cn(
                  'w-12 h-14 text-center text-xl font-bold',
                  error && 'border-krds-danger-base',
                  expired && 'opacity-50'
                )}
                disabled={expired || loading}
                aria-label={`인증번호 ${index + 1}번째 자리`}
                aria-invalid={!!error}
              />
            ))}
          </div>

          {/* 타이머 */}
          {showTimer && (
            <div className="text-center">
              <Body
                size="sm"
                className={cn(
                  'tabular-nums',
                  expired
                    ? 'text-krds-danger-base'
                    : remainingTime <= 30
                      ? 'text-krds-warning-60'
                      : 'text-krds-gray-60'
                )}
                aria-live="polite"
              >
                {expired
                  ? '인증번호가 만료되었습니다.'
                  : `남은 시간 ${formatTime(remainingTime)}`}
              </Body>
            </div>
          )}

          {/* 에러 메시지 */}
          {error && (
            <Body
              size="sm"
              className="text-krds-danger-base text-center"
              role="alert"
            >
              {error}
            </Body>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isDisabled}
            loading={loading}
          >
            인증하기
          </Button>
        </form>
      </CardBody>

      {showResend && (
        <CardFooter className="justify-center text-sm">
          <Body as="span" size="sm" className="text-krds-gray-60">
            인증번호를 받지 못하셨나요?
          </Body>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={handleResend}
            className="ml-1"
          >
            재전송
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

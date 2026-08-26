'use client';

import * as React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import {
  FormField,
  FormLabel,
  FormError,
  FormHelperText,
} from '@/components/form-field';
import { Shield, Smartphone, Check, Copy, RefreshCw } from 'lucide-react';

/**
 * 2단계 인증 코드 검증 스키마
 */
const verifyCodeSchema = z.object({
  code: z
    .string()
    .min(1, '인증 코드를 입력해주세요')
    .length(6, '인증 코드는 6자리입니다')
    .regex(/^\d+$/, '숫자만 입력해주세요'),
});

type VerifyCodeFormData = z.infer<typeof verifyCodeSchema>;

/**
 * TwoFactorSetup 스타일 variants
 */
const twoFactorSetupVariants = cva('w-full', {
  variants: {
    size: {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      full: 'max-w-full',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export type TwoFactorStep = 'intro' | 'setup' | 'verify' | 'backup' | 'success';

export interface TwoFactorSetupProps
  extends VariantProps<typeof twoFactorSetupVariants> {
  /** QR 코드 이미지 URL 또는 Base64 */
  qrCodeUrl?: string;
  /** 수동 설정용 시크릿 키 */
  secretKey?: string;
  /** 백업 코드 목록 */
  backupCodes?: string[];
  /** 설정 시작 핸들러 */
  onSetupStart?: () => void | Promise<void>;
  /** 인증 코드 검증 핸들러 */
  onVerify: (code: string) => void | Promise<void>;
  /** 백업 코드 저장 확인 핸들러 */
  onBackupConfirm?: () => void | Promise<void>;
  /** 새 QR 코드 요청 핸들러 */
  onRefreshQR?: () => void | Promise<void>;
  /** 로딩 상태 */
  loading?: boolean;
  /** 서버 에러 메시지 */
  error?: string;
  /** 현재 단계 (외부 제어) */
  step?: TwoFactorStep;
  /** 단계 변경 핸들러 */
  onStepChange?: (step: TwoFactorStep) => void;
  /** 완료 후 리다이렉트 핸들러 */
  onComplete?: () => void;
  /** 건너뛰기 핸들러 */
  onSkip?: () => void;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * TwoFactorSetup - 2단계 인증 설정 컴포넌트
 *
 * @example
 * ```tsx
 * <TwoFactorSetup
 *   qrCodeUrl="/api/2fa/qr"
 *   secretKey="ABCD1234EFGH5678"
 *   backupCodes={['XXXX-XXXX', 'YYYY-YYYY']}
 *   onVerify={handleVerify}
 *   onComplete={handleComplete}
 * />
 * ```
 */
export const TwoFactorSetup = React.forwardRef<
  HTMLDivElement,
  TwoFactorSetupProps
>(
  (
    {
      qrCodeUrl,
      secretKey,
      backupCodes = [],
      onSetupStart,
      onVerify,
      onBackupConfirm,
      onRefreshQR,
      loading = false,
      error,
      step: controlledStep,
      onStepChange,
      onComplete,
      onSkip,
      className,
      size,
    },
    ref
  ) => {
    const [internalStep, setInternalStep] =
      React.useState<TwoFactorStep>('intro');
    const [copiedSecret, setCopiedSecret] = React.useState(false);
    const [copiedBackup, setCopiedBackup] = React.useState(false);

    const step = controlledStep ?? internalStep;

    const handleStepChange = (newStep: TwoFactorStep) => {
      if (onStepChange) {
        onStepChange(newStep);
      } else {
        setInternalStep(newStep);
      }
    };

    const verifyForm = useForm<VerifyCodeFormData>({
      resolver: zodResolver(verifyCodeSchema),
      defaultValues: { code: '' },
    });

    const handleVerifySubmit: SubmitHandler<VerifyCodeFormData> = async (
      data
    ) => {
      await onVerify(data.code);
      if (backupCodes.length > 0) {
        handleStepChange('backup');
      } else {
        handleStepChange('success');
      }
    };

    const handleCopySecret = async () => {
      if (secretKey) {
        await navigator.clipboard.writeText(secretKey);
        setCopiedSecret(true);
        setTimeout(() => setCopiedSecret(false), 2000);
      }
    };

    const handleCopyBackupCodes = async () => {
      const codesText = backupCodes.join('\n');
      await navigator.clipboard.writeText(codesText);
      setCopiedBackup(true);
      setTimeout(() => setCopiedBackup(false), 2000);
    };

    const handleSetupStart = async () => {
      if (onSetupStart) {
        await onSetupStart();
      }
      handleStepChange('setup');
    };

    const formId = React.useId();

    // 인트로 단계
    if (step === 'intro') {
      return (
        <div
          ref={ref}
          className={cn(
            twoFactorSetupVariants({ size }),
            'text-center space-y-6',
            className
          )}
        >
          <div className="mx-auto w-20 h-20 rounded-full bg-krds-primary-5 flex items-center justify-center">
            <Shield
              className="w-10 h-10 text-krds-primary-60"
              aria-hidden="true"
            />
          </div>

          <div>
            <h1 className="text-krds-heading-lg font-bold text-krds-gray-90">
              2단계 인증 설정
            </h1>
            <p className="mt-2 text-krds-body-md text-krds-gray-60">
              2단계 인증을 설정하면 계정 보안이 강화됩니다.
              <br />
              로그인 시 인증 앱의 코드가 필요합니다.
            </p>
          </div>

          <div className="text-left p-4 rounded-lg bg-krds-gray-5 space-y-3">
            <h2 className="font-medium text-krds-gray-90">준비물</h2>
            <ul className="space-y-2 text-krds-body-sm text-krds-gray-70">
              <li className="flex items-start gap-2">
                <Smartphone
                  className="w-5 h-5 text-krds-primary-60 shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span>
                  Google Authenticator, Microsoft Authenticator 등의
                  <br />
                  인증 앱이 설치된 스마트폰
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleSetupStart}
              loading={loading}
              className="w-full"
            >
              설정 시작하기
            </Button>
            {onSkip && (
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={onSkip}
                className="w-full"
              >
                나중에 설정하기
              </Button>
            )}
          </div>
        </div>
      );
    }

    // QR 코드 설정 단계
    if (step === 'setup') {
      return (
        <div
          ref={ref}
          className={cn(
            twoFactorSetupVariants({ size }),
            'space-y-6',
            className
          )}
        >
          <div className="text-center">
            <h1 className="text-krds-heading-lg font-bold text-krds-gray-90">
              인증 앱 설정
            </h1>
            <p className="mt-2 text-krds-body-md text-krds-gray-60">
              인증 앱에서 QR 코드를 스캔하거나 수동으로 키를 입력하세요.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              aria-live="polite"
              className="p-4 rounded-md bg-krds-danger-5 border border-krds-danger-30 text-krds-danger-60 text-krds-body-md"
            >
              {error}
            </div>
          )}

          {/* QR 코드 */}
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-white rounded-lg border border-krds-gray-20">
              {qrCodeUrl ? (
                <img
                  src={qrCodeUrl}
                  alt="2단계 인증 QR 코드"
                  className="w-48 h-48"
                />
              ) : (
                <div className="w-48 h-48 bg-krds-gray-10 rounded flex items-center justify-center">
                  <span className="text-krds-gray-60">QR 코드 로딩 중...</span>
                </div>
              )}
            </div>

            {onRefreshQR && (
              <button
                type="button"
                onClick={onRefreshQR}
                disabled={loading}
                className="inline-flex items-center gap-1 text-krds-body-sm text-krds-primary-60 hover:text-krds-primary-70 transition-colors disabled:opacity-50"
              >
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
                새 QR 코드 생성
              </button>
            )}
          </div>

          {/* 시크릿 키 (수동 입력용) */}
          {secretKey && (
            <div className="p-4 rounded-lg bg-krds-gray-5 space-y-2">
              <p className="text-krds-body-sm text-krds-gray-60">
                QR 코드를 스캔할 수 없는 경우, 아래 키를 직접 입력하세요:
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-3 bg-white rounded border border-krds-gray-20 font-mono text-krds-body-sm break-all">
                  {secretKey}
                </code>
                <Button
                  type="button"
                  variant="tertiary"
                  size="icon"
                  onClick={handleCopySecret}
                  aria-label="시크릿 키 복사"
                >
                  {copiedSecret ? (
                    <Check className="w-4 h-4 text-krds-success-60" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {copiedSecret && (
                <p className="text-krds-body-sm text-krds-success-60">
                  클립보드에 복사되었습니다
                </p>
              )}
            </div>
          )}

          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={() => handleStepChange('verify')}
            className="w-full"
          >
            다음: 인증 코드 입력
          </Button>
        </div>
      );
    }

    // 인증 코드 확인 단계
    if (step === 'verify') {
      return (
        <form
          onSubmit={verifyForm.handleSubmit(handleVerifySubmit)}
          className={cn(
            twoFactorSetupVariants({ size }),
            'space-y-6',
            className
          )}
          aria-busy={loading}
          noValidate
        >
          <div className="text-center">
            <h1 className="text-krds-heading-lg font-bold text-krds-gray-90">
              인증 코드 확인
            </h1>
            <p className="mt-2 text-krds-body-md text-krds-gray-60">
              인증 앱에 표시된 6자리 코드를 입력하세요.
            </p>
          </div>

          {error && (
            <div
              id={`${formId}-error`}
              role="alert"
              aria-live="polite"
              className="p-4 rounded-md bg-krds-danger-5 border border-krds-danger-30 text-krds-danger-60 text-krds-body-md"
            >
              {error}
            </div>
          )}

          <FormField
            id={`${formId}-code`}
            status={verifyForm.formState.errors.code ? 'error' : undefined}
            required
          >
            <FormLabel>인증 코드</FormLabel>
            <Input
              type="text"
              placeholder="000000"
              autoComplete="one-time-code"
              inputMode="numeric"
              maxLength={6}
              aria-required="true"
              className="text-center text-2xl tracking-widest font-mono"
              {...verifyForm.register('code')}
            />
            {verifyForm.formState.errors.code ? (
              <FormError>{verifyForm.formState.errors.code.message}</FormError>
            ) : (
              <FormHelperText>
                인증 앱에서 30초마다 새로운 코드가 생성됩니다
              </FormHelperText>
            )}
          </FormField>

          <div className="space-y-3">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              disabled={loading}
              className="w-full"
            >
              확인
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => handleStepChange('setup')}
              className="w-full"
            >
              이전으로
            </Button>
          </div>
        </form>
      );
    }

    // 백업 코드 단계
    if (step === 'backup') {
      return (
        <div
          ref={ref}
          className={cn(
            twoFactorSetupVariants({ size }),
            'space-y-6',
            className
          )}
        >
          <div className="text-center">
            <h1 className="text-krds-heading-lg font-bold text-krds-gray-90">
              백업 코드 저장
            </h1>
            <p className="mt-2 text-krds-body-md text-krds-gray-60">
              인증 앱을 사용할 수 없을 때 아래 코드로 로그인할 수 있습니다.
              <br />
              <strong className="text-krds-danger-60">
                안전한 곳에 보관하세요. 이 화면을 떠나면 다시 볼 수 없습니다.
              </strong>
            </p>
          </div>

          <div className="p-4 rounded-lg bg-krds-gray-5 space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {backupCodes.map((code, index) => (
                <code
                  key={index}
                  className="p-2 bg-white rounded border border-krds-gray-20 font-mono text-center text-krds-body-md"
                >
                  {code}
                </code>
              ))}
            </div>

            <Button
              type="button"
              variant="tertiary"
              size="md"
              onClick={handleCopyBackupCodes}
              className="w-full"
            >
              {copiedBackup ? (
                <>
                  <Check className="w-4 h-4 text-krds-success-60" />
                  복사됨
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  모두 복사하기
                </>
              )}
            </Button>
          </div>

          <div className="p-4 rounded-lg bg-krds-warning-5 border border-krds-warning-30">
            <p className="text-krds-body-sm text-krds-warning-70">
              각 백업 코드는 한 번만 사용할 수 있습니다. 사용 후에는 새로운
              백업 코드를 생성해야 합니다.
            </p>
          </div>

          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={() => {
              if (onBackupConfirm) {
                onBackupConfirm();
              }
              handleStepChange('success');
            }}
            className="w-full"
          >
            백업 코드를 저장했습니다
          </Button>
        </div>
      );
    }

    // 성공 화면
    return (
      <div
        ref={ref}
        className={cn(
          twoFactorSetupVariants({ size }),
          'text-center space-y-6',
          className
        )}
      >
        <div className="mx-auto w-20 h-20 rounded-full bg-krds-success-5 flex items-center justify-center">
          <Check
            className="w-10 h-10 text-krds-success-60"
            aria-hidden="true"
          />
        </div>

        <div>
          <h1 className="text-krds-heading-lg font-bold text-krds-gray-90">
            2단계 인증 설정 완료
          </h1>
          <p className="mt-2 text-krds-body-md text-krds-gray-60">
            2단계 인증이 성공적으로 설정되었습니다.
            <br />
            다음 로그인부터 인증 앱의 코드가 필요합니다.
          </p>
        </div>

        {onComplete && (
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={onComplete}
            className="w-full"
          >
            완료
          </Button>
        )}
      </div>
    );
  }
);

TwoFactorSetup.displayName = 'TwoFactorSetup';

export { verifyCodeSchema, type VerifyCodeFormData };

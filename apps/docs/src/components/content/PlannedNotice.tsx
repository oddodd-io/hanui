'use client';

import { Alert, AlertDescription } from '@hanui/react';

export interface PlannedNoticeProps {
  /** 무엇의 설계안인지 (예: "Search Kit") */
  name: string;
  /** 설치 방법이 정해졌을 때 안내할 문구 (선택) */
  note?: string;
}

/**
 * 아직 구현되지 않은 컴포넌트/키트의 문서 상단에 붙이는 안내.
 *
 * 문서가 먼저 작성되고 구현이 뒤따르는 경우, 아무 표시가 없으면
 * 사용자가 "이미 쓸 수 있는 것"으로 오해한다. 이 문서가 설계안임을
 * 명시해 잘못된 기대를 막는다.
 */
export function PlannedNotice({ name, note }: PlannedNoticeProps) {
  return (
    <Alert variant="warning" role="status" title="아직 구현되지 않았습니다">
      <AlertDescription>
        아래 내용은 <strong>{name}</strong>의 설계안입니다. 아직 코드가 없어
        설치하거나 사용할 수 없습니다.
        {note ? ` ${note}` : ''}
      </AlertDescription>
    </Alert>
  );
}

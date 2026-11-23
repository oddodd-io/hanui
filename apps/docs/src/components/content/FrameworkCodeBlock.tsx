'use client';

import type { ReactNode } from 'react';
import { useFramework, FrameworkTabs } from '../FrameworkTabs';
import { CodeBlock } from './CodeBlock';

interface FrameworkCodeBlockProps {
  reactCode: string;
  /**
   * Vue 코드. **없으면 Vue 주소에서 코드 대신 한 줄 안내를 띄운다.**
   *
   * 예전에는 모든 블록 문서가 `vueCode={`<!-- Coming Soon -->`}`를 넘겼다(90곳).
   * 코드 블록 안에 "Coming Soon"이 뜨는 것도 이상하고, 무엇보다 **없는 것을
   * "곧 나온다"고 약속하는 문구**였다. prop을 빼는 쪽으로 바꿨다.
   */
  vueCode?: string;
  reactLanguage?: string;
  vueLanguage?: string;
  showLineNumbers?: boolean;
  reactFileName?: string;
  vueFileName?: string;
  showTabs?: boolean;
}

export function FrameworkCodeBlock({
  reactCode,
  vueCode,
  reactLanguage = 'tsx',
  vueLanguage = 'vue',
  showLineNumbers = true,
  reactFileName,
  vueFileName,
  showTabs = false,
}: FrameworkCodeBlockProps) {
  const { framework } = useFramework();

  const isVue = framework === 'vue';

  // Vue 코드가 없으면 React 코드를 Vue 딱지만 붙여 보여주지 않는다.
  // 문서 맨 위 안내(VueDocSupplement)가 이유를 적고, 여기서는 자리만 짚는다.
  if (isVue && !vueCode) {
    return (
      <p className="text-sm text-krds-gray-60 border border-krds-gray-20 rounded-lg px-4 py-3">
        이 예제는 Vue 버전이 없습니다. 위 안내를 참고하세요.
      </p>
    );
  }

  const code = isVue ? (vueCode as string) : reactCode;
  const language = isVue ? vueLanguage : reactLanguage;
  const fileName = isVue ? vueFileName : reactFileName;

  return (
    <div className="space-y-3">
      {showTabs && (
        <div className="flex justify-end">
          <FrameworkTabs />
        </div>
      )}
      <CodeBlock
        code={code}
        language={language}
        showLineNumbers={showLineNumbers}
        fileName={fileName}
      />
    </div>
  );
}

interface FrameworkContentProps {
  react: ReactNode;
  vue: ReactNode;
}

export function FrameworkContent({ react, vue }: FrameworkContentProps) {
  const { framework } = useFramework();
  return <>{framework === 'react' ? react : vue}</>;
}

'use client';

import { useState } from 'react';
import { Copy, Check, Sparkles } from 'lucide-react';
import { Heading, Code } from '@hanui/react';
import { useFramework } from '@/components/FrameworkTabs';
import vueApi from '@/lib/vue-api.json';
import vueBlocks from '@/lib/vue-blocks.json';

type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun';

interface InstallationProps {
  componentName: string;
  componentDescription?: string;
}

export function Installation({
  componentName,
  componentDescription,
}: InstallationProps) {
  const [packageManager, setPackageManager] = useState<PackageManager>('pnpm');
  const { framework } = useFramework();
  const [copied, setCopied] = useState(false);
  const [aiCopied, setAiCopied] = useState(false);

  const getCommand = () => {
    const runners: Record<PackageManager, string> = {
      pnpm: 'pnpm',
      npm: 'npx',
      yarn: 'yarn',
      bun: 'bun',
    };
    // `hanui-vue`라는 명령은 **없다.** vue-cli 패키지는 2026-10-01에 제거됐고
    // @hanui/cli의 bin은 `hanui` 하나뿐이다. Vue는 플래그로 고른다.
    const suffix = framework === 'vue' ? ' --framework vue' : '';
    return `${runners[packageManager]} hanui add ${componentName}${suffix}`;
  };

  const pascalName =
    componentName.charAt(0).toUpperCase() +
    componentName.slice(1).replace(/-([a-z])/g, (_, c) => c.toUpperCase());

  const getAiPrompt = () => {
    const frameworkLabel = framework === 'vue' ? 'Vue' : 'React';
    const suffix = framework === 'vue' ? ' --framework vue' : '';
    const importExample =
      framework === 'vue'
        ? `import { ${pascalName} } from '@/components/hanui/${componentName}.vue';`
        : `import { ${pascalName} } from '@/components/hanui/${componentName}';`;
    const docsUrl =
      framework === 'vue'
        ? `https://vue.hanui.io/components/${componentName}`
        : `https://react.hanui.io/components/${componentName}`;

    return `HANUI 라이브러리에서 ${componentName} 컴포넌트를 설치해줘. (${frameworkLabel})

설치 명령어: npx hanui add ${componentName}${suffix}

설치 후 사용법:
${importExample}

공식 문서: ${docsUrl}`;
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getCommand());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAiCopy = async () => {
    await navigator.clipboard.writeText(getAiPrompt());
    setAiCopied(true);
    setTimeout(() => setAiCopied(false), 2000);
  };

  // Vue 주소인데 Vue 쪽에 그 이름이 없으면 설치 명령을 띄우면 안 된다 —
  // 받아지지 않는 명령을 안내하게 된다. 블록이 특히 그렇다(Vue 블록은 0개).
  const availableInVue = componentName in vueApi || componentName in vueBlocks;

  if (framework === 'vue' && !availableInVue) {
    return (
      <div className="space-y-4">
        <Heading level="h2" id="installation" className="text-2xl font-bold">
          설치
        </Heading>
        <p className="text-sm text-krds-gray-60 border border-krds-gray-20 rounded-lg px-4 py-3">
          Vue 버전이 없어 설치할 수 없습니다. 위 안내를 참고하세요.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Heading level="h2" id="installation" className="text-2xl font-bold">
          설치
        </Heading>
        <button
          onClick={handleAiCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-all bg-gradient-to-r from-violet-500 to-purple-500 text-white border-transparent hover:from-violet-600 hover:to-purple-600"
          title="AI에게 설치 요청할 프롬프트를 복사합니다"
        >
          {aiCopied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              복사됨
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              AI 프롬프트 복사
            </>
          )}
        </button>
      </div>

      <div className="space-y-4">
        {/* Package Manager Selector */}
        <div className="flex items-center gap-2">
          {(['pnpm', 'npm', 'yarn', 'bun'] as const).map((pm) => (
            <button
              key={pm}
              onClick={() => setPackageManager(pm)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                packageManager === pm
                  ? 'bg-krds-gray-90 text-white border-krds-gray-90'
                  : 'bg-transparent border-krds-gray-20 text-krds-gray-70 hover:border-krds-gray-30'
              }`}
            >
              {pm}
            </button>
          ))}
        </div>

        <div className="relative group">
          <Code variant="block" language="bash">
            {getCommand()}
          </Code>
          <button
            onClick={handleCopy}
            className="absolute top-4 right-3 p-2 rounded-md transition-all bg-krds-gray-70 hover:bg-krds-gray-60 text-krds-gray-10 opacity-0 group-hover:opacity-100"
            aria-label="Copy code"
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

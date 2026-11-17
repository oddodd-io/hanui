'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

export type Framework = 'react' | 'vue';

interface FrameworkContextType {
  framework: Framework;
  setFramework: (framework: Framework) => void;
  isVueSubdomain: boolean;
}

const FrameworkContext = createContext<FrameworkContextType | null>(null);

export function useFramework() {
  const context = useContext(FrameworkContext);
  if (!context) {
    throw new Error('useFramework must be used within a FrameworkProvider');
  }
  return context;
}

/** 서브도메인 ↔ 프레임워크. 새 프레임워크는 여기만 추가하면 된다 */
const SUBDOMAIN: Record<string, Framework> = { vue: 'vue', react: 'react' };

/** 서브도메인을 떼어내고 기본 도메인만 남긴다 (www.hanui.io·react.hanui.io → hanui.io) */
function baseHostname(hostname: string): string {
  const known = [...Object.keys(SUBDOMAIN), 'www'];
  const parts = hostname.split('.');
  return known.includes(parts[0]) ? parts.slice(1).join('.') : hostname;
}

/**
 * 서브도메인에서 프레임워크 감지
 * vue.hanui.io → vue / react.hanui.io·hanui.io → react / localhost → react
 */
function getFrameworkFromHostname(): Framework {
  if (typeof window === 'undefined') return DEFAULT_FRAMEWORK;
  return SUBDOMAIN[window.location.hostname.split('.')[0]] ?? DEFAULT_FRAMEWORK;
}

/** 서버 렌더 결과는 주소를 모르므로 늘 이 값이다 (브라우저에서 맞춘다) */
const DEFAULT_FRAMEWORK: Framework = 'react';

interface FrameworkProviderProps {
  children: ReactNode;
  defaultFramework?: Framework;
}

export function FrameworkProvider({
  children,
  defaultFramework,
}: FrameworkProviderProps) {
  // 첫 렌더는 서버와 같은 값으로 두고(하이드레이션 어긋남 방지),
  // 붙은 뒤에 실제 주소를 보고 맞춘다. useState 초기값으로 주소를 읽으면
  // 서버는 react로 그리고 브라우저는 vue로 계산해, vue.hanui.io인데
  // React 탭이 켜져 보이는 상태가 된다.
  const [framework, setFramework] = useState<Framework>(
    defaultFramework ?? DEFAULT_FRAMEWORK
  );

  useEffect(() => {
    if (defaultFramework) return;
    setFramework(getFrameworkFromHostname());
  }, [defaultFramework]);

  const isVueSubdomain = framework === 'vue';

  // 프레임워크 변경 시 서브도메인으로 리다이렉트
  const handleSetFramework = (newFramework: Framework) => {
    if (typeof window === 'undefined') return;

    const hostname = window.location.hostname;
    const pathname = window.location.pathname;
    const protocol = window.location.protocol;

    // 로컬 개발 환경에서는 리다이렉트 없이 상태만 변경
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      setFramework(newFramework);
      return;
    }

    // 알려진 서브도메인을 떼고 기본 도메인을 구한다
    // (react.hanui.io에서 vue로 갈 때 vue.react.hanui.io가 되지 않게)
    const base = baseHostname(hostname);
    const target =
      newFramework === DEFAULT_FRAMEWORK ? base : `${newFramework}.${base}`;

    if (target === hostname) {
      setFramework(newFramework);
      return;
    }
    window.location.href = `${protocol}//${target}${pathname}`;
  };

  return (
    <FrameworkContext.Provider
      value={{ framework, setFramework: handleSetFramework, isVueSubdomain }}
    >
      {children}
    </FrameworkContext.Provider>
  );
}

interface FrameworkTabsProps {
  className?: string;
}

export function FrameworkTabs({ className = '' }: FrameworkTabsProps) {
  const { framework, setFramework } = useFramework();

  const tabs: { value: Framework; label: string }[] = [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
  ];

  return (
    <div className={`flex gap-1 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => setFramework(tab.value)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            framework === tab.value
              ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

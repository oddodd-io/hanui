'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useFramework } from '@/components/FrameworkTabs';

interface NavItem {
  id: string;
  title: string;
  level: number;
}

export function PageNav() {
  const pathname = usePathname();
  // 프레임워크가 바뀌면 본문 h2가 달라진다(Vue에 없는 묶음은 통째로 사라진다).
  // 마운트 때 한 번만 훑으면 **없어진 묶음이 목차에 남아 죽은 링크가 된다** —
  // FrameworkProvider가 주소를 보고 값을 맞추는 건 첫 렌더 '뒤'라 반드시 걸린다.
  const { framework } = useFramework();
  const [headings, setHeadings] = useState<NavItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Extract headings immediately
    const elements = document.querySelectorAll('h2[id]');
    const items: NavItem[] = Array.from(elements).map((element) => ({
      id: element.id,
      title: element.textContent || '',
      level: parseInt(element.tagName.substring(1)),
    }));

    // Update headings state in a separate microtask to avoid cascading renders
    // 0개여도 반영한다. 안 그러면 거르기 전 목차가 그대로 남는다.
    Promise.resolve().then(() => setHeadings(items));

    // Set up intersection observer for active section highlighting
    if (elements.length > 0) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id);
            }
          });
        },
        {
          rootMargin: '-80px 0px -80% 0px',
        }
      );

      elements.forEach((element) => observer.observe(element));

      return () => {
        observer.disconnect();
      };
    }
  }, [pathname, framework]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className="hidden xl:block w-48 flex-shrink-0">
      <div className="sticky top-24">
        <h4 className="font-semibold text-sm text-krds-gray-95 mb-4">
          이 페이지의 구성
        </h4>
        <ul className="space-y-1.5 text-sm">
          {headings.map((heading) => {
            const isActive = activeId === heading.id;
            return (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  className={`block py-1 transition-colors ${
                    isActive
                      ? 'border-krds-primary-base text-krds-primary-base font-medium'
                      : 'border-krds-gray-20 text-krds-gray-70 hover:text-krds-gray-95 hover:border-krds-gray-40'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(heading.id)?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start',
                    });
                  }}
                >
                  {heading.title}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

'use client';

import { useEffect, useState, useRef } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function useHeadings() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    const content = document.querySelector('[data-blog-content]');
    if (!content) return;

    initialized.current = true;
    const elements = content.querySelectorAll('h2, h3');
    const items: TocItem[] = Array.from(elements).map((el) => {
      if (!el.id) {
        el.id =
          el.textContent
            ?.trim()
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w가-힣-]/g, '') ?? '';
      }
      return {
        id: el.id,
        text: el.textContent ?? '',
        level: Number(el.tagName[1]),
      };
    });
    // 마운트 후 DOM(외부 시스템)을 한 번 읽어 목차를 만든다.
    // 파생 상태가 아니라 외부 상태 동기화라 cascading render가 발생하지 않는다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHeadings(items);
  }, []);

  return headings;
}

export function BlogToc() {
  const headings = useHeadings();
  const [activeId, setActiveId] = useState<string>('');

  // 스크롤 스파이
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 }
    );

    for (const { id } of headings) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <aside className="hidden xl:block absolute left-full top-10 ml-6 w-48 h-full">
      <div className="sticky top-24">
        <h3 className="text-sm font-semibold text-krds-gray-50 mb-3">목차</h3>
        <nav className="flex flex-col gap-0.5">
          {headings.map((h) => (
            <a
              key={h.id}
              href={`#${h.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(h.id)?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                });
              }}
              className={`block py-1 text-sm leading-snug transition-colors ${
                h.level === 3 ? 'pl-3' : ''
              } ${
                activeId === h.id
                  ? 'text-krds-primary-base font-semibold'
                  : 'text-krds-gray-40 hover:text-krds-gray-70'
              }`}
            >
              {h.text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}

'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { searchDocumentation, type SearchItem } from '@/lib/search-data';
import {
  Search,
  FileText,
  Layers,
  BookOpen,
  Users,
  Sparkles,
  Loader2,
  Bot,
} from 'lucide-react';
// Note: This component uses custom UI that doesn't benefit from HANUI components
// The result buttons have complex internal structure (icon, content, key hint)
// that would break if converted to Button component

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categoryConfig = {
  'get-started': {
    label: 'Get Started',
    icon: BookOpen,
    color: 'text-blue-600',
  },
  'design-system': {
    label: 'Design System',
    icon: Layers,
    color: 'text-purple-600',
  },
  components: { label: 'Components', icon: FileText, color: 'text-green-600' },
  templates: { label: 'Templates', icon: Sparkles, color: 'text-orange-600' },
  community: { label: 'Community', icon: Users, color: 'text-pink-600' },
  showcase: { label: 'Showcase', icon: Sparkles, color: 'text-yellow-600' },
};

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [aiResult, setAiResult] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(false);
  const [showAi, setShowAi] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const aiAbortRef = useRef<AbortController | null>(null);

  // AI search
  const handleAiSearch = useCallback(async (searchQuery: string) => {
    if (aiAbortRef.current) {
      aiAbortRef.current.abort();
    }

    const controller = new AbortController();
    aiAbortRef.current = controller;

    setAiLoading(true);
    setAiError(false);
    setAiResult('');
    setShowAi(true);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
        signal: controller.signal,
      });

      if (!response.ok) throw new Error('AI search failed');

      const data = await response.json();
      setAiResult(data.result);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setAiError(true);
    } finally {
      setAiLoading(false);
    }
  }, []);

  // Search function
  const handleSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
    setShowAi(false);
    setAiResult('');
    if (searchQuery.trim()) {
      const searchResults = searchDocumentation(searchQuery);
      setResults(searchResults);
      setSelectedIndex(-1);
    } else {
      setResults([]);
      setSelectedIndex(-1);
    }
  }, []);

  // Navigate to selected result
  const handleSelect = useCallback(
    (href: string) => {
      router.push(href);
      onClose();
      setQuery('');
      setResults([]);
      setShowAi(false);
      setAiResult('');
    },
    [router, onClose]
  );

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showAi) {
          setShowAi(false);
          return;
        }
        onClose();
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (results.length > 0) {
          setSelectedIndex((prev) => {
            if (prev < 0) return 0;
            return Math.min(prev + 1, results.length - 1);
          });
        }
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (results.length > 0) {
          setSelectedIndex((prev) => {
            if (prev <= 0) return -1;
            return prev - 1;
          });
        }
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelect(results[selectedIndex].href);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, handleSelect, onClose, showAi]);

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current && selectedIndex >= 0) {
      const selectedElement = resultsRef.current.children[
        selectedIndex
      ] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
        });
      }
    }
  }, [selectedIndex]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      setSelectedIndex(-1);
      setShowAi(false);
      setAiResult('');
      setAiLoading(false);
      if (aiAbortRef.current) {
        aiAbortRef.current.abort();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const canAiSearch = query.trim().length >= 5;

  /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl mx-4 bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200 border border-krds-gray-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-4 px-6 py-4 border-b border-krds-gray-10 bg-krds-gray-0">
          <Search className="w-5 h-5 text-krds-gray-60 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="검색어를 입력하세요..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-base text-krds-gray-95 placeholder:text-krds-gray-60"
            style={{ fontSize: '1.6rem' }}
            aria-label="문서 검색"
          />
          {canAiSearch && !showAi && (
            <button
              onClick={() => handleAiSearch(query)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700 transition-all shadow-sm"
              aria-label="AI로 컴포넌트 추천받기"
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI 추천
            </button>
          )}
          <kbd className="hidden sm:inline-flex h-7 select-none items-center gap-1 rounded-md border border-krds-gray-20 bg-white px-2.5 font-mono text-xs font-medium text-krds-gray-70 shadow-sm">
            ESC
          </kbd>
        </div>

        {/* AI Result Panel */}
        {showAi && (
          <div className="border-b border-krds-gray-10">
            <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-50 to-purple-50">
              <Bot className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">
                AI 컴포넌트 추천
              </span>
              <button
                onClick={() => setShowAi(false)}
                className="ml-auto text-xs text-purple-500 hover:text-purple-700"
              >
                닫기
              </button>
            </div>
            <div className="px-6 py-4 max-h-[40vh] overflow-y-auto">
              {aiLoading && (
                <div className="flex items-center gap-3 py-8 justify-center">
                  <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />
                  <span className="text-sm text-krds-gray-60">
                    AI가 컴포넌트를 분석하고 있어요...
                  </span>
                </div>
              )}
              {aiError && (
                <div className="py-4 text-center">
                  <p className="text-sm text-krds-gray-60">
                    AI 검색에 실패했어요. 키워드 검색 결과를 확인해주세요.
                  </p>
                </div>
              )}
              {aiResult && (
                <div className="prose prose-sm max-w-none text-krds-gray-80 [&_pre]:bg-krds-gray-5 [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:overflow-x-auto [&_code]:text-sm [&_code]:font-mono [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-krds-gray-95 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-krds-gray-90 [&_p]:leading-relaxed [&_ul]:space-y-1 [&_a]:text-krds-primary-base [&_a]:underline">
                  <AiMarkdown content={aiResult} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search Results */}
        <div
          ref={resultsRef}
          className="max-h-[60vh] overflow-y-auto overscroll-contain"
        >
          {results.length > 0 ? (
            <div className="py-2">
              {results.map((result, index) => {
                const categoryInfo = categoryConfig[result.category];
                const Icon = categoryInfo.icon;
                const isSelected = index === selectedIndex;

                return (
                  <button
                    key={result.href}
                    onClick={() => handleSelect(result.href)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-start gap-4 px-6 py-4 text-left transition-all ${
                      isSelected ? 'bg-krds-primary-5' : 'hover:bg-krds-gray-5'
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg ${categoryInfo.color} bg-current/10`}
                    >
                      <Icon className={`w-5 h-5 ${categoryInfo.color}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base font-semibold text-krds-gray-95 truncate">
                          {result.title}
                        </span>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full bg-current/10 ${categoryInfo.color} flex-shrink-0 font-medium`}
                        >
                          {categoryInfo.label}
                        </span>
                      </div>
                      {result.description && (
                        <p className="text-sm text-krds-gray-70 line-clamp-2 leading-relaxed">
                          {result.description}
                        </p>
                      )}
                    </div>

                    {/* Enter Key Hint */}
                    {isSelected && (
                      <kbd className="hidden sm:inline-flex h-7 select-none items-center gap-1 rounded-md border border-krds-primary-base/30 bg-krds-primary-base/5 px-2.5 font-mono text-xs font-medium text-krds-primary-base flex-shrink-0 shadow-sm">
                        ↵
                      </kbd>
                    )}
                  </button>
                );
              })}
            </div>
          ) : query.trim() ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-krds-gray-5 flex items-center justify-center">
                <Search className="w-8 h-8 text-krds-gray-40" />
              </div>
              <p className="text-base font-medium text-krds-gray-95 mb-1">
                검색 결과가 없습니다
              </p>
              <p className="text-sm text-krds-gray-60 mb-4">
                다른 키워드로 검색해보세요
              </p>
              {canAiSearch && !showAi && (
                <button
                  onClick={() => handleAiSearch(query)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700 transition-all shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  AI에게 물어보기
                </button>
              )}
            </div>
          ) : (
            <div className="py-16 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-krds-primary-base/10 flex items-center justify-center">
                <Search className="w-8 h-8 text-krds-primary-base" />
              </div>
              <p className="text-base font-medium text-krds-gray-95 mb-1">
                문서 검색
              </p>
              <p className="text-sm text-krds-gray-60 mb-6">
                검색어를 입력하거나 자연어로 필요한 화면을 설명해보세요
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AiMarkdown({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeLines: string[] = [];
  let codeLang = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre key={`code-${i}`} data-lang={codeLang}>
            <code>{codeLines.join('\n')}</code>
          </pre>
        );
        codeLines = [];
        codeLang = '';
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        codeLang = line.slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    if (line.startsWith('### ')) {
      elements.push(<h3 key={i}>{line.slice(4)}</h3>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={i}>{line.slice(3)}</h2>);
    } else if (line.startsWith('- ')) {
      const listItems: string[] = [line.slice(2)];
      let j = i + 1;
      while (j < lines.length && lines[j].startsWith('- ')) {
        listItems.push(lines[j].slice(2));
        j++;
      }
      elements.push(
        <ul key={i}>
          {listItems.map((item, idx) => (
            <li key={idx}>{formatInline(item)}</li>
          ))}
        </ul>
      );
      i = j - 1;
    } else if (line.trim()) {
      elements.push(<p key={i}>{formatInline(line)}</p>);
    }
  }

  return <>{elements}</>;
}

function formatInline(text: string): React.ReactNode {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 rounded bg-krds-gray-5 text-purple-700"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-krds-gray-95">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

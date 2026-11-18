'use client';

import type { BlogPost, BlogSeries } from '@/lib/blog';
import { Input } from '@hanui/react';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

interface BlogListProps {
  posts: BlogPost[];
  series: BlogSeries[];
}

export function BlogList({ posts, series }: BlogListProps) {
  const [query, setQuery] = useState('');
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null);

  // 필터링
  const filtered = posts.filter((post) => {
    const matchesQuery =
      !query || post.title.toLowerCase().includes(query.toLowerCase());
    const matchesSeries = !selectedSeries || post.series === selectedSeries;
    return matchesQuery && matchesSeries;
  });

  const hasFilter = !!query || !!selectedSeries;

  return (
    <>
      {/* Series Sidebar - 왼쪽에 position으로 띄움 */}
      {series.length > 0 && (
        <aside className="hidden xl:block absolute right-full top-10 mr-6 w-48 h-full">
          <div className="sticky top-24">
            <h3 className="text-sm font-semibold text-krds-gray-50 mb-3">
              시리즈
            </h3>
            <nav className="flex flex-col gap-0.5">
              <button
                onClick={() => setSelectedSeries(null)}
                className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-sm transition-colors text-left ${
                  !selectedSeries
                    ? 'bg-krds-primary-base/10 text-krds-primary-base font-semibold'
                    : 'text-krds-gray-60 hover:bg-krds-gray-5'
                }`}
              >
                <span>전체</span>
                <span
                  className={`text-xs ${!selectedSeries ? 'text-krds-primary-text' : 'text-krds-gray-60'}`}
                >
                  {posts.length}
                </span>
              </button>
              {series.map((s) => (
                <button
                  key={s.name}
                  onClick={() =>
                    setSelectedSeries(selectedSeries === s.name ? null : s.name)
                  }
                  className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-sm transition-colors text-left ${
                    selectedSeries === s.name
                      ? 'bg-krds-primary-base/10 text-krds-primary-base font-semibold'
                      : 'text-krds-gray-60 hover:bg-krds-gray-5'
                  }`}
                >
                  <span className="truncate">{s.name}</span>
                  <span
                    className={`text-xs shrink-0 ml-2 ${selectedSeries === s.name ? 'text-krds-primary-text' : 'text-krds-gray-60'}`}
                  >
                    {s.posts.length}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </aside>
      )}

      {/* Search */}
      <div className="pt-6 pb-4">
        <Input
          placeholder="제목으로 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          clearable
          onClear={() => setQuery('')}
          leftAddon={<Search className="w-4 h-4 text-krds-gray-40" />}
          className="max-w-md"
        />
      </div>

      {/* Mobile Series (xl 미만에서만 표시) */}
      {series.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pb-6 xl:hidden">
          <button
            onClick={() => setSelectedSeries(null)}
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              !selectedSeries
                ? 'bg-krds-primary-base text-white'
                : 'bg-krds-gray-5 text-krds-gray-60 hover:text-krds-primary-base'
            }`}
          >
            전체
          </button>
          {series.map((s) => (
            <button
              key={s.name}
              onClick={() =>
                setSelectedSeries(selectedSeries === s.name ? null : s.name)
              }
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedSeries === s.name
                  ? 'bg-krds-primary-base text-white'
                  : 'bg-krds-gray-5 text-krds-gray-60 hover:text-krds-primary-base'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      )}

      {/* Post List */}
      {filtered.length === 0 ? (
        <p className="text-krds-gray-50 py-16 text-center">
          {hasFilter ? '검색 결과가 없습니다.' : '아직 작성된 글이 없습니다.'}
        </p>
      ) : (
        <div className="divide-y divide-krds-gray-10">
          {filtered.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block py-8"
            >
              {/* Series Badge */}
              {post.series && (
                <span className="inline-flex items-center py-0.5 rounded text-xs font-medium text-krds-primary-base bg-krds-primary-base/10 mb-2">
                  {post.series}
                  {post.seriesOrder != null && ` #${post.seriesOrder}`}
                </span>
              )}
              <h2 className="text-xl font-bold text-krds-gray-95 mb-2 group-hover:underline transition-colors leading-snug">
                {post.title}
              </h2>
              <p className="text-krds-gray-60 leading-relaxed line-clamp-3 mb-4">
                {post.description}
              </p>
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-krds-primary-text bg-krds-gray-5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-krds-gray-60">
                <time>{formatDate(post.date)}</time>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

'use client';

import type { BlogPost, BlogSeries } from '@/lib/blog';
import { TAG_AXES } from '@/lib/blog-tags';
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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 태그별 글 수 — 0건인 태그는 필터에 내보내지 않는다
  const tagCounts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }

  const toggleTag = (tag: string) =>
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  // 필터링 — 태그는 AND(고른 것을 모두 가진 글만)
  const filtered = posts.filter((post) => {
    const matchesQuery =
      !query || post.title.toLowerCase().includes(query.toLowerCase());
    const matchesSeries = !selectedSeries || post.series === selectedSeries;
    const matchesTags = selectedTags.every((t) => post.tags.includes(t));
    return matchesQuery && matchesSeries && matchesTags;
  });

  const hasFilter = !!query || !!selectedSeries || selectedTags.length > 0;

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

      {/* Tag Filter */}
      <div className="pb-6 space-y-2">
        {TAG_AXES.map((axis) => {
          const tags = axis.tags.filter((t) => (tagCounts.get(t) ?? 0) > 0);
          if (tags.length === 0) return null;
          return (
            <div
              key={axis.label}
              className="flex flex-wrap items-center gap-1.5"
            >
              <span className="w-10 shrink-0 text-xs font-medium text-krds-gray-50">
                {axis.label}
              </span>
              {tags.map((tag) => {
                const on = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleTag(tag)}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      on
                        ? 'bg-krds-primary-base text-white'
                        : 'bg-krds-gray-5 text-krds-gray-60 hover:text-krds-primary-base'
                    }`}
                  >
                    {tag}
                    {/* 숫자는 색을 따로 주지 않고 글자 크기로만 구분한다 —
                        krds-gray-40(#8a949e)을 gray-5 배경에 쓰면 2.82:1로 KWCAG 1.4.3 미달 */}
                    <span className="text-xs">{tagCounts.get(tag)}</span>
                  </button>
                );
              })}
            </div>
          );
        })}
        {hasFilter && (
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setSelectedTags([]);
                setSelectedSeries(null);
                setQuery('');
              }}
              className="text-sm text-krds-gray-50 underline hover:text-krds-primary-base"
            >
              필터 지우기
            </button>
            <span className="text-sm text-krds-gray-60" aria-live="polite">
              {filtered.length}편
            </span>
          </div>
        )}
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

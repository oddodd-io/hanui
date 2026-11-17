import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { compile, run } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import remarkGfm from 'remark-gfm';
import { getAllPosts, getPostBySlug, getSeriesByName } from '@/lib/blog';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { BlogMDXContent } from '@/components/blog/BlogMDXContent';
import { BlogToc } from './blog-toc';

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: 'Post Not Found - HANUI' };
  }

  const metadata: Metadata = {
    title: `${post.title} - HANUI Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      url: `https://hanui.io/blog/${slug}`,
      ...(post.image && {
        images: [{ url: post.image, width: 1200, height: 630 }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };

  // 글마다 자기 주소를 canonical로 둔다. 없으면 루트 레이아웃의 canonical: '/'를
  // 물려받아 모든 글이 홈페이지를 가리킨다(= 색인에서 홈과 중복 취급).
  // metadataBase가 https://hanui.io 이므로 vue.hanui.io로 들어와도 한 주소로 모인다.
  metadata.alternates = { canonical: post.canonicalUrl ?? `/blog/${slug}` };

  return metadata;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

async function compileMDX(source: string) {
  const code = String(
    await compile(source, {
      outputFormat: 'function-body',
      remarkPlugins: [remarkGfm],
    })
  );

  const { default: MDXContent } = await run(code, {
    ...(runtime as any),
    baseUrl: import.meta.url,
  });

  return MDXContent;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const MDXContent = await compileMDX(post.content);

  // Get series info
  const seriesData = post.series ? getSeriesByName(post.series) : null;

  // Get adjacent posts for navigation
  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost =
    currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  return (
    <div className="max-w-4xl mx-auto px-4 relative">
      <BlogToc />
      <article>
        {/* Back */}
        <div className="pt-6 pb-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-krds-gray-50 hover:text-krds-gray-70 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            목록으로
          </Link>
        </div>

        {/* Title */}
        <header className="pt-4 pb-8">
          <h1 className="text-[2.5rem] leading-tight font-extrabold text-krds-gray-95 mb-6 break-keep">
            {post.title}
          </h1>

          {/* Author & Date */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-krds-gray-95">HANUI</span>
              <span className="text-krds-gray-30">·</span>
              <time className="text-krds-gray-50">{formatDate(post.date)}</time>
            </div>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-12">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-krds-gray-5 text-krds-primary-base"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Series Navigation */}
        {seriesData && (
          <div className="mb-10 p-5 bg-krds-gray-5/50 rounded-xl border border-krds-gray-10">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-krds-primary-base" />
              <h3 className="text-sm font-bold text-krds-gray-95">
                {seriesData.name} 시리즈
              </h3>
              <span className="text-xs text-krds-gray-40">
                ({seriesData.posts.length}편)
              </span>
            </div>
            <ol className="flex flex-col gap-1">
              {seriesData.posts.map((p, i) => {
                const isCurrent = p.slug === slug;
                return (
                  <li key={p.slug}>
                    {isCurrent ? (
                      <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-krds-primary-base/10 text-sm font-semibold text-krds-primary-base">
                        <span className="text-xs text-krds-primary-base/60">
                          {i + 1}.
                        </span>
                        {p.title}
                      </span>
                    ) : (
                      <Link
                        href={`/blog/${p.slug}`}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-krds-gray-60 hover:bg-krds-gray-5 transition-colors"
                      >
                        <span className="text-xs text-krds-gray-40">
                          {i + 1}.
                        </span>
                        {p.title}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        )}

        {/* Content — HANUI Code component for code blocks */}
        <BlogMDXContent>
          <MDXContent />
        </BlogMDXContent>

        {/* Author Card */}
        <div className="mt-12 p-6 bg-krds-gray-5/50 rounded-2xl flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-krds-gray-5 flex items-center justify-center text-krds-gray-90 flex-shrink-0">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="1"
                y="1"
                width="22"
                height="22"
                rx="4"
                stroke="currentColor"
                strokeWidth="2"
              />
              <rect
                x="5"
                y="5"
                width="6"
                height="6"
                className="fill-[var(--krds-primary-base)]"
              />
              <rect x="13" y="5" width="6" height="6" fill="currentColor" />
              <rect x="5" y="13" width="6" height="6" fill="currentColor" />
              <rect x="13" y="13" width="6" height="6" fill="currentColor" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-krds-gray-95 mb-1">HANUI</p>
            <p className="text-sm text-krds-gray-50 leading-relaxed mb-2">
              KRDS 기반 React 컴포넌트 라이브러리. 공공 웹 개발을 더 쉽게.
            </p>
          </div>
        </div>

        {/* Post Navigation */}
        {(prevPost || nextPost) && (
          <nav className="mt-10 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {prevPost ? (
              <Link
                href={`/blog/${prevPost.slug}`}
                className="group flex flex-col gap-1 p-5 bg-krds-gray-5/50 rounded-xl hover:bg-krds-gray-5 transition-colors"
              >
                <span className="text-xs text-krds-gray-40 font-medium uppercase tracking-wider">
                  이전 포스트
                </span>
                <span className="font-semibold text-krds-gray-95 group-hover:text-krds-primary-base transition-colors line-clamp-1">
                  {prevPost.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
            {nextPost && (
              <Link
                href={`/blog/${nextPost.slug}`}
                className="group flex flex-col gap-1 p-5 bg-krds-gray-5/50 rounded-xl hover:bg-krds-gray-5 transition-colors text-right"
              >
                <span className="text-xs text-krds-gray-40 font-medium uppercase tracking-wider">
                  다음 포스트
                </span>
                <span className="font-semibold text-krds-gray-95 group-hover:text-krds-primary-base transition-colors line-clamp-1">
                  {nextPost.title}
                </span>
              </Link>
            )}
          </nav>
        )}
      </article>
    </div>
  );
}

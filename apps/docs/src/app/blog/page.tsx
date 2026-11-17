import type { Metadata } from 'next';
import { getAllPosts, getAllSeries } from '@/lib/blog';
import { BlogList } from './blog-list';

export const metadata: Metadata = {
  title: 'Blog - HANUI',
  description:
    'HANUI 개발 과정, KRDS 활용 팁, React 컴포넌트 설계 등 공공 웹 개발에 관한 이야기를 공유합니다.',
  openGraph: {
    title: 'Blog - HANUI',
    description:
      'HANUI 개발 과정, KRDS 활용 팁, React 컴포넌트 설계 등 공공 웹 개발에 관한 이야기',
    url: 'https://hanui.io/blog',
  },
  alternates: {
    canonical: '/blog',
    types: {
      'application/rss+xml': '/blog/rss.xml',
    },
  },
};

export default function BlogPage() {
  const posts = getAllPosts();
  const series = getAllSeries();

  return (
    <div className="max-w-4xl mx-auto px-4 relative">
      {/* Header */}
      <div className="pt-8 pb-8 border-b border-krds-gray-10">
        <h1 className="text-3xl font-bold text-krds-gray-95 mb-2">Blog</h1>
        <p className="text-krds-gray-50 mb-3">
          HANUI 개발 과정, KRDS 활용 팁, React 컴포넌트 설계 등 공공 웹 개발에
          관한 이야기를 공유합니다.
        </p>
        <div className="flex items-center gap-3 text-sm">
          <a
            href="https://github.com/hanui-o/hanui"
            target="_blank"
            rel="noopener noreferrer"
            className="text-krds-gray-50 hover:text-krds-primary-base transition-colors"
          >
            GitHub
          </a>
          <span className="text-krds-gray-20">|</span>
          <a
            href="https://hanui.io"
            className="text-krds-gray-50 hover:text-krds-primary-base transition-colors"
          >
            Docs
          </a>
        </div>
      </div>

      {/* Post List with Search & Series Filter */}
      <BlogList posts={posts} series={series} />
    </div>
  );
}

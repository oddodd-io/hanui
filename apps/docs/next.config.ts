import type { NextConfig } from 'next';
import createMDX from '@next/mdx';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // www → non-www 리다이렉트는 Vercel 도메인 설정에서 처리
      // (next.config에서 하면 Vercel 자체 리다이렉트와 충돌하여 무한 루프 발생)

      // hanui.io는 인트로 + 블로그만 남긴다. 문서 경로는 최신인 Vue로 보낸다.
      // `/`(인트로)·`/blog/*`·`/sitemap.xml`·`/blog/rss.xml`은 아래 목록에 넣지 말 것.
      // permanent: false(307)로 둔다 — 308은 브라우저가 영구 캐시해서 되돌리기 어렵다.
      // `api`는 넣지 말 것 — /api/*는 문서가 아니라 라우트 핸들러다.
      // /api/search는 헤더 검색창이 POST로 부르고(교차 출처가 되면 CORS로 막힌다),
      // /api/cron/blog-watch는 Vercel cron이 hanui.io로 때린다(리다이렉트되면 발행이 멈춘다).
      {
        source:
          '/:path(components|blocks|kits|templates|a11y|docs|playground|showcase|typography)/:rest*',
        has: [{ type: 'host', value: 'hanui.io' }],
        destination: 'https://vue.hanui.io/:path/:rest*',
        permanent: false,
      },

      // Kit 문서는 2026-11-23에 내렸다. `/kits`만 안내 페이지로 남기고 하위는 그쪽으로 보낸다.
      // 발행된 글(`hanui-kits.mdx`)이 `/kits/board`로 링크하고 있어 404로 두지 않는다.
      {
        source: '/kits/:rest+',
        destination: '/kits',
        permanent: false,
      },

      // 이전 경로 → 현재 경로
      {
        source: '/design-system/typography',
        destination: '/docs/typography',
        permanent: true,
      },
      {
        source: '/design-system/spacing',
        destination: '/docs/spacing',
        permanent: true,
      },
      {
        source: '/design-system/colors',
        destination: '/docs/colors',
        permanent: true,
      },
      {
        source: '/components/inpagenavigation',
        destination: '/components/in-page-navigation',
        permanent: true,
      },
      {
        source: '/components/section-heading',
        destination: '/components/section-heading-system',
        permanent: true,
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ['@hanui/react'],
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
      },
    ],
    qualities: [85],
  },
  // NOTE: optimizePackageImports disabled - it incorrectly tries to bundle
  // content components (PageSection, SectionHeading) with @hanui/react
  // experimental: {
  //   optimizePackageImports: ['@hanui/react'],
  // },
  webpack: (config) => {
    // Enable CSS imports from workspace packages
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.css': ['.css'],
    };
    return config;
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeHighlight],
  },
});

export default withMDX(nextConfig);

import type { Metadata } from 'next';
import { Krona_One } from 'next/font/google';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import type { ReactNode } from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { FrameworkProvider } from '@/components/FrameworkTabs';
import { StructuredData } from '@/components/StructuredData';
import './globals.css';

const GTM_ID = 'GTM-MLGSBMTX';

const kronaOne = Krona_One({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-krona-one',
});

export const metadata: Metadata = {
  title: {
    template: '%s | HANUI',
    default: 'HANUI - KRDS 기반 공공 웹 UI 컴포넌트 라이브러리',
  },
  description:
    'KRDS(Korea Republic Design System)를 준수하는 공공 웹사이트용 React 컴포넌트 라이브러리. 접근성 AA 등급, TypeScript 지원, 9개 핵심 컴포넌트 제공.',
  keywords: [
    'HANUI',
    'KRDS',
    '공공 웹',
    'React',
    '컴포넌트 라이브러리',
    'UI 라이브러리',
    '접근성',
    'TypeScript',
    '디자인 시스템',
    'Korean Design System',
  ],
  authors: [{ name: 'odada-o', url: 'https://github.com/odada-o' }],
  creator: '오드오드',
  publisher: 'HANUI',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://hanui.io',
    siteName: 'HANUI',
    title: 'HANUI - KRDS 기반 공공 웹 UI 컴포넌트 라이브러리',
    description:
      'KRDS를 준수하는 공공 웹사이트용 React 컴포넌트 라이브러리. 접근성 AA 등급, TypeScript 지원, 9개 핵심 컴포넌트 제공.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'HANUI - KRDS 기반 공공 웹 UI 컴포넌트 라이브러리',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HANUI - KRDS 기반 공공 웹 UI 컴포넌트 라이브러리',
    description:
      'KRDS를 준수하는 공공 웹사이트용 React 컴포넌트 라이브러리. 접근성 AA 등급, TypeScript 지원.',
    images: ['/og-image.png'],
    creator: '@oddodd',
  },
  verification: {
    google: 'd-lKf12TX-T8zDSGDsHe18M0zG7V5kW-e6F8U',
    other: {
      'naver-site-verification': '11f6b3d109de4b6b0b771e75d431cd0e2b1b39c8',
    },
  },
  metadataBase: new URL('https://hanui.io'),
  // 여기에 canonical을 두면 자기 canonical이 없는 모든 페이지가 홈을 가리킨다
  // (= 홈의 중복본으로 색인됨). 페이지마다 각자 선언하고, 없으면 자기 주소로 인식된다.
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-gov.min.css"
        />
        <StructuredData />
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
      </head>
      <body className={`${kronaOne.variable} antialiased`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
            title="Google Tag Manager"
          />
        </noscript>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <FrameworkProvider>{children}</FrameworkProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}

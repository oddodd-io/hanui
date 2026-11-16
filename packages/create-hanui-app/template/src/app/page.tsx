import { Container, Button } from '@hanui/react';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Container className="py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 text-gray-90 dark:text-gray-10">
            Welcome to HANUI
          </h1>
          <p className="text-xl mb-8 text-gray-70 dark:text-gray-30">
            KRDS 기반 React 컴포넌트 라이브러리로 빠르게 시작하세요.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg">시작하기</Button>
            <Button variant="outline" size="lg">
              문서 보기
            </Button>
          </div>
          <div className="mt-16 p-8 bg-gray-5 dark:bg-gray-90 rounded-lg border border-gray-20 dark:border-gray-80">
            <h2 className="text-2xl font-semibold mb-4">다음 단계</h2>
            <ul className="text-left space-y-3 text-gray-70 dark:text-gray-30">
              <li>
                ✓{' '}
                <code className="bg-gray-20 dark:bg-gray-80 px-2 py-1 rounded">
                  src/app/page.tsx
                </code>{' '}
                파일을 수정하여 페이지를 편집하세요
              </li>
              <li>
                ✓{' '}
                <a
                  href="https://hanui.io/docs/introduction"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-60 hover:underline"
                >
                  HANUI 문서
                </a>
                를 확인하세요
              </li>
              <li>
                ✓{' '}
                <a
                  href="https://github.com/hanui-o/hanui"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-60 hover:underline"
                >
                  GitHub
                </a>
                에서 예제를 확인하세요
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </main>
  );
}

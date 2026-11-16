import { Container } from '@hanui/react';

export function Footer() {
  return (
    <footer id="footer" className="py-6 md:py-0">
      <Container className="flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
        <p className="text-center leading-loose text-krds-gray-70 md:text-left text-sm">
          MIT License · Built by{' '}
          <a
            href="https://www.linkedin.com/in/hanui/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 hover:text-krds-gray-95"
          >
            HANUI
          </a>
          . The source code is available on{' '}
          <a
            href="https://github.com/hanui-o/hanui"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 hover:text-krds-gray-95"
          >
            GitHub
          </a>
          . 문의는{' '}
          <a
            href="mailto:mia@hanui.io"
            className="font-medium underline underline-offset-4 hover:text-krds-gray-95"
          >
            mia@hanui.io
          </a>
          로 보내주세요.
        </p>
      </Container>
    </footer>
  );
}

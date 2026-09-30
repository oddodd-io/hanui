import type { Preview } from '@storybook/vue3-vite';
import '../src/styles/index.scss';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    a11y: {
      // 위반이 있으면 스토리를 실패로 표시한다
      test: 'error',
    },
    backgrounds: { disable: true },
  },
  globalTypes: {
    krdsMode: {
      description: 'KRDS 색상 모드',
      toolbar: {
        title: '모드',
        icon: 'contrast',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'high-contrast', title: 'High Contrast' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { krdsMode: 'light' },
  decorators: [
    (story, context) => {
      const mode = context.globals.krdsMode ?? 'light';
      // KRDS 고대비 모드는 [data-krds-mode="high-contrast"] 셀렉터로 켜진다.
      // 개별 스토리 화면에서는 KRDS 사이트처럼 <html>에도 붙여 body로 Teleport되는 모달 등에도 적용한다.
      // Docs 페이지는 여러 스토리를 한 문서에 그리므로 <html>에 붙이면 마지막 스토리(HighContrast)의 모드가
      // 페이지 전체에 번진다 → Docs에서는 각 스토리 래퍼에만 적용한다.
      if (context.viewMode === 'story') {
        document.documentElement.setAttribute('data-krds-mode', mode);
      } else {
        document.documentElement.removeAttribute('data-krds-mode');
      }
      // 배경색은 KRDS 원본에서 body에 지정하므로 데모용으로만 검정을 준다.
      return {
        components: { story },
        setup: () => ({ mode }),
        template: `
          <div
            :data-krds-mode="mode"
            :style="{ padding: '24px', background: mode === 'high-contrast' ? '#000' : '#fff' }"
          >
            <story />
          </div>
        `,
      };
    },
  ],
};

export default preview;

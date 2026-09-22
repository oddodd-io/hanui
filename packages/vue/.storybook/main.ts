import type { StorybookConfig } from '@storybook/vue3-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.ts', '../src/**/*.mdx'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: '@storybook/vue3-vite',
  // vite.config.ts의 lib 빌드 설정은 Storybook에 맞지 않으므로 필요한 것만 가져온다.
  viteFinal: async (config) => {
    const { mergeConfig } = await import('vite');
    return mergeConfig(config, {
      css: {
        preprocessorOptions: {
          scss: {
            silenceDeprecations: [
              'import',
              'global-builtin',
              'color-functions',
              'slash-div',
            ],
            quietDeps: true,
          },
        },
        postcss: {},
      },
    });
  },
};

export default config;

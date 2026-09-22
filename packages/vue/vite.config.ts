import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      outDir: 'dist',
      tsconfigPath: './tsconfig.json',
      exclude: ['src/**/*.test.{ts,tsx}', 'src/**/*.stories.ts', 'src/test/**'],
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        // KRDS 원본 SCSS는 @import 문법을 사용한다. vendor는 수정하지 않으므로 경고만 끈다.
        silenceDeprecations: [
          'import',
          'global-builtin',
          'color-functions',
          'slash-div',
        ],
        quietDeps: true,
      },
    },
    // 워크스페이스 루트의 PostCSS/Tailwind 설정을 상속하지 않는다.
    postcss: {},
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'HanuiVue',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: { vue: 'Vue' },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) return 'vue.css';
          return 'assets/[name][extname]';
        },
      },
    },
    cssCodeSplit: false,
    sourcemap: true,
    emptyOutDir: true,
  },
  resolve: {
    alias: { '@': resolve(__dirname, './src') },
  },
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      outDir: 'dist',
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        charts: resolve(__dirname, 'src/charts/index.ts'),
        // package.json의 "./kits/*" 서브패스 export가 가리키는 산출물.
        // 여기에 없으면 dist/kits/**가 생성되지 않아 import가 그대로 실패한다.
        'kits/authentication/index': resolve(
          __dirname,
          'src/components/kits/authentication/index.ts'
        ),
        'kits/dashboard/index': resolve(
          __dirname,
          'src/components/kits/dashboard/index.ts'
        ),
        'kits/form/index': resolve(
          __dirname,
          'src/components/kits/form/index.ts'
        ),
        'kits/settings/index': resolve(
          __dirname,
          'src/components/kits/settings/index.ts'
        ),
      },
      name: 'HanuiReact',
      formats: ['es', 'cjs'],
      fileName: (format, entryName) =>
        `${entryName}.${format === 'es' ? 'mjs' : 'js'}`,
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'next/link',
        /^@radix-ui\//,
        /^lucide-react/,
        /^@tanstack\//,
        /^@visx\//,
        /^swiper/,
        'class-variance-authority',
        'clsx',
        'tailwind-merge',
        'cmdk',
        'shiki',
      ],
      output: {
        banner: '"use client";',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'react/jsx-runtime',
          'next/link': 'NextLink',
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'react.css';
          return assetInfo.name!;
        },
      },
    },
    cssCodeSplit: false,
    sourcemap: true,
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});

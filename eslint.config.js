import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import vuePlugin from 'eslint-plugin-vue';
import vueA11yPlugin from 'eslint-plugin-vuejs-accessibility';
import vueParser from 'vue-eslint-parser';
import tsParserForVue from '@typescript-eslint/parser';
import globals from 'globals';

export default [
  // Base JavaScript recommended rules
  js.configs.recommended,

  // Global ignores
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/.turbo/**',
      '**/coverage/**',
      '*.config.ts',
      '*.config.js',
      '*.config.mjs',
      '*.config.cjs',
    ],
  },

  // TypeScript files
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...jsxA11yPlugin.configs.recommended.rules,

      // React settings
      'react/react-in-jsx-scope': 'off', // Not needed in React 18+
      'react/prop-types': 'off', // Using TypeScript for prop types
      'react/jsx-uses-react': 'off', // Not needed in React 18+
      'react/no-unescaped-entities': 'off', // Allow quotes in JSX text

      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // Accessibility
      'jsx-a11y/anchor-is-valid': [
        'error',
        {
          components: ['Link'],
          specialLink: ['hrefLeft', 'hrefRight'],
          aspects: ['invalidHref', 'preferButton'],
        },
      ],
      'jsx-a11y/label-has-associated-control': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // Vue SFC
  // React 쪽 jsx-a11y와 같은 접근성 기준을 .vue에도 적용한다.
  ...vuePlugin.configs['flat/recommended'],
  ...vueA11yPlugin.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParserForVue,
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    rules: {
      // 컴포넌트 파일명이 곧 컴포넌트 이름이라 단어 수 강제는 하지 않는다
      'vue/multi-word-component-names': 'off',
      // React 쪽과 동일하게 완화
      'vuejs-accessibility/label-has-for': 'off',
    },
  },

  // JavaScript files
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
  },
];

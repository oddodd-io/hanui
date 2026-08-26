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
      '**/__experiments__/**',
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

      // no-undef는 TS 문법을 이해하지 못해 타입 전용 참조(React.ComponentType 등)를
      // 오탐한다. 미정의 식별자는 TypeScript 컴파일러가 잡는다.
      // (typescript-eslint 공식 권장)
      'no-undef': 'off',

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

      // role은 ARIA 전용 이름이 아니다. ProfileCard의 role(직책)처럼
      // 커스텀 컴포넌트의 도메인 prop까지 검사하면 오탐이 난다.
      'jsx-a11y/aria-role': ['error', { ignoreNonDOM: true }],

      // Tailwind가 list-style을 초기화하면 Safari/VoiceOver가 목록 의미를 잃는다.
      // <ul role="list">는 그 대응으로 일부러 넣는 것이라 중복으로 보지 않는다.
      'jsx-a11y/no-redundant-roles': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // 테스트 파일
  // tsconfig에서 제외돼 있어 projectService가 프로젝트를 찾지 못한다.
  // 타입 인지 규칙이 필요 없는 파일이므로 해당 파싱을 끈다.
  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}', '**/test/**'],
    languageOptions: {
      parserOptions: {
        projectService: false,
        project: false,
      },
    },
  },

  // Vue SFC
  // React 쪽 jsx-a11y와 같은 접근성 기준을 .vue에도 적용한다.
  ...vuePlugin.configs['flat/essential'],
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
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      // 컴포넌트 파일명이 곧 컴포넌트 이름이라 단어 수 강제는 하지 않는다
      'vue/multi-word-component-names': 'off',
      // React 쪽과 동일하게 완화
      'vuejs-accessibility/label-has-for': 'off',
      // Tailwind가 list-style을 초기화하면 Safari/VoiceOver가 목록 의미를 잃는다.
      // React 쪽과 동일한 판단.
      'vuejs-accessibility/no-redundant-roles': 'off',

      // 아래 3개는 "키보드 경로가 형제/자식 요소에 있는" 패턴을 오탐한다.
      // (hover 메뉴의 aria-expanded 버튼, 오버레이 클릭 닫기, aria-activedescendant
      //  리스트박스, label 안의 보조 클릭 영역 등)
      // 규칙은 살려두되 케이스별 검토가 끝날 때까지 경고로 둔다.
      // TODO: 40건 검토 후 실제 결함은 고치고 나머지는 근거 주석과 함께 개별 disable.
      'vuejs-accessibility/no-static-element-interactions': 'warn',
      'vuejs-accessibility/click-events-have-key-events': 'warn',
      'vuejs-accessibility/mouse-events-have-key-events': 'warn',

      // 라이브러리 primitive는 레이블을 소비자가 준다 (Input/Textarea)
      'vuejs-accessibility/form-control-has-label': 'warn',

      // 코어 규칙은 TS 문법을 몰라 오탐이 난다. TS 전용 규칙으로 대체한다.
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
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

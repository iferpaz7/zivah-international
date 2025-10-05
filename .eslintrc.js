module.exports = {
  root: true,
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:jsx-a11y/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier', 'simple-import-sort', 'unused-imports', 'import'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  rules: {
    // Prettier integration
    'prettier/prettier': 'error',

    // TypeScript rules
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
    '@typescript-eslint/no-explicit-any': 'warn',

    // Import rules
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'unused-imports/no-unused-imports': 'error',
    'import/no-duplicates': 'error',
    'import/no-unresolved': 'off', // TypeScript handles this

    // React rules
    'react-hooks/exhaustive-deps': 'warn',
    'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
    'react/self-closing-comp': 'error',
    'react/jsx-boolean-value': ['error', 'never'],

    // General rules
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-destructuring': ['error', { object: true, array: false }],

    // Next.js specific
    '@next/next/no-html-link-for-pages': 'error',
    '@next/next/no-img-element': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
  },
  overrides: [
    // Configuration files
    {
      files: ['*.config.{js,ts}', '*.d.ts'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        'import/no-default-export': 'off',
      },
    },
    // API routes
    {
      files: ['src/app/api/**/*.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off', // API routes often deal with any
      },
    },
    // Test files
    {
      files: ['**/*.test.{js,ts,tsx}', '**/*.spec.{js,ts,tsx}'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
      },
    },
  ],
};

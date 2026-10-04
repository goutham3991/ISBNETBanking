import js from '@eslint/js';
import globals from 'globals';
import playwright from 'eslint-plugin-playwright';

export default [
  { ignores: ['node_modules/', 'playwright-report/', 'test-results/', 'allure-report/', 'allure-results/', 'auth/'] },
  js.configs.recommended,
  {
    languageOptions: { globals: { ...globals.node } }
  },
  {
    ...playwright.configs['flat/recommended'],
    files: ['tests/**/*.js', 'pages/**/*.js', 'fixtures/**/*.js'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'playwright/no-wait-for-timeout': 'error',
      'playwright/no-focused-test': 'error',
      'playwright/expect-expect': 'off',
      'playwright/consistent-spacing-between-blocks': 'off'
    }
  }
];

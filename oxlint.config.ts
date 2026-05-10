import { defineConfig } from 'oxlint';

export default defineConfig({
  categories: {
    correctness: 'error',
    style: 'error',
  },
  rules: {
    curly: 'error',
    'id-length': 'off',
    'no-null': 'off',
    'sort-keys': 'off',
    'consistent-type-definitions': ['error', 'type'],
    'max-statements': 'off',
    'no-ternary': 'off',
    'filename-case': 'off',
    'sort-imports': 'off',
    'no-magic-numbers': 'off',
  },
  env: {
    builtin: true,
  },
  ignorePatterns: ['**/node_modules/**'],
  options: {
    typeAware: true,
  },
});

import { defineConfig } from 'oxfmt';

export default defineConfig({
  ignorePatterns: ['**/node_modules/**', '**/worker-configuration.d.ts', '**/*.css'],
  singleQuote: true,
  sortImports: true,
});

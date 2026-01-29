import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  base: '/radio',
  trailingSlash: 'always',
  // No adapter needed for static
});
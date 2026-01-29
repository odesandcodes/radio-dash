import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  build: {
    format: 'directory' // Ensures we get /radio/index.html instead of radio.html
  },
  base: '/radio',
  trailingSlash: 'always',
});
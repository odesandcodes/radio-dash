import { defineConfig } from 'astro/config';
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  // No base path, no target logic. Just Cloudflare.
  base: '/',
  trailingSlash: 'ignore',
});
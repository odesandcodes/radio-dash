import { defineConfig } from 'astro/config';
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  // Force Cloudflare back to Server mode
  output: 'server',
  adapter: cloudflare(),
  base: '/',
  trailingSlash: 'ignore',
});
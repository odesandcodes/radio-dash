import { defineConfig } from 'astro/config';
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  output: 'server', // Cloudflare NEEDS this to run the API routes
  adapter: cloudflare(),
  base: '/', // Cloudflare apps usually run at the root
  trailingSlash: 'ignore',
});
import { defineConfig } from 'astro/config';
import cloudflare from "@astrojs/cloudflare";

const isCloudflare = process.env.DEPLOY_TARGET === 'cloudflare';

export default defineConfig({
  output: isCloudflare ? 'server' : 'static',
  adapter: isCloudflare ? cloudflare() : undefined,
  base: isCloudflare ? '/' : '/radio',
  trailingSlash: isCloudflare ? 'ignore' : 'always',
});
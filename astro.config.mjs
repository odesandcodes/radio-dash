import { defineConfig } from 'astro/config';
import cloudflare from "@astrojs/cloudflare";

// We check if the target is Cloudflare. If NOT, we assume it's Caddy.
const isCloudflare = process.env.DEPLOY_TARGET === 'cloudflare';

export default defineConfig({
  // Default to static (Caddy). Only use server for Cloudflare.
  output: isCloudflare ? 'server' : 'static',
  
  // Default to /radio (Caddy). Only use root for Cloudflare.
  base: isCloudflare ? '/' : '/radio',

  // Only load the adapter if we are explicitly on Cloudflare
  adapter: isCloudflare ? cloudflare() : undefined,

  trailingSlash: 'always',
});
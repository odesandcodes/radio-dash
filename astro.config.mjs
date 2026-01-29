import { defineConfig } from 'astro/config';
import cloudflare from "@astrojs/cloudflare";

// Check if we are building for the Caddy server
const isCaddyBuild = process.env.DEPLOY_TARGET === 'caddy';

export default defineConfig({
  // 'static' for Caddy, 'server' for Cloudflare SSR
  output: isCaddyBuild ? 'static' : 'server',
  
  // This is the "Sub-apartment" address for Caddy
  base: isCaddyBuild ? '/radio' : '/',

  // Only use the Cloudflare adapter when NOT building for Caddy
  adapter: isCaddyBuild ? undefined : cloudflare(),

  // Ensures Caddy's trailing slash preference is met
  trailingSlash: isCaddyBuild ? 'always' : 'ignore', 
});
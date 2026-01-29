import { defineConfig } from 'astro/config';
import cloudflare from "@astrojs/cloudflare";

// Force a boolean check
const isCaddyBuild = process.env.DEPLOY_TARGET === 'caddy';

export default defineConfig({
  // If it's Caddy, we MUST use 'static'. 
  // If it's not Caddy, we use 'server'.
  output: isCaddyBuild ? 'static' : 'server',
  
  base: isCaddyBuild ? '/radio' : '/',

  // Only apply the adapter if we are in server mode
  adapter: isCaddyBuild ? undefined : cloudflare(),
  
  trailingSlash: isCaddyBuild ? 'always' : 'ignore',
});
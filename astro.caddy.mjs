import { defineConfig } from 'astro/config';
import node from "@astrojs/node";

export default defineConfig({
  output: 'static', // This is the key
  adapter: node({
    mode: "standalone"
  }),
  // This forces Astro to put everything in /dist instead of /dist/client
  build: {
    format: 'directory',
    client: './' 
  },
  base: '/radio',
  trailingSlash: 'always',
});